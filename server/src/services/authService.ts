import prisma from "./prismaClient";
import { hashPassword, comparePassword, hashToken } from "../utils/hash";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { RegisterInput, LoginInput } from "../types/AuthTypes";

export const register = async (input: RegisterInput) => {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
  });

  if (existing) {
    if (existing.email === input.email) throw new Error("EMAIL_TAKEN");
    throw new Error("USERNAME_TAKEN");
  }

  const passwordHash = await hashPassword(input.password);

  const [day, month, year] = input.dateOfBirth.split("/");
  const dateOfBirth = new Date(`${year}-${month}-${day}`);

  const user = await prisma.user.create({
    data: { username: input.username, email: input.email, passwordHash, dateOfBirth },
    select: { id: true, username: true, email: true, dateOfBirth: true, createdAt: true },
  });

  return user;
}

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: input.identifier }, { username: input.identifier }] },
  });

  if (!user) throw new Error("INVALID_CREDENTIALS");

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  const accessToken = signAccessToken({ userId: user.id, username: user.username });
  const refreshToken = signRefreshToken(user.id);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: hashToken(refreshToken), expiresAt },
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, email: user.email, dateOfBirth: user.dateOfBirth },
  };
}

export const refresh = async (rawToken: string) => {
  const payload = verifyRefreshToken(rawToken);

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
  });

  if (!stored || stored.userId !== payload.userId || stored.expiresAt < new Date()) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  // Rotate: delete old, issue new
  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) throw new Error("USER_NOT_FOUND");

  const newAccessToken = signAccessToken({ userId: user.id, username: user.username });
  const newRefreshToken = signRefreshToken(user.id);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: hashToken(newRefreshToken), expiresAt },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export const logout = async (rawToken: string) => {
  await prisma.refreshToken.deleteMany({ where: { tokenHash: hashToken(rawToken) } });
}

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, dateOfBirth: true, createdAt: true },
  });
  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
}
