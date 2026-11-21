import dotenv from "dotenv";
dotenv.config();

const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || "iP95p4xoKVk53GoZ742B";

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI!,
  elevenLabsApiKey: process.env.ELEVEN_LABS_API_KEY,
  voiceId: defaultVoiceId,
  // voices clients may request (keep in sync with client/src/constants/Voices.ts); anything else is rejected
  allowedVoiceIds: [defaultVoiceId, "hpp4J3VqNfWAUOO0d1Us"],
  audioCacheDir: process.env.AUDIO_CACHE_DIR || "./audio",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpFrom: process.env.SMTP_FROM || "no-reply@tts-and-spell.app",
};
