import styles from "./AudioButton.module.scss";
import playIcon from "../../assets/svg/play.svg";
import playGreyIcon from "../../assets/svg/play-grey.svg";
import plusIcon from "../../assets/svg/plus.svg";
import { useAudioButtonController } from "./useAudioButtonController";
import { fetchContextAudio, type ContextAudioType } from "../../services/WordService";
import type { JSX } from "react/jsx-dev-runtime";
import type { GameModeTheme } from "../../types/GameTypes";
import { useEffect, useRef, useState } from "react";

const MENU_ANIMATION_MS = 180;

interface AudioButtonProps {
  size?: "small" | "default";
  audio?: string;
  autoplay?: boolean;
  autoplayDelayMs?: number;
  onAfterClick?: () => void;
  color?: GameModeTheme;
  word?: string;
  sentence?: string;
  definition?: string;
}

const AudioButton: React.FC<AudioButtonProps> = ({
  size = "default",
  audio = "",
  onAfterClick,
  color = "green",
  word,
  sentence,
  definition,
}): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [loadingContextType, setLoadingContextType] = useState<ContextAudioType | null>(null);
  const audioButtonRef = useRef<HTMLDivElement>(null);
  const { playAudio } = useAudioButtonController(
    audio,
  );

  const handleClick = () => {
    playAudio();
    onAfterClick?.();
  };

  const handleContextAudioClick = async (contextType: ContextAudioType) => {
    if (!word || loadingContextType) return;

    setLoadingContextType(contextType);
    try {
      const audio = await fetchContextAudio(word, contextType);
      await playAudio(audio);
    } catch (error) {
      console.error(`Failed to play ${contextType} audio:`, error);
    } finally {
      setLoadingContextType(null);
    }
  };

  const hasContextMenu = Boolean(word && sentence && definition) && size === "default";

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuVisible(true);
      return;
    }

    if (!isMenuVisible) return;
    const timeoutId = window.setTimeout(() => setIsMenuVisible(false), MENU_ANIMATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isMenuOpen, isMenuVisible]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!audioButtonRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isMenuOpen]);

  return (
    <div ref={audioButtonRef} className={styles["audio-button-wrapper"]}>
      {hasContextMenu && (
        <>
          <button
            type="button"
            className={styles["audio-button__menu-toggle"]}
            aria-label="Show word details"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          >
            <img src={plusIcon} alt="" className={styles["audio-button__menu-plus"]} />
          </button>
          {isMenuVisible && (
            <div className={`${styles["audio-button__menu"]} ${!isMenuOpen ? styles["audio-button__menu--closing"] : ""}`}>
              <button
                type="button"
                disabled={loadingContextType !== null}
                onClick={() => void handleContextAudioClick("sentence")}
              >
                <img src={playGreyIcon} alt="" aria-hidden="true" />
                Sentence
              </button>
              <button
                type="button"
                disabled={loadingContextType !== null}
                onClick={() => void handleContextAudioClick("definition")}
              >
                <img src={playGreyIcon} alt="" aria-hidden="true" />
                Definition
              </button>
            </div>
          )}
        </>
      )}
      <button
        type="button"
        className={`${styles["audio-button"]} ${styles[`audio-button--${color}`]} ${size === "small" ? styles["audio-button--small"] : ""}`}
        aria-label="Play audio"
        onClick={handleClick}
      >
        <img src={playIcon} alt="Play" className={styles["audio-button__icon"]} />
      </button>
    </div>
  );
};

export default AudioButton;