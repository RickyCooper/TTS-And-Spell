import { Request, Response } from "express";
import { getRandomWords, getAllWords, getDemoWords } from "../services/wordService";
import { generateAudioWithCache } from "../services/cacheService";
import { config } from "../config";
import path from "path";
import fs from "fs/promises";

const DEMO_AUDIO_DIR = path.resolve(__dirname, "../../assets/demo-audio");

export const gameAudio = async (req: Request, res: Response) => {

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
    
    console.error("Error in AudioController:", error);
  }
};

export const demoAudio = async (req: Request, res: Response) => {

  try {
    const count = req.query.count ? parseInt(req.query.count as string, 10) : undefined;
    const words = getDemoWords(count);

    const wordsWithAudio = await Promise.all(
      words.map(async (word) => {
        const filePath = path.join(DEMO_AUDIO_DIR, `${word}_${config.voiceId.toLowerCase()}.mp3`);
        const audioBuffer = await fs.readFile(filePath);
        return { text: word, audio: audioBuffer.toString("base64") };
      })
    );

    res.json({ words: wordsWithAudio });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
    console.error("Error in AudioController:", error);
  }
};