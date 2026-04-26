import React, { useState, useCallback, useEffect } from "react";
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
  timer: {
    total: null,
    remaining: null,
  },
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({children}) => {

  const [gameState, setGameState] = useState<GameState>(initialState);
  const startTimeRef = React.useRef<number | null>(null);
  const isPrefetchingRef = React.useRef<boolean>(false);
  const timerExpiredRef = React.useRef<boolean>(false);
  
  const streakRef = React.useRef<StreakInfo>({
    currentStreak: 0,
    highestStreak: 0,
  });

  const startGame = useCallback(async (mode: GameModeType) => {
    const modeDetails = GAME_MODES.find((game) => game.name === mode);
    const modeConfig = modeDetails?.config;
    const timeLimit = modeConfig?.timeLimit ?? null;

    streakRef.current = { currentStreak: 0, highestStreak: 0 };
    timerExpiredRef.current = false;

    setGameState({
      ...initialState,
      status: "loading",
      mode: modeDetails,
      timer: {
        total: timeLimit,
        remaining: timeLimit,
      },
    });
  
    try {
      const words = await fetchWords("medium", modeConfig?.questionLimit);
      startTimeRef.current = Date.now();

      setGameState((prev) => ({
        ...prev,
        status: "playing",
        words,
      }));
    } catch {
      setGameState(initialState);
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

  const endGame = useCallback((earlyEnd?: boolean) => {
    timerExpiredRef.current = true;

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
  }, []);

  useEffect(() => {
    const timeLimit = gameState.mode?.config?.timeLimit;

    if (gameState.status !== "playing" || !timeLimit || !startTimeRef.current) {
      return;
    }

    const updateTimer = () => {
      if (!startTimeRef.current) return;

      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(timeLimit - elapsedSeconds, 0);

      setGameState((prev) => ({
        ...prev,
        timer: {
          total: timeLimit,
          remaining,
        },
      }));

      if (remaining <= 0 && !timerExpiredRef.current) {
        endGame(true);
      }
    };

    updateTimer();
    const intervalId = window.setInterval(updateTimer, 100);

    return () => window.clearInterval(intervalId);
  }, [gameState.status, gameState.mode, endGame]);

  const resetGame = useCallback(() => {
    streakRef.current = { currentStreak: 0, highestStreak: 0 };
    startTimeRef.current = null;
    timerExpiredRef.current = false;
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
