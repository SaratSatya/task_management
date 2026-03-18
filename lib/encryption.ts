import "server-only";
import crypto from "crypto";
import { env } from "./env";

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

function getKey() {
  return Buffer.from(env.TASK_ENCRYPTION_KEY, "hex");
}

export function encryptText(plainText: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

export function decryptText(encryptedText: string) {
  const [ivHex, cipherText] = encryptedText.split(":");

  if (!ivHex || !cipherText) {
    throw new Error("Invalid encrypted text format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);

  let decrypted = decipher.update(cipherText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}