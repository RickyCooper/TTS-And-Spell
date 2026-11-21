import { useEffect } from "react";
import { useGameContext } from "../../context/GameContext/GameContext";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

const AUTOPLAY_DELAY_MS = 250;

export const useAudioButtonController = (audio: string) => {
  const { gameState } = useGameContext();
  const { play } = useAudioPlayer();

  const playAudio = (audioData = audio) => play(audioData);

  useEffect(() => {
    if (gameState.status !== "playing") return;

    const timeoutId = setTimeout(() => void play(audio), AUTOPLAY_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [play, audio, gameState.status]);

  return {
    playAudio,
  };
};