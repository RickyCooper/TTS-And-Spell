import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  auth: config.smtpUser ? { user: config.smtpUser, pass: config.smtpPass } : undefined,
});

export const sendPasswordResetCodeEmail = async (to: string, code: string): Promise<void> => {
  await transporter.sendMail({
    from: config.smtpFrom,
    to,
    subject: "Your password reset code",
    text: `Your password reset code is ${code}. It expires in 30 minutes. If you didn't request this, you can ignore this email.`,
    html: `<p>Your password reset code is <strong>${code}</strong>.</p><p>It expires in 30 minutes. If you didn't request this, you can ignore this email.</p>`,
  });
};
