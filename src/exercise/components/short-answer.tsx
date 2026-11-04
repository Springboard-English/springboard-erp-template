import { Input } from "../../components/ui/input";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { ExerciseNode } from "../lib/exercises";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";
import { EXAM_FIELD_PROPS } from "../lib/exam-field";

import { Frame, type SubProps } from "./frame";

// A short answer: the question, then a place to write it.
//
// Deliberately shaped like `mcq-choice-group` rather than `inline-blank` — this
// IS an MCQ with its options swapped for an input. The question is asked in
// full, on its own line, and the answer goes underneath.
//
// Not `InlineBlank`, which embeds the input INSIDE the sentence: with no blank
// to sit either side of, the box would land wherever an invented
// `before`/`after` split put it — "Why did the company ▢ close?".
type ShortAnswerNode = Extract<ExerciseNode, { type: "short-answer" }>;

export function ShortAnswer({ node, mode, value, onChange }: SubProps<ShortAnswerNode>) {
  const { t } = useI18n();
  const answer = typeof value === "string" ? value : "";
  // Absent whenever the reader isn't allowed the key (the student-safe payload
  // drops it), so this can't be indexed blind.
  const correct = node.content.accepted_answers?.[0];
  const isCorrect =
    mode === "result" &&
    correct !== undefined &&
    answer.trim().toLowerCase() === correct.toLowerCase();

  return (
    <Frame node={node} mode={mode}>
      <p
        className={cn(
          promptTextClass(promptDensity(node.content.prompt)),
          "text-foreground",
        )}
      >
        {node.content.prompt}
      </p>
      {/* Full width, because the answer is a phrase rather than one word — an
          input sized to its content would start narrower than anything it
          could hold. */}
      <Input
        {...EXAM_FIELD_PROPS}
        value={answer}
        placeholder={node.content.placeholder ?? t("exercise.renderer.typeAnswer", "Type your answer")}
        disabled={mode === "result"}
        onChange={(event) => onChange?.(event.target.value)}
        className={cn(
          "mt-4 h-11 w-full rounded-sm border-2 bg-card px-3 text-[15px] font-bold",
          mode === "result" &&
            (isCorrect
              ? "border-success bg-success-bg text-mint-700"
              : "border-error bg-error-bg text-error"),
        )}
      />
      {mode === "result" && correct !== undefined ? (
        <p
          className={cn(
            "mt-4 text-sm font-extrabold",
            isCorrect ? "text-mint-700" : "text-error",
          )}
        >
          {isCorrect ? t("exercise.renderer.correctAnswer", "Correct answer") : t("exercise.renderer.expected", "Expected: {answer}", { answer: correct })}
        </p>
      ) : null}
    </Frame>
  );
}
