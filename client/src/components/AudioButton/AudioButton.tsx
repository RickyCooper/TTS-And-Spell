import styles from "./AudioButton.module.scss";
import playIcon from "../../assets/svg/play.svg";
import { useAudioButtonController } from "./useAudioButtonController";
import type { JSX } from "react/jsx-dev-runtime";
import type { GameModeTheme } from "../../types/GameTypes";

interface AudioButtonProps {
  size?: "small" | "default";
  audio?: string;
  autoplay?: boolean;
  autoplayDelayMs?: number;
  onAfterClick?: () => void;
  color?: GameModeTheme;
}

const AudioButton: React.FC<AudioButtonProps> = ({
  size = "default",
  audio = "",
  onAfterClick,
  color = "green",
}): JSX.Element => {

  const { playAudio } = useAudioButtonController(
    audio,
  );

  const handleClick = () => {
    playAudio();
    onAfterClick?.();
  };

  return (
    <button
      className={`${styles["audio-button"]} ${styles[`audio-button--${color}`]} ${size === "small" ? styles["audio-button--small"] : ""}`}
      aria-label="Play audio"
      onClick={handleClick}
    >
      <img src={playIcon} alt="Play" className={styles["audio-button__icon"]} />
    </button>
  );
};

export default AudioButton;