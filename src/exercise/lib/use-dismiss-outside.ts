import { useEffect, type RefObject } from "react";

// Closes a panel that floats out of the runner's bottom bar (the question
// palette, the notes pad) when the student presses anywhere outside it, or
// presses Escape.
//
// Not a transparent `fixed inset-0` button behind the panel, which would be
// wrong twice over:
//
//  1. **It would never cover the screen.** The bottom bar is `backdrop-blur`,
//     and a `backdrop-filter` makes an element the containing block of its
//     `fixed` descendants — so `inset-0` means "the bar", not the viewport
//     (390×73 on an iPhone). A tap on the paper would close nothing.
//  2. **It would eat the tap it sat under.** Next lives in that bar, so with a
//     panel open the first press on Next would only close the panel. In WebKit
//     on a phone the press goes through instead and the palette stays open
//     over the paper.
//
// A document listener has neither problem. Nothing is layered over the page, so
// the press that closes the panel still lands where it was aimed: Next turns the
// page, a gap takes focus. `pointerdown` rather than `click`, so the panel is
// gone before that click is handled, and in the capture phase so a handler that
// stops propagation can't hold the panel open. The panel's own toggle must sit
// inside `ref`, or pressing it would close the panel and the click would
// immediately reopen it.

export function useDismissOutside(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onDismiss: () => void,
): void {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = ref.current;
      if (root && event.target instanceof Node && root.contains(event.target)) return;
      onDismiss();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, open, onDismiss]);
}
