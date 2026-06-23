import { createContext, useContext } from "react";
import type { GameState, GameModeType } from "../../types/GameTypes";

export interface GameContextType {
  gameState: GameState;
  startGame: (mode: GameModeType, isDemo?: boolean) => Promise<void>;
  submitAnswer: (input: string, skipped?: boolean) => string;
  resetGame: () => void;
  endGame: (earlyEnd?: boolean) => void;
}

export const GameContext = createContext<GameContextType | undefined>(
  undefined,
);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
