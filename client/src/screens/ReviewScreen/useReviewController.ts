import { useGameContext } from "../../context/GameContext/GameContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import victorySound from "../../assets/audio/victory.mp3";

export const useReviewController = () => {

  const { gameState, startGame, resetGame } = useGameContext();
  const navigate = useNavigate();

  const results = gameState.words.map((word) => ({
    word: word.text,
    attempts: word.attempts.filter((input) => input.trim()),
    audio: word.audio,
  }));

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
    navigate("/modes");
  };

  const handleReplay = async () => {
    await startGame(gameState.mode!.name, gameState.isDemo);
    navigate("/game");
  };

  return {
    results: results,
    total: gameState.words.length,
    stats: gameState.stats,
    handleExit,
    handleReplay,
  };
};