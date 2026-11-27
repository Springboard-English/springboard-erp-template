import { useEffect, type RefObject } from "react";

/** Room left between a focused field's caret and the top of the bar. */
const CLEARANCE_GAP_PX = 12;

const SCROLLING_OVERFLOW = new Set(["auto", "scroll", "overlay"]);

/** Whether `node` scrolls its content vertically: the page itself, or an element with auto/scroll overflow. */
function isVerticalScroller(node: HTMLElement): boolean {
  if (node === document.scrollingElement) return true;
  return SCROLLING_OVERFLOW.has(getComputedStyle(node).overflowY);
}

/** The visible bottom edge of a scroller in viewport pixels, at most the window's. */
function scrollerBottom(node: HTMLElement): number {
  if (node === document.scrollingElement) return window.innerHeight;
  // A scroller taller than the window is only covered up to the window's edge.
  return Math.min(node.getBoundingClientRect().bottom, window.innerHeight);
}

/** Whether `node` is a field the user types into, whose caret the browser keeps in view. */
function isEditable(node: Element): node is HTMLElement {
  return (
    node instanceof HTMLTextAreaElement
    || (node instanceof HTMLInputElement && !["checkbox", "radio", "button", "submit", "range"].includes(node.type))
    || (node instanceof HTMLElement && node.isContentEditable)
  );
}

/**
 * While `active`, gives each scroll container around the focused field a
 * `scroll-padding-bottom` equal to how much of it `overlay` covers, so the
 * browser scrolls a focused field, and the caret of a growing textarea, to
 * sit above the overlay. Only containers the overlay actually covers are
 * padded, and every inline value is restored when it goes inactive.
 * `settleMs` is how long the overlay takes to slide into place.
 */
export default function useScrollClearance(
  overlay: RefObject<HTMLElement | null>,
  active: boolean,
  settleMs = 0,
): void {
  useEffect(() => {
    if (!active || typeof document === "undefined") return;
    // Each padded scroller and the inline value it had before.
    const padded = new Map<HTMLElement, string>();

    const release = (node: HTMLElement) => {
      node.style.scrollPaddingBottom = padded.get(node) ?? "";
      padded.delete(node);
    };

    const apply = () => {
      const bar = overlay.current;
      const focused = document.activeElement;
      const covers = new Map<HTMLElement, number>();
      // Focus inside the overlay itself (its own buttons) needs no room.
      if (bar && focused instanceof HTMLElement && !bar.contains(focused)) {
        const top = bar.getBoundingClientRect().top;
        for (let node = focused.parentElement; node; node = node.parentElement) {
          if (!isVerticalScroller(node)) continue;
          const cover = Math.ceil(scrollerBottom(node) - top + CLEARANCE_GAP_PX);
          if (cover > 0) covers.set(node, cover);
        }
      }
      for (const node of Array.from(padded.keys())) {
        if (!covers.has(node)) release(node);
      }
      covers.forEach((cover, node) => {
        if (!padded.has(node)) padded.set(node, node.style.scrollPaddingBottom);
        node.style.scrollPaddingBottom = `${cover}px`;
      });
    };

    // The bar usually appears on the first keystroke, over a field already
    // focused; once it has settled, lift that field if it is now covered.
    const reveal = () => {
      apply();
      const bar = overlay.current;
      const focused = document.activeElement;
      if (!bar || !focused || !isEditable(focused) || bar.contains(focused)) return;
      const field = focused.getBoundingClientRect();
      const barTop = bar.getBoundingClientRect().top;
      // A field taller than the room above the bar is left to the caret reveal,
      // so a long textarea does not jump to its top.
      if (field.bottom > barTop && field.height < barTop - CLEARANCE_GAP_PX) {
        focused.scrollIntoView({ block: "nearest" });
      }
    };

    apply();
    const settle = window.setTimeout(reveal, settleMs + 50);
    document.addEventListener("focusin", apply);
    // Capture: a field's own handler may grow it before the browser moves the caret.
    document.addEventListener("input", apply, true);
    window.addEventListener("resize", apply);
    const observer =
      typeof ResizeObserver === "undefined" || !overlay.current
        ? null
        : new ResizeObserver(apply);
    if (observer && overlay.current) observer.observe(overlay.current);
    return () => {
      window.clearTimeout(settle);
      document.removeEventListener("focusin", apply);
      document.removeEventListener("input", apply, true);
      window.removeEventListener("resize", apply);
      observer?.disconnect();
      for (const node of Array.from(padded.keys())) release(node);
    };
  }, [active, overlay, settleMs]);
}
