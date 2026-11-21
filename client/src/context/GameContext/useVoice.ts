import { useCallback, useRef, useState } from "react";
import type { Dispatch, RefObject } from "react";
import type { GameState } from "../../types/GameTypes";
import type { GameAction } from "./GameReducer";
import { fetchWordsAudio } from "../../services/WordService";
import { DEFAULT_VOICE_ID, VOICES } from "../../constants/Voices";

const VOICE_STORAGE_KEY = "tts_voice_id";

const getStoredVoiceId = (): string => {
  const storedVoiceId = localStorage.getItem(VOICE_STORAGE_KEY);
  return VOICES.find((voice) => voice.id === storedVoiceId)?.id ?? DEFAULT_VOICE_ID;
};

export const useVoice = (
  gameState: GameState,
  dispatch: Dispatch<GameAction>,
  sessionIdRef: RefObject<number>,
) => {
  // the stored preference is the source of truth; this is the voice the current game is using
  const [voiceId, setVoiceId] = useState(getStoredVoiceId);
  const [isChangingVoice, setIsChangingVoice] = useState(false);
  // async callbacks read the latest voice here instead of closing over stale state
  const voiceIdRef = useRef(voiceId);

  const applyVoice = useCallback((nextVoiceId: string) => {
    voiceIdRef.current = nextVoiceId;
    setVoiceId(nextVoiceId);
  }, []);

  // picks the voice a new game uses without changing the stored preference
  const startGameVoice = useCallback((isDemo?: boolean): string => {
    // demo audio only exists in the default voice
    const gameVoiceId = isDemo ? DEFAULT_VOICE_ID : getStoredVoiceId();
    applyVoice(gameVoiceId);
    return gameVoiceId;
  }, [applyVoice]);

  const saveVoice = useCallback((nextVoiceId: string) => {
    applyVoice(nextVoiceId);
    localStorage.setItem(VOICE_STORAGE_KEY, nextVoiceId);
  }, [applyVoice]);

  const changeVoice = async (nextVoiceId: string) => {
    const previousVoiceId = voiceIdRef.current;
    if (gameState.isDemo || nextVoiceId === previousVoiceId || isChangingVoice) return;

    const sessionId = sessionIdRef.current;
    const pendingWords = gameState.status === "playing"
      ? gameState.words.slice(gameState.currentIndex).map((word) => word.text)
      : [];

    saveVoice(nextVoiceId);
    if (pendingWords.length === 0) return;

    setIsChangingVoice(true);
    try {
      const audio = await fetchWordsAudio(pendingWords, nextVoiceId);
      if (sessionId === sessionIdRef.current) {
        dispatch({ type: "AUDIO_REFRESHED", audio });
      }
    } catch (error) {
      console.error("Failed to switch voice", error);
      // keep the selected voice in step with the audio that is actually loaded
      if (sessionId === sessionIdRef.current) saveVoice(previousVoiceId);
    } finally {
      setIsChangingVoice(false);
    }
  };

  return { voiceId, voiceIdRef, isChangingVoice, startGameVoice, changeVoice };
};
