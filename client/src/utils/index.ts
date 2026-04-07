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
    
    console.log("Calculated time:", { minutes, seconds });
    return { minutes: minutes, seconds: seconds };
}

const getWordScore = (attempts: string[], word: string): number => {
    if (attempts.length === 0) return 0;
    const correctIndex = attempts.findIndex(a => checkAnswer(a, word));
    if (correctIndex === -1) return 0;
    if (correctIndex === 0) return 1;
    if (correctIndex === 1) return 0.5;
    return 0.25;
};

export const calculateAccuracy = (words: { text: string; attempts?: string[] }[]) => {
    const totalWords = words.length;
    if (totalWords === 0) return 0;

    const totalScore = words.reduce((sum, word) => {
        return sum + getWordScore(word.attempts || [], word.text);
    }, 0);

    return Math.round((totalScore / totalWords) * 100);
}

export const calculateStreak = (currentStreak: number, highestStreak: number, isCorrect: boolean): { currentStreak: number; highestStreak: number } => {
    if (isCorrect) {
        const newStreak = currentStreak + 1;
        return { currentStreak: newStreak, highestStreak: Math.max(newStreak, highestStreak) };
    } else {
        return { currentStreak: 0, highestStreak };
    }
}