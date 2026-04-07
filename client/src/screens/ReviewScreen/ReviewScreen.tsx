import styles from "./ReviewScreen.module.scss";
import { useReviewController } from "./useReviewController";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import Button from "../../components/Button/Button";
import Scrollbar from "../../components/Scrollbar/Scrollbar";
import { useRef } from "react";
import useGridObserver from "../../hooks/useGridObserver";
import StatChip from "../../components/StatChip/StatChip";
import accuracyIcon from "../../assets/svg/accuracy.svg";
import streakIcon from "../../assets/svg/streak.svg";
import timeIcon from "../../assets/svg/time.svg";

const ReviewScreen = () => {

  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const { stats, results, handleExit, handleReplay } = useReviewController();

  useGridObserver(scrollTargetRef);

  const statChips = (
    <div className={styles["review-screen_stats-container"]}>
      <StatChip icon={accuracyIcon} data={stats.accuracy} stat="accuracy"/>
      <StatChip icon={streakIcon} data={stats.highestStreak} stat="streak"/>
      <StatChip icon={timeIcon} data={[stats.time.minutes, stats.time.seconds]} stat="time"/>
    </div>
  )

  const reviewCards =  (
    results.map((item, index) => (
          <ReviewCard
            key={index}
            word={item.word}
            attempts={item.attempts}
            audio={item.audio}
            index={index}
          />
        )
      )
    )

  const scrollbar = results.length > 5 
    ? <Scrollbar targetRef={scrollTargetRef} /> 
    : null;  

  return (
    <div className={styles["review-screen"]}>
      {statChips}
      <div className={styles["review-screen_scroll-wrapper"]}>
        {scrollbar}
        <div className={styles["review-screen_cards-container"]} ref={scrollTargetRef}>
          {reviewCards}
        </div>
      </div>
      <div className={styles["review-screen_buttons-container"]}>
        <Button text="Replay" variant="primary" color="orange" onClick={handleReplay} />
        <Button text="Finish" variant="primary" color="green" onClick={handleExit} />
      </div>
    </div>
  );
};

export default ReviewScreen;