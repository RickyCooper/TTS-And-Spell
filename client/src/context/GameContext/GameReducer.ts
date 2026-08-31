import type { GamemodeInfo, GameState, Word } from "../../types/GameTypes";
import {
  calculateAccuracy,
  calculateScore,
  calculateStreak,
  calculateTime,
  checkAnswer,
  getAttemptedWords,
  getRemainingTime,
  recordAttempt,
} from "../../utils";

const MAX_ATTEMPTS_PER_WORD = 5;

export const initialState: GameState = {
  status: "idle",
  words: [],
  currentIndex: 0,
  mode: undefined,
  startTime: null,
  streak: { currentStreak: 0, highestStreak: 0 },
  timer: {
    total: null,
    remaining: null,
  },
  stats: {
    time: { minutes: 0, seconds: 0 },
    accuracy: 0,
    highestStreak: 0,
    score: 0,
  },
};

export type GameAction =
  | { type: "START_LOADING"; mode: GamemodeInfo }
  | { type: "WORDS_LOADED"; words: Word[]; startTime: number }
  | { type: "START_FAILED" }
  | { type: "WORDS_PREFETCHED"; words: Word[] }
  | { type: "SUBMIT_ANSWER"; input: string; skipped?: boolean }
  | { type: "TICK" }
  | { type: "END_GAME"; earlyEnd?: boolean }
  | { type: "RESET" };

const buildFinalStats = (words: Word[], highestStreak: number, startTime: number | null) => ({
  accuracy: calculateAccuracy(words),
  score: calculateScore(words),
  time: calculateTime(startTime ?? Date.now(), Date.now()),
  highestStreak,
});

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "START_LOADING": {
      const timeLimit = action.mode.config.timeLimit ?? null;
      return {
        ...initialState,
        status: "loading",
        mode: action.mode,
        timer: { total: timeLimit, remaining: timeLimit },
      };
    }

    case "WORDS_LOADED":
      if (state.status !== "loading") return state;
      return { ...state, status: "playing", words: action.words, startTime: action.startTime };

    case "START_FAILED":
      return state.status === "loading" ? initialState : state;

    case "WORDS_PREFETCHED":
      if (state.status !== "playing") return state;
      return { ...state, words: [...state.words, ...action.words] };

    case "SUBMIT_ANSWER": {
      if (state.status !== "playing") return state;

      const currentWord = state.words[state.currentIndex];
      const isCorrect = checkAnswer(action.input, currentWord.text);
      const words = state.words.map((word, index) =>
        index === state.currentIndex ? recordAttempt(word, action.input, action.skipped) : word
      );
      const reachedMaxAttempts = !action.skipped && !isCorrect
        && words[state.currentIndex].attempts.length >= MAX_ATTEMPTS_PER_WORD;
      const streak = calculateStreak(state.streak.currentStreak, state.streak.highestStreak, isCorrect);
      const nextIndex = state.currentIndex + (isCorrect || action.skipped || reachedMaxAttempts ? 1 : 0);
      const isLastQuestion = nextIndex >= words.length;

      if (isLastQuestion) {
        return {
          ...state,
          words,
          streak,
          status: "review",
          stats: buildFinalStats(words, streak.highestStreak, state.startTime),
        };
      }

      return {
        ...state,
        words,
        streak,
        currentIndex: nextIndex,
      };
    }

    case "TICK": {
      if (state.status !== "playing" || state.timer.total === null || state.startTime === null) {
        return state;
      }

      const remaining = getRemainingTime(state.timer.total, state.startTime);
      if (remaining <= 0) {
        return {
          ...state,
          status: "review",
          timer: { ...state.timer, remaining: 0 },
          stats: buildFinalStats(state.words, state.streak.highestStreak, state.startTime),
        };
      }

      return { ...state, timer: { ...state.timer, remaining } };
    }

    case "END_GAME": {
      if (state.status !== "playing") return state;
      const words = getAttemptedWords(state.words, state.currentIndex, action.earlyEnd);
      return {
        ...state,
        words,
        status: "review",
        stats: buildFinalStats(words, state.streak.highestStreak, state.startTime),
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
};
