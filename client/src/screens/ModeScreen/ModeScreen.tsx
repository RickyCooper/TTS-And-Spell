import styles from "./ModeScreen.module.scss";
import { GAME_MODES } from "../../constants/GameModes";
import GamemodeCard from "../../components/GamemodeCard/GamemodeCard";
import Button from "../../components/Button/Button";
import { useGameContext } from "../../context/GameContext/GameContext";
import { useAuthContext } from "../../context/AuthContext/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import type { GamemodeType } from "../../types/GameTypes";

const VALID_MODES = new Set<GamemodeType>(["regular", "quick", "marathon", "survival", "rematch", "countdown"]);

const ModeScreen = ({ isDemo }: { isDemo: boolean }) => {
  const { startGame } = useGameContext();
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogout = () => {
    void logout();
    navigate("/login");
  };

  const handleStartGame = async (mode: GamemodeType) => {
    await startGame(mode, isDemo);
    navigate("/game");
  };

  useEffect(() => {
    const modeParam = searchParams.get("mode") as GamemodeType | null;
    if (modeParam && VALID_MODES.has(modeParam)) {
      void handleStartGame(modeParam);
    }
  }, []);

  return (
    <div className={styles["mode-screen"]}>
      {user ? (
        <Button
          text="logout"
          variant="tertiary"
          onClick={handleLogout}
          className={styles["mode-screen__logout"]}
        />
      ) : (
        <Button
          text="sign in"
          variant="tertiary"
          onClick={() => navigate("/login")}
          className={styles["mode-screen__logout"]}
        />
      )}
      <h1 className={styles["mode-screen__title"]}>gamemodes</h1>
      <div className={styles["mode-screen__grid"]}>
        {GAME_MODES.map((modeInfo) => (
          <GamemodeCard
            key={modeInfo.name}
            mode={modeInfo.name}
            title={modeInfo.title}
            desc={modeInfo.desc}
            disabled={modeInfo.disabled}
            onClick={() => void handleStartGame(modeInfo.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default ModeScreen;