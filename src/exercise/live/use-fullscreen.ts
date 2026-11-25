import { useCallback, useEffect, useState } from "react";

// A minimal wrapper over the Fullscreen API for the live-session runner.
//
// `requestFullscreen` must be called from a user gesture, so `enter` is meant to
// be wired to a button (the FullscreenGate) rather than fired on mount — a
// silent request is rejected by every browser. The hook only tracks the
// resulting state and never throws into the runner.
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenEnabled?: boolean;
};
type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};

function currentFullscreenElement(): Element | null {
  const doc = document as FsDocument;
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

export interface FullscreenControls {
  /** Whether the document is currently in fullscreen. */
  isFullscreen: boolean;
  /** Whether this browser can go fullscreen at all (iOS Safari can't). */
  supported: boolean;
  /** Enter fullscreen. MUST be called from a user gesture. */
  enter: () => Promise<void>;
  /** Leave fullscreen (no-op if not in it). */
  exit: () => Promise<void>;
}

export function useFullscreen(): FullscreenControls {
  const [isFullscreen, setIsFullscreen] = useState(
    () => currentFullscreenElement() !== null,
  );

  useEffect(() => {
    const onChange = () => setIsFullscreen(currentFullscreenElement() !== null);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const enter = useCallback(async () => {
    const el = document.documentElement as FsElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    } catch {
      // Blocked (no gesture) or unsupported: the gate stays up and the student
      // can retry. Never surface this into the exam.
    }
  }, []);

  const exit = useCallback(async () => {
    const doc = document as FsDocument;
    try {
      if (currentFullscreenElement() === null) return;
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
    } catch {
      // no-op
    }
  }, []);

  const doc = document as FsDocument;
  const supported =
    (typeof document.fullscreenEnabled === "boolean" && document.fullscreenEnabled) ||
    Boolean(doc.webkitFullscreenEnabled);

  return { isFullscreen, supported, enter, exit };
}
