import type { GameModeInfo } from "../types/GameTypes";

export const GAME_MODES: GameModeInfo[] = [
  {
    name: "regular",
    title: "Regular",
    desc: "standard game, ten words.",
    config: {
      questionLimit: 10,
    },
  },
  {
    name: "quick",
    title: "Quick",
    desc: "short on time? five words.",
    config: {
      questionLimit: 5,
    },
  },
  {
    name: "rematch",
    title: "Rematch",
    desc: "words you answered incorrectly.",
    config: {
      questionLimit: 10,
    },
  },
  {
    name: "marathon",
    title: "Marathon",
    desc: "endless mode.",
    config: {
    },
  },
  {
    name: "countdown",
    title: "Countdown",
    desc: "race against the clock.",
    config: {
      timeLimit: 120,
    },
  },
];