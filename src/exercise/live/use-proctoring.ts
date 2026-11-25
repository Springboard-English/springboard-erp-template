import { useCallback, useEffect, useRef } from "react";

import { recordProctorEvent, type ProctorEventType } from "./api";
import type { ExamBlockReason } from "./device-support";
import { fromOwnWriting } from "./use-copy-guard";

// Client-side integrity signals for a live session, POSTed to
// /v2/live-sessions/{sid}/proctor-events. The server applies a risk weight per
// type and refreshes the *teacher* aggregate only — a student never sees their
// own risk score, which is why nothing here surfaces anything in the UI.
//
// Three rules this hook exists to enforce:
//
//  1. **Never interrupt the exam.** Every post is fire-and-forget. A network
//     failure, a 4xx, an ended session — none of it may throw into the runner
//     or block a keystroke. Proctoring is strictly observational.
//  2. **Report transitions, not states.** `visibilitychange` and window
//     blur/focus both fire for a tab switch, and a single alt-tab can emit
//     several. Posting each one would inflate the risk score for one action, so
//     visibility is tracked as a single boolean and only its *flips* are sent.
//  3. **Never send answer content.** A paste or a copy reports its length, not its text.
//     The payload is a signal for the teacher, not a copy of the student's work.

/** Ignore repeats of the same type inside this window (rapid-fire alt-tabbing). */
const MIN_INTERVAL_MS = 1_000;

interface ProctoringTarget {
  sessionKey: string;
  participantKey: string;
}

/** Report a signal the runner observes itself; a no-op while proctoring is off. */
export type ReportProctorEvent = (
  type: ProctorEventType,
  payload?: Record<string, unknown>,
) => void;

export function useProctoring(
  target: ProctoringTarget | null,
  enabled: boolean,
  /** Why this device sits the paper without the fullscreen lock, if it does. */
  unsupportedFullscreen: ExamBlockReason | null = null,
): ReportProctorEvent {
  // Held in refs so the listeners are attached once per session rather than
  // re-bound on every answer keystroke.
  const lastSentAt = useRef<Partial<Record<ProctorEventType, number>>>({});
  const hiddenSince = useRef<number | null>(null);
  const isHidden = useRef(false);
  // The live `send` while enabled, so `report` shares its throttle and its gate.
  const sendRef = useRef<ReportProctorEvent | null>(null);
  const report = useCallback<ReportProctorEvent>((type, payload) => {
    sendRef.current?.(type, payload);
  }, []);

  useEffect(() => {
    if (!enabled || !target) return;

    const { sessionKey, participantKey } = target;
    lastSentAt.current = {};
    isHidden.current = false;
    hiddenSince.current = null;

    function send(type: ProctorEventType, payload?: Record<string, unknown>) {
      const now = Date.now();
      const previous = lastSentAt.current[type] ?? 0;
      if (now - previous < MIN_INTERVAL_MS) return;
      lastSentAt.current[type] = now;

      // Deliberately unawaited and unreported: see rule 1 above.
      void recordProctorEvent(sessionKey, participantKey, {
        type,
        ...(payload ? { payload } : {}),
      }).catch(() => undefined);
    }
    sendRef.current = send;

    /** Collapse visibilitychange + window blur/focus into one hidden/visible edge. */
    function setHidden(hidden: boolean) {
      if (hidden === isHidden.current) return;
      isHidden.current = hidden;

      if (hidden) {
        hiddenSince.current = Date.now();
        send("blur");
        return;
      }
      // Time away is the useful part of a return — a two-second alt-tab and a
      // two-minute one are very different signals for the same pair of events.
      const awayMs = hiddenSince.current ? Date.now() - hiddenSince.current : null;
      hiddenSince.current = null;
      send("focus", awayMs !== null ? { away_ms: awayMs } : undefined);
    }

    // Once per mount; the server charges it once per attempt, so a refresh
    // re-reporting it costs nothing.
    if (unsupportedFullscreen) {
      send("fullscreen-unsupported", { reason: unsupportedFullscreen });
    }

    const onVisibility = () => setHidden(document.hidden);
    const onBlur = () => setHidden(true);
    const onFocus = () => setHidden(false);

    // No paste listener: `use-copy-guard.ts` refuses every paste that did not
    // come from the student's own writing and reports those through the runner
    // as `paste` with `blocked: true`. What it lets through is their own text
    // moved between their own fields, which is not a signal.

    // The outbound half, which `use-copy-guard.ts` cancels. Every phase this
    // hook is enabled on is one the guard holds shut, so what reaches here was
    // blocked. The selection is measured because a cancelled copy leaves the
    // clipboard empty; an empty one (an image dragged, Ctrl+C on nothing) is
    // not an attempt to take anything, so it is not reported.
    const onCopy = (event: Event) => {
      if (fromOwnWriting(event.target)) return;
      const length = document.getSelection()?.toString().length ?? 0;
      if (length === 0) return;
      send("copy", { via: event.type === "dragstart" ? "drag" : event.type, length });
    };

    const onFullscreenChange = () => {
      // Only the exit is a signal; entering fullscreen is the desired state.
      if (document.fullscreenElement === null) send("fullscreen-exit");
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    // Capture phase, so a handler that stops propagation cannot hide a copy.
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("cut", onCopy, true);
    document.addEventListener("dragstart", onCopy, true);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      sendRef.current = null;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("cut", onCopy, true);
      document.removeEventListener("dragstart", onCopy, true);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [enabled, target?.sessionKey, target?.participantKey, unsupportedFullscreen]);

  return report;
}
