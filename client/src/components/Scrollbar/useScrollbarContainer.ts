import { useRef, useEffect, useState, useCallback, type RefObject, type PointerEvent } from "react";

const MIN_THUMB_HEIGHT = 20;

const useScrollbarController = (targetRef: RefObject<HTMLElement | null>) => {

  const [thumb, setThumb] = useState({ height: MIN_THUMB_HEIGHT, top: 0 });
  const [visible, setVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragOrigin = useRef({ y: 0, thumbTop: 0 });
  const baseRef = useRef({ clientHeight: 0, scrollHeight: 0 });

  const updateThumb = useCallback(() => {
    const target = targetRef.current;
    const track = trackRef.current;
    if (!target || !track) return;

    const { clientHeight: baseClient, scrollHeight: baseScroll } = baseRef.current;
    if (baseClient === 0) return;

    const { scrollTop } = target;
    const trackHeight = track.clientHeight;

    const height = Math.max((baseClient / baseScroll) * trackHeight, MIN_THUMB_HEIGHT);

    const maxScroll = baseScroll - baseClient;
    const top = maxScroll > 0 ? (scrollTop / maxScroll) * (trackHeight - height) : 0;

    setThumb({ height, top });
  }, [targetRef]);

  const initThumb = useCallback(() => {
    const target = targetRef.current;
    const track = trackRef.current;
    if (!target || !track) return;

    const { clientHeight, scrollHeight } = target;
    if (scrollHeight <= clientHeight) return;

    baseRef.current = { clientHeight, scrollHeight };
    setVisible(true);
    updateThumb();

  }, [targetRef, updateThumb]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    target.addEventListener("scroll", updateThumb);

    const observer = new ResizeObserver(() => {
      if (baseRef.current.clientHeight === 0) initThumb();
    });
    observer.observe(target);

    return () => {
      target.removeEventListener("scroll", updateThumb);
      observer.disconnect();
    };

  }, [targetRef, updateThumb, initThumb]);

  const onPointerDown = (e: PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragOrigin.current = { y: e.clientY, thumbTop: thumb.top };

  };

  const onPointerMove = (e: PointerEvent) => {
    if (!(e.target as HTMLElement).hasPointerCapture(e.pointerId)) return;

    const target = targetRef.current;
    const track = trackRef.current;
    if (!target || !track) return;

    const maxThumbTop = track.clientHeight - thumb.height;
    const newTop = Math.max(0, Math.min(dragOrigin.current.thumbTop + (e.clientY - dragOrigin.current.y), maxThumbTop));
    const { clientHeight, scrollHeight } = baseRef.current;
    target.scrollTop = (newTop / maxThumbTop) * (scrollHeight - clientHeight);

  };

  return { thumb, visible, trackRef, onPointerDown, onPointerMove };
};

export default useScrollbarController;