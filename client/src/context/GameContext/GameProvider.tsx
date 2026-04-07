import React, { useState, useCallback } from "react";
import type { ReactNode } from "react";
import type {
  GameState,
  GameModeType,
  StreakInfo,
} from "../../types/GameTypes";
import { GameContext } from "./GameContext";
import { fetchWords } from "../../services/WordService";
import { GAME_MODES } from "../../constants/GameModes";
import { calculateAccuracy, calculateStreak, calculateTime, checkAnswer } from "../../utils";

const initialState: GameState = {
  status: "idle",
  words: [],
  stats: {
    time: { minutes: 0, seconds: 0 },
    accuracy: 0,
    highestStreak: 0,
  },
  currentIndex: 0,
  mode: undefined,
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({children}) => {

  const [gameState, setGameState] = useState<GameState>(initialState);
  const startTimeRef = React.useRef<number | null>(null);
  const isPrefetchingRef = React.useRef<boolean>(false);
  
  const streakRef = React.useRef<StreakInfo>({
    currentStreak: 0,
    highestStreak: 0,
  });

  const startGame = useCallback(async (mode: GameModeType) => {
    const modeDetails = GAME_MODES.find((game) => game.name === mode);
    const modeConfig = modeDetails?.config;
    
    setGameState((prev) => ({ ...prev, status: "loading", mode: modeDetails }));
  
    try {
      const words = await fetchWords("medium", modeConfig?.questionLimit);
      setGameState((prev) => ({
        ...prev,
        status: "playing",
        words,
        modeConfig,
      }));
      startTimeRef.current = Date.now();
    } catch {
      setGameState((prev) => ({ ...prev, status: "idle" }));
    }
  }, []);

  const prefetchWords = async (difficulty: string, voiceId?: string) => {
    if (isPrefetchingRef.current) return;
    isPrefetchingRef.current = true;
    try {
      const newWords = await fetchWords(difficulty, 5, voiceId);
      setGameState((prev) => ({ ...prev, words: [...prev.words, ...newWords] }));
    } catch (error) {
      console.error("Failed to prefetch words", error);
    } finally {
      isPrefetchingRef.current = false;
    }
  };

  const submitAnswer = (input: string, skipped?: boolean) => {
    const isCorrect = checkAnswer(input, gameState.words[gameState.currentIndex].text);
    streakRef.current = calculateStreak(streakRef.current.currentStreak, streakRef.current.highestStreak, isCorrect);

    setGameState((prev) => {
      const words = prev.words.map((word, wordIndex) => 
        wordIndex === prev.currentIndex
          ? (skipped
              ? word
              : { ...word, attempts: [...(word.attempts || []), input.trim().toLowerCase()] })
          : word
      );

      return {
        ...prev,
        words,
      };
    });

    progressGameIndex(isCorrect, skipped);
    
    return skipped ? "skipped" : isCorrect ? "correct" : "incorrect";
  };
  
  const progressGameIndex = (isCorrect: boolean, skipped?: boolean) => {
    const index = gameState.currentIndex + (isCorrect || skipped ? 1 : 0);
    const isLastQuestion = index >= gameState.words.length;

    if (isLastQuestion) {
      endGame();
    } else {
      setGameState((prev) => {
        return {
          ...prev,
          currentIndex: isLastQuestion ? prev.currentIndex : index,
          status: "playing",
        };
      });

      const questionLimit = gameState.mode?.config?.questionLimit;
      const remaining = gameState.words.length - index;
      if (!questionLimit && remaining <= 5) {
        prefetchWords("medium");
      }
    }
  };

  const endGame = (earlyEnd?: boolean) => {
    setGameState((prev) => {
      const words = earlyEnd ? prev.words.slice(0, prev.currentIndex) : prev.words;
      return {
        ...prev,
        words,
        stats: {
          ...prev.stats,
          accuracy: calculateAccuracy(words),
          time: calculateTime(startTimeRef.current || 0, Date.now()),
          highestStreak: streakRef.current.highestStreak,
        },
        status: "review",
      };
    });
  };

  const resetGame = useCallback(() => {
    streakRef.current = { currentStreak: 0, highestStreak: 0 };
    setGameState(initialState);
  }, []);

  return (
    <GameContext.Provider
      value={{ gameState, startGame, submitAnswer, resetGame, endGame }}
    >
      {children}
    </GameContext.Provider>
  );
};
