import { createCipheriv, createDecipheriv } from "crypto"

const ALGORITHM = "aes-256-cbc"

export function encryptFile(buffer: Buffer, key: string, iv: string): Buffer {
  const cipher = createCipheriv(ALGORITHM, Buffer.from(key, "utf8"), Buffer.from(iv, "utf8"))
  return Buffer.concat([cipher.update(buffer), cipher.final()])
}

export function decryptFile(encrypted: Buffer, key: string, iv: string): Buffer {
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(key, "utf8"), Buffer.from(iv, "utf8"))
  return Buffer.concat([decipher.update(encrypted), decipher.final()])
}
