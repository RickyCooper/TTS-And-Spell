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

const AppRoutes = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return <LoadingScreen />;

  const isDemo = !user || user.approvalStatus === "pending";

  return (
    <div className={styles.app}>
      <GameProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthScreen initialView="login" />} />
          <Route path="/signup" element={<AuthScreen initialView="signup" />} />
          <Route path="/modes" element={<ModeScreen isDemo={isDemo} />} />
          <Route path="/game" element={<GameContent />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </GameProvider>
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

