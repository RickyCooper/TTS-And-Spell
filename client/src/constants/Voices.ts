import type { Voice } from "../types/GameTypes";

// keep in sync with allowedVoiceIds in server/src/config/index.ts
export const VOICES: Voice[] = [
  { id: "iP95p4xoKVk53GoZ742B", name: "George" },
  { id: "hpp4J3VqNfWAUOO0d1Us", name: "Carrie" },
];

export const DEFAULT_VOICE_ID = "iP95p4xoKVk53GoZ742B";
