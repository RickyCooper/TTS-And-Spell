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
  lives: null,
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
  | { type: "UPDATE_TIMER" }
  | { type: "END_GAME"; earlyEnd?: boolean }
  | { type: "RESET" };

const buildFinalStats = (words: Word[], highestStreak: number, startTime: number | null) => ({
  accuracy: calculateAccuracy(words),
  score: calculateScore(words),
  time: calculateTime(startTime ?? Date.now(), Date.now()),
  highestStreak,
});

// every game-over path funnels through here so "end the round" only has one implementation
const finishGame = (state: GameState, updates: Partial<GameState> = {}): GameState => {
  const words = updates.words ?? state.words;
  const streak = updates.streak ?? state.streak;
  return {
    ...state,
    ...updates,
    status: "review",
    stats: buildFinalStats(words, streak.highestStreak, state.startTime),
  };
};

// only lives-based modes (e.g. survival) lose a life on a miss; other modes leave lives untouched
const applyLifePenalty = (lives: GameState["lives"], isCorrect: boolean): GameState["lives"] => {
  if (!lives || isCorrect) return lives;
  return { ...lives, remaining: lives.remaining - 1 };
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "START_LOADING": {
      const timeLimit = action.mode.config.timeLimit ?? null;
      const lifeLimit = action.mode.config.lifeLimit ?? null;
      return {
        ...initialState,
        status: "loading",
        mode: action.mode,
        timer: { total: timeLimit, remaining: timeLimit },
        lives: lifeLimit ? { total: lifeLimit, remaining: lifeLimit } : null,
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

      const isLivesMode = state.lives !== null;
      const currentWord = state.words[state.currentIndex];
      const isCorrect = checkAnswer(action.input, currentWord.text);
      const words = state.words.map((word, index) =>
        index === state.currentIndex ? recordAttempt(word, action.input, action.skipped) : word
      );

      const reachedMaxAttempts = !isLivesMode && !action.skipped && !isCorrect
        && words[state.currentIndex].attempts.length >= MAX_ATTEMPTS_PER_WORD;
      const streak = calculateStreak(state.streak.currentStreak, state.streak.highestStreak, isCorrect);
      const lives = applyLifePenalty(state.lives, isCorrect);

      // lives-based modes are one-shot per word: every submission advances, win or lose
      const advances = isLivesMode || isCorrect || action.skipped || reachedMaxAttempts;
      const nextIndex = state.currentIndex + (advances ? 1 : 0);

      const isOutOfWords = nextIndex >= words.length;
      const isOutOfLives = lives !== null && lives.remaining <= 0;

      if (isOutOfWords || isOutOfLives) {
        return finishGame(state, { words, streak, lives });
      }

      return { ...state, words, streak, lives, currentIndex: nextIndex };
    }

    case "UPDATE_TIMER": {
      if (state.status !== "playing" || state.timer.total === null || state.startTime === null) {
        return state;
      }

      const remaining = getRemainingTime(state.timer.total, state.startTime);
      if (remaining <= 0) {
        return finishGame(state, { timer: { ...state.timer, remaining: 0 } });
      }

      return { ...state, timer: { ...state.timer, remaining } };
    }

    case "END_GAME": {
      if (state.status !== "playing") return state;
      // no completed questions to review, so skip the review screen entirely
      if (action.earlyEnd && state.currentIndex === 0) return initialState;
      const words = getAttemptedWords(state.words, state.currentIndex, action.earlyEnd);
      return finishGame(state, { words });
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
};
