import { useMemo } from "react";

// Whether this device can sit a Leap challenge at all.
//
// The runner is locked to fullscreen, and two kinds of device cannot honour
// that lock while the student types:
//
//  1. **No Fullscreen API.** iPhone Safari, and most in-app browsers (Zalo,
//     Messenger), expose none.
//  2. **Fullscreen without a keyboard — iPadOS.** WebKit grants element
//     fullscreen on a non-desktop idiom only WITHOUT keyboard access
//     (`WebFullScreenManager::supportsFullScreenForElement`), then drops every
//     letter and digit key while it lasts (`EventHandler::
//     isKeyEventAllowedInFullScreen`), and a run of taps raises "It looks like
//     you are typing while in full screen" with Exit / Stay buttons
//     (`WKFullScreenViewController _showPhishingAlert`). A gap cannot be typed
//     into. Every iOS browser is WebKit, so Chrome on an iPad is the same.
//
// Both sit the paper with the lock off
// (no FullscreenGate), and the runner reports a `fullscreen-unsupported`
// proctor event, charged once per attempt. Pure and tested; `readDeviceFacts`
// is the only part that touches the browser.

export type ExamBlockReason = "no-fullscreen" | "fullscreen-blocks-typing";

export interface DeviceFacts {
  /** `document.fullscreenEnabled || document.webkitFullscreenEnabled`. */
  fullscreenEnabled: boolean;
  /** `requestFullscreen` or its webkit spelling exists on the root element. */
  canRequestFullscreen: boolean;
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
}

/**
 * iPhone, iPod or iPad — including an iPad in its default "desktop website"
 * mode, which reports `MacIntel` exactly like a Mac. No Mac has a touchscreen,
 * so more than one touch point is what gives the iPad away.
 */
export function isAppleTouchDevice(facts: DeviceFacts): boolean {
  if (/\b(iPhone|iPad|iPod)\b/.test(facts.userAgent)) return true;
  if (facts.platform === "iPhone" || facts.platform === "iPad" || facts.platform === "iPod") {
    return true;
  }
  return facts.platform === "MacIntel" && facts.maxTouchPoints > 1;
}

/** Why this device cannot sit a challenge, or null when it can. */
export function examBlockReason(facts: DeviceFacts): ExamBlockReason | null {
  const hasFullscreen = facts.fullscreenEnabled && facts.canRequestFullscreen;
  if (!hasFullscreen) return "no-fullscreen";
  if (isAppleTouchDevice(facts)) return "fullscreen-blocks-typing";
  return null;
}

type FsDocument = Document & { webkitFullscreenEnabled?: boolean };
type FsElement = HTMLElement & { webkitRequestFullscreen?: unknown };

export function readDeviceFacts(): DeviceFacts {
  const doc = document as FsDocument;
  const root = document.documentElement as FsElement;
  return {
    fullscreenEnabled:
      (typeof document.fullscreenEnabled === "boolean" && document.fullscreenEnabled) ||
      Boolean(doc.webkitFullscreenEnabled),
    canRequestFullscreen:
      typeof root.requestFullscreen === "function" ||
      typeof root.webkitRequestFullscreen === "function",
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints ?? 0,
  };
}

/** The block reason for this browser, read once — none of these facts change. */
export function useExamBlockReason(): ExamBlockReason | null {
  return useMemo(() => examBlockReason(readDeviceFacts()), []);
}
