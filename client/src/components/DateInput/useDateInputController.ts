import { useRef, useCallback, useState } from "react";

export const DATE_MASK = "DD / MM / YYYY";
const DIGIT_SLOT_POSITIONS = [0, 1, 5, 6, 10, 11, 12, 13];

export const buildDateMask = (digits: string): string => {
  let result = "";
  let di = 0;
  for (let i = 0; i < DATE_MASK.length; i++) {
    const c = DATE_MASK[i];
    if (c === "/" || c === " ") {
      result += c;
    } else {
      result += di < digits.length ? digits[di++] : c;
    }
  }
  return result;
}

export const buildDateMaskParts = (digits: string): Array<{ char: string; filled: boolean }> => {
  const parts: Array<{ char: string; filled: boolean }> = [];
  let di = 0;
  for (let i = 0; i < DATE_MASK.length; i++) {
    const c = DATE_MASK[i];
    if (c === "/" || c === " ") {
      parts.push({ char: c, filled: true });
    } else if (di < digits.length) {
      parts.push({ char: digits[di++], filled: true });
    } else {
      parts.push({ char: c, filled: false });
    }
  }
  return parts;
}

export const useDateInputController = (onChange?: (value: string) => void) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [digits, setDigits] = useState("");
  const [hasFocused, setHasFocused] = useState(false);

  const snapCursor = useCallback((digitCount: number) => {
    const pos = DIGIT_SLOT_POSITIONS[digitCount] ?? DATE_MASK.length;
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(pos, pos);
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (/^\d$/.test(e.key) && digits.length < 8) {
        const newDigits = digits + e.key;
        setDigits(newDigits);
        if (onChange) onChange(buildDateMask(newDigits).replace(/ /g, ""));
        snapCursor(newDigits.length);
      } else if (e.key === "Backspace" && digits.length > 0) {
        const newDigits = digits.slice(0, -1);
        setDigits(newDigits);
        if (onChange) onChange(buildDateMask(newDigits).replace(/ /g, ""));
        snapCursor(newDigits.length);
      }
    },
    [digits, onChange, snapCursor],
  );

  const handleFocus = useCallback(() => {
    setHasFocused(true);
    snapCursor(digits.length);
  }, [digits.length, snapCursor]);

  return { inputRef, digits, hasFocused, handleKeyDown, handleFocus };
}
