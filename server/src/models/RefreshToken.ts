import { Schema, model } from "mongoose";
import crypto from "crypto";

export interface IRefreshToken {
  _id: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  userId: string;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);
