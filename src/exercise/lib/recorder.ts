// Pure helpers for the speaking recorder, kept apart from the component so they
// can be tested without a browser.

/** Container types to try, best first: Chrome and Firefox take WebM, Safari MP4. */
export const RECORDING_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];

/**
 * The first container this browser records, or "" to let it choose. `supports`
 * is `MediaRecorder.isTypeSupported`, passed in so the choice is testable.
 */
export function pickRecordingType(supports: (type: string) => boolean): string {
  return RECORDING_TYPES.find((type) => supports(type)) ?? "";
}

/**
 * A recording's media type without its codec parameters, as it is uploaded and
 * signed: `audio/webm;codecs=opus` is `audio/webm`. Falls back to `audio/webm`
 * when the browser reported nothing usable.
 */
export function uploadType(type: string): string {
  const base = type.split(";")[0].trim().toLowerCase();
  return base.startsWith("audio/") ? base : "audio/webm";
}

/**
 * A timed part's clock for one speaking question, as the server stamped it when
 * the student opened the part (ISO times). Preparation runs from `openedAt` to
 * `prepEndsAt`; takes may run until `deadlineAt`.
 */
export interface RecordingWindow {
  openedAt: string | null;
  prepEndsAt: string | null;
  deadlineAt: string | null;
  /** Start recording by itself when preparation ends: the runner picks one question per part. */
  autoStart: boolean;
}

/** Where a timed part's clock stands: still preparing, open for takes, or over. */
export type WindowStage = "preparing" | "open" | "over";

/** The stage of a part's clock at `now` (ms); a missing time never blocks. */
export function windowStage(window: RecordingWindow, now: number): WindowStage {
  const deadline = window.deadlineAt ? Date.parse(window.deadlineAt) : null;
  if (deadline !== null && now >= deadline) return "over";
  const prepEnds = window.prepEndsAt ? Date.parse(window.prepEndsAt) : null;
  return prepEnds !== null && now < prepEnds ? "preparing" : "open";
}

/**
 * When a take started at `startedAt` (ms) must stop: the question's longest take
 * or the part's deadline, whichever is first; null when neither limits it.
 */
export function takeEndsAt(
  startedAt: number,
  maxSeconds: number | null | undefined,
  deadlineAt: string | null | undefined,
): number | null {
  const ends = [
    maxSeconds && maxSeconds > 0 ? startedAt + maxSeconds * 1000 : null,
    deadlineAt ? Date.parse(deadlineAt) : null,
  ].filter((value): value is number => value !== null && !Number.isNaN(value));
  return ends.length ? Math.min(...ends) : null;
}

/** Seconds from `now` to `until` (both ms), never below 0. */
export function secondsUntil(until: number, now: number): number {
  return Math.max(0, (until - now) / 1000);
}
