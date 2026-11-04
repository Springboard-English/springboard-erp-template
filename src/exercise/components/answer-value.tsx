import { useI18n } from "../../context/I18nContext";
import { valueLabel } from "../i18n";
import type { FormattedAnswer } from "../lib/attempt-answer";

// A formatted answer, printed. Shared by the teacher's attempt screen and the
// student's own review, so "what was put for question 7" reads the same to
// both.
//
// This is not a renderer and reveals nothing by itself: it prints whatever
// `formatAnswer` / `formatAnswerKey` handed it. The student-facing caller hands
// it their own answer, and the correct one only when the run released it
// (`releasedAnswerKey`).
export function AnswerValue({ formatted }: { formatted: FormattedAnswer }) {
  const { t } = useI18n();
  if (formatted.kind === "none") {
    return <span className="font-semibold text-muted-foreground">—</span>;
  }
  if (formatted.kind === "text") {
    return <span className="font-bold text-foreground">{formatted.value}</span>;
  }
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-0.5">
      {formatted.value.map((part) => (
        <span key={part.label}>
          <span className="text-muted-foreground">{valueLabel(t, part.label)}: </span>
          <span className="font-bold text-foreground">{part.value}</span>
        </span>
      ))}
    </span>
  );
}

/** Last resort for a question whose content doesn't match its declared type. */
export function rawAnswer(answer: unknown): FormattedAnswer {
  if (answer === null || answer === undefined) return { kind: "none" };
  if (typeof answer === "string") {
    return answer.trim() ? { kind: "text", value: answer.trim() } : { kind: "none" };
  }
  return { kind: "text", value: JSON.stringify(answer) };
}
