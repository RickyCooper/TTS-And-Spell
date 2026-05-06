import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  elevenLabsApiKey: process.env.ELEVEN_LABS_API_KEY,
  voiceId: process.env.ELEVENLABS_VOICE_ID || "iP95p4xoKVk53GoZ742B",
  audioCacheDir: process.env.AUDIO_CACHE_DIR || "./audio",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
