import { answerSpan, spanText } from "./error-correction";
import { markFromParagraph } from "./error-hunt";
import { answerRecord, rootedAnswer, type ExerciseAnswer, type ExerciseNode } from "./exercises";

// The answer key read as a student's answer, and back.
//
// Edit mode draws every question through the student's own renderer. The
// renderer shows `answerFromKey(node)` as if a student had answered, and a
// teacher answering it writes the key with `keyFromAnswer`: picking an option
// marks it correct, typing in a blank sets the first accepted answer, and
// picking a hunt's words plus typing the fix sets the mistake.

/** What a student would have to answer for this question to be right. */
export function answerFromKey(node: ExerciseNode): ExerciseAnswer {
  switch (node.type) {
    case "mcq":
    case "reading-full-test":
      return node.content.correct_option_id || null;
    case "gap-filling":
    case "rewriting": {
      const word = node.content.accepted_answers?.[0] ?? "";
      return node.content.root ? { root: node.content.root, word } : word || null;
    }
    case "short-answer":
      return node.content.accepted_answers?.[0] ?? null;
    case "true-false-not-given":
      return node.content.answer ?? null;
    case "error-correction": {
      const { error, error_offset, accepted_answers } = node.content;
      const record: Record<string, string> = {};
      if (error && error_offset !== undefined) {
        record.pick = String(error_offset);
        record.pick_end = String(error_offset + error.length);
      }
      if (accepted_answers?.[0]) record.fix = accepted_answers[0];
      return Object.keys(record).length ? record : null;
    }
    case "essay":
    case "speaking":
      return null;
  }
}

/** The first accepted answer replaced, the alternates kept; blank clears it. */
function withFirstAnswer(current: string[] | undefined, first: string): string[] | undefined {
  const rest = (current ?? []).slice(1);
  if (!first) return rest.length ? rest : undefined;
  return [first, ...rest];
}

/**
 * The question with its key set from an answer given on its renderer.
 *
 * `huntText` is the joined passage when the question is a mistake in a section
 * hunt: the picked offsets are into it, and the stored sentence is the one the
 * pick sits in.
 */
export function keyFromAnswer(
  node: ExerciseNode,
  answer: ExerciseAnswer,
  huntText: string | null = null,
): ExerciseNode {
  switch (node.type) {
    case "mcq":
    case "reading-full-test": {
      const id = typeof answer === "string" ? answer : "";
      return { ...node, content: { ...node.content, correct_option_id: id } } as ExerciseNode;
    }
    case "gap-filling":
    case "rewriting": {
      const { root, word } = rootedAnswer(answer ?? "");
      const content = { ...node.content, accepted_answers: withFirstAnswer(node.content.accepted_answers, word) };
      if (answer && typeof answer === "object") (content as { root?: string }).root = root || undefined;
      return { ...node, content } as ExerciseNode;
    }
    case "short-answer": {
      const word = typeof answer === "string" ? answer : "";
      return {
        ...node,
        content: { ...node.content, accepted_answers: withFirstAnswer(node.content.accepted_answers, word) },
      } as ExerciseNode;
    }
    case "true-false-not-given":
      return {
        ...node,
        content: { ...node.content, answer: typeof answer === "string" && answer ? answer : undefined },
      } as ExerciseNode;
    case "error-correction": {
      const record = answerRecord(answer);
      const text = huntText ?? node.content.sentence;
      const span = answerSpan(text, record);
      const content = {
        ...node.content,
        accepted_answers: withFirstAnswer(node.content.accepted_answers, record.fix ?? ""),
        error: span ? spanText(text, span) : undefined,
        error_offset: span ? span.start : undefined,
      };
      // A hunt stores the sentence the mistake sits in, measured in the passage.
      if (span && huntText) {
        const mark = markFromParagraph(huntText, span);
        if (mark) content.sentence = mark.sentence;
      }
      return { ...node, content } as ExerciseNode;
    }
    case "essay":
    case "speaking":
      return node;
  }
}
