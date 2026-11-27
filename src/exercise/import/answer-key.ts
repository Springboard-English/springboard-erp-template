import type { Translate } from "./i18n";
import type { ExerciseNode } from "../index";

// The answer key as the teacher edits it, and the rules for turning that back
// into the `answer_key` blob the API stores.
//
// Kept out of the editor component because the shape is a contract, not a UI
// detail: it has to match `nodeToExercisePost` exactly (lib/exercise-import.ts),
// which is what the create path writes, and the registry's per-family models
// server-side. A key in the wrong shape doesn't fail loudly — it grades every
// student wrong, forever, and looks like a wrong answer rather than a bug.

export type AnswerKeyBlob = Record<string, unknown> | null;

export type AnswerKeyDraft =
  // `selectCount` and `caseSensitive` are not edited here, only CARRIED: a PATCH
  // replaces the whole key, so a draft that forgot them would wipe them on every
// save.
  | { kind: "choice"; correctOptionId: string | undefined; selectCount?: number }
  // `root` is the bank word a banked word-formation blank is formed from.
  | { kind: "accepted"; answers: string[]; caseSensitive?: boolean; root?: string }
  | {
      kind: "error-correction";
      // The marked text (one word or several) and its start offset move
      // together — both ends of the span grade identification, and the text
      // rebuilds the key without needing the sentence.
      errorWord: string;
      errorOffset: number | undefined;
      answers: string[];
      partialCredit: boolean;
      caseSensitive?: boolean;
    }
  | { kind: "tfng"; answer: "true" | "false" | "not-given" | undefined }
  | { kind: "human" };

/** Read the current key off a node whose `answer_key` has been folded in. */
export function initialAnswerKeyDraft(node: ExerciseNode): AnswerKeyDraft {
  switch (node.type) {
    case "mcq":
    case "reading-full-test":
      return {
        kind: "choice",
        correctOptionId: node.content.correct_option_id,
        selectCount: node.type === "mcq" ? node.content.select_count : undefined,
      };
    case "gap-filling":
    case "short-answer":
    case "rewriting":
      return {
        kind: "accepted",
        answers: node.content.accepted_answers ?? [],
        caseSensitive: node.content.case_sensitive,
        root: "root" in node.content ? node.content.root : undefined,
      };
    case "error-correction":
      return {
        kind: "error-correction",
        errorWord: node.content.error ?? "",
        errorOffset: node.content.error_offset,
        answers: node.content.accepted_answers ?? [],
        partialCredit: node.content.partial_credit ?? false,
        caseSensitive: node.content.case_sensitive,
      };
    case "true-false-not-given":
      return { kind: "tfng", answer: node.content.answer };
    default:
      return { kind: "human" };
  }
}

/**
 * Why this key can't be saved yet, or null.
 *
 * Mirrors the server-side registry checks (app/base/domain/exercise_schema.py)
 * so the teacher is told what's wrong here rather than by a rejected PATCH.
 * Each of these would otherwise produce an exercise no student can answer.
 */
export function answerKeyError(draft: AnswerKeyDraft, t: Translate): string | null {
  switch (draft.kind) {
    case "choice":
      return draft.correctOptionId ? null : t("exercise.import.answer.chooseCorrectOption", "Choose the correct option.");
    case "accepted": {
      const filled = draft.answers.map((answer) => answer.trim()).filter(Boolean);
      return filled.length ? null : t("exercise.import.answer.addAcceptedAnswer", "Add at least one accepted answer.");
    }
    case "error-correction": {
      if (draft.errorOffset === undefined) {
        return t("exercise.import.answer.clickErrorWords", "Click the word or words that contain the error.");
      }
      const filled = draft.answers.map((answer) => answer.trim()).filter(Boolean);
      return filled.length ? null : t("exercise.import.answer.addAcceptedCorrection", "Add at least one accepted correction.");
    }
    case "tfng":
      return draft.answer ? null : t("exercise.import.answer.chooseTfng", "Choose True, False, or Not Given.");
    default:
      return null;
  }
}

/**
 * Why this question's answer isn't ready, or null.
 *
 * Extraction returns `answer_key: null` rather than guessing when a
 * worksheet prints no key, so the review has to say which questions still need
 * one — and the save has to refuse them, since the registry rejects a keyless
 * auto-gradable question partway through the run, after earlier questions are
 * already in the library.
 */
export function nodeAnswerError(node: ExerciseNode, t: Translate): string | null {
  return answerKeyError(initialAnswerKeyDraft(node), t);
}

/** The `answer_key` blob to PATCH. Shapes match `nodeToExercisePost`. */
export function draftToAnswerKey(draft: AnswerKeyDraft): AnswerKeyBlob {
  switch (draft.kind) {
    case "choice":
      return {
        correct_option_id: draft.correctOptionId,
        ...(draft.selectCount ? { select_count: draft.selectCount } : {}),
      };
    case "accepted":
      return {
        accepted_answers: draft.answers
          .map((answer) => answer.trim())
          .filter(Boolean),
        ...(draft.caseSensitive ? { case_sensitive: true } : {}),
        ...(draft.root ? { root: draft.root } : {}),
      };
    case "error-correction":
      return {
        error: draft.errorWord,
        error_offset: draft.errorOffset,
        accepted_answers: draft.answers.map((answer) => answer.trim()).filter(Boolean),
        ...(draft.partialCredit ? { partial_credit: true } : {}),
        ...(draft.caseSensitive ? { case_sensitive: true } : {}),
      };
    case "tfng":
      return { answer: draft.answer };
    default:
      return null;
  }
}
