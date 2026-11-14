import { createContext, useContext, type ReactNode } from "react";

/** One student's file for one question, as the app's API reports it. */
export interface AnswerFile {
  /** `pending` until the file exists in Drive and is shared to the student. */
  status: "pending" | "ready" | "failed";
  /** The bare Drive id; null while pending. */
  driveFileId: string | null;
  /** When the file was handed in and locked; null while it can be written. */
  handedInAt: string | null;
  /** Why the file failed, when it did. */
  lastError?: string | null;
}

/** Hands a finished recording in; resolves to the stored answer's file key. */
export type FinishRecording = (recording: Blob) => Promise<string>;

/**
 * How a runner answers essays and speaking questions in files rather than inline.
 * Absent (the default), an essay is typed in place and a speaking question has
 * no recorder.
 */
export interface AnswerFiles {
  /** The student's own file for this question, when it is answered in one. */
  file: (nodeId: string) => AnswerFile | undefined;
  /**
   * Start a recording for a speaking question: asks the API for somewhere to
   * put it, so it rejects (with the server's reason) once the attempt is shut.
   * The returned function uploads and hands in the take.
   */
  beginRecording?: (nodeId: string, contentType: string) => Promise<FinishRecording>;
  /** False once time is up: no new recording starts, one under way still hands in. */
  canStartRecording?: boolean;
}

const NO_FILES: AnswerFiles = { file: () => undefined };

const AnswerFilesContext = createContext<AnswerFiles>(NO_FILES);

/** Supplies a run's answer files to the essay and speaking renderers below it. */
export function AnswerFilesProvider({ value, children }: { value: AnswerFiles; children: ReactNode }) {
  return <AnswerFilesContext.Provider value={value}>{children}</AnswerFilesContext.Provider>;
}

/** The runner's answer files, or the inline default. */
export function useAnswerFiles(): AnswerFiles {
  return useContext(AnswerFilesContext);
}

/** Opens any Drive file in its own editor or viewer. */
export function driveFileUrl(fileId: string): string {
  return `https://drive.google.com/open?id=${encodeURIComponent(fileId)}`;
}
