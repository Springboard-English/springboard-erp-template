import type { ExerciseNode } from "../index";

// A paper's answer key typed or pasted in one go ("1 A, 2 C, 3 sweeten"), for
// an import whose paper printed no key: without it every question is answered
// by hand, one at a time.

/** One "number answer" pair, in the order it was written. */
export interface QuickKeyEntry {
  number: number;
  answer: string;
}

/** What a key filled in: the changed questions by id, and the numbers it couldn't use. */
export interface QuickKeyResult {
  updates: Map<string, ExerciseNode>;
  unmatched: number[];
}

// "12. B", "12) B", "12 - B", "12:B", "12 B" — up to the next comma, semicolon,
// line break, or the next number that starts a pair.
const PAIR = /(\d+)\s*[.):\-–]?\s*([^\d,;\n]+?)\s*(?=[,;\n]|\s+\d+\s*[.):\-–]?\s*[^\d\s,;]|$)/g;

/** The pairs in a pasted key. Text that isn't a numbered answer is skipped. */
export function parseQuickKey(text: string): QuickKeyEntry[] {
  const entries: QuickKeyEntry[] = [];
  for (const match of text.matchAll(PAIR)) {
    const answer = match[2].trim();
    if (answer) entries.push({ number: Number(match[1]), answer });
  }
  return entries;
}

// The letters a question's options print as: their ids when those are the
// letters (A, E, K…), else A, B, C in order. The template's `optionLetters`
// rule, which its /exercise entry doesn't export.
function letters(options: Array<{ id: string }>): string[] {
  const ids = options.map((option) => option.id.trim().toUpperCase());
  const printed = ids.every((id) => /^[A-Z]$/.test(id)) && new Set(ids).size === ids.length;
  return printed ? ids : options.map((_, index) => String.fromCharCode(65 + index));
}

const TFNG: Record<string, "true" | "false" | "not-given"> = {
  t: "true",
  true: "true",
  yes: "true",
  y: "true",
  f: "false",
  false: "false",
  no: "false",
  n: "false",
  ng: "not-given",
  "not given": "not-given",
  "not-given": "not-given",
};

/** One question with this answer set, or null when the answer can't be its key. */
function keyed(node: ExerciseNode, answer: string): ExerciseNode | null {
  switch (node.type) {
    case "mcq": {
      const options = node.content.options;
      const byLetter = letters(options).indexOf(answer.toUpperCase());
      const index = byLetter >= 0 ? byLetter : options.findIndex((option) => option.label.trim().toLowerCase() === answer.toLowerCase());
      return index >= 0 ? { ...node, content: { ...node.content, correct_option_id: options[index].id } } : null;
    }
    case "true-false-not-given": {
      const value = TFNG[answer.toLowerCase().replace(/\s+/g, " ")];
      return value ? { ...node, content: { ...node.content, answer: value } } : null;
    }
    case "gap-filling":
    case "short-answer":
    case "rewriting": {
      // "colour / color" lists the accepted spellings.
      const accepted = answer.split("/").map((part) => part.trim()).filter(Boolean);
      return accepted.length ? ({ ...node, content: { ...node.content, accepted_answers: accepted } } as ExerciseNode) : null;
    }
    default:
      return null;
  }
}

/**
 * Apply a key to the questions, numbered 1.. in the order given (the review's
 * own numbering). A number with no question, or an answer that doesn't fit its
 * question, is reported rather than guessed at.
 */
export function applyQuickKey(nodes: ExerciseNode[], entries: QuickKeyEntry[]): QuickKeyResult {
  const updates = new Map<string, ExerciseNode>();
  const unmatched: number[] = [];
  for (const { number, answer } of entries) {
    const node = nodes[number - 1];
    const next = node ? keyed(updates.get(node.id) ?? node, answer) : null;
    if (node && next) updates.set(node.id, next);
    else unmatched.push(number);
  }
  return { updates, unmatched };
}
