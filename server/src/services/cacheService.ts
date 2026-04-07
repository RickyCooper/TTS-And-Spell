import { type WordWithAudio, generateSingleWordAudio} from "./audioService";
import { storageProvider } from "../storage";

const buildCacheKey = (word: string, voiceId: string): string =>
  `${word.toLowerCase().replace(/[^a-z0-9_-]/g, "_")}_${voiceId}`;

export const generateAudioWithCache = async (
  words: string[],
  voiceId: string
): Promise<WordWithAudio[]> => {
  return Promise.all(
    words.map(async (word) => {
      const key = buildCacheKey(word, voiceId);

      let audioBuffer: Buffer;

      if (await storageProvider.exists(key)) {
        audioBuffer = await storageProvider.read(key);
      } else {
        audioBuffer = await generateSingleWordAudio(word, voiceId);
        await storageProvider.write(key, audioBuffer);
      }

      return {
        text: word,
        audio: audioBuffer.toString("base64"),
      };
    })
  );
};
