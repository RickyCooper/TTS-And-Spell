import styles from "./DateInput.module.scss";
import { useDateInputController, buildDateMask, buildDateMaskParts } from "./useDateInputController";

interface DateInputProps {
  helperText?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

const DateInput = ({
  helperText = "",
  onChange,
  disabled = false,
  autoFocus = false,
}: DateInputProps) => {
  const { inputRef, digits, hasFocused, handleKeyDown, handleFocus } =
    useDateInputController(onChange);

  return (
    <div className={styles["date-input"]}>
      {helperText && <p className={styles["date-input__helper-text"]}>{helperText}</p>}
      <div className={styles["date-input__wrapper"]}>
        <input
          ref={inputRef}
          type="text"
          autoFocus={autoFocus}
          className={styles["date-input__input"]}
          value={digits.length > 0 ? buildDateMask(digits) : ""}
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onClick={handleFocus}
          placeholder=""
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
        />
        <div className={styles["date-input__overlay"]} aria-hidden>
          {buildDateMaskParts(digits).map((part, i) => (
            <span
              key={i}
              className={
                (part.char === "/" || part.char === " ")
                  ? hasFocused
                    ? styles["date-input__char--filled"]
                    : styles["date-input__char--empty"]
                  : part.filled
                    ? styles["date-input__char--filled"]
                    : styles["date-input__char--empty"]
              }
            >
              {part.char === " " ? "\u00A0" : part.char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateInput;
