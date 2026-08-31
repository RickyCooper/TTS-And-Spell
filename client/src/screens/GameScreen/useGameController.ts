import { useCallback, useRef, useState } from "react";
import { useGameContext } from "../../context/GameContext/GameContext";
import { checkAnswer } from "../../utils";
import correctSfx from "../../assets/audio/correct.mp3";
import incorrectSfx from "../../assets/audio/incorrect.mp3";

export const useGameController = () => {

  const correctAudioRef = useRef<HTMLAudioElement>(new Audio(correctSfx));
  const incorrectAudioRef = useRef<HTMLAudioElement>(new Audio(incorrectSfx));

  const { submitAnswer, gameState, endGame } = useGameContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const [feedback, setFeedback] = useState<string | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback((inputValue: string, skipped?: boolean) => {
    const isPlaying = gameState.status === "playing";
    const isCorrect = isPlaying && !skipped && checkAnswer(inputValue, gameState.words[gameState.currentIndex].text);
    const isLastQuestion = gameState.currentIndex >= gameState.words.length - 1;

    submitAnswer(inputValue, skipped);

    if (isPlaying) {
      if (isCorrect && !isLastQuestion) correctAudioRef.current.play();
      if (!skipped && !isCorrect) incorrectAudioRef.current.play();
    }

    setFeedback(skipped ? "skipped" : isCorrect ? "correct" : "incorrect");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setFeedback(null);
    }, 400);
  }, [submitAnswer, gameState.status, gameState.words, gameState.currentIndex]);

  const handleSkip = useCallback(() => {
    handleSubmit("", true);
    focusInput();
  }, [handleSubmit, focusInput]);

  const handleEndGame = useCallback(() => {
    endGame(true);
  }, [endGame]);

  return { inputRef, handleSubmit, handleSkip, focusInput, feedback, handleEndGame };
};