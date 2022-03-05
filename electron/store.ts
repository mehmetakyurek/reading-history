import { btoa } from "buffer";
import { createCipheriv, createDecipheriv, pbkdf2, randomBytes } from "crypto";
import { app } from "electron";
import { createReadStream, createWriteStream, existsSync, read } from "fs";
import { promises as fs } from "fs";
import { electron, version } from "process";

const filePath = `${app.getPath("userData")}/data.bin`

export class Store {
    file: fs.FileHandle
    encrypted: boolean
    key: Buffer

    constructor(file?: fs.FileHandle, encrypted?: boolean) {
        this.file = file;
        this.encrypted = encrypted;
    }
    static async init() {
        if (existsSync(filePath)) {
            const file = await fs.open(filePath, "r+")
            const encrypted = (await file.read({ position: 0, length: 1 })).buffer[0] === 1;
            return new Store(file, encrypted);
        } else return new Store();
    }

    getItem(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const size = (await this.file.stat()).size;
            if (this.encrypted) {
                if (size < Number.MAX_SAFE_INTEGER && size > 49) {
                    const file = (await this.file.read({ buffer: Buffer.alloc(size - 49), position: 49 })).buffer;
                    const [authTag, encrypted, iv] = [file.slice(-16), file.slice(12, -16), file.slice(0, 12)];
                    const decipher = createDecipheriv("aes-256-gcm", this.key, iv, { authTagLength: 16 }).setAuthTag(authTag);
                    decipher.write(encrypted);
                    decipher.end();
                    let data = "";
                    decipher.on("data", chunk => data += chunk);
                    decipher.on("end", () => { resolve(data) })
                } else resolve("");
            } else {
                const file = (await this.file.read({ buffer: Buffer.alloc(size - 1), position: 1 })).buffer;
                const data = Buffer.from(file.toString(), "base64").toString();
                resolve(data)
            }
        })
    }
    async setItem(data: string): Promise<void> {
        if (this.encrypted) {
            const iv = randomBytes(12);
            const cipher = createCipheriv("aes-256-gcm", this.key, iv, { authTagLength: 16 });
            let encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
            const authTag = cipher.getAuthTag()
            encrypted = Buffer.concat([iv, encrypted, authTag]);
            const file = createWriteStream(filePath, { start: 49, flags: "r+" });
            file.on("ready", () => { file.end(encrypted); })
        } else {
            const file = createWriteStream(filePath, { start: 1, flags: "r+" });
            file.on("ready", () => { file.end(Buffer.from(data).toString("base64")) })
        }
        return;
    }
    async removeItem(): Promise<void> {
        return;
    }

    fileExists(): Promise<boolean> { return Promise.resolve((this.file) !== undefined) }
    isEncrypted(): Promise<boolean> { return Promise.resolve(this.encrypted === true) }
    createUser(pwd?: string) {
        return new Promise(async (resolve, reject) => {
            this.file = await fs.open(filePath, "w+")
            const data = Buffer.alloc(pwd === undefined ? 1 : 49);
            this.encrypted = pwd !== undefined;
            if (pwd !== undefined) {
                if (pwd.length >= 4) {
                    data.fill(1, 0, 1);
                    const salt = randomBytes(16);
                    const hash = await this.hashString(pwd, salt);
                    data.fill(Buffer.concat([hash, salt]), 1, 49);

                    this.key = await this.hashString(hash, salt);

                    await this.file.write(data);
                    resolve(true);
                } else resolve(false);
            } else {
                data.fill(0, 0, 1);
                this.file.write(data);
                resolve(true);
            }
        })
    }
    async login(pwd: string): Promise<boolean> {
        if (this.fileExists) {
            if (this.encrypted) {
                const data = (await this.file.read({ length: 49, position: 1, buffer: Buffer.alloc(48) })).buffer;
                console.log(data);

                const [hash, salt] = [data.slice(0, 32), data.slice(32, 48)];
                const pwdHash = await this.hashString(pwd, salt)
                if (pwdHash.equals(hash)) {
                    this.key = await this.hashString(pwdHash, salt);
                    return true;
                } else return false;
            } else return true;
        } else return false;
    }
    async hashString(pwd: string | Buffer, salt: Buffer): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            pbkdf2(pwd, salt, 500000, 32, "sha512", (err, h) => resolve(h));
        })
    }
}