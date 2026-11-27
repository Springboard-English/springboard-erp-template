import {
  QUESTION_TYPE_LABELS,
  SKILL_LABELS,
  questionSummary,
  type ExerciseNode,
} from "../index";

import type { CollectionLayout } from "./api";
import { valueLabel, type Translate } from "./i18n";
import { libraryQuestionEdit, type LibraryQuestionField } from "./library-question";

// The runner editor saves nothing as it goes. Every host lists what it holds as
// `EditorChange` rows, and the final check (`SaveReviewDialog`) shows them
// grouped, flags the risky ones and runs the host's `SaveTask`s in order. What
// is pure about that lives here.

/** One unsaved change, as the final check lists it. */
export interface EditorChange {
  /** Stable while the change is pending; a `SaveTask` reports by it. */
  id: string;
  /** The heading it is listed under: its part and section, or "Question". */
  group: string;
  /** What changed, in the teacher's words: "Question 3 · Answer". */
  label: string;
  before?: string | null;
  after?: string | null;
  /** What saving it may do to work students have already done. */
  risk?: string | null;
  /** Why it can't be saved yet; any blocked change holds Save all. */
  blocked?: string | null;
}

/** Changes under one heading, in the order they were listed. */
export interface ChangeGroup {
  group: string;
  changes: EditorChange[];
}

/**
 * One write (or a few that belong together) behind some changes. `run` throws
 * to fail all its `ids`, or calls `fail` for the ones that failed on their own.
 */
export interface SaveTask {
  ids: string[];
  run: (fail: (id: string, message: string) => void) => Promise<void>;
}

/** A failure whose message is already in the teacher's words; the final check shows it as is. */
export class SaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SaveError";
  }
}

/** The changes under their headings, headings in first-seen order. */
export function groupChanges(changes: readonly EditorChange[]): ChangeGroup[] {
  const groups = new Map<string, EditorChange[]>();
  for (const change of changes) {
    const list = groups.get(change.group) ?? [];
    list.push(change);
    groups.set(change.group, list);
  }
  return [...groups].map(([group, list]) => ({ group, changes: list }));
}

/** The first blocker among the changes, or null when Save all may run. */
export function firstBlocker(changes: readonly EditorChange[]): string | null {
  return changes.find((change) => change.blocked)?.blocked ?? null;
}

/**
 * Run each task in order, whatever the one before did, and report as it goes.
 * Resolves with the message of every change that was not saved, by id.
 */
export async function runSaveTasks(
  tasks: readonly SaveTask[],
  messageOf: (error: unknown) => string,
  onProgress?: (done: number, failed: Record<string, string>) => void,
): Promise<Record<string, string>> {
  const failed: Record<string, string> = {};
  for (const [index, task] of tasks.entries()) {
    try {
      await task.run((id, message) => {
        failed[id] = message;
      });
    } catch (error) {
      const message = messageOf(error);
      for (const id of task.ids) failed[id] ??= message;
    }
    onProgress?.(index + 1, { ...failed });
  }
  return failed;
}

const EXCERPT = 140;

/**
 * Two long texts cut to where they differ, so a fixed typo in a passage shows
 * as the sentence around it rather than the whole passage twice.
 */
export function differingExcerpt(before: string, after: string): { before: string; after: string } {
  if (before === after) return { before, after };
  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) start += 1;
  let end = 0;
  while (
    end < before.length - start &&
    end < after.length - start &&
    before[before.length - 1 - end] === after[after.length - 1 - end]
  ) {
    end += 1;
  }
  // A little context on each side, starting at a word.
  const near = Math.max(0, start - 30);
  const from = near === 0 ? 0 : before.lastIndexOf(" ", near) + 1;
  const cut = (text: string) => {
    const to = Math.min(text.length, text.length - end + 30);
    const slice = text.slice(from, to);
    const body = slice.length > EXCERPT ? slice.slice(0, EXCERPT) : slice;
    return `${from > 0 ? "…" : ""}${body}${from + body.length < text.length ? "…" : ""}`;
  };
  return { before: cut(before), after: cut(after) };
}

/** How a question's answer key reads, injected so this stays free of components. */
export type DescribeAnswer = (node: ExerciseNode) => string;

/** What switching a saved question's type does; plain, because it cannot be undone after saving. */
export function typeRisk(t: Translate, runsPossible: boolean): string {
  const cleared = t("exercise.import.editorChanges.typeCleared", "The answer is cleared; set it again before saving.");
  return runsPossible
    ? `${cleared} ${t(
        "exercise.import.editorChanges.typeRuns",
        "Students have already answered this question as the old type. Their saved answers do not fit the new type, so they may show wrongly in reviews and regrades.",
      )}`
    : cleared;
}

/**
 * The rows for one edited question, one per field that moved (wording,
 * answer, marks…), each before → after. A question whose stored shape moved
 * without any named field gets one "changed" row, so it is never left out.
 */
export function questionChanges(
  {
    stored,
    edited,
    layout,
    id,
    group,
    label,
    describeAnswer,
    risk,
    blocked,
    runsPossible = false,
  }: {
    stored: ExerciseNode;
    edited: ExerciseNode;
    layout: CollectionLayout | null;
    id: string;
    group: string;
    /** "Question 3". */
    label: string;
    describeAnswer: DescribeAnswer;
    /** A field's risk (an answer or marks change on a paper already sat). */
    risk?: (field: LibraryQuestionField) => string | null;
    /** The host's own blocker; left out, the library page's rules apply. */
    blocked?: string | null;
    /** A test that uses the question has been run, or may have been. */
    runsPossible?: boolean;
  },
  t: Translate,
): EditorChange[] {
  const edit = libraryQuestionEdit(stored, edited, layout, t);
  const cleared = t("exercise.import.editorChanges.empty", "(empty)");
  const text = (value: string | null | undefined) => value?.trim() || cleared;
  const fields: EditorChange[] = edit.fields.map((field) => {
    const row = (name: string, before: string | null, after: string | null): EditorChange => ({
      id: `${id}:${field}`,
      group,
      label: `${label} · ${name}`,
      before,
      after,
      risk: field === "type" ? typeRisk(t, runsPossible) : (risk?.(field) ?? null),
    });
    switch (field) {
      case "type":
        return row(
          t("exercise.import.editorChanges.type", "Type"),
          valueLabel(t, QUESTION_TYPE_LABELS[stored.type] ?? stored.type),
          valueLabel(t, QUESTION_TYPE_LABELS[edited.type] ?? edited.type),
        );
      case "skill":
        return row(
          t("exercise.import.editorChanges.skill", "Skill"),
          valueLabel(t, SKILL_LABELS[stored.skillTag] ?? stored.skillTag),
          valueLabel(t, SKILL_LABELS[edited.skillTag] ?? edited.skillTag),
        );
      case "points":
        return row(t("exercise.import.editorChanges.points", "Marks"), String(stored.points ?? 0), String(edited.points ?? 0));
      case "title":
        return row(t("exercise.import.editorChanges.title", "Title"), text(stored.title), text(edited.title));
      case "instruction":
        return row(t("exercise.import.editorChanges.instruction", "Instruction"), text(stored.instruction), text(edited.instruction));
      case "question": {
        const before = questionSummary(stored.type, stored.content as Record<string, unknown>);
        const after = questionSummary(edited.type, edited.content as Record<string, unknown>);
        // The wording is the same, so it was the options, a picture or the layout.
        if (before === after) {
          return row(t("exercise.import.editorChanges.question", "Question"), null, t("exercise.import.editorChanges.optionsChanged", "Options or other content changed"));
        }
        const excerpt = differingExcerpt(before, after);
        return row(t("exercise.import.editorChanges.question", "Question"), text(excerpt.before), text(excerpt.after));
      }
      case "explanation": {
        const of = (node: ExerciseNode) => ("explanation" in node.content ? node.content.explanation : null);
        return row(t("exercise.import.editorChanges.explanation", "Explanation"), text(of(stored)), text(of(edited)));
      }
      case "answer":
        return row(t("exercise.import.editorChanges.answer", "Answer"), describeAnswer(stored), describeAnswer(edited));
    }
  });
  const rows = fields.length
    ? fields
    : [{ id: `${id}:changed`, group, label, before: null, after: t("exercise.import.editorChanges.changed", "Changed") }];
  // One blocker per question is enough to say what to fix.
  const blocker = blocked === undefined ? edit.blocked : blocked;
  if (blocker) rows[0] = { ...rows[0], blocked: blocker };
  return rows;
}
