import { type RefObject } from "react";
import styles from "./Scrollbar.module.scss";
import useScrollbarController from "../Scrollbar/useScrollbarContainer";

interface ScrollbarProps {
  targetRef: RefObject<HTMLElement | null>;
}

const Scrollbar = ({ targetRef }: ScrollbarProps) => {

  const { thumb, trackRef, onPointerDown, onPointerMove } = useScrollbarController(targetRef);

  return (
    <div
      className={styles["scrollbar"]}
      ref={trackRef}
    >
      <div
        className={styles["scrollbar_thumb"]}
        style={{ height: thumb.height, top: thumb.top }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      />
    </div>
  );
};

export default Scrollbar;