import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { formatMarks, type GradedResult } from "../lib/grading";

// The score header for the Correction / Score screen.
export function ScoreSummary({ result, studentName }: { result: GradedResult; studentName?: string }) {
  const { t } = useI18n();
  const tone = result.percentage >= 70 ? "mint" : result.percentage >= 40 ? "butter" : "rose";
  const ring: Record<string, string> = { mint: "text-mint-700 bg-mint-bg", butter: "text-butter-700 bg-butter-bg", rose: "text-rose-700 bg-rose-100" };
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border bg-card p-8 text-center shadow-sm">
      <span className={cn("grid size-24 place-items-center rounded-full text-3xl font-extrabold", ring[tone])}>{result.percentage}%</span>
      <div>
        <p className="text-lg font-extrabold text-foreground">{studentName ? t("exercise.score.niceWorkName", "Nice work, {name}!", { name: studentName }) : t("exercise.score.niceWork", "Nice work!")}</p>
        <p className="text-sm font-semibold text-muted-foreground">{t("exercise.score.summary", "{correct} of {gradable} auto-graded correct · {points}/{max} points", { correct: result.correct, gradable: result.gradable, points: formatMarks(result.points), max: formatMarks(result.maxPoints) })}</p>
        {/* Said outright rather than left to be inferred from a number that
            later changes. A student who wrote an essay has not finished being
            marked, and the score above is only of what has been. */}
        {result.pending > 0 ? (
          <p className="mt-1 text-sm font-bold text-lav-700">
            {result.pending === 1
              ? t("exercise.score.pendingOne", "Not final — 1 written answer is still with your teacher.")
              : t("exercise.score.pendingOther", "Not final — {n} written answers are still with your teacher.", { n: result.pending })}
          </p>
        ) : null}
      </div>
    </div>
  );
}
