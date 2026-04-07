import type { JSX } from "react/jsx-dev-runtime";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  completed: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }): JSX.Element => {

  const percentage = Math.min(100, Math.max(0, (completed / total) * 100));

  return (
    <div className={styles["progress-bar_container"]}>
      <div
        className={`${styles["progress-bar"]} ${percentage === 0 ? styles["progress-bar--hidden"] : ""}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default ProgressBar;