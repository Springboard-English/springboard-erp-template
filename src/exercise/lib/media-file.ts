// What a recording upload accepts, decided before anything is uploaded. The
// API re-checks type and size when the recording is saved.

import type { Translate } from "../i18n";

/** The audio types the API stores a recording as (`AudioContentType` there). */
export type AudioContentType =
  | "audio/mpeg"
  | "audio/mp4"
  | "audio/x-m4a"
  | "audio/wav"
  | "audio/x-wav"
  | "audio/ogg"
  | "audio/webm";

/** The API's cap on one recording. */
export const MAX_MEDIA_BYTES = 60 * 1024 * 1024;

/** For the file input's `accept`: the MIME types and the extensions browsers miss. */
export const AUDIO_ACCEPT =
  "audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/x-wav,audio/ogg,audio/webm,.mp3,.m4a,.mp4,.wav,.ogg,.oga,.webm";

const BY_EXTENSION: Record<string, AudioContentType> = {
  mp3: "audio/mpeg",
  m4a: "audio/x-m4a",
  mp4: "audio/mp4",
  wav: "audio/wav",
  ogg: "audio/ogg",
  oga: "audio/ogg",
  webm: "audio/webm",
};

const KNOWN = new Set<string>(Object.values(BY_EXTENSION).concat(["audio/x-wav"]));

// Browsers report a few of these under names the API does not list.
const ALIASES: Record<string, AudioContentType> = {
  "audio/mp3": "audio/mpeg",
  "audio/m4a": "audio/x-m4a",
  "audio/wave": "audio/wav",
  "audio/vnd.wave": "audio/wav",
};

/**
 * The content type to upload a file as, or null when it is not audio we take.
 * The reported type wins when it is one we know; an empty or generic one (some
 * browsers report "" for .m4a) falls back to the extension.
 */
export function audioContentTypeFor(name: string, reported: string): AudioContentType | null {
  const type = reported.toLowerCase();
  if (KNOWN.has(type)) return type as AudioContentType;
  if (ALIASES[type]) return ALIASES[type];
  const extension = name.toLowerCase().split(".").pop() ?? "";
  return BY_EXTENSION[extension] ?? null;
}

/** Why a file cannot be used, or null if it can. */
export function mediaFileError(name: string, reported: string, sizeBytes: number, t: Translate): string | null {
  if (!audioContentTypeFor(name, reported)) {
    return t("exercise.media.chooseAudio", "Choose an audio file (MP3, M4A, WAV, OGG or WebM).");
  }
  if (sizeBytes > MAX_MEDIA_BYTES) {
    return t("exercise.media.tooLarge", "That file is {size}; the limit is {limit}.", {
      size: formatBytes(sizeBytes),
      limit: formatBytes(MAX_MEDIA_BYTES),
    });
  }
  if (sizeBytes === 0) return t("exercise.media.empty", "That file is empty.");
  return null;
}

/** "4.2 MB" / "820 KB". */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || !Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
