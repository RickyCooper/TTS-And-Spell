import { useGameContext } from "../../context/GameContext/GameContext";
import { useEffect } from "react";
import victorySound from "../../assets/audio/victory.mp3";

export const useReviewController = () => {

  const { gameState, startGame, resetGame } = useGameContext();

  console.log(gameState.stats)

  const results = gameState.words.map((word) => {
    const questionMatch = gameState.words.find((q) => q.text === word.text);
    const attempts = questionMatch 
      ? questionMatch.attempts.map((a) => a).filter((input) => input.trim())
      : [];

    return {
      word: word.text,
      attempts,
      audio: word.audio,
    };
  });

  useEffect(() => {
    const audio = new Audio(victorySound);
    audio.play().catch((e) => console.error("Error playing sound:", e));
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const handleExit = () => {
    resetGame();
  };

  const handleReplay = () => {
    resetGame();
    startGame(gameState.mode!.name);
  }

  return {
    results: results,
    total: gameState.words.length,
    stats: gameState.stats,
    handleExit,
    handleReplay,
  };
};