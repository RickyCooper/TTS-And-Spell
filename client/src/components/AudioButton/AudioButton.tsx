import styles from "./AudioButton.module.scss";
import playIcon from "../../assets/svg/play.svg";
import { useAudioButtonController } from "./useAudioButtonController";
import type { JSX } from "react/jsx-dev-runtime";

interface AudioButtonProps {
  size?: "small" | "default";
  audio?: string;
  autoplay?: boolean;
  autoplayDelayMs?: number;
  onAfterClick?: () => void;
}

const AudioButton: React.FC<AudioButtonProps> = ({
  size = "default",
  audio = "",
  onAfterClick,
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
      className={`${styles["audio-button"]} ${size === "small" ? styles["audio-button--small"] : ""}`}
      aria-label="Play audio"
      onClick={handleClick}
    >
      <img src={playIcon} alt="Play" className={styles["audio-button__icon"]} />
    </button>
  );
};

export default AudioButton;