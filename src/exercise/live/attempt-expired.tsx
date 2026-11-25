import { Link } from "react-router-dom";
import { TimerOff } from "lucide-react";

import { StudentPageShell } from "./student-page-shell";
import { Button } from "../../exports";
import { useStableI18n } from "./i18n";
import { useHomeHref } from "./config";

// Attempt Expired: THIS person's time on a public self-paced link has run out.
//
// Deliberately not `ChallengeClosed`. A public link never ends, so "the teacher
// has closed access" would be untrue — the link is still open and someone else
// can start the paper right now. What ended is their own attempt, and saying so
// is the difference between "you ran out of time" and "something broke".
//
// The server has the last word either way: answers past the deadline are refused
// (`submit_answer`), and a Cloud Task finishes the attempt at it, so a student
// who never reaches this screen is still marked submitted.
export function AttemptExpired() {
  const { t } = useStableI18n();
  const homeHref = useHomeHref();
  return (
    <StudentPageShell>
      <div className="flex flex-col items-center gap-5 rounded-3xl border bg-card p-10 text-center shadow-sm">
        <span className="grid size-16 place-items-center rounded-full bg-error-bg text-error"><TimerOff className="size-8" /></span>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{t("exercise.live.attemptExpired.title", "Your time is up")}</h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">{t("exercise.live.attemptExpired.body", "The time limit for this attempt has run out, so it can no longer be answered. Everything you submitted before then has been saved.")}</p>
        </div>
        {homeHref ? (
          <Button asChild variant="outline"><Link to={homeHref}>{t("exercise.live.attemptExpired.backHome", "Back to Home")}</Link></Button>
        ) : null}
      </div>
    </StudentPageShell>
  );
}
