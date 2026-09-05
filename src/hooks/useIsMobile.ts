import { useEffect, useState } from "react";

// 767px, not 768px: this is the complement of Tailwind's `md:` breakpoint, so a
// component that branches on this hook and a sibling that branches on `md:`
// always agree about which side of the line they are on.
export const MOBILE_MEDIA_QUERY = "(max-width: 767px)";

/**
 * True while the viewport is narrower than Tailwind's `md` breakpoint.
 *
 * Use this only where the decision cannot be expressed in CSS — choosing which
 * component to *mount*, or suppressing a layout mode. For showing and hiding,
 * prefer `md:hidden` / `hidden md:block`, which need no JS and do not flash on
 * first paint.
 */
export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia(MOBILE_MEDIA_QUERY).matches,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) =>
      setIsMobile(event.matches);

    // Re-read on mount: the viewport can change between the initial state and
    // the effect running (rotation, or a hydration on a different width).
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
