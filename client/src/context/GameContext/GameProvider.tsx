import React, { useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  GameState,
  GamemodeType,
  StreakInfo,
} from "../../types/GameTypes";
import { GameContext } from "./GameContext";
import { fetchWordAudio, fetchWordAudioDemo } from "../../services/WordService";
import { GAME_MODES } from "../../constants/GameModes";
import {
  calculateAccuracy,
  calculateScore,
  calculateStreak,
  calculateTime,
  checkAnswer,
  getAttemptedWords,
  getRemainingTime,
  recordAttempt,
  shouldPrefetch,
} from "../../utils";

const DEFAULT_DIFFICULTY = "medium";
const PREFETCH_BATCH_SIZE = 5;
const PREFETCH_THRESHOLD = 5;

const initialState: GameState = {
  status: "idle",
  words: [],
  stats: {
    time: { minutes: 0, seconds: 0 },
    accuracy: 0,
    highestStreak: 0,
    score: 0,
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

  const startGame = useCallback(async (mode: GamemodeType, isDemo?: boolean) => {
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
      const words = isDemo
        ? await fetchWordAudioDemo(modeConfig?.questionLimit)
        : await fetchWordAudio(DEFAULT_DIFFICULTY, modeConfig?.questionLimit);
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

  const prefetchWordAudio = useCallback(async () => {
    if (isPrefetchingRef.current) return;
    isPrefetchingRef.current = true;
    try {
      const newWords = await fetchWordAudio(DEFAULT_DIFFICULTY, PREFETCH_BATCH_SIZE);
      setGameState((prev) => ({ ...prev, words: [...prev.words, ...newWords] }));
    } catch (error) {
      console.error("Failed to prefetch words", error);
    } finally {
      isPrefetchingRef.current = false;
    }
  }, []);

  const endGame = useCallback((earlyEnd?: boolean) => {
    timerExpiredRef.current = true;

    setGameState((prev) => {
      const words = getAttemptedWords(prev.words, prev.currentIndex, earlyEnd);
      return {
        ...prev,
        words,
        stats: {
          ...prev.stats,
          accuracy: calculateAccuracy(words),
          score: calculateScore(words),
          time: calculateTime(startTimeRef.current || 0, Date.now()),
          highestStreak: streakRef.current.highestStreak,
        },
        status: "review",
      };
    });
  }, []);

  const submitAnswer = useCallback((input: string, skipped?: boolean) => {
    const isCorrect = checkAnswer(input, gameState.words[gameState.currentIndex].text);
    streakRef.current = calculateStreak(streakRef.current.currentStreak, streakRef.current.highestStreak, isCorrect);

    setGameState((prev) => ({
      ...prev,
      words: prev.words.map((word, index) =>
        index === prev.currentIndex ? recordAttempt(word, input, skipped) : word
      ),
    }));

    const nextIndex = gameState.currentIndex + (isCorrect || skipped ? 1 : 0);
    const isLastQuestion = nextIndex >= gameState.words.length;

    if (isLastQuestion) {
      endGame();
    } else {
      setGameState((prev) => ({
        ...prev,
        currentIndex: nextIndex,
        status: "playing",
      }));

      const remainingWords = gameState.words.length - nextIndex;
      if (shouldPrefetch(gameState.mode?.config?.questionLimit, remainingWords, PREFETCH_THRESHOLD)) {
        prefetchWordAudio();
      }
    }

    return skipped ? "skipped" : isCorrect ? "correct" : "incorrect";
  }, [gameState.words, gameState.currentIndex, gameState.mode, endGame, prefetchWordAudio]);

  useEffect(() => {
    const timeLimit = gameState.mode?.config?.timeLimit;

    if (gameState.status !== "playing" || !timeLimit || !startTimeRef.current) {
      return;
    }

    const updateTimer = () => {
      if (!startTimeRef.current) return;

      const remaining = getRemainingTime(timeLimit, startTimeRef.current);

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
