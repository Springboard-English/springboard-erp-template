/**
 * What a student actually put, in words — and what the key says, in the same
 * words.
 *
 * The stored answer is ids: `"b"`, or `{pick: "17", fix: "have"}`. Only the
 * node's content knows that `"b"` is "Because the factory had already closed",
 * so a teacher reading the raw value learns nothing. This is the translation,
 * and it is the one genuinely new piece of logic behind the per-student attempt
 * view.
 *
 * Pure and tested for the same reason `answer-key.ts` is: getting it wrong shows
 * a teacher the wrong answer beside a correct tick, which looks exactly like a
 * grading bug and isn't one. It never decides correctness — the server did that,
 * and `AttemptItem.correct` carries the verdict.
 */

import { answerSpan, spanText, wordAt } from "./error-correction";
import {
  answerRecord,
  rootedAnswer,
  type ExerciseAnswer,
  type ExerciseNode,
} from "./exercises";

export type FormattedAnswer =
  /** Nothing to show: unanswered, or a shape this node can't interpret. */
  | { kind: "none" }
  | { kind: "text"; value: string }
  /** Several labelled parts — a `{pick, fix}` correction, or one pick per gap. */
  | { kind: "pairs"; value: Array<{ label: string; value: string }> };

const NONE: FormattedAnswer = { kind: "none" };

function text(value: string | null | undefined): FormattedAnswer {
  const trimmed = (value ?? "").trim();
  return trimmed ? { kind: "text", value: trimmed } : NONE;
}

/** An option's printed label, falling back to its id when the pool is missing. */
function optionLabel(
  options: Array<{ id: string; label: string }> | undefined,
  id: string,
): string {
  return options?.find((option) => option.id === id)?.label ?? id;
}

/**
 * The words an error-correction pick selects — how the pick is stored.
 *
 * The offsets ARE the answer (grading is integer compares, deliberately, so no
 * tokenisation contract is shared between client and server), but offsets are
 * unreadable on a marking screen. Recovering the words is display only. The
 * offsets are into the text the student clicked — a hunt's joined passage, or
 * the question's own sentence — and read against the other they name other
 * words. A pick that lands on no word shows nothing.
 */
function pickedText(text: string, record: Record<string, string>): string | null {
  const span = answerSpan(text, record);
  if (span === null || !wordAt(text, span.start)) return null;
  return spanText(text, span) || null;
}

/**
 * A True/False/Not Given value as the paper prints it.
 *
 * The stored values are `true`, `false` and `not-given` — wire spellings, and
 * the last one reads like a slug on a marking screen and in the CSV. Anything
 * else is passed through as sent: a value this build doesn't know is still
 * what the student put.
 */
export function tfngLabel(value: string): string {
  switch (value) {
    case "true":
      return "True";
    case "false":
      return "False";
    case "not-given":
      return "Not given";
    default:
      return value;
  }
}

export function formatAnswer(
  node: ExerciseNode,
  answer: ExerciseAnswer,
  /** The hunt this question is a mistake of, as `huntParagraph` joins it —
   * null for a question the student saw on its own. */
  huntText: string | null = null,
): FormattedAnswer {
  if (answer === null || answer === undefined) return NONE;

  switch (node.type) {
    case "mcq":
    case "reading-full-test": {
      const { options } = node.content;
      // A merged "choose N" group hands every question the WHOLE selection, so
      // the answer can be a list here even though one question is one mark.
      // Show all of it: what they picked is what they picked, and the server
      // decided which of those picks this question was scored on.
      //
      // LABELLED as the group's picks. Bare, the same "A, C, D" would sit on
      // every row of the group, Correct on one and Incorrect on the next, and
      // read as the grader contradicting itself.
      if (Array.isArray(answer)) {
        const labels = answer.map((id) => optionLabel(options, id));
        return labels.length
          ? { kind: "pairs", value: [{ label: "Picked for the group", value: labels.join(", ") }] }
          : NONE;
      }
      if (typeof answer !== "string") return NONE;
      return text(optionLabel(options, answer));
    }

    case "gap-filling":
    case "rewriting": {
      // A banked word-formation answer is `{ root, word }`, and each half is
      // marked, so a teacher sees both — half-right earns half.
      if (typeof answer === "string") return text(answer);
      const { root, word } = rootedAnswer(answer);
      const parts: Array<{ label: string; value: string }> = [];
      if (root) parts.push({ label: "Root", value: root });
      if (word.trim()) parts.push({ label: "Answer", value: word.trim() });
      return parts.length ? { kind: "pairs", value: parts } : NONE;
    }

    case "short-answer":
    case "essay":
      // Typed answers are shown verbatim — the student's own words are the
      // thing being marked, so nothing is normalised or truncated here.
      return typeof answer === "string" ? text(answer) : NONE;

    case "true-false-not-given":
      return typeof answer === "string" ? text(tfngLabel(answer)) : NONE;

    case "error-correction": {
      // Two parts, and a teacher needs both: which word they blamed, and what
      // they replaced it with. Half-right is a real outcome here (the server
      // awards partial credit), so collapsing them into one string would hide
      // exactly the distinction the marking screen is for.
      const record = answerRecord(answer);
      const parts: Array<{ label: string; value: string }> = [];
      const picked = pickedText(huntText ?? node.content.sentence, record);
      if (picked) parts.push({ label: "Marked", value: picked });
      const fix = (record.fix ?? "").trim();
      if (fix) parts.push({ label: "Corrected to", value: fix });
      return parts.length ? { kind: "pairs", value: parts } : NONE;
    }
  }
}

/**
 * The same, for the correct answer, so both sides of the comparison read alike.
 *
 * Returns `none` for a question with no key — which is a real state, not an
 * error: extraction may return `answer_key: null` for a paper printed without
 * one, and essays carry no key at all (they are human-graded, and nothing marks
 * them yet).
 */
export function formatAnswerKey(node: ExerciseNode): FormattedAnswer {
  switch (node.type) {
    case "mcq":
    case "reading-full-test": {
      const id = node.content.correct_option_id;
      return id ? text(optionLabel(node.content.options, id)) : NONE;
    }

    case "gap-filling":
    case "rewriting":
    case "short-answer": {
      const accepted = node.content.accepted_answers;
      // Every accepted spelling, not just the first: a teacher checking a
      // near-miss needs to see what the grader would have taken.
      const joined = accepted?.length ? accepted.join(" / ") : "";
      const root = "root" in node.content ? node.content.root : undefined;
      if (!root) return joined ? text(joined) : NONE;
      const parts = [{ label: "Root", value: root }];
      if (joined) parts.push({ label: "Answer", value: joined });
      return { kind: "pairs", value: parts };
    }

    case "true-false-not-given":
      return node.content.answer ? text(tfngLabel(node.content.answer)) : NONE;

    case "error-correction": {
      const parts: Array<{ label: string; value: string }> = [];
      if (node.content.error) {
        parts.push({ label: "Marked", value: node.content.error });
      }
      const accepted = node.content.accepted_answers;
      if (accepted?.length) {
        parts.push({ label: "Corrected to", value: accepted.join(" / ") });
      }
      return parts.length ? { kind: "pairs", value: parts } : NONE;
    }

    case "essay":
      // Human-graded: there is no key, and inventing one would be worse than
      // the blank.
      return NONE;
  }
}

/** Flatten either shape to one line, for a table cell or a CSV. */
export function formattedAnswerText(formatted: FormattedAnswer): string {
  if (formatted.kind === "none") return "";
  if (formatted.kind === "text") return formatted.value;
  return formatted.value.map((part) => `${part.label}: ${part.value}`).join(" · ");
}
