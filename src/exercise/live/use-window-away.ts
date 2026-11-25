import { useEffect, useState } from "react";

// Whether the exam window has lost the student: the tab is hidden, or the window
// is open but focus is somewhere else. That covers a chat assistant in another
// window or in the browser's side panel, a snipping tool, and an app that reads
// the screen for an assistant. The runner covers the paper while this is true
// (`PrivacyScreen`), so what those see is a blurred page.
//
// Proctoring records the same edges itself (`use-proctoring.ts`); this only
// decides what is on screen, and reports nothing.
export function useWindowAway(enabled: boolean): boolean {
  const [away, setAway] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setAway(false);
      return;
    }
    const update = () => setAway(document.hidden || !document.hasFocus());
    update();
    document.addEventListener("visibilitychange", update);
    window.addEventListener("blur", update);
    window.addEventListener("focus", update);
    return () => {
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("blur", update);
      window.removeEventListener("focus", update);
    };
  }, [enabled]);

  return away;
}
