import type { CollectionLayout } from "../types";
import { QUESTION_TYPE_LABELS, type QuestionType } from "./exercises";

// What a question actually IS, once the section it sits in is taken into account.
//
// Six of the paper's most distinctive tasks are not `QuestionType` values at all
// — a gapped text, a multiple matching, a "choose TWO", a jumbled paragraph, a
// guided cloze and a word formation are all SECTIONS of plain `mcq` or
// `gap-filling` questions carrying a `layout`. That is a deliberate and good
// data model: it buys per-question marks, one grader and no new content shape
// (see CLAUDE.md, "One passage, many questions is a Collection, not a type").
//
// But a surface that labels a question by `node.type` alone calls all six
// "Multiple choice". In the AI-extract review that is actively misleading: the
// teacher is being asked to verify that the extractor read the paper correctly,
// and "Multiple choice" for a gapped text reads as a mis-extraction of a task
// that was in fact read perfectly — and hides a real mis-extraction, since a
// gapped text wrongly detected as plain MCQs looks identical.
//
// The type is still the type. This is a LABEL: the pair (type, layout) named the
// way the paper names it.

/** The label for one layout, when it is set. */
const LAYOUT_LABELS: Record<CollectionLayout, string> = {
  cloze: "Open cloze / summary completion",
  "banked-cloze": "Cloze from a word bank",
  "guided-cloze": "Guided cloze",
  "word-formation": "Word formation",
  "gapped-text": "Gapped text",
  "jumbled-paragraph": "Jumbled paragraphs",
  "multi-select": "Choose several",
  "multiple-matching": "Multiple matching",
  "topic-pool": "Speaking topic pool",
};

/** Every task a section can declare, in the order a picker offers them. */
export const SECTION_LAYOUTS = Object.keys(LAYOUT_LABELS) as CollectionLayout[];

/**
 * An error hunt over a passage ("the passage contains FIVE mistakes…") is a task
 * the API models WITHOUT a layout: a section with a passage whose questions are
 * all error-correction (extraction.py's TASKS, "`layout` stays empty"). So it is
 * never stored — a picker offers it, and it is read back from the questions.
 */
export const ERROR_HUNT = "error-hunt";
export type SectionTask = CollectionLayout | typeof ERROR_HUNT;
export const ERROR_HUNT_LABEL = "Error correction in a passage";

/** The section's task: its layout, else a hunt when every question is one. */
export function sectionTask(
  layout: CollectionLayout | null | undefined,
  types: string[],
): SectionTask | null {
  if (layout) return layout;
  return types.length > 0 && types.every((type) => type === "error-correction")
    ? ERROR_HUNT
    : null;
}

/** A task's name as a teacher reads it. */
export function sectionTaskLabel(task: SectionTask): string {
  return task === ERROR_HUNT ? ERROR_HUNT_LABEL : LAYOUT_LABELS[task];
}

/** Whether the task's passage carries `{gap}` blanks the answers are placed in. */
export function usesBlanks(task: SectionTask | null | undefined): boolean {
  return (
    task === "cloze" ||
    task === "banked-cloze" ||
    task === "word-formation" ||
    task === "guided-cloze" ||
    task === "gapped-text"
  );
}

/** The question type a task pins, as `layoutRequiredType`, hunt included. */
export function taskRequiredType(task: SectionTask | null | undefined): QuestionType | null {
  return task === ERROR_HUNT ? "error-correction" : layoutRequiredType(task);
}

/**
 * How a question in this section should be named.
 *
 * The layout wins when there is one, because it is the more specific truth: a
 * gapped text IS a run of mcq, but "Gapped text" is what the paper calls it and
 * what the teacher is checking. Falls back to the plain type label, so a section
 * with no layout — and every standalone question — reads as its plain type.
 */
export function questionTypeLabel(
  type: QuestionType | string,
  layout?: CollectionLayout | null,
): string {
  if (layout && layout in LAYOUT_LABELS) {
    return LAYOUT_LABELS[layout as CollectionLayout];
  }
  return QUESTION_TYPE_LABELS[type as QuestionType] ?? type;
}

/**
 * True when the questions of this section share ONE option pool.
 *
 * Gapped text, jumbled paragraphs, multiple matching and "choose several" each
 * print one lettered list that every question in the run draws from — so a
 * question ADDED to such a section has to be given the same options as its
 * siblings, or it is an MCQ with no options in the middle of a matching task and
 * the section stops rendering as one. A guided cloze is the explicit exception:
 * its blanks each print their own options (see the section prompt in the API's
 * extraction.py), so copying one question's options onto another would be wrong.
 */
export function sharesOnePool(layout?: CollectionLayout | null): boolean {
  return (
    layout === "gapped-text" ||
    layout === "jumbled-paragraph" ||
    layout === "multiple-matching" ||
    layout === "multi-select"
  );
}

/**
 * The question type a section's layout requires, or null when it doesn't care.
 *
 * Every layout is defined over exactly one base type — the mcq ones, and the
 * three gap-filling ones (cloze, banked-cloze, word-formation) — so a question
 * added to a laid-out section has its type decided for it. Offering a free
 * choice there would let a teacher put a True/False question inside a gapped
 * text, which the runner cannot draw: `pageLayout` requires every node in the
 * page to be mcq before it will use the layout at all, so ONE wrong type
 * silently degrades the whole section back to a stack of cards.
 *
 * Note `guided-cloze` is the cloze that is NOT gap-filling: its blanks print
 * their own options, so each one is an mcq.
 */
const GAP_LAYOUTS = new Set<CollectionLayout>([
  "cloze",
  "banked-cloze",
  "word-formation",
]);

export function layoutRequiredType(
  layout?: CollectionLayout | null,
): QuestionType | null {
  if (!layout) return null;
  if (layout === "topic-pool") return "speaking";
  return GAP_LAYOUTS.has(layout) ? "gap-filling" : "mcq";
}
