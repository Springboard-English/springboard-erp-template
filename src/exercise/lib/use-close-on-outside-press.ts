import { useEffect, useRef, type PointerEventHandler } from "react";

// Closes an editor pop-up (a question's menu, the runner heading's panel) on a
// press outside it, or Escape. "Inside" is the pop-up's React tree, not its DOM
// box: a select or searchable list in it draws its options in a portal at the
// end of the body, and a pick there must not close the pop-up before it lands.
// React bubbles that press through the portal to the pop-up's
// `onPointerDownCapture` before the document listener runs, which is why this
// listens in the bubble phase (unlike `useDismissOutside`).
//
// Escape that an open select or list already handled (`defaultPrevented`)
// closes only that list.

/**
 * Calls `onClose` on a press outside the element given the returned handler, or
 * on Escape, while `open`. `keep` says a press target is inside anyway (a
 * dialog the pop-up opened from elsewhere in the tree).
 */
export function useCloseOnOutsidePress(
  open: boolean,
  onClose: () => void,
  keep?: (target: Element | null) => boolean,
): PointerEventHandler {
  const pressedInside = useRef(false);
  useEffect(() => {
    if (!open) return;
    // The press that opened it (on a toggle inside) set the flag with no
    // listener to clear it.
    pressedInside.current = false;
    const onDown = (event: PointerEvent) => {
      const inside = pressedInside.current || Boolean(keep?.(event.target as Element | null));
      pressedInside.current = false;
      if (!inside) onClose();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) onClose();
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, keep]);
  return () => {
    pressedInside.current = true;
  };
}
