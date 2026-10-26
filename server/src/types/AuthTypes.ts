import { z } from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
  dateOfBirth: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date of birth must be in DD/MM/YYYY format"),
});

export const LoginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const VerifyResetCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type VerifyResetCodeInput = z.infer<typeof VerifyResetCodeSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
