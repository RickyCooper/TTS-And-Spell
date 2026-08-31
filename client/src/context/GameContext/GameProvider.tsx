import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import type { GamemodeType } from "../../types/GameTypes";
import { GameContext } from "./GameContext";
import { fetchWordAudio, fetchWordAudioDemo } from "../../services/WordService";
import { GAME_MODES } from "../../constants/GameModes";
import { shouldPrefetch } from "../../utils";
import { gameReducer, initialState } from "./GameReducer";

const DEFAULT_DIFFICULTY = "medium";
const PREFETCH_BATCH_SIZE = 5;
const PREFETCH_THRESHOLD = 5;

export const GameProvider: React.FC<{ children: ReactNode }> = ({children}) => {

  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  const isPrefetchingRef = React.useRef<boolean>(false);
  // increments on every start/reset so late fetch responses from a superseded game can be ignored
  const sessionIdRef = React.useRef(0);

  const startGame = useCallback(async (mode: GamemodeType, isDemo?: boolean) => {
    const modeDetails = GAME_MODES.find((game) => game.name === mode);
    if (!modeDetails) return;

    const sessionId = ++sessionIdRef.current;
    dispatch({ type: "START_LOADING", mode: modeDetails });

    try {
      const words = isDemo
        ? await fetchWordAudioDemo(modeDetails.config.questionLimit)
        : await fetchWordAudio(DEFAULT_DIFFICULTY, modeDetails.config.questionLimit);

      if (sessionId !== sessionIdRef.current) return;
      dispatch({ type: "WORDS_LOADED", words, startTime: Date.now() });
    } catch {
      if (sessionId !== sessionIdRef.current) return;
      dispatch({ type: "START_FAILED" });
    }
  }, []);

  const prefetchWordAudio = useCallback(async () => {
    if (isPrefetchingRef.current) return;
    isPrefetchingRef.current = true;
    const sessionId = sessionIdRef.current;

    try {
      const newWords = await fetchWordAudio(DEFAULT_DIFFICULTY, PREFETCH_BATCH_SIZE);
      if (sessionId === sessionIdRef.current) {
        dispatch({ type: "WORDS_PREFETCHED", words: newWords });
      }
    } catch (error) {
      console.error("Failed to prefetch words", error);
    } finally {
      isPrefetchingRef.current = false;
    }
  }, []);

  const submitAnswer = useCallback((input: string, skipped?: boolean) => {
    dispatch({ type: "SUBMIT_ANSWER", input, skipped });
  }, []);

  const endGame = useCallback((earlyEnd?: boolean) => {
    dispatch({ type: "END_GAME", earlyEnd });
  }, []);

  const resetGame = useCallback(() => {
    sessionIdRef.current += 1;
    dispatch({ type: "RESET" });
  }, []);

  useEffect(() => {
    const questionLimit = gameState.mode?.config?.questionLimit;
    const remainingWords = gameState.words.length - gameState.currentIndex;

    if (gameState.status === "playing" && shouldPrefetch(questionLimit, remainingWords, PREFETCH_THRESHOLD)) {
      prefetchWordAudio();
    }
  }, [gameState.status, gameState.mode, gameState.words.length, gameState.currentIndex, prefetchWordAudio]);

  useEffect(() => {
    if (gameState.status !== "playing" || gameState.timer.total === null) return;

    const intervalId = window.setInterval(() => dispatch({ type: "TICK" }), 100);
    return () => window.clearInterval(intervalId);
  }, [gameState.status, gameState.timer.total]);

  const value = useMemo(
    () => ({ gameState, startGame, submitAnswer, resetGame, endGame }),
    [gameState, startGame, submitAnswer, resetGame, endGame],
  );

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

