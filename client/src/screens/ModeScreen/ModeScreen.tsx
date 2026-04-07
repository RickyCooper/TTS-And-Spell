import styles from "./ModeScreen.module.scss";
import { GAME_MODES } from "../../constants/GameModes";
import GameModeCard from "../../components/GameModeCard/GameModeCard";
import { useGameContext } from "../../context/GameContext/GameContext";

const ModeScreen = () => {
  const { startGame } = useGameContext();

  return (
    <div className={styles["mode-screen"]}>
      <h1 className={styles["mode-screen__title"]}>gamemodes</h1>
      <div className={styles["mode-screen__grid"]}>
        {GAME_MODES.map((modeInfo) => (
          <GameModeCard
            key={modeInfo.name}
            mode={modeInfo.name}
            title={modeInfo.title}
            desc={modeInfo.desc}
            disabled={modeInfo.disabled}
            onClick={() => startGame(modeInfo.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default ModeScreen;