import { Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

import { StudentPageShell } from "./student-page-shell";
import { Button } from "../../exports";
import { useStableI18n } from "./i18n";
import { useHomeHref } from "./config";

// Challenge Closed: the timed class challenge has ended and the link is closed.
export function ChallengeClosed() {
  const { t } = useStableI18n();
  const homeHref = useHomeHref();
  return (
    <StudentPageShell>
      <div className="flex flex-col items-center gap-5 rounded-3xl border bg-card p-10 text-center shadow-sm">
        <span className="grid size-16 place-items-center rounded-full bg-error-bg text-error"><LockKeyhole className="size-8" /></span>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">{t("exercise.live.challengeClosed.title", "This challenge has ended")}</h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">{t("exercise.live.challengeClosed.body", "The teacher has closed access to this activity, so it can no longer be answered.")}</p>
        </div>
        {homeHref ? (
          <Button asChild variant="outline"><Link to={homeHref}>{t("exercise.live.challengeClosed.backHome", "Back to Home")}</Link></Button>
        ) : null}
      </div>
    </StudentPageShell>
  );
}
