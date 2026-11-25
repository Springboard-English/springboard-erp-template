import { formatUserTimestamp } from "../../exports";
import type { ParticipantSummary } from "./api";
import { useStableI18n } from "./i18n";
import { attemptDuration, formatDuration } from "./results";

// When a sitting happened, how much of it was answered, and how long it took —
// facts about the sitting, not the score, so they print whatever the
// visibility gate says. One line, shared by the review of a past run and the
// runner's own score screen, so "2 min taken" reads the same in both places.
//
// The duration is `started_at` → `finished_at` and nothing else
// (`attemptDuration`); a missing end is a dash, never `joined_at` arithmetic.
export function RunFacts({ run }: { run: ParticipantSummary }) {
  const { t } = useStableI18n();
  const when = run.finished_at ?? run.joined_at;
  const date = when ? new Date(when) : null;
  const taken = attemptDuration(run);
  const facts = [
    date && !Number.isNaN(date.getTime()) ? formatUserTimestamp(when) : null,
    t("exercise.live.runFacts.answered", "{answered}/{total} answered", { answered: run.answered, total: run.question_count }),
    run.finished_at ? null : t("exercise.live.runFacts.notSubmitted", "not submitted"),
    taken !== null ? t("exercise.live.runFacts.taken", "{duration} taken", { duration: formatDuration(taken, t) }) : null,
  ].filter(Boolean);
  return (
    <p className="text-sm font-semibold text-muted-foreground">
      {facts.join(" · ")}
    </p>
  );
}
