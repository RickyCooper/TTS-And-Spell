import { useEffect, useRef, useState } from "react";
import { useGameContext } from "../../context/GameContext/GameContext";
import { useVoicePreview } from "./useVoicePreview";

export const useVoiceSelectorController = (onAfterChange?: () => void) => {
  const { voiceId, isChangingVoice, changeVoice } = useGameContext();
  const { loadingPreviewId, previewVoice, stopPreview } = useVoicePreview();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const toggleOpen = () => setIsOpen((open) => !open);

  const selectVoice = (selectedVoiceId: string) => {
    // the re-voiced word autoplays once it loads, so don't talk over it with a preview
    stopPreview();
    void changeVoice(selectedVoiceId);
    onAfterChange?.();
  };

  return {
    containerRef,
    isOpen,
    toggleOpen,
    voiceId,
    isChangingVoice,
    loadingPreviewId,
    previewVoice,
    selectVoice,
  };
};
