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
