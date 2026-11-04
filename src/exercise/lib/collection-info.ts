import type { CollectionInfo, CollectionLayout } from "../types";
import { valueLabel, type Translate } from "../i18n";
import {
  questionTypeLabel,
  sectionTaskLabel,
  taskRequiredType,
  type SectionTask,
} from "./section-type";

// A section's `info` — its task layout and its shared word box — edited as ONE
// value, because that is how the API stores it and how `PATCH
// /v2/collections/{id}` takes it: the blob is REPLACED, not merged.
//
// So every change rebuilds the whole object from the one being edited. Keys this
// build doesn't know are carried through untouched (a replace that dropped them
// would delete them), and an emptied field REMOVES its key rather than leaving
// `""` or `[]` behind — every reader checks for the key's absence.

type InfoChange = { layout?: CollectionLayout | null; word_bank?: string[] };

function rebuild(
  info: CollectionInfo | null | undefined,
  change: InfoChange,
): CollectionInfo | null {
  const next: Record<string, unknown> = { ...(info ?? {}) };
  if ("layout" in change) {
    if (change.layout) next.layout = change.layout;
    else delete next.layout;
  }
  if ("word_bank" in change) {
    if (change.word_bank?.length) next.word_bank = change.word_bank;
    else delete next.word_bank;
  }
  return Object.keys(next).length ? (next as CollectionInfo) : null;
}

/** `info` with its task set, or cleared to a plain run of questions. */
export function withLayout(
  info: CollectionInfo | null | undefined,
  layout: CollectionLayout | null,
): CollectionInfo | null {
  return rebuild(info, { layout });
}

/** `info` with its word box replaced; an empty box removes it. */
export function withWordBank(
  info: CollectionInfo | null | undefined,
  words: string[],
): CollectionInfo | null {
  return rebuild(info, { word_bank: words });
}

/**
 * The bank with what was typed or pasted appended, in order. Commas and line
 * breaks separate words (a paper's box pastes as either); spaces don't, since
 * an entry can be a phrase. A word already in the bank is not added twice.
 */
export function addBankWords(words: string[], text: string): string[] {
  const next = [...words];
  for (const word of text.split(/[,\n]/).map((part) => part.trim())) {
    if (word && !next.includes(word)) next.push(word);
  }
  return next;
}

function canonical(info: CollectionInfo | null | undefined): string {
  const tidy = rebuild(info, {
    layout: info?.layout ?? null,
    word_bank: info?.word_bank ?? [],
  });
  if (!tidy) return "null";
  const record = tidy as Record<string, unknown>;
  return JSON.stringify(
    Object.fromEntries(Object.keys(record).sort().map((key) => [key, record[key]])),
  );
}

/** Whether two `info` values say the same thing (null and `{}` do). */
export function sameCollectionInfo(
  a: CollectionInfo | null | undefined,
  b: CollectionInfo | null | undefined,
): boolean {
  return canonical(a) === canonical(b);
}

/** A section's task and word box in a few words, for the pending-changes list. */
export function describeCollectionInfo(info: CollectionInfo | null | undefined, t: Translate): string {
  const task = info?.layout
    ? valueLabel(t, questionTypeLabel("mcq", info.layout))
    : t("exercise.collection.plainRun", "Plain run of questions");
  const words = info?.word_bank?.length ?? 0;
  if (!words) return task;
  return words === 1
    ? t("exercise.collection.taskWordOne", "{task} · 1 word", { task })
    : t("exercise.collection.taskWordOther", "{task} · {n} words", { task, n: words });
}

/** Whether a word box belongs on screen for this section at all. */
export function showsWordBank(info: CollectionInfo | null | undefined): boolean {
  return (
    info?.layout === "word-formation" ||
    info?.layout === "banked-cloze" ||
    Boolean(info?.word_bank?.length)
  );
}

/**
 * The bank a word-formation blank's root is picked from, or null when its
 * section has none. A banked cloze places the bank word unchanged, and a
 * per-blank word is printed beside its blank, so neither has a root to pick.
 */
export function rootBank(info: CollectionInfo | null | undefined): string[] | null {
  return info?.layout === "word-formation" && info.word_bank?.length ? info.word_bank : null;
}

/**
 * Why a section of these question types would NOT be drawn as `layout`, or null.
 *
 * Every layout is defined over one base type, and `pageLayout` draws the task
 * only when every question on the page is that type — one True/False in a gapped
 * text silently turns the whole section back into a stack of cards. Setting a
 * layout on a saved section is exactly where that mismatch gets introduced, so it
 * is said at the moment of choosing rather than discovered by a student.
 */
export function layoutMismatch(
  task: SectionTask | null | undefined,
  types: string[],
  t: Translate,
): string | null {
  const required = taskRequiredType(task);
  if (!task || !required || types.length === 0) return null;
  const off = types.filter((type) => type !== required).length;
  if (!off) return null;
  const values = {
    task: valueLabel(t, sectionTaskLabel(task)),
    type: valueLabel(t, questionTypeLabel(required)),
    n: off,
  };
  return off === 1
    ? t(
        "exercise.collection.layoutMismatchOne",
        "A {task} section is drawn only when every question is {type} — 1 of these isn’t, so students would see plain question cards instead.",
        values,
      )
    : t(
        "exercise.collection.layoutMismatchOther",
        "A {task} section is drawn only when every question is {type} — {n} of these aren’t, so students would see plain question cards instead.",
        values,
      );
}
