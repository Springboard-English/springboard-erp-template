/**
 * A released answer key, in words, for the student's own result.
 *
 * The student's nodes are the student-safe session exercises and carry no key;
 * when a run releases it (api `scripts/060` — only once the run has ENDED), the
 * key rides the gated result item instead. This folds it into a COPY of the
 * node the way the teacher's views do (`mergeAnswerKey`) and prints it with the
 * teacher's own `formatAnswerKey`, so both screens name the right answer in the
 * same words.
 *
 * It never hands the key to a renderer — the runner's components are the exam
 * screen, and the key stays one table cell away from them (see CLAUDE.md, "The
 * renderers never reveal the answer").
 */

import { mergeAnswerKey } from "./api";
import { formatAnswerKey, type FormattedAnswer } from "../lib/attempt-answer";
import { exerciseNodeSchema, type ExerciseNode } from "../lib/exercises";

const NONE: FormattedAnswer = { kind: "none" };

export function releasedAnswerKey(
  node: ExerciseNode,
  answerKey: Record<string, unknown> | null | undefined,
): FormattedAnswer {
  if (!answerKey) return NONE;
  const content = mergeAnswerKey(
    node.type,
    node.content as Record<string, unknown>,
    answerKey,
  );
  // Parsed, not cast: a key whose shape doesn't fit the type must print
  // nothing rather than be formatted down a branch that doesn't apply.
  const parsed = exerciseNodeSchema.safeParse({ ...node, content });
  return parsed.success ? formatAnswerKey(parsed.data) : NONE;
}
