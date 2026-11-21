import type { JSX } from "react";
import styles from "./ToggleButton.module.scss";
import type { GameModeTheme } from "../../types/GameTypes";

interface ToggleButtonProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  // accessible name, since the toggle has no visible text
  label: string;
  // "radio" for mutually exclusive choices, where one option is always selected
  role?: "switch" | "radio";
  color?: GameModeTheme;
  disabled?: boolean;
  className?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  checked,
  onChange,
  label,
  role = "switch",
  color = "green",
  disabled = false,
  className,
}): JSX.Element => {
  const classNames = [
    styles["toggle-button"],
    styles[`toggle-button--${color}`],
    checked ? styles["toggle-button--checked"] : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      role={role}
      aria-checked={checked}
      aria-label={label}
      className={classNames}
      disabled={disabled}
      onClick={() => onChange(!checked)}
    >
      <span className={styles["toggle-button__knob"]} />
    </button>
  );
};

export default ToggleButton;
