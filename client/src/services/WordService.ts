import type { Word } from "../types/GameTypes";
import { DEFAULT_VOICE_ID } from "../constants/Voices";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export type ContextAudioType = "sentence" | "definition";

interface WordResponse {
  text: string;
  audio: string;
  sentence: string;
  definition: string;
}

const toWord = (word: WordResponse): Word => ({ ...word, attempts: [] });

const postJson = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Error requesting ${path}: ${response.statusText}`);
  }

  return response.json();
};

export const fetchWordAudio = async (
  difficulty: string,
  count: number = 10,
  voiceId: string = DEFAULT_VOICE_ID,
): Promise<Word[]> => {
  try {
    const data = await postJson<{ words: WordResponse[] }>("/game/words", {
      voiceId,
      [difficulty]: count,
    });

    return data.words.map(toWord);

  } catch (error) {
    console.error("Failed to fetch words", error);
    throw error;
  }
};

export const fetchWordAudioDemo = async (count?: number): Promise<Word[]> => {
  try {
    const url = count != null ? `${API_URL}/game/demo?count=${count}` : `${API_URL}/game/demo`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error fetching demo words: ${response.statusText}`);
    }

    const data = await response.json();

    return data.words.map(toWord);

  } catch (error) {
    console.error("Failed to fetch demo words", error);
    throw error;
  }
};

export const fetchContextAudio = async (
  word: string,
  contextType: ContextAudioType,
  voiceId: string = DEFAULT_VOICE_ID,
): Promise<string> => {
  const data = await postJson<{ audio: string }>("/game/context-audio", { word, contextType, voiceId });
  return data.audio;
};

// re-voices words that are already in play; resolves to a word -> base64 audio lookup
export const fetchWordsAudio = async (
  words: string[],
  voiceId: string,
): Promise<Record<string, string>> => {
  const data = await postJson<{ words: { text: string; audio: string }[] }>("/game/word-audio", { words, voiceId });
  return Object.fromEntries(data.words.map((word) => [word.text, word.audio]));
};

export const fetchVoicePreview = async (voiceId: string): Promise<string> => {
  const data = await postJson<{ audio: string }>("/game/voice-preview", { voiceId });
  return data.audio;
};