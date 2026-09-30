import { User } from "../models/User";
import { RefreshToken } from "../models/RefreshToken";
import { PasswordResetCode } from "../models/PasswordResetCode";
import { hashPassword, comparePassword, hashToken, generateResetCode } from "../utils/hash";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { sendPasswordResetCodeEmail } from "./emailService";
import { RegisterInput, LoginInput } from "../types/AuthTypes";

const RESET_CODE_TTL_MS = 30 * 60 * 1000;
const MAX_RESET_ATTEMPTS = 5;

export const register = async (input: RegisterInput) => {
  const existing = await User.findOne({
    $or: [{ email: input.email }, { username: input.username }],
  });

  if (existing) {
    if (existing.email === input.email) throw new Error("EMAIL_TAKEN");
    throw new Error("USERNAME_TAKEN");
  }

  const passwordHash = await hashPassword(input.password);

  const [day, month, year] = input.dateOfBirth.split("/");
  const dateOfBirth = new Date(`${year}-${month}-${day}`);

  const user = await User.create({ username: input.username, email: input.email, passwordHash, dateOfBirth });

  return { 
    id: user._id, 
    username: user.username, 
    email: user.email, 
    dateOfBirth: user.dateOfBirth, 
    createdAt: user.createdAt,
    approvalStatus: user.approvalStatus
  };
}

export const login = async (input: LoginInput) => {
  const user = await User.findOne({
    $or: [{ email: input.identifier }, { username: input.identifier }],
  });

  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  const accessToken = signAccessToken({ userId: user._id, username: user.username });
  const refreshToken = signRefreshToken(user._id);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ userId: user._id, tokenHash: hashToken(refreshToken), expiresAt });

  return {
    accessToken,
    refreshToken,
    user: { 
      id: user._id, 
      username: user.username,
       email: user.email, 
       dateOfBirth: user.dateOfBirth,
       approvalStatus: user.approvalStatus
    },
  };
}

export const refresh = async (rawToken: string) => {
  const payload = verifyRefreshToken(rawToken);

  const stored = await RefreshToken.findOne({ tokenHash: hashToken(rawToken) });

  if (!stored || stored.userId !== payload.userId || stored.expiresAt < new Date()) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  // Rotate: delete old, issue new
  await RefreshToken.findByIdAndDelete(stored._id);

  const user = await User.findById(payload.userId);
  if (!user) throw new Error("USER_NOT_FOUND");

  const newAccessToken = signAccessToken({ userId: user._id, username: user.username });
  const newRefreshToken = signRefreshToken(user._id);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ userId: user._id, tokenHash: hashToken(newRefreshToken), expiresAt });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export const logout = async (rawToken: string) => {
  await RefreshToken.deleteMany({ tokenHash: hashToken(rawToken) });
}

export const getMe = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  return { 
    id: user._id, 
    username: user.username, 
    email: user.email, 
    dateOfBirth: user.dateOfBirth, 
    createdAt: user.createdAt, 
    approvalStatus: user.approvalStatus
  };
}

export const forgotPassword = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (!user) return; // don't reveal whether the email is registered

  const code = generateResetCode();
  const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MS);

  await PasswordResetCode.deleteMany({ userId: user._id });
  await PasswordResetCode.create({ userId: user._id, codeHash: hashToken(code), expiresAt });

  await sendPasswordResetCodeEmail(user.email, code);
}

// shared by verifyResetCode/resetPassword so both fail the same generic way
const getValidResetCode = async (email: string, code: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("INVALID_RESET_CODE");

  const stored = await PasswordResetCode.findOne({ userId: user._id });
  if (!stored || stored.expiresAt < new Date()) throw new Error("INVALID_RESET_CODE");

  if (stored.attempts >= MAX_RESET_ATTEMPTS) {
    await PasswordResetCode.findByIdAndDelete(stored._id);
    throw new Error("INVALID_RESET_CODE");
  }

  if (hashToken(code) !== stored.codeHash) {
    stored.attempts += 1;
    await stored.save();
    throw new Error("INVALID_RESET_CODE");
  }

  return { user, stored };
}

export const verifyResetCode = async (email: string, code: string): Promise<void> => {
  await getValidResetCode(email, code);
}

export const resetPassword = async (email: string, code: string, newPassword: string): Promise<void> => {
  const { user, stored } = await getValidResetCode(email, code);

  user.passwordHash = await hashPassword(newPassword);
  await user.save();

  await PasswordResetCode.findByIdAndDelete(stored._id);
  await RefreshToken.deleteMany({ userId: user._id }); // sign out all existing sessions
}
