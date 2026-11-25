import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

import { StudentPageShell } from "./student-page-shell";
import { Button } from "../../exports";
import { useStableI18n } from "./i18n";
import { useHomeHref } from "./config";
import { TOUR_ANCHORS, tourAnchorProps } from "./tour";

// Submission Confirmation: the attempt was received; explains when scores appear.
// `children` sits under the card — the runner puts the student's answers there
// (AnswerReceipt) as their record of having sat the paper.
export function SubmissionConfirmation({
  canSeeResults,
  onSeeResults,
  retake,
  children,
}: {
  canSeeResults: boolean;
  onSeeResults: () => void;
  /**
   * "Take it again", when another attempt may follow. A slot rather than a flag
   * so the runner owns the join it swaps; this screen only places it.
   */
  retake?: ReactNode;
  children?: ReactNode;
}) {
  const { t } = useStableI18n();
  const homeHref = useHomeHref();
  return (
    <StudentPageShell>
      <div
        {...tourAnchorProps(TOUR_ANCHORS.runnerSubmitted)}
        className="flex flex-col items-center gap-5 rounded-3xl border bg-card p-10 text-center shadow-sm"
      >
        <span className="grid size-16 place-items-center rounded-full bg-mint-bg text-mint-700"><CheckCircle2 className="springboard-pop size-8" /></span>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{t("exercise.live.submitted.title", "Answers submitted!")}</h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">{canSeeResults ? t("exercise.live.submitted.resultsReady", "Your corrected answers are ready to view.") : t("exercise.live.submitted.scoresReleased", "Scores are released by whoever set this test.")}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {canSeeResults ? (
            <Button size="lg" onClick={onSeeResults}>{t("exercise.live.submitted.seeResults", "See My Results")}</Button>
          ) : homeHref ? (
            <Button asChild size="lg" variant="outline"><Link to={homeHref}>{t("exercise.live.submitted.done", "Done")}</Link></Button>
          ) : null}
          {retake}
        </div>
      </div>
      {children ? <div className="mt-6">{children}</div> : null}
    </StudentPageShell>
  );
}
