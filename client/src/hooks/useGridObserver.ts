
import { useEffect, useCallback, useRef, type RefObject } from "react";

const useGridObserver = (gridRef: RefObject<HTMLDivElement | null>) => {
    
  const baseRef = useRef({ baseMaxHeight: 0, closedCardHeight: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);

  const applyMaxHeight = useCallback(() => {
    if (!gridRef) return;

    const grid = gridRef.current;
    if (!grid) return;
    
    const children = Array.from(grid.children) as HTMLElement[];
    const { baseMaxHeight, closedCardHeight } = baseRef.current;

    let extra = 0;

    for (const child of children) {
      const diff = child.getBoundingClientRect().height - closedCardHeight;
      if (diff > 0) extra += diff;
    }
    
    grid.style.maxHeight = `${baseMaxHeight + extra}px`;
  }, [gridRef]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const children = Array.from(grid.children) as HTMLElement[];

    const GRID_GAP_PX = 24;

    const closedCardHeight = children[0].getBoundingClientRect().height;

    const visibleCards = Math.min(5, children.length);
    const baseMaxHeight = visibleCards * closedCardHeight + (visibleCards - 1) * GRID_GAP_PX;

    baseRef.current = { baseMaxHeight, closedCardHeight };
    grid.style.maxHeight = `${baseMaxHeight}px`;

    const observer = new ResizeObserver(applyMaxHeight);
    children.forEach(child => observer.observe(child));
    observerRef.current = observer;
      
    return () => {
      observerRef.current?.disconnect();
    };
  }, [gridRef, applyMaxHeight]);
};

export default useGridObserver;