import { useMemo, useState } from "react";
import { History } from "lucide-react";

import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { buildChangelog, countInternalChanges } from "./changelog";
import type { ChangelogChange, ChangelogChangeKind, ChangelogCommit } from "./types";

export interface ChangelogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The app's history, newest commit first. */
  commits: readonly ChangelogCommit[];
  /**
   * Short sha of the running bundle, so the row a user is actually looking at
   * can be marked. Anything longer than 7 chars is compared by prefix, which is
   * what CI passes (`$COMMIT_SHA` is the full 40).
   */
  currentCommit?: string | null;
  /** Overrides the dialog heading — an app with a name worth saying can say it. */
  title?: string;
}

/**
 * The four kinds are told apart by *weight*, not by hue: solid primary, outlined
 * primary, neutral, muted. No literal colour appears here on purpose.
 *
 * Two reasons. None of the consumers imports this package's stylesheet — each
 * keeps its own copy of the theme — so a hardcoded `emerald-500` would ignore
 * whatever brand the app is wearing, and Leap's design system forbids raw colour
 * in a component outright. And a badge already prints its own label, so the
 * colour is never the thing carrying the meaning.
 */
const KIND_CLASSES: Record<ChangelogChangeKind, string> = {
  feature: "border-transparent bg-primary text-primary-foreground",
  fix: "border-primary/40 bg-primary/10 text-primary",
  improvement: "border-border bg-secondary text-secondary-foreground",
  internal: "border-border/60 bg-muted/60 text-muted-foreground",
};

function KindBadge({ kind }: { kind: ChangelogChangeKind }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        KIND_CLASSES[kind],
      )}
    >
      {t(`changelog.kind.${kind}`)}
    </span>
  );
}

function useDateFormatter(locale: string) {
  return useMemo(() => {
    try {
      return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
    } catch {
      // An unknown locale tag would otherwise throw and take the dialog with it.
      return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });
    }
  }, [locale]);
}

function formatDay(formatter: Intl.DateTimeFormat, date: string): string {
  // `YYYY-MM-DD` parsed bare is UTC midnight, which renders as the day before
  // in every timezone west of Greenwich. Anchor it to local midnight instead.
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : formatter.format(parsed);
}

function ChangeRow({ change, current }: { change: ChangelogChange; current: boolean }) {
  const { t } = useI18n();
  return (
    <li
      className={cn(
        "flex items-start gap-2.5 rounded-lg px-2 py-2",
        current && "bg-primary/[0.06] ring-1 ring-primary/25",
      )}
      data-testid="changelog-change"
    >
      <KindBadge kind={change.kind} />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-6 text-foreground/85">
          {change.scope ? (
            <span className="mr-1.5 font-mono text-xs text-muted-foreground">{change.scope}</span>
          ) : null}
          {change.summary}
        </p>
        {current ? (
          <p className="mt-0.5 text-[11px] font-semibold text-primary/80">
            {t("changelog.currentBuild")}
          </p>
        ) : null}
      </div>
      <span className="shrink-0 font-mono text-[11px] leading-6 text-muted-foreground/70" title={change.sha}>
        {change.shortSha}
      </span>
    </li>
  );
}

/**
 * The commit history of a deployed bundle, as release notes.
 *
 * Opened from the build tag in an app's account panel — the sha was already
 * there to tie a bug report to a build, and "what actually changed since the
 * one I had yesterday" is the next question anyone asks after reading it.
 *
 * The commit list is generated at build time and shipped inside the bundle
 * (each app's `scripts/generate-changelog.mjs`); nothing is fetched, so this
 * works offline and needs no API surface.
 */
export default function ChangelogDialog({
  open,
  onOpenChange,
  commits,
  currentCommit,
  title,
}: ChangelogDialogProps) {
  const { t, locale } = useI18n();
  const [showInternal, setShowInternal] = useState(false);
  const formatter = useDateFormatter(locale);

  const internalCount = useMemo(() => countInternalChanges(commits), [commits]);
  const days = useMemo(
    () => buildChangelog(commits, { includeInternal: showInternal }),
    [commits, showInternal],
  );

  const current = currentCommit?.trim().toLowerCase() ?? "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="size-4 text-muted-foreground" />
            {title ?? t("changelog.title")}
          </DialogTitle>
          <DialogDescription>{t("changelog.description")}</DialogDescription>
        </DialogHeader>

        <div className="-mx-2 max-h-[60vh] overflow-y-auto px-2">
          {days.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("changelog.empty")}</p>
          ) : (
            days.map((day) => (
              <section key={day.date} className="mb-4 last:mb-0">
                <div className="sticky top-0 z-10 flex items-center gap-3 bg-background/95 py-1.5 backdrop-blur">
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {formatDay(formatter, day.date)}
                  </h3>
                  <div className="h-px flex-1 bg-border/40" />
                </div>
                <ul className="space-y-0.5">
                  {day.changes.map((change) => (
                    <ChangeRow
                      key={change.sha}
                      change={change}
                      current={current.length > 0 && change.sha.toLowerCase().startsWith(current.slice(0, 7))}
                    />
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>

        {internalCount > 0 ? (
          <button
            type="button"
            onClick={() => setShowInternal((value) => !value)}
            className="self-start text-xs font-medium text-muted-foreground underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-foreground"
          >
            {showInternal
              ? t("changelog.hideInternal")
              : t("changelog.showInternal", undefined, { count: internalCount })}
          </button>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
