import { forwardRef } from "react";
import styles from "./TextInput.module.scss";
import { useTextInputController } from "./useTextInputController";

type TextInputVariant = "game" | "form";

interface TextInputProps {
  initialValue?: string;
  placeholder?: string;
  helperText?: string;
  type?: string;
  variant?: TextInputVariant;
  multiline?: boolean;
  rows?: number;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  feedback?: string | null;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  initialValue = "",
  placeholder = "",
  helperText = "",
  type = "text",
  variant = "game",
  multiline = false,
  rows = 4,
  onChange,
  onSubmit,
  disabled = false,
  autoFocus = true,
  feedback = null,
}, ref) => {
  const { value, setValue, handleChange } = useTextInputController(
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

  if (multiline) {
    return (
      <div className={styles["text-input"]}>
        {helperText && <p className={styles["text-input__helper-text"]}>{helperText}</p>}
        <textarea
          rows={rows}
          autoFocus={autoFocus}
          className={styles["text-input__textarea"]}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          placeholder={placeholder}
          disabled={disabled}
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className={styles["text-input"]}>
      {helperText && <p className={styles["text-input__helper-text"]}>{helperText}</p>}
      <input
        ref={ref}
        type={type}
        autoFocus={autoFocus ?? true}
        className={[
          styles["text-input__input"],
          variant === "form" && styles["text-input__input--form"],
          feedback === "correct" && styles["text-input__input--valid"],
          feedback === "incorrect" && `${styles["text-input__input--invalid"]} ${styles["text-input__input--shake"]}`,
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

export default TextInput;