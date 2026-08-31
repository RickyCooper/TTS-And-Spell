import type { GamemodeInfo } from "../types/GameTypes";

export const GAME_MODES: GamemodeInfo[] = [
  {
    name: "regular",
    title: "Regular",
    desc: "standard game, ten words.",
    theme: "green",
    config: {
      questionLimit: 10,
    },
  },
  {
    name: "quick",
    title: "Quick",
    desc: "short on time? five words.",
    theme: "blue",
    config: {
      questionLimit: 5,
    },
  },
  {
    name: "rematch",
    title: "Rematch",
    desc: "words you answered incorrectly.",
    theme: "red",
    config: {
      questionLimit: 10,
    },
  },
  {
    name: "marathon",
    title: "Marathon",
    desc: "endless mode.",
    theme: "orange",
    config: {
    },
  },
  {
    name: "countdown",
    title: "Countdown",
    desc: "race against the clock.",
    theme: "purple",
    config: {
      timeLimit: 60,
    },
  },
];