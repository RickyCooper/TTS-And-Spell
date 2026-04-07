import wordsData from "../data/words.json";
type Difficulty = keyof typeof wordsData;

export const getRandomWords = (difficulty: string, count: number): string[] => {
  const difficultyKey = difficulty.toLowerCase() as Difficulty;
  const entries = wordsData[difficultyKey];

  if (!entries) {
    return [];
  }

  // Fisher-Yates shuffle
  const shuffled = [...entries];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const random = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[random]] = [shuffled[random], shuffled[i]];
  }

  return shuffled.slice(0, count).map((entry) => entry.word);
};

export const getAllWords = () => {
  return wordsData;
};
