import type { JSX } from "react/jsx-dev-runtime";
import styles from "./IndicatorBar.module.scss";

interface ProgressBarProps {
  value: number;
  total: number;
  variant?: "progress" | "timer";
}

const IndicatorBar: React.FC<ProgressBarProps> = ({ value, total, variant = "progress" }): JSX.Element => {

  const safeTotal = total <= 0 ? 1 : total;
  const percentage = Math.min(100, Math.max(0, (value / safeTotal) * 100));
  const scale = percentage / 100;
  const isUrgentTimer = variant === "timer" && value <= 10 && value > 0;

  const containerStyles = [
    styles["indicator-bar_container"],
    isUrgentTimer ? styles["indicator-bar_container--warning"] : "",
  ].filter(Boolean).join(" ");

  const indicatorStyles = [
    styles["indicator-bar"],
    variant === "timer" ? styles["indicator-bar--timer"] : "",
    isUrgentTimer ? styles["indicator-bar--warning"] : "",
    percentage === 0 ? styles["indicator-bar--hidden"] : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={containerStyles}>
      <div className={styles["indicator-bar_track"]}>
        <div
          className={indicatorStyles}
          style={{ transform: `scaleX(${scale})` }}
        />
      </div>
    </div>
  );
};

export default IndicatorBar;