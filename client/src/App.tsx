import styles from "./App.module.scss";
import GameScreen from "./screens/GameScreen/GameScreen";
import ModeScreen from "./screens/ModeScreen/ModeScreen";
import ReviewScreen from "./screens/ReviewScreen/ReviewScreen";
import LoadingScreen from "./screens/LoadingScreen/LoadingScreen";
import AuthScreen from "./screens/AuthScreen/AuthScreen";
import { useGameContext } from "./context/GameContext/GameContext";
import { GameProvider } from "./context/GameContext/GameProvider";
import { AuthProvider } from "./context/AuthContext/AuthProvider";
import { useAuthContext } from "./context/AuthContext/AuthContext";

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

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

const App = () => {
  return (
    <div className={styles.app}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
};

export default App;

