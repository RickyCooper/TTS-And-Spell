import { Schema, model } from "mongoose";
import crypto from "crypto";

export interface IUser {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
  approvalStatus: 'pending' | 'approved';
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    approvalStatus: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
      },
    },
  }
);

export const User = model<IUser>("User", userSchema);
