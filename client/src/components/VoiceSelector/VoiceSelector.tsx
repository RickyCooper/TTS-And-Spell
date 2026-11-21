import type { JSX } from "react";
import styles from "./VoiceSelector.module.scss";
import Button from "../Button/Button";
import ToggleButton from "../ToggleButton/ToggleButton";
import { useVoiceSelectorController } from "./useVoiceSelectorController";
import { VOICES } from "../../constants/Voices";
import type { GameModeTheme } from "../../types/GameTypes";
import voiceIcon from "../../assets/svg/voice.svg";
import speakerIcon from "../../assets/svg/try.svg";

interface VoiceSelectorProps {
  color?: GameModeTheme;
  onAfterChange?: () => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  color = "purple",
  onAfterChange,
}): JSX.Element => {
  const {
    containerRef,
    isOpen,
    toggleOpen,
    voiceId,
    isChangingVoice,
    loadingPreviewId,
    previewVoice,
    selectVoice,
  } = useVoiceSelectorController(onAfterChange);

  return (
    <div ref={containerRef} className={styles["voice-selector"]}>
      <Button
        variant="icon"
        icon={voiceIcon}
        label="Choose voice"
        color={color}
        ariaExpanded={isOpen}
        onClick={toggleOpen}
        className={styles["voice-selector__button"]}
      />
      <div
        role="radiogroup"
        aria-label="Voice"
        className={`${styles["voice-selector__options"]} ${isOpen ? styles["voice-selector__options--open"] : ""}`}
      >
        {VOICES.map((voice) => (
          <div key={voice.id} className={styles["voice-selector__option"]}>
            <Button
              variant="icon"
              size="small"
              icon={speakerIcon}
              label={`Listen to ${voice.name}`}
              color={color}
              disabled={loadingPreviewId !== null}
              onClick={() => void previewVoice(voice.id)}
            />
            <span className={styles["voice-selector__name"]}>{voice.name}</span>
            <ToggleButton
              checked={voice.id === voiceId}
              label={`Use ${voice.name}`}
              role="radio"
              color={color}
              disabled={isChangingVoice}
              onChange={(checked) => {
                // a voice is only ever replaced by selecting another one
                if (checked) selectVoice(voice.id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceSelector;
