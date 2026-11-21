import { type WordWithAudio, generateSingleWordAudio} from "./audioService";
import { storageProvider } from "../storage";

export type ContextAudioType = "sentence" | "definition";

// cache is keyed by voice only, so delete the cached voice-preview_* files if this phrase changes
const VOICE_PREVIEW_TEXT = "Hi there! I'll read out your spelling words. Listen closely!";

const sanitizeKey = (word: string): string => word.toLowerCase().replace(/[^a-z0-9_-]/g, "_");

const buildCacheKey = (word: string, voiceId: string): string =>
  `${sanitizeKey(word)}_${voiceId}`;

const buildContextCacheKey = (word: string, contextType: ContextAudioType, voiceId: string): string =>
  `${sanitizeKey(word)}_${contextType}_${voiceId}`;

// returns the cached audio for key, generating and caching it from text on a miss
const readOrGenerate = async (key: string, text: string, voiceId: string): Promise<Buffer> => {
  if (await storageProvider.exists(key)) {
    return storageProvider.read(key);
  }

  const audioBuffer = await generateSingleWordAudio(text, voiceId);
  await storageProvider.write(key, audioBuffer);
  return audioBuffer;
};

export const generateAudioWithCache = async (
  words: string[],
  voiceId: string
): Promise<WordWithAudio[]> => {
  return Promise.all(
    words.map(async (word) => {
      const audioBuffer = await readOrGenerate(buildCacheKey(word, voiceId), word, voiceId);

      return {
        text: word,
        audio: audioBuffer.toString("base64"),
      };
    })
  );
};

export const generateContextAudioWithCache = async (
  word: string,
  text: string,
  contextType: ContextAudioType,
  voiceId: string,
): Promise<string> => {
  const audioBuffer = await readOrGenerate(buildContextCacheKey(word, contextType, voiceId), text, voiceId);

  return audioBuffer.toString("base64");
};

export const generateVoicePreviewWithCache = async (voiceId: string): Promise<string> => {
  const audioBuffer = await readOrGenerate(`voice-preview_${voiceId}`, VOICE_PREVIEW_TEXT, voiceId);

  return audioBuffer.toString("base64");
};
