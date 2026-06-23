import gameWords from "../data/words.json";
import demoWords from "../data/demo.json";

type Difficulty = keyof typeof gameWords;

const shuffleArray = <T>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[random]] = [shuffled[random], shuffled[i]];
  }
  return shuffled;
};

export const getRandomWords = (difficulty: string, count: number): string[] => {
  const difficultyKey = difficulty.toLowerCase() as Difficulty;
  const entries = gameWords[difficultyKey];

  if (!entries) {
    return [];
  }

  return shuffleArray(entries).slice(0, count).map((entry) => entry.word);
};

export const getDemoWords = (count: number = 10): string[] => {
  return shuffleArray(demoWords).slice(0, count).map((entry) => entry.word);
};

export const getAllWords = () => {
  return gameWords;
};