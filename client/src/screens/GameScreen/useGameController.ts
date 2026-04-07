import { useCallback, useRef, useState } from "react";
import { useGameContext } from "../../context/GameContext/GameContext";
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSubmit = (inputValue: string, skipped?: boolean) => {

    const result = submitAnswer(inputValue, skipped);

    const isLastQuestion = gameState.currentIndex >= gameState.words.length - 1;

    if (gameState.status === "playing") {
      if (result === "correct" && !isLastQuestion) correctAudioRef.current.play();
      if (result === "incorrect") incorrectAudioRef.current.play();
    }
    
    setFeedback(result);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setFeedback(null);
    }, 400);
  };

  const handleSkip = useCallback(() => {
    handleSubmit("", true);
    focusInput();
  }, [handleSubmit, focusInput]);

  const handleEndGame = useCallback(() => {
    endGame(true);
  }, [endGame]);

  return { inputRef, handleSubmit, handleSkip, focusInput, feedback, handleEndGame };
};