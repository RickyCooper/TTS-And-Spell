import styles from "./AudioButton.module.scss";
import playIcon from "../../assets/svg/play.svg";
import playGreyIcon from "../../assets/svg/play-grey.svg";
import plusIcon from "../../assets/svg/plus.svg";
import { useAudioButtonController } from "./useAudioButtonController";
import { useAudioContextMenu } from "./useAudioContextMenu";
import type { JSX } from "react";
import type { GameModeTheme } from "../../types/GameTypes";

interface AudioButtonProps {
  size?: "small" | "default";
  audio?: string;
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
  const { playAudio } = useAudioButtonController(audio);
  const {
    containerRef,
    isMenuOpen,
    toggleMenu,
    loadingContextType,
    playContextAudio,
  } = useAudioContextMenu(word, playAudio);

  const handleClick = () => {
    playAudio();
    onAfterClick?.();
  };

  const hasContextMenu = Boolean(word && sentence && definition) && size === "default";

  return (
    <div ref={containerRef} className={styles["audio-button-wrapper"]}>
      {hasContextMenu && (
        <>
          <button
            type="button"
            className={styles["audio-button__menu-toggle"]}
            aria-label="Show word details"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <img src={plusIcon} alt="" className={styles["audio-button__menu-plus"]} />
          </button>
          <div className={`${styles["audio-button__menu"]} ${isMenuOpen ? styles["audio-button__menu--open"] : ""}`}>
            <button
              type="button"
              disabled={loadingContextType !== null}
              onClick={() => void playContextAudio("sentence")}
            >
              <img src={playGreyIcon} alt="" aria-hidden="true" />
              Sentence
            </button>
            <button
              type="button"
              disabled={loadingContextType !== null}
              onClick={() => void playContextAudio("definition")}
            >
              <img src={playGreyIcon} alt="" aria-hidden="true" />
              Definition
            </button>
          </div>
        </>
      )}
      <button
        type="button"
        className={`${styles["audio-button"]} ${styles[`audio-button--${color}`]} ${size === "small" ? styles["audio-button--small"] : ""}`}
        aria-label="Play audio"
        onClick={handleClick}
      >
        <img src={playIcon} alt="" className={styles["audio-button__icon"]} />
      </button>
    </div>
  );
};

export default AudioButton;