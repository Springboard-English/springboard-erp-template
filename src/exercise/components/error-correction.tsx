import { Input } from "../../components/ui/input";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import {
  answerSpan,
  markSpan,
  pickMatchesMark,
  spanAnswerFields,
  toggleSpanWord,
  type WordSpan,
} from "../lib/error-correction";
import { answerRecord, type ExerciseNode } from "../lib/exercises";
import { EXAM_FIELD_PROPS } from "../lib/exam-field";

import { ClickableSentence } from "./clickable-sentence";
import { Frame, type SubProps } from "./frame";

// Error identification & correction. The student selects the wrong word or
// words in an unmarked sentence (identification) and types the fix
// (correction). The answer is `{ pick, pick_end, fix }` — the selection's start
// and end offsets, stored as strings so they fit ExerciseAnswer's
// Record<string, string>. Grading (server and the mirrored `isCorrectAnswer`)
// compares them to the marked span; nothing here matches before/after context.
type ErrorNode = Extract<ExerciseNode, { type: "error-correction" }>;

export function ErrorCorrection({ node, mode, value, onChange }: SubProps<ErrorNode>) {
  const { t } = useI18n();
  const sentence = node.content.sentence;
  const record = answerRecord(value);
  const picked = answerSpan(sentence, record);
  const fix = record.fix ?? "";

  // Present only when the reader is allowed the key (teacher / gated result).
  const { error, error_offset, accepted_answers, case_sensitive } = node.content;
  const marked = markSpan(sentence, error_offset, error);
  const norm = (v: string) => (case_sensitive ? v.trim() : v.trim().toLowerCase());
  const pickOk = pickMatchesMark(record, error_offset, error);
  const fixOk =
    accepted_answers !== undefined && accepted_answers.some((a) => norm(a) === norm(fix));

  const emit = (next: { pick?: WordSpan | null; fix?: string }) => {
    const nextPick = next.pick !== undefined ? next.pick : picked;
    const nextFix = next.fix !== undefined ? next.fix : fix;
    const merged: Record<string, string> = spanAnswerFields(nextPick);
    if (nextFix) merged.fix = nextFix;
    onChange?.(merged);
  };

  const showResult = mode === "result" && marked !== null;

  return (
    <Frame node={node} mode={mode}>
      <div className="space-y-5">
        <ClickableSentence
          sentence={sentence}
          selected={mode === "result" ? null : picked}
          disabled={mode !== "practice"}
          onSelect={(offset) => emit({ pick: toggleSpanWord(sentence, picked, offset) })}
          // Green marks what was actually wrong; red marks a wrong pick.
          runs={
            showResult && marked
              ? [
                  {
                    span: marked,
                    className: "bg-success-bg font-extrabold text-mint-700",
                  },
                  ...(picked && !pickOk
                    ? [{ span: picked, className: "bg-error-bg text-error line-through decoration-2" }]
                    : []),
                ]
              : undefined
          }
        />
        {mode === "practice" ? (
          <p className="text-xs font-bold text-muted-foreground">
            {t("exercise.renderer.mistakeHint", "A mistake can be more than one word — click the next word to add it.")}
          </p>
        ) : null}

        <div className="space-y-1.5">
          <p className="text-xs font-extrabold text-muted-foreground">
            {t("exercise.renderer.yourCorrection", "Your correction")}
          </p>
          <Input
            {...EXAM_FIELD_PROPS}
            value={fix}
            placeholder={node.content.placeholder ?? t("exercise.renderer.typeCorrection", "Type the correction")}
            disabled={mode !== "practice"}
            onChange={(event) => emit({ fix: event.target.value })}
            className={cn(
              "max-w-xs font-bold",
              showResult && (fixOk ? "border-success bg-success-bg text-mint-700" : "border-error bg-error-bg text-error"),
            )}
          />
        </div>

        {showResult ? (
          <div className="space-y-1 border-t pt-4 text-sm font-extrabold">
            <p className={pickOk ? "text-mint-700" : "text-error"}>
              {pickOk
                ? t("exercise.renderer.rightWords", "You identified the right words.")
                : t("exercise.renderer.errorWas", "The error was “{error}”.", { error: error ?? "" })}
            </p>
            <p className={fixOk ? "text-mint-700" : "text-error"}>
              {fixOk
                ? t("exercise.renderer.correctionAccepted", "Your correction is accepted.")
                : t("exercise.renderer.expected", "Expected: {answer}", { answer: accepted_answers?.[0] ?? "" })}
            </p>
          </div>
        ) : null}
      </div>
    </Frame>
  );
}
