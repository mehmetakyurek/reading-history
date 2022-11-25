import { createCipheriv, createDecipheriv, pbkdf2, randomBytes } from "crypto";
import { app, dialog } from "electron";
import { createReadStream, createWriteStream, existsSync, PathLike, read } from "fs";
import { promises as fs } from "fs";
import path = require("path");
import { decrypt, encrypt, hashData } from "./encryption";
const defaultDataPath = `${app.getPath("userData")}\\user.rhdata`
const userData = `${app.getPath("userData")}\\data.json`;

export class Store {
    file: fs.FileHandle
    encrypted: boolean
    key: Buffer
    filePath: PathLike

    constructor(filePath: PathLike, file?: fs.FileHandle, encrypted?: boolean) {
        this.file = file;
        this.encrypted = encrypted;
        this.filePath = filePath;
    }
    static async init() {
        let data: string;
        if (existsSync(userData))
            data = await (await fs.readFile(userData)).toString();
        else
            data = await this.createuserDataFile();
        if (existsSync(data)) {
            const file = await fs.open(data, "r+")
            const encrypted = (await file.read({ position: 0, length: 1 })).buffer[0] === 1;
            return new Store(data, file, encrypted);
        } else {
            return new Store(data);
        }

    }
    static async createuserDataFile(): Promise<string> {
        const data = await fs.open(userData, "w+")
        data.appendFile(defaultDataPath);
        data.close();
        return defaultDataPath;
    }
    getItem(): Promise<string> {
        return new Promise<string>(async (resolve) => {
            const size = (await this.file.stat()).size;
            if (this.encrypted) {
                if (size < Number.MAX_SAFE_INTEGER && size > 49) {
                    resolve((await decrypt(this.key, this.file)));
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
            const encrypted = encrypt(data, this.key);
            const file = createWriteStream(this.filePath, { start: 49, flags: "r+" });
            file.on("ready", () => { file.end(encrypted); })
        } else {
            const file = createWriteStream(this.filePath, { start: 1, flags: "r+" });
            file.on("ready", () => { file.end(Buffer.from(data).toString("base64")) })
        }
        return;
    }
    async removeItem(): Promise<void> {
        return;
    }

    fileExists(): Promise<boolean> { return Promise.resolve((this.file) !== undefined) }
    isEncrypted(): Promise<boolean> { return Promise.resolve(this.encrypted === true) }
    getFilePath(): Promise<string> {return Promise.resolve(this.filePath.toString())}
    createUser(pwd?: string, fileLocation?: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
            try {
                this.file = await fs.open(this.filePath, "w+");
                const data = Buffer.alloc(pwd === undefined ? 1 : 49);
                this.encrypted = pwd !== undefined;
                if (pwd !== undefined) {
                    if (pwd.length >= 4) {
                        data.fill(1, 0, 1);
                        const salt = randomBytes(16);
                        const hash = await hashData(pwd, salt);
                        data.fill(Buffer.concat([hash, salt]), 1, 49);
                        this.key = await hashData(hash, salt);
                        await this.file.write(data);
                        resolve(true);
                    } else resolve(false);
                } else {
                    data.fill(0, 0, 1);
                    this.file.write(data);
                    resolve(true);
                }
            } catch (err) {
                console.log(err);
            }
        })
    }
    async login(pwd: string): Promise<boolean> {
        if (this.fileExists) {
            if (this.encrypted) {
                const data = (await this.file.read({ length: 48, position: 1, buffer: Buffer.alloc(48) })).buffer;
                const [hash, salt] = [data.slice(0, 32), data.slice(32, 48)];
                const pwdHash = await hashData(pwd, salt)
                if (pwdHash.equals(hash)) {
                    this.key = await hashData(pwdHash, salt);
                    return true;
                } else return false;
            } else return true;
        } else return false;
    }
    async moveSaveFile() {
        return new Promise(async res => {
            const newPath = (await dialog.showSaveDialog({ filters: [{ name: "*", extensions: ["rhdata"] }] })).filePath;
            if (newPath && !existsSync(newPath)) {
                await fs.writeFile(userData, newPath);
                await fs.copyFile(this.filePath, newPath);
                this.filePath = newPath;
                this.file = await fs.open(this.filePath, "r+")
                res(newPath);
            } else (res(this.filePath));
        })
    }
}
