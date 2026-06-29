import { useState } from "react";
import AudioButton from "../AudioButton/AudioButton";
import styles from "./ReviewCard.module.scss";
import { checkAnswer } from "../../utils";

interface ReviewCardProps {
  word: string;
  attempts: string[];
  audio?: string;
  index?: number;
}

const ReviewCard = ({ word, attempts, audio = "", index = 0 }: ReviewCardProps) => {

  const [expanded, setExpanded] = useState(false);
  
  const isCorrect = attempts.some(
    (attempt) => checkAnswer(attempt, word ) 
  );

  const incorrectAttemptsCount = attempts.filter((attempt) => !checkAnswer(attempt, word)).length;
  
  const incorrectCounter = (
    <div className={styles["review-card_incorrect-counter"]}>
      {incorrectAttemptsCount}
    </div>
  );
  
  const header = (
    <div
      className={`
      ${styles["review-card_header"]}
      ${styles["review-card--closed"]} 
    `}
    >
      <div className={styles["review-card_header-left"]}>
        <AudioButton size="small" audio={audio} />
        <h3>{word}</h3>
      </div>
      <div>
        {incorrectAttemptsCount > 0 && incorrectCounter}
      </div>
    </div>
  );

  const incorrectAttempts = (
    <div>
      {attempts
        .filter((attempt) => !checkAnswer(attempt, word))
        .map((attempt, index) => {
          return (
            <div
              key={`${attempt}-${index}`}
              className={`${styles["review-card_attempt"]} ${styles["review-card_attempt--incorrect"]}`}
            >
              {attempt}
            </div>
          );
        })}
    </div>
  );

  const result = isCorrect ? (
    <div className={`${styles["review-card_attempt"]} ${styles["review-card_attempt--correct"]}`}>{word}</div>
  ) : (
    <div className={`${styles["review-card_attempt"]} ${styles["review-card_attempt--skipped"]}`}>{"skipped"}</div>
  );

  return (
    <div
      className={styles["review-card"]}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseOver={() => setExpanded(true)}
      onMouseOut={() => setExpanded(false)}
    >
      {header}
      <div
        className={styles["review-card_attempts-container"]}
        style={{ "--rows": expanded ? "1fr" : "0fr" } as React.CSSProperties}
      >
        <div style={{ overflow: "hidden" }}>
          {incorrectAttempts}
        </div>
        {result}
      </div>
    </div>
  );
};

export default ReviewCard;