import type { TranscriptCue } from "../types";

// Reading a timed transcript against a playing clip. Pure, so the rules are
// tested without an <audio> element.

/**
 * The cue being spoken at `seconds`, as an index, or -1 before the first.
 *
 * Between two cues the earlier stays lit, so the highlight doesn't blink off
 * during a pause; past the last it stays on the last.
 */
export function activeCueIndex(cues: readonly TranscriptCue[], seconds: number): number {
  let found = -1;
  for (let i = 0; i < cues.length; i += 1) {
    if (cues[i].start_s > seconds) break;
    found = i;
  }
  return found;
}

/** A cue's start as the transcript prints it: `m:ss`, or `h:mm:ss` past an hour. */
export function cueClock(seconds: number): string {
  const whole = Math.max(0, Math.floor(seconds));
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = String(whole % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

/** What a recording's transcript has to show: timed lines, else plain text, else nothing. */
export type TranscriptContent =
  | { kind: "timed"; cues: TranscriptCue[] }
  | { kind: "plain"; text: string }
  | { kind: "none" };

/** Which form of a recording's transcript to draw. Timed lines win over the text. */
export function transcriptContent(recording: {
  transcript?: string | null;
  transcript_cues?: TranscriptCue[] | null;
}): TranscriptContent {
  if (recording.transcript_cues && recording.transcript_cues.length > 0) {
    return { kind: "timed", cues: recording.transcript_cues };
  }
  const text = recording.transcript?.trim();
  return text ? { kind: "plain", text } : { kind: "none" };
}
