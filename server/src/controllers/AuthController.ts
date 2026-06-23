import { Request, Response } from "express";
import * as authService from "../services/authService";
import { AuthRequest } from "../middleware/authenticate";

const REFRESH_COOKIE = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (err: any) {
    if (err.message === "EMAIL_TAKEN") {
      res.status(409).json({ message: "Email is already in use" });
    } else if (err.message === "USERNAME_TAKEN") {
      res.status(409).json({ message: "Username is already taken" });
    } else {
      throw err;
    }
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ accessToken, user });
  } catch (err: any) {
    if (err.message === "INVALID_CREDENTIALS") {
      const isEmail = req.body.identifier?.includes("@");
      const message = isEmail
        ? "Email or password is incorrect"
        : "Username or password is incorrect";
      res.status(401).json({ message });
    } else {
      throw err;
    }
  }
}

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const rawToken = req.cookies?.[REFRESH_COOKIE];
  if (!rawToken) {
    res.status(401).json({ message: "No refresh token provided" });
    return;
  }

  try {
    const { accessToken, refreshToken } = await authService.refresh(rawToken);
    res.cookie(REFRESH_COOKIE, refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ accessToken });
  } catch {
    res.clearCookie(REFRESH_COOKIE);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  const rawToken = req.cookies?.[REFRESH_COOKIE];
  if (rawToken) {
    await authService.logout(rawToken);
  }
  res.clearCookie(REFRESH_COOKIE, { path: "/" });
  res.status(204).send();
}

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.status(200).json({ user });
  } catch {
    res.status(404).json({ message: "User not found" });
  }
}
