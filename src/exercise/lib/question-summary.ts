import type { Translate } from "../i18n";
import type { QuestionType } from "./exercises";

// What a question says, for lists that have to identify one at a glance.
//
// A question's `title` is almost always empty: extracted questions inherit their
// heading from the part/section they sit in (that is the whole point of
// collections), so a list built on titles would render `Untitled question` on
// every row and a teacher could not tell Q3 from Q4 without opening both. The question's own
// text — its prompt, its sentence, its statement — is the thing that actually
// differs, so that is what the lists show.
//
// Pure and content-shape-driven, so it works off the API DTO's `content` blob
// without needing a parsed `ExerciseNode`: the tables read exercises straight
// from the wire, and a row must still render when a blob is a shape this build
// doesn't know.

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * The question's own text, or "" when its content carries none.
 *
 * Gap-family questions are shown with the blank in place (`before ____ after`),
 * because the blank's position is most of what distinguishes one from the next.
 */
export function questionSummary(
  type: QuestionType | string,
  content: Record<string, unknown> | null | undefined,
): string {
  if (!content) return "";
  switch (type) {
    // Short-answer is NOT here: it carries a `prompt` like an mcq, so it falls
    // through to the default below. Listed here it would read "____" on every row.
    case "gap-filling":
    case "rewriting": {
      const before = text(content.before);
      const after = text(content.after);
      // A rewrite transforms a printed sentence, and that sentence is the
      // question: "He started work at 9 → He has ____ (since)" is answerable,
      // while the frame alone gives a teacher the blank and not what to fill it
      // from. Leads the summary so it survives a line clamp.
      const source = text(content.source_sentence);
      if (!before && !after) return source;
      // The word given is part of what identifies the row: a word-formation run
      // often repeats a frame ("...is at least a ____ feature") and the word is
      // the only thing telling two items apart in a list.
      const given = text(content.given_word);
      const frame = [before, "____", after, given && `(${given})`]
        .filter(Boolean)
        .join(" ");
      return source ? `${source} → ${frame}` : frame;
    }
    case "error-correction":
      return text(content.sentence);
    case "true-false-not-given":
      return text(content.statement);
    default: {
      // mcq, reading-full-test, essay and anything this build hasn't met yet:
      // `prompt` is the field every remaining content shape uses for the ask.
      const prompt = text(content.prompt);
      if (prompt) return prompt;
      // A guided-cloze blank has no prompt — its place in the passage IS the
      // question — so every row of one would read "Untitled question". Its own options
      // are what tell one blank from the next.
      const labels = Array.isArray(content.options)
        ? content.options
            .map((option) => text((option as { label?: unknown } | null)?.label))
            .filter(Boolean)
        : [];
      return labels.length ? `____ (${labels.join(" / ")})` : "";
    }
  }
}

/** The summary, or the question's title, or a last-resort placeholder. */
export function questionLabel(
  type: QuestionType | string,
  content: Record<string, unknown> | null | undefined,
  t: Translate,
  title?: string | null,
): string {
  return questionSummary(type, content) || text(title) || t("exercise.question.untitled", "Untitled question");
}
