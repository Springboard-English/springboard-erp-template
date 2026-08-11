import { useEffect, useRef, useState } from 'react';

/**
 * The rendered pixel width of a container.
 *
 * A time-series chart is drawn at real pixel size rather than scaled from a
 * fixed viewBox, because scaling a viewBox scales the tick labels with it — at
 * which point the type size depends on how wide the panel happens to be.
 */
export function useChartWidth<T extends HTMLElement>(fallback = 640) {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width;
      if (next && next > 0) {
        setWidth(next);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
