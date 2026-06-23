import { Routes, Route, Navigate } from "react-router-dom";
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

  if (gameState.status === "idle") {
    return <Navigate to="/modes" replace />;
  }

  switch (gameState.status) {
    case "playing":
      return <GameScreen />;
    case "review":
      return <ReviewScreen />;
    case "loading":
      return <LoadingScreen />;
    default:
      return <Navigate to="/modes" replace />;
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

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;

