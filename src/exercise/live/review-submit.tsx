import { ReviewChecklist } from "../runner/review-checklist";
import { type ExerciseAnswer, type SpringboardTest } from "../lib/exercises";
import { useStableI18n } from "./i18n";
import { TOUR_ANCHORS, tourAnchorProps } from "./tour";

// Review-Before-Submit step. Rendered by the runner inside the student shell.
// The Back / Submit controls live in the shell's fixed bottom bar (see the
// runner's footer), so the actions are always reachable without scrolling to the
// end of a long checklist.
export function ReviewSubmit({ test, answers, unansweredCount, onEdit }: {
  test: SpringboardTest;
  answers: Record<string, ExerciseAnswer>;
  unansweredCount: number;
  onEdit: (index: number) => void;
}) {
  const { t } = useStableI18n();
  return (
    <div className="space-y-6">
      <div {...tourAnchorProps(TOUR_ANCHORS.runnerReviewSummary)}>
        <h1 className="text-2xl font-extrabold text-foreground">{t("exercise.live.reviewSubmit.title", "Review your answers")}</h1>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          {unansweredCount === 0
            ? t("exercise.live.reviewSubmit.allAnswered", "Everything is answered — you're ready to submit.")
            : unansweredCount === 1
              ? t("exercise.live.reviewSubmit.needAnswerOne", "1 question still need an answer.")
              : t("exercise.live.reviewSubmit.needAnswerOther", "{n} questions still need an answer.", { n: unansweredCount })}
        </p>
      </div>

      <ReviewChecklist test={test} answers={answers} onEdit={onEdit} />
    </div>
  );
}
