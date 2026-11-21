import { Request, Response } from "express";
import { getRandomWords, getDemoWords, getWordDetails, type WordDetails } from "../services/wordService";
import {
  generateAudioWithCache,
  generateContextAudioWithCache,
  generateVoicePreviewWithCache,
} from "../services/cacheService";
import type {
  ContextAudioInput,
  DemoQueryInput,
  GameWordsInput,
  VoicePreviewInput,
  WordAudioInput,
} from "../types/GameTypes";
import { config } from "../config";
import path from "path";
import fs from "fs/promises";

const DEMO_AUDIO_DIR = path.resolve(__dirname, "../../assets/demo-audio");

// handlers let errors reject; Express 5 forwards them to the errorHandler middleware

export const gameAudio = async (req: Request, res: Response) => {
  const { voiceId, ...difficulties }: GameWordsInput = req.body;

  const words = Object.entries(difficulties).flatMap(([difficulty, count]) =>
    getRandomWords(difficulty, Number(count)),
  );

  // Generate audio for the selected words (cache-first)
  const wordsWithAudio = await generateAudioWithCache(words.map((word) => word.word), voiceId);

  res.json({
    words: wordsWithAudio.map((wordWithAudio, index) => ({
      ...wordWithAudio,
      sentence: words[index].sentence,
      definition: words[index].definition,
    })),
  });
};

export const demoAudio = async (req: Request, res: Response) => {
  const { count }: DemoQueryInput = res.locals.query;
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
};

export const contextAudio = async (req: Request, res: Response) => {
  const { word, contextType, voiceId }: ContextAudioInput = req.body;

  const wordDetails = getWordDetails(word);
  if (!wordDetails) {
    res.status(404).json({ message: "Word details not found." });
    return;
  }

  const audio = await generateContextAudioWithCache(
    wordDetails.word,
    wordDetails[contextType],
    contextType,
    voiceId,
  );

  res.json({ word: wordDetails.word, contextType, audio });
};

export const wordAudio = async (req: Request, res: Response) => {
  const { words, voiceId }: WordAudioInput = req.body;

  // only known words are voiced so this can't be used as a free-text TTS endpoint
  const wordDetails = words.map((word) => getWordDetails(word));
  const knownWords = wordDetails.filter((details): details is WordDetails => details !== undefined);
  if (knownWords.length !== words.length) {
    res.status(404).json({ message: "Word details not found." });
    return;
  }

  const uniqueWords = [...new Set(knownWords.map((details) => details.word))];
  const wordsWithAudio = await generateAudioWithCache(uniqueWords, voiceId);

  res.json({ words: wordsWithAudio });
};

export const voicePreview = async (req: Request, res: Response) => {
  const { voiceId }: VoicePreviewInput = req.body;

  res.json({ audio: await generateVoicePreviewWithCache(voiceId) });
};