import AudioButton from "../../components/AudioButton/AudioButton";
import styles from "./GameScreen.module.scss";
import { useGameController } from "./useGameController";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
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

  const displayProgressBar = (
      questionLimit && (
        <ProgressBar completed={gameState.currentIndex} total={questionLimit} />
      )
  )

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