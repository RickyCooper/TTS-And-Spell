import { forwardRef } from "react";
import styles from "./GameInput.module.scss";
import { useGameInputController } from "./useGameInputController";

interface GameInputProps {
  initialValue?: string;
  placeholder?: string;
  helperText?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  feedback?: string | null;
}

const GameInput = forwardRef<HTMLInputElement, GameInputProps>(({
  initialValue = "",
  placeholder = "",
  helperText = "",
  onChange,
  onSubmit,
  disabled = false,
  autoFocus = true,
  feedback = null,
}, ref) => {
  const { value, setValue, handleChange } = useGameInputController(
    initialValue,
    onChange,
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (onSubmit && value.trim()) {
        onSubmit(value);
      }
      setValue("");
    }
  };

  return (
    <div className={styles["game-input"]}>
      <p className={styles["game-input__helper-text"]}>{helperText || ""}</p>
      <input
        ref={ref}
        type="text"
        autoFocus={autoFocus ?? true}
        className={[
          styles["game-input__textarea"],
          feedback === "correct" && styles["game-input__textarea--correct"],
          feedback === "incorrect" && `${styles["game-input__textarea--incorrect"]} ${styles["game-input__textarea--shake"]}`,
        ]
          .filter(Boolean)
          .join(" ")}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );
});

export default GameInput;