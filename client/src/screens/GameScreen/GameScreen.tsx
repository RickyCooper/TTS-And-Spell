import AudioButton from "../../components/AudioButton/AudioButton";
import styles from "./GameScreen.module.scss";
import { useGameController } from "./useGameController";
import IndicatorBar from "../../components/IndicatorBar/IndicatorBar";
import TextInput from "../../components/TextInput/TextInput";
import Button from "../../components/Button/Button";
import { useGameContext } from "../../context/GameContext/GameContext";
import fireIcon from "../../assets/svg/fire.svg";
import fireExtinguishedIcon from "../../assets/svg/fire-extinguished.svg";

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
      color={gameState.mode?.theme}
    />
  ) : timeLimit && gameState.timer.remaining !== null ? (
    <IndicatorBar
      value={gameState.timer.remaining}
      total={timeLimit}
      variant="timer"
      color={gameState.mode?.theme}
    />
  ) : null;

  const displayLives = gameState.lives ? (
    <div className={styles["game-screen_lives"]}>
      {Array.from({ length: gameState.lives.total }, (_, index) => (
        <img
          key={index}
          src={index < gameState.lives!.remaining ? fireIcon : fireExtinguishedIcon}
          alt={index < gameState.lives!.remaining ? "life" : "life lost"}
          className={styles["game-screen_life-icon"]}
        />
      ))}
    </div>
  ) : null;

  return (
    <div className={styles["game-screen"]}>
      <div className={styles["game-screen_body"]}>
        <AudioButton
          audio={gameState.words[gameState.currentIndex]?.audio}
          word={gameState.words[gameState.currentIndex]?.text}
          sentence={gameState.words[gameState.currentIndex]?.sentence}
          definition={gameState.words[gameState.currentIndex]?.definition}
          onAfterClick={focusInput}
          color={gameState.mode?.theme}
        />
        <TextInput
          key={gameState.currentIndex}
          ref={inputRef}
          helperText="Press enter to submit your answer."
          autoFocus={true}
          onSubmit={handleSubmit}
          feedback={feedback}
        />
        <Button text="skip" variant="tertiary" onClick={handleSkip} />
      </div>
      <div className={styles["game-screen_footer"]}>
        {displayProgressBar || displayLives}
        <Button text="end lesson." variant="tertiary" onClick={handleEndGame} />
      </div>
    </div>
  );
};

export default GameScreen;