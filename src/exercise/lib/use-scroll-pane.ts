import { useLayoutEffect, useRef, type RefObject } from "react";

/**
 * A runner scroll pane: publishes its own height on itself as
 * `--runner-scroller`, for the things pinned inside it that have to cap
 * themselves to it — today the gapped-text / jumbled drag pool.
 *
 * Inheritance does the routing, so nothing has to know which pane it is in: the
 * content pane sets the variable, and the questions column — a pane nested
 * inside it in the side-by-side layout — sets it again for its own subtree. A
 * pool reads whichever pane actually scrolls it.
 *
 * Measured rather than derived from `100dvh` minus the two bar heights minus
 * the content padding, which would be three things to keep in step with the
 * layout.
 */
export function useScrollPane<T extends HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const pane = ref.current;
    if (!pane) return;
    const publish = () =>
      pane.style.setProperty("--runner-scroller", `${pane.clientHeight}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(pane);
    return () => observer.disconnect();
  }, []);
  return ref;
}
