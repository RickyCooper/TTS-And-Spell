import { useCallback, useRef, useMemo, useEffect } from "react";
import { useGameContext } from "../../context/GameContext/GameContext";

export const useAudioButtonController = (
  audio: string,
  autoplayDelayMs = 250,
) => {
  
  const { gameState } = useGameContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const playAudio = useCallback(async (audioData = audio) => {
    const audioElement = audioRef.current;
    if (!audioElement || !audioData) {
      return;
    }

    const audioSrc = `data:audio/mpeg;base64,${audioData}`;
    if (audioElement.src !== audioSrc) {
      audioElement.src = audioSrc;
    } else {
      audioElement.currentTime = 0;
    }

    try {
      await audioElement.play();
    } catch (e) {
      console.error("Error playing audio:", e);
    }
  }, [audio]);

  const audioSrc = useMemo(() => {
    return audio ? `data:audio/mpeg;base64,${audio}` : "";
  }, [audio]);

  useEffect(() => { 
    const delay = Math.max(0, autoplayDelayMs);

    const timeoutId = setTimeout(() => {
      if (gameState.status === "playing") {
        playAudio();
      }
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };

  }, [audioSrc, autoplayDelayMs, playAudio, gameState.status]);

  return {
    playAudio,
  };
};