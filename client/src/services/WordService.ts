import type { Word } from "../types/GameTypes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DEFAULT_VOICE_ID = "iP95p4xoKVk53GoZ742B";

export const fetchWords = async (
  difficulty: string,
  count: number = 10,
  voiceId: string = DEFAULT_VOICE_ID,
): Promise<Word[]> => {
  try {
    const payload = {
      voiceId,
      [difficulty]: count,
    };

    const response = await fetch(`${API_URL}/words`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error fetching words: ${response.statusText}`);
    }

    const data = await response.json();

    return data.words.map((word: { text: string, audio: string }) => ({
      text: word.text,
      audio: word.audio,
      attempts: [],
    }));

  } catch (error) {
    console.error("Failed to fetch words", error);
    throw error;
  }
};