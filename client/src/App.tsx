import styles from "./App.module.scss";
import GameScreen from "./screens/GameScreen/GameScreen";
import ModeScreen from "./screens/ModeScreen/ModeScreen";
import ReviewScreen from "./screens/ReviewScreen/ReviewScreen";
import LoadingScreen from "./screens/LoadingScreen/LoadingScreen";
import { useGameContext } from "./context/GameContext/GameContext";
import { GameProvider } from "./context/GameContext/GameProvider";

const GameContent = () => {
  const { gameState } = useGameContext();

  switch (gameState.status) {
    case "playing":
      return <GameScreen />;
    case "review":
      return <ReviewScreen />;
    case "loading":
      return <LoadingScreen />;
    case "idle":
    default:
      return <ModeScreen />;
  }
};

const App = () => {
  return (
    <div className={styles.app}>
      <GameProvider>
        <GameContent />
      </GameProvider>
    </div>
  );
};

export default App;
