import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AccessTokenPayload {
  userId: string;
  username: string;
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, config.jwtAccessSecret, { expiresIn: "15m" });
}

export const signRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtRefreshSecret, { expiresIn: "7d" });
}

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, config.jwtAccessSecret) as AccessTokenPayload;
}

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, config.jwtRefreshSecret) as { userId: string };
}
