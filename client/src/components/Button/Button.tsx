import React from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "icon";
type ButtonColor = "green" | "blue" | "red" | "brown" | "purple" | "orange" | "grey";

interface ButtonProps {
  text?: string;
  onClick: (() => void) | undefined;
  variant?: ButtonVariant;
  color?: ButtonColor;
  disabled?: boolean;
  className?: string;
  // icon variant only
  icon?: string;
  // accessible name, since the icon variant has no visible text
  label?: string;
  size?: "default" | "small";
  ariaExpanded?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant,
  color,
  className,
  disabled = false,
  icon,
  label,
  size = "default",
  ariaExpanded,
}) => {
  const classNames = [
    styles["button"],
    styles[`button--${variant}`],
    color ? styles[`button--${color}`] : "",
    size === "small" ? styles["button--small"] : "",
    className,
  ].filter(Boolean).join(" ");

  if (variant === "icon") {
    return (
      <button
        className={classNames}
        onClick={onClick}
        disabled={disabled}
        type="button"
        aria-label={label}
        aria-expanded={ariaExpanded}
      >
        <img src={icon} alt="" className={styles["button_icon"]} />
      </button>
    );
  }

  return (
    <button
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <p className={styles["button_text"]}>{text}</p>
    </button>
  );
};

export default Button;