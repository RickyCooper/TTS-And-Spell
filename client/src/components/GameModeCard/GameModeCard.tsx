import type { JSX } from "react/jsx-dev-runtime";
import type { GamemodeType } from "../../types/GameTypes";
import styles from "./GamemodeCard.module.scss";
import Button from "../Button/Button";

interface GamemodeCardProps {
  mode: GamemodeType;
  title: string;
  desc: string;
  disabled?: boolean;
  onClick?: () => void;
}

const GamemodeCard: React.FC<GamemodeCardProps> = ({
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

export default GamemodeCard;