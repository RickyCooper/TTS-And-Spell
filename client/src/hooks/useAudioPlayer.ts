import { useEffect } from "react";

// one element shared app-wide so a new sound replaces whatever is still playing
let sharedAudio: HTMLAudioElement | null = null;

const getAudio = (): HTMLAudioElement => (sharedAudio ??= new Audio());

// plays base64 mp3 audio
const play = async (base64Audio: string) => {
  if (!base64Audio) return;

  const audioElement = getAudio();
  const audioSrc = `data:audio/mpeg;base64,${base64Audio}`;
  if (audioElement.src !== audioSrc) {
    audioElement.src = audioSrc;
  } else {
    audioElement.currentTime = 0;
  }

  try {
    await audioElement.play();
  } catch (error) {
    console.error("Error playing audio:", error);
  }
};

const stop = () => {
  sharedAudio?.pause();
};

export const useAudioPlayer = () => {
  useEffect(() => stop, []);

  return { play, stop };
};
