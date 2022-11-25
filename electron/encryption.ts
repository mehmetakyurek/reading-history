import { createCipheriv, createDecipheriv, pbkdf2, randomBytes } from "crypto";
import { FileHandle } from "fs/promises";

export const encrypt = (data: string, key: Buffer) => {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv, { authTagLength: 16 });
    let encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag()
    encrypted = Buffer.concat([iv, encrypted, authTag]);
    return encrypted;
}

export const decrypt = (key: Buffer, file: FileHandle) => {
    return new Promise<string>(async (res) => {
        const size = (await file.stat()).size;
        if (size < Number.MAX_SAFE_INTEGER && size > 49) {
            const read = (await file.read({ buffer: Buffer.alloc(size - 49), position: 49 })).buffer;
            const [authTag, encrypted, iv] = [read.slice(-16), read.slice(12, -16), read.slice(0, 12)];
            const decipher = createDecipheriv("aes-256-gcm", key, iv, { authTagLength: 16 }).setAuthTag(authTag);
            decipher.write(encrypted);
            decipher.end();
            let data = "";
            decipher.on("data", chunk => data += chunk);
            decipher.on("end", () => { res(data) })
        }
    })
}

export const hashData = (pwd: string | Buffer, salt: Buffer) => {
    return new Promise<Buffer>((resolve, reject) => {
        pbkdf2(pwd, salt, 500000, 32, "sha512", (err, h) => resolve(h));
    })
}