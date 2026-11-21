import { useRef, useState } from "react";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { fetchVoicePreview } from "../../services/WordService";

export const useVoicePreview = () => {
  const { play, stop } = useAudioPlayer();
  const [loadingPreviewId, setLoadingPreviewId] = useState<string | null>(null);
  // a voice's sample never changes, so each one is only fetched once per page load
  const previewCacheRef = useRef(new Map<string, string>());

  const previewVoice = async (voiceId: string) => {
    if (loadingPreviewId) return;

    setLoadingPreviewId(voiceId);
    try {
      let audio = previewCacheRef.current.get(voiceId);
      if (!audio) {
        audio = await fetchVoicePreview(voiceId);
        previewCacheRef.current.set(voiceId, audio);
      }
      await play(audio);
    } catch (error) {
      console.error("Failed to play voice preview:", error);
    } finally {
      setLoadingPreviewId(null);
    }
  };

  return { loadingPreviewId, previewVoice, stopPreview: stop };
};
