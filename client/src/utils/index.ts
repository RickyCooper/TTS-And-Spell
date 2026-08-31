export const checkAnswer = (input: string, word: string) => {
    return input.trim().toLowerCase() === word.toLowerCase();
}

export const calculateTime = (startTime: number, endTime: number) => {
    const totalSeconds = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (seconds < 10) {    
        return { minutes: minutes, seconds: Number(`0${seconds}`) };
    }

    return { minutes: minutes, seconds: seconds };
}

const FIRST_TRY_SCORE = 1;
const SECOND_TRY_SCORE = 0.5;
const MULTIPLE_TRY_SCORE = 0.25;

const findCorrectAttemptIndex = (attempts: string[], word: string): number => {
    return attempts.findIndex(a => checkAnswer(a, word));
};

const calculateWordScore = (attempts: string[], word: string): number => {
    const correctIndex = findCorrectAttemptIndex(attempts, word);
    if (correctIndex === -1) return 0;
    if (correctIndex === 0) return FIRST_TRY_SCORE;
    if (correctIndex === 1) return SECOND_TRY_SCORE;
    return MULTIPLE_TRY_SCORE;
};

export const calculateAccuracy = (words: { text: string; attempts?: string[] }[]) => {
    const totalWords = words.length;
    if (totalWords === 0) return 0;

    const totalScore = words.reduce((sum, word) => {
        return sum + calculateWordScore(word.attempts || [], word.text);
    }, 0);

    return Math.round((totalScore / totalWords) * 100);
}

export const calculateScore = (words: { text: string; attempts?: string[] }[]) => {
    return words.filter((word) =>
        findCorrectAttemptIndex(word.attempts || [], word.text) !== -1
    ).length;
}

export const calculateStreak = (currentStreak: number, highestStreak: number, isCorrect: boolean): { currentStreak: number; highestStreak: number } => {
    if (isCorrect) {
        const newStreak = currentStreak + 1;
        return { currentStreak: newStreak, highestStreak: Math.max(newStreak, highestStreak) };
    } else {
        return { currentStreak: 0, highestStreak };
    }
}

export const recordAttempt = <T extends { attempts?: string[] }>(word: T, input: string, skipped?: boolean): T => {
    if (skipped) return word;
    return { ...word, attempts: [...(word.attempts || []), input.trim().toLowerCase()] };
}

export const shouldPrefetch = (questionLimit: number | undefined, remainingWords: number, threshold: number): boolean => {
    return !questionLimit && remainingWords <= threshold;
}

export const getRemainingTime = (timeLimit: number, startTime: number): number => {
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    return Math.max(timeLimit - elapsedSeconds, 0);
}

export const getAttemptedWords = <T>(words: T[], currentIndex: number, earlyEnd?: boolean): T[] => {
    return earlyEnd ? words.slice(0, currentIndex) : words;
}