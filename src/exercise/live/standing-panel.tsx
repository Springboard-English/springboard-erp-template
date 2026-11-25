import { useState } from "react";
import { DetailTabs, ScoreDistributionChart } from "../../exports";
import { SKILL_LABELS, type SkillTag } from "../lib/exercises";

import type { ScoreStanding } from "./api";
import { valueLabel } from "./i18n";
import { useStableI18n } from "./i18n";
import { SKILL_ACCENTS } from "./icons";
import { formatMarks, formatPercentile, formatScore } from "./results";
import { cn } from "../../lib/utils";

// Where one attempt sits in its run: rank, percentile and the room's
// histogram with this student's bar picked out, for the whole paper or, on a
// tab, one skill.
//
// Every figure is the API's (`standing`, `standing_by_skill`), over the same
// counted attempts as the teacher's results screen, so a student's rank here
// and their row there cannot disagree. Draws nothing when the API sends no
// standing: an attempt that is not the counted one, or an older API.

type StandingView = "all" | SkillTag;

/**
 * The standing card on a student's result and on the teacher's view of one
 * attempt. `subject` names whose bar is highlighted ("You", "This student").
 */
export function StandingPanel({
  standing,
  bySkill,
  title,
  subject,
  className,
}: {
  standing: ScoreStanding | null | undefined;
  bySkill: ScoreStanding[] | undefined;
  title: string;
  subject: string;
  className?: string;
}) {
  const { t } = useStableI18n();
  const [view, setView] = useState<StandingView>("all");
  if (!standing) return null;
  const skills = (bySkill ?? []).filter((row) => row.skill);
  // One figure row and one chart at a time, switched like the results
  // screen's Score distribution, rather than a card per skill down the page.
  const skill = skills.find((row) => row.skill === view);
  const shown = skill ?? standing;
  const accent = skill?.skill ? SKILL_ACCENTS[skill.skill] : "rose";

  return (
    <section className={cn("rounded-3xl border bg-card p-6 shadow-sm", className)}>
      <h2 className="mb-4 text-sm font-bold text-foreground">{title}</h2>
      {skills.length > 0 ? (
        <DetailTabs<StandingView>
          className="mb-4"
          tabs={[
            { value: "all", label: t("exercise.live.scoreDist.allSkills", "All skills") },
            ...skills.map((row) => ({
              value: row.skill as StandingView,
              label: valueLabel(t, SKILL_LABELS[row.skill as SkillTag] ?? row.skill),
            })),
          ]}
          activeTab={skill ? view : "all"}
          onChange={setView}
          classNames={{ pill: "bg-primary" }}
        />
      ) : null}
      <StandingFigures standing={shown} />
      <ScoreDistributionChart
        className="mt-4"
        bins={shown.buckets}
        color={`var(--${accent}-300)`}
        highlightColor={`var(--${accent}-${skill ? 700 : 600})`}
        highlightScore={Number(shown.points)}
        height={180}
        ariaLabel={t("exercise.live.standing.aria", "Where this score sits among the class")}
        labels={{
          students: t("exercise.live.scoreDist.students", "Students"),
          percentile: t("exercise.live.scoreDist.percentile", "Percentile"),
          cohort: t("exercise.live.standing.cohort", "Class"),
          highlight: subject,
        }}
      />
    </section>
  );
}

/**
 * Rank, percentile and the score beside the room's average and median, as a
 * row of small figures.
 */
function StandingFigures({ standing }: { standing: ScoreStanding }) {
  const { t } = useStableI18n();
  const figures = [
    {
      label: t("exercise.live.standing.rank", "Rank"),
      value: t("exercise.live.standing.rankOf", "{rank} of {total}", {
        rank: standing.rank,
        total: standing.cohort_size,
      }),
    },
    {
      label: t("exercise.live.scoreDist.percentile", "Percentile"),
      value: formatPercentile(standing.percentile),
    },
    {
      label: t("exercise.live.standing.score", "Score"),
      value: `${formatMarks(standing.points)}/${formatMarks(standing.max_points)}`,
    },
    {
      label: t("exercise.live.standing.average", "Class average"),
      value: formatScore(standing.average_points),
    },
    {
      label: t("exercise.live.standing.median", "Class median"),
      value: formatScore(standing.median_points),
    },
  ];
  return (
    <dl className="flex flex-wrap gap-x-6 gap-y-2">
      {figures.map((figure) => (
        <div key={figure.label}>
          <dt className="text-[11px] font-semibold text-muted-foreground">{figure.label}</dt>
          <dd className="text-lg font-extrabold text-foreground">
            {figure.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
