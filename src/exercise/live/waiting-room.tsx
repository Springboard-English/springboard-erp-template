import { Link } from "react-router-dom";
import { Hourglass } from "lucide-react";
import { useAuth } from "../../exports";

import { StudentPageShell } from "./student-page-shell";
import { EyeCareNote } from "./eye-care-note";
import { Button } from "../../exports";
import { useStableI18n } from "./i18n";
import { TOUR_ANCHORS, tourAnchorProps } from "./tour";
import { homeRouteForAccountType } from "./config";

// The waiting room: you are in the challenge, it has not started.
//
// Without it the runner would draw the exam paper the moment join returned, so
// a student handed the code would read the questions while the teacher is
// still taking the register.
//
// It cannot name the test. Nothing exposes a test's name to a student:
// GET /v2/live-sessions/{id} requires the `tests_get` scope, which they never
// hold. The code is what they have, so the code is what we show.
export function WaitingRoom({ code }: { code: string }) {
  const { t } = useStableI18n();
  const { user } = useAuth();
  const displayName =
    (typeof user?.name === "string" && user.name) || user?.username || null;

  return (
    <StudentPageShell>
      <div
        {...tourAnchorProps(TOUR_ANCHORS.runnerWaiting)}
        className="flex flex-col items-center gap-5 rounded-3xl border bg-card p-10 text-center shadow-sm"
      >
        <span className="grid size-16 place-items-center rounded-full bg-butter-bg text-butter-700">
          <Hourglass className="size-8" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{t("exercise.live.waiting.title", "You’re in")}</h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {t("exercise.live.waiting.body", "Waiting for your teacher to start the challenge. The questions appear here by themselves — you don’t need to refresh.")}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground">
            {t("exercise.live.waiting.code", "Code")}
          </p>
          <p className="font-mono text-3xl font-extrabold tracking-[.2em] text-foreground">
            {code}
          </p>
        </div>
        {displayName ? (
          <p className="text-sm font-semibold text-muted-foreground">
            {t("exercise.live.waiting.joinedAs", "Joined as")} <span className="font-bold text-foreground">{displayName}</span>
          </p>
        ) : null}
        {/* Stepping away is fine, and costs nothing: proctoring is not armed
            while waiting (see lib/live-phase), the server prices lobby events at
            zero anyway, and re-joining is idempotent on (session, user) — the
            runner re-joins from the code in its own URL. Coming back is the part
            that needs help, so the student dashboard lists a run still in its
            lobby with a link straight back here. */}
        <Button asChild variant="ghost">
          <Link to={homeRouteForAccountType(user?.account_type)}>{t("exercise.live.waiting.leave", "Leave for Now")}</Link>
        </Button>
        <p className="text-xs font-semibold text-muted-foreground">
          {t("exercise.live.waiting.leaveHint", "If you leave, come back when your teacher says to start — this challenge is waiting for you on your dashboard.")}
        </p>
      </div>
      {/* The lobby is the one moment in the whole flow with time to spare, so
          it is where the eye-care note earns its space. */}
      <div className="mt-6">
        <EyeCareNote />
      </div>
    </StudentPageShell>
  );
}
