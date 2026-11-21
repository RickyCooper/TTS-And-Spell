import gameWords from "../data/words.json";
import demoWords from "../data/demo.json";

type Difficulty = keyof typeof gameWords;
export type WordDetails = {
  word: string;
  definition: string;
  sentence: string;
};

const wordDetailsByName = new Map<string, WordDetails>();
for (const entry of [...Object.values(gameWords).flat(), ...demoWords] as WordDetails[]) {
  const key = entry.word.toLowerCase();
  if (!wordDetailsByName.has(key)) wordDetailsByName.set(key, entry);
}

const shuffleArray = <T>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[random]] = [shuffled[random], shuffled[i]];
  }
  return shuffled;
};

export const getRandomWords = (difficulty: string, count: number) => {
  const difficultyKey = difficulty.toLowerCase() as Difficulty;
  const entries = gameWords[difficultyKey];

  if (!entries) {
    return [];
  }

  return shuffleArray(entries).slice(0, count);
};

export const getDemoWords = (count: number = 10) => {
  return shuffleArray(demoWords).slice(0, count);
};

export const getWordDetails = (word: string): WordDetails | undefined => {
  return wordDetailsByName.get(word.toLowerCase());
};

export const getAllWords = () => {
  return gameWords;
};