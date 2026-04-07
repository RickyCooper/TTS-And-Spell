export type GameModeType =
  | "regular"
  | "quick"
  | "marathon"
  | "survival"
  | "rematch"
  | "countdown";

export type GameStatus = "idle" | "loading" | "playing" | "review";

export interface GameConfig {
  timeLimit?: number;
  questionLimit?: number;
  lifeLimit?: number;
}

export interface GameModeInfo {
  name: GameModeType;
  title: string;
  desc: string;
  config: GameConfig;
  disabled?: boolean;
}

export interface Word {
  text: string;
  audio: string;
  attempts: string[];
}

export interface GameState {
  status: GameStatus;
  mode?: GameModeInfo;
  words: Word[];
  currentIndex: number;
  stats: {
    time: { minutes: number; seconds: number };
    accuracy: number;
    highestStreak: number;
  }
}
export interface StreakInfo {
  currentStreak: number;
  highestStreak: number;
}