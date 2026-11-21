import { useEffect, useRef, useState } from "react";
import { fetchContextAudio, type ContextAudioType } from "../../services/WordService";
import { useGameContext } from "../../context/GameContext/GameContext";

export const useAudioContextMenu = (
  word: string | undefined,
  playAudio: (audio: string) => Promise<void>,
) => {
  const { voiceId } = useGameContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadingContextType, setLoadingContextType] = useState<ContextAudioType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((isOpen) => !isOpen);

  const playContextAudio = async (contextType: ContextAudioType) => {
    if (!word || loadingContextType) return;

    setLoadingContextType(contextType);
    try {
      const audio = await fetchContextAudio(word, contextType, voiceId);
      await playAudio(audio);
    } catch (error) {
      console.error(`Failed to play ${contextType} audio:`, error);
    } finally {
      setLoadingContextType(null);
    }
  };

  return {
    containerRef,
    isMenuOpen,
    toggleMenu,
    loadingContextType,
    playContextAudio,
  };
};
