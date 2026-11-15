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

/** How long a speaking question prepares and records for; null is no limit. */
export interface RecordingTimes {
  /** Seconds to prepare before recording starts on its own; null is none. */
  prepareSeconds: number | null;
  /** Seconds a take may run before it stops and hands in on its own; null is no limit. */
  speakSeconds: number | null;
}

/**
 * The times a question records with: the runner's (a timed part, a preparation
 * timer) where it gives them, else the question's own longest take.
 */
export function resolveRecordingTimes(
  fromRunner: Partial<RecordingTimes> | undefined,
  maxSeconds: number | undefined,
): RecordingTimes {
  const positive = (value: number | null | undefined) => (value && value > 0 ? value : null);
  return {
    prepareSeconds: positive(fromRunner?.prepareSeconds),
    speakSeconds: positive(fromRunner?.speakSeconds) ?? positive(maxSeconds),
  };
}

/** Seconds left of a countdown of `total` started at `startedAt` (ms), never below 0. */
export function secondsLeft(total: number, startedAt: number, now: number): number {
  return Math.max(0, total - (now - startedAt) / 1000);
}
