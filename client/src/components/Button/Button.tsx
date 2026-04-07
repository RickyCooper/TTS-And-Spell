import React from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonColor = "green" | "blue" | "red" | "brown" | "purple" | "orange" | "grey";

interface ButtonProps {
  text: string;
  onClick: (() => void) | undefined;
  variant?: ButtonVariant;
  color?: ButtonColor;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant,
  color,
  className,
  disabled = false,
}) => {
  return (
    <button
      className={`${styles["button"]} ${styles[`button--${variant}`]} ${color ? styles[`button--${color}`] : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <p className={styles["button_text"]}>{text}</p>
    </button>
  );
};

export default Button;