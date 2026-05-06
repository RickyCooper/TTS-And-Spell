import { useState } from "react";
import type { ChangeEvent } from "react";

export const useTextInputController = (
  initialValue: string = "",
  onChange?: (value: string) => void,
) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return {
    value,
    handleChange,
    setValue,
  };
};
