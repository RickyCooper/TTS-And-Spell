import { Schema, model } from "mongoose";
import crypto from "crypto";

export interface IPasswordResetCode {
  _id: string;
  userId: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
}

const passwordResetCodeSchema = new Schema<IPasswordResetCode>(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    userId: { type: String, required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PasswordResetCode = model<IPasswordResetCode>("PasswordResetCode", passwordResetCodeSchema);
