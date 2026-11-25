import { useStableI18n } from "./i18n";
import { SKILL_ACCENTS } from "./icons";
import type { SkillBarRow } from "./skill-breakdown";
import { cn } from "../../lib/utils";

// A score split by skill: one bar per skill the paper tests, in the API's order.
//
// Drawn by hand rather than with the template's `CategoryBars`, which picks its
// own categorical colours and folds long tails into "Other". The design system
// locks one accent per skill — reading is rose, listening is sky, and so on,
// everywhere a skill appears — and a breakdown that recoloured them would be
// the one place a student learned the legend wrong. Nor is it `AccuracyBar`,
// whose green/amber/red tone would override the skill's colour with a verdict.
//
// The fill is the skill's `--<accent>-500` token, applied through `style` so
// the CSS custom property resolves (the design system's rule: a component never
// inlines a hex). The percentage carries no colour judgement of its own; the
// figure beside the bar does the talking.
//
// Rows come from `lib/skill-breakdown.ts` and, before that, from the API.
// Nothing here computes a score. An empty list draws nothing (or the caller's
// `emptyMessage`), which is what an API without `by_skill` yet produces.
export function SkillBreakdown({
  rows,
  title,
  emptyMessage,
  className,
}: {
  rows: SkillBarRow[];
  title?: string;
  emptyMessage?: string;
  className?: string;
}) {
  const { t } = useStableI18n();
  if (rows.length === 0) {
    return emptyMessage ? (
      <p className={cn("text-sm font-semibold text-muted-foreground", className)}>
        {emptyMessage}
      </p>
    ) : null;
  }
  return (
    <section className={className}>
      {title ? (
        <h2 className="mb-4 text-sm font-bold text-foreground">{title}</h2>
      ) : null}
      <ul className="space-y-3">
        {rows.map((row) => {
          const fill = `var(--${SKILL_ACCENTS[row.skill]}-500)`;
          return (
            <li key={row.skill}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-bold">
                <span className="flex min-w-0 items-center gap-2 text-foreground">
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: fill }}
                  />
                  <span className="truncate">{row.label}</span>
                  {/* Said on the row, not inferred from a number that later
                      changes: this skill's figure is of what has been marked. */}
                  {row.provisional ? (
                    <span className="shrink-0 rounded-full bg-lav-bg px-2 py-0.5 text-[10px] font-extrabold text-lav-700">
                      {t("exercise.live.results.provisional", "provisional")}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {row.value} · {row.percentage === null ? "—" : `${row.percentage}%`}
                </span>
              </div>
              <div
                className="h-2.5 overflow-hidden rounded-full bg-muted"
                role="img"
                aria-label={`${row.label}: ${row.value}`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-soft"
                  style={{ width: `${row.percentage ?? 0}%`, background: fill }}
                />
              </div>
              {row.note ? (
                <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                  {row.note}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
