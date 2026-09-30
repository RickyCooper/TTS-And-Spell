import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 12;

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export const comparePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
}

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// cryptographically secure 6-digit numeric code for password reset emails
export const generateResetCode = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
}
