import type { JSX } from "react/jsx-dev-runtime";
import type { GameModeType } from "../../types/GameTypes";
import styles from "./GameModeCard.module.scss";
import Button from "../Button/Button";

interface GameModeCardProps {
  mode: GameModeType;
  title: string;
  desc: string;
  disabled?: boolean;
  onClick?: () => void;
}

const GameModeCard: React.FC<GameModeCardProps> = ({
  mode,
  title,
  desc,
  disabled = false,
  onClick,
}): JSX.Element => {

  return (
    <div
      className={`${styles["gamemode-card"]} ${styles[`gamemode-card--${mode}`]}  ${disabled ? styles["gamemode-card--disabled"] : ""}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className={styles["gamemode-card__content"]}>
        <h3 className={styles["gamemode-card__title"]}>{title}</h3>
        <p className={styles["gamemode-card__desc"]}>{desc}</p>
      </div>
      <Button className={styles["gamemode-card__button"]} text={"Play"} onClick={disabled ? undefined : onClick}></Button>
    </div>
  );

};

export default GameModeCard;