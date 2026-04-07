import { Request, Response } from "express";
import { getRandomWords, getAllWords } from "../services/wordService";
import { generateAudioWithCache } from "../services/cacheService";
import { config } from "../config";

export const WordAudioController = async (req: Request, res: Response) => {

  let words: string[] = [];
  
  try {

    const { voiceId: requestedVoiceId, ...difficulties } = req.body;
    const voiceId: string = requestedVoiceId ?? config.voiceId;

    // Get Words based on requested difficulties and counts
    Object.entries(difficulties).forEach(([difficulty, count]) => {
      words = [...getRandomWords(difficulty, Number(count))];
    });

    // Generate audio for the selected words (cache-first)
    const wordsWithAudio = await generateAudioWithCache(words, voiceId);

    res.json({ words: wordsWithAudio });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ 
      error: errorMessage
    });
    
    console.error("Error in WordAudioController:", error);
  }
};
