import AudioButton from "../../components/AudioButton/AudioButton";
import styles from "./GameScreen.module.scss";
import { useGameController } from "./useGameController";
import IndicatorBar from "../../components/IndicatorBar/IndicatorBar";
import GameInput from "../../components/GameInput/GameInput";
import Button from "../../components/Button/Button";
import { useGameContext } from "../../context/GameContext/GameContext";

const GameScreen = () => {

  const { gameState } = useGameContext();

  const {
    inputRef,
    handleSubmit,
    handleSkip,
    focusInput,
    feedback,
    handleEndGame,
  } = useGameController();

  const questionLimit = gameState.mode?.config?.questionLimit;
  const timeLimit = gameState.timer.total;

  const displayProgressBar = questionLimit ? (
    <IndicatorBar
      value={gameState.currentIndex}
      total={questionLimit}
      variant="progress"
    />
  ) : timeLimit && gameState.timer.remaining !== null ? (
    <IndicatorBar
      value={gameState.timer.remaining}
      total={timeLimit}
      variant="timer"
    />
  ) : null;

  return (
    <div className={styles["game-screen"]}>
      <div className={styles["game-screen_body"]}>
        <AudioButton
          audio={gameState.words[gameState.currentIndex]?.audio}
          onAfterClick={focusInput}
        />     
        <GameInput
          ref={inputRef}
          helperText="Press enter to submit your answer."
          autoFocus={true}
          onSubmit={handleSubmit}
          feedback={feedback}
        />
        <Button text="skip" variant="tertiary" onClick={handleSkip} />
      </div>
      <div className={styles["game-screen_footer"]}>
        {displayProgressBar}
        <Button text="end lesson early." variant="tertiary" onClick={handleEndGame} />
      </div>
    </div>
  );
};

export default GameScreen;