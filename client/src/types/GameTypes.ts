export type GamemodeType =
  | "regular"
  | "quick"
  | "marathon"
  | "survival"
  | "rematch"
  | "countdown";
;

export type GameStatus = "idle" | "loading" | "playing" | "review";

export type GameModeTheme = "green" | "blue" | "red" | "brown" | "purple" | "orange";

export interface GameConfig {
  timeLimit?: number;
  questionLimit?: number;
  lifeLimit?: number;
}

export interface GamemodeInfo {
  name: GamemodeType;
  title: string;
  desc: string;
  theme: GameModeTheme;
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
  mode?: GamemodeInfo;
  words: Word[];
  currentIndex: number;
  timer: {
    total: number | null;
    remaining: number | null;
  };
  stats: {
    time: { minutes: number; seconds: number };
    accuracy: number;
    highestStreak: number;
    score: number;
  };
}
export interface StreakInfo {
  currentStreak: number;
  highestStreak: number;
}