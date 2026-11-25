import { useMemo } from "react";
import type { AnswerFile, AnswerFiles } from "../lib/answer-files";
import type { ExerciseAnswer } from "../lib/exercises";
import type { RecordingWindow } from "../lib/recorder";

import { errorMessage } from "../../exports";
import {
  handInSpeakingRecording,
  requestSpeakingUploadUrl,
  isTimedPart,
  type RunPart,
  type SessionExercise,
  type SubmissionFile,
} from "./api";
import { useStableI18n } from "./i18n";

// Opus runs well under this; AAC on Safari about 16 KB/s. The cap is signed into
// the upload, so it is generous rather than tight.
const BYTES_PER_SECOND = 64 * 1024;
// A take with no limit on the question stops being accepted past this length.
const DEFAULT_MAX_SECONDS = 15 * 60;
// The API refuses a larger cap.
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

/** An error carrying the student-facing message, keeping what caused it. */
function studentError(message: string, cause: unknown): Error {
  return Object.assign(new Error(message), { cause });
}

/** A submission file as the template's renderers read it. */
export function toAnswerFile(file: SubmissionFile): AnswerFile {
  return {
    status: file.status,
    driveFileId: file.drive_file_id,
    handedInAt: file.handed_in_at ?? null,
    lastError: file.last_error,
  };
}

/**
 * The student's answers with each essay that has its Doc counted as answered
 * (`{ file_key }`), for the question map, the review and the blank check: the
 * API records the Doc as the answer only at hand-in, so the paper alone would
 * call every Doc essay blank. Never sent.
 */
export function withEssayDocs(
  answers: Record<string, ExerciseAnswer>,
  paper: SessionExercise[] | undefined,
): Record<string, ExerciseAnswer> {
  const docs = (paper ?? []).filter((item) => item.document && answers[item.exercise_key] == null);
  if (!docs.length) return answers;
  const counted = { ...answers };
  for (const item of docs) counted[item.exercise_key] = { file_key: item.document!.appsheet_key };
  return counted;
}

/**
 * The upload cap for one take: the question's longest take (or fifteen minutes)
 * at a generous bitrate, plus a megabyte for the container, within the API's
 * 100 MB.
 */
export function recordingByteCap(maxSeconds: number | null | undefined): number {
  const seconds = maxSeconds && maxSeconds > 0 ? maxSeconds : DEFAULT_MAX_SECONDS;
  return Math.min(seconds * BYTES_PER_SECOND + 1024 * 1024, MAX_UPLOAD_BYTES);
}

/**
 * A speaking question's part clock, when its part is timed and opened: the
 * server's stamps, and whether this question records by itself when
 * preparation ends. Only the part's first speaking question still unanswered
 * does, so a page of several never opens two microphones.
 */
export function partWindowFor(
  nodeId: string,
  paper: SessionExercise[] | undefined,
  parts: RunPart[] | undefined,
  answers: Record<string, ExerciseAnswer>,
): RecordingWindow | undefined {
  const item = paper?.find((entry) => entry.exercise_key === nodeId);
  const part = item?.part_key ? parts?.find((entry) => entry.part_key === item.part_key) : undefined;
  if (!item || !part || !isTimedPart(part) || !part.opened_at) return undefined;
  const firstOpen = (paper ?? [])
    .filter((entry) => entry.part_key === part.part_key && entry.exercise.type === "speaking")
    .sort((a, b) => a.order - b.order)
    .find((entry) => answers[entry.exercise_key] == null);
  return {
    openedAt: part.opened_at,
    prepEndsAt: part.prep_ends_at,
    deadlineAt: part.deadline_at,
    autoStart: firstOpen?.exercise_key === nodeId,
  };
}

/**
 * The runner's answer files for the template: each essay's Doc from the paper,
 * and a recorder that asks the API for an upload slot before a take starts and
 * hands the take in when it stops. Node ids are link keys, as the runner's are.
 */
export function useRunAnswerFiles(
  sessionKey: string | undefined,
  participantKey: string | undefined,
  paper: SessionExercise[] | undefined,
  canStartRecording: boolean,
  parts: RunPart[] | undefined,
  answers: Record<string, ExerciseAnswer>,
  serverNow: () => number,
): AnswerFiles {
  const { t } = useStableI18n();
  return useMemo<AnswerFiles>(() => {
    const byLink = new Map((paper ?? []).map((item) => [item.exercise_key, item]));
    return {
      file: (nodeId) => {
        const document = byLink.get(nodeId)?.document;
        return document ? toAnswerFile(document) : undefined;
      },
      canStartRecording,
      recordingWindow: (nodeId) => partWindowFor(nodeId, paper, parts, answers),
      serverNow,
      beginRecording: async (nodeId, contentType) => {
        if (!sessionKey || !participantKey) throw new Error(t("exercise.live.recorder.notJoined", "You’re not in this challenge yet."));
        const maxSeconds = byLink.get(nodeId)?.exercise.content?.max_seconds;
        const cap = recordingByteCap(typeof maxSeconds === "number" ? maxSeconds : null);
        let slot;
        try {
          slot = await requestSpeakingUploadUrl(sessionKey, participantKey, nodeId, contentType, cap);
        } catch (error) {
          throw studentError(errorMessage(error, t("exercise.live.recorder.startFailed", "Recording couldn’t start. Try again.")), error);
        }
        return async (recording) => {
          try {
            const file = await handInSpeakingRecording(sessionKey, participantKey, nodeId, slot, recording, contentType, cap);
            return file.appsheet_key;
          } catch (error) {
            throw studentError(errorMessage(error, t("exercise.live.recorder.handInFailed", "Your recording couldn’t be handed in. Try again.")), error);
          }
        };
      },
    };
  }, [paper, canStartRecording, parts, answers, serverNow, sessionKey, participantKey, t]);
}
