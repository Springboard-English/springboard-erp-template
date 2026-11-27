import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";

import { Button, errorMessage } from "../../exports";
import { uploadRecordingFile, type MediaRef } from "./api";
import type { Translate } from "./i18n";
import { useStableI18n } from "./i18n";
import {
  AUDIO_ACCEPT,
  audioContentTypeFor,
  mediaFileError,
} from "../index";

// Picking a recording's file: from the teacher's machine, checked here, its
// length read by the browser (the play window the server opens is that long),
// then uploaded straight to the bucket's `tmp/`. What claims the upload — a new
// recording, or a replaced file — is the caller's.

/** A file just uploaded, and what the form needs from it. */
export interface UploadedRecording {
  media: MediaRef;
  /** The file's name without its extension — a starting title. */
  name: string;
  /** Plays the teacher's own file before anything is saved. */
  localUrl: string;
}

/** The clip's length in seconds, read by the browser from a URL it can play. */
function readDuration(src: string, t: Translate): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) resolve(audio.duration);
      else reject(new Error(t("exercise.import.mediaField.noLength", "This file doesn’t report a length.")));
    };
    audio.onerror = () => reject(new Error(t("exercise.import.mediaField.notAudio", "The browser can’t read this file as audio.")));
    audio.src = src;
  });
}

/**
 * A button that picks, checks and uploads one audio file, with progress, and
 * says why a file was refused under itself.
 */
export function RecordingFileButton({
  label,
  disabled,
  onUploaded,
  size = "sm",
  variant = "outline",
}: {
  label: string;
  disabled?: boolean;
  onUploaded: (upload: UploadedRecording) => void;
  size?: "sm" | "default";
  variant?: "outline" | "default";
}) {
  const { t } = useStableI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    const problem = mediaFileError(file.name, file.type, file.size, t);
    const contentType = audioContentTypeFor(file.name, file.type);
    if (problem || !contentType) {
      setError(problem ?? t("exercise.import.mediaField.chooseAudio", "Choose an audio file."));
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setUploading(true);
    setProgress(0);
    try {
      // Read first: a file the browser cannot play is not worth uploading.
      const duration = await readDuration(localUrl, t);
      const { key } = await uploadRecordingFile(file, contentType, t, setProgress);
      onUploaded({
        media: { provider: "gcs", key, content_type: contentType, size_bytes: file.size, duration_s: duration },
        name: file.name.replace(/\.[^.]+$/, ""),
        localUrl,
      });
    } catch (err) {
      URL.revokeObjectURL(localUrl);
      setError(
        errorMessage(err, t("exercise.import.mediaField.uploadFailed", "Couldn’t upload the file.")),
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-1.5">
      <input
        ref={inputRef}
        type="file"
        accept={AUDIO_ACCEPT}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        {uploading ? t("exercise.import.mediaField.uploading", "Uploading {n}%", { n: Math.round(progress * 100) }) : label}
      </Button>
      {error ? (
        <p role="alert" className="text-xs font-bold text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** "MP3, M4A, WAV, OGG or WebM · up to 60 MB" — what the picker takes. */
export function recordingFileHint(t: Translate): string {
  return t("exercise.import.mediaField.fileHint", "MP3, M4A, WAV, OGG or WebM · up to 60 MB");
}
