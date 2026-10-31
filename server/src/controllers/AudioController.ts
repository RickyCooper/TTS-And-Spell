import { Request, Response } from "express";
import { getRandomWords, getDemoWords, getWordDetails } from "../services/wordService";
import { type ContextAudioType, generateAudioWithCache, generateContextAudioWithCache } from "../services/cacheService";
import { config } from "../config";
import path from "path";
import fs from "fs/promises";

const DEMO_AUDIO_DIR = path.resolve(__dirname, "../../assets/demo-audio");

export const gameAudio = async (req: Request, res: Response) => {

  let words: { word: string; definition: string; sentence: string }[] = [];
  
  try {

    const { voiceId: requestedVoiceId, ...difficulties } = req.body;
    const voiceId: string = requestedVoiceId ?? config.voiceId;

    // Get Words based on requested difficulties and counts
    Object.entries(difficulties).forEach(([difficulty, count]) => {
      words = [...getRandomWords(difficulty, Number(count))];
    });

    // Generate audio for the selected words (cache-first)
    const wordsWithAudio = await generateAudioWithCache(words.map((word) => word.word), voiceId);

    res.json({
      words: wordsWithAudio.map((wordWithAudio, index) => ({
        ...wordWithAudio,
        sentence: words[index].sentence,
        definition: words[index].definition,
      })),
    });

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
        const filePath = path.join(DEMO_AUDIO_DIR, `${word.word}_${config.voiceId.toLowerCase()}.mp3`);
        const audioBuffer = await fs.readFile(filePath);
        return {
          text: word.word,
          audio: audioBuffer.toString("base64"),
          sentence: word.sentence,
          definition: word.definition,
        };
      })
    );

    res.json({ words: wordsWithAudio });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
    console.error("Error in AudioController:", error);
  }
};

export const contextAudio = async (req: Request, res: Response) => {
  try {
    const { word, contextType, voiceId: requestedVoiceId } = req.body;
    if (typeof word !== "string" || (contextType !== "sentence" && contextType !== "definition")) {
      res.status(400).json({ error: "A word and valid context type are required." });
      return;
    }

    const wordDetails = getWordDetails(word);
    if (!wordDetails) {
      res.status(404).json({ error: "Word details not found." });
      return;
    }

    const voiceId: string = requestedVoiceId ?? config.voiceId;
    const audio = await generateContextAudioWithCache(
      wordDetails.word,
      wordDetails[contextType as ContextAudioType],
      contextType as ContextAudioType,
      voiceId,
    );

    res.json({ word: wordDetails.word, contextType, audio });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
    console.error("Error generating context audio:", error);
  }
};