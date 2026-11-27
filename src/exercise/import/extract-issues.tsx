import { useState } from "react";
import { AlertTriangle, ChevronDown, Loader2, RotateCcw } from "lucide-react";
import { Button } from "../../exports";

import { useStableI18n } from "./i18n";
import type { ImportIssue } from "./import-issues";
import { cn } from "../../lib/utils";

/** An issue with the name the teacher knows its section by. */
export interface LabelledIssue extends ImportIssue {
  label: string;
}

/**
 * What an AI import lost: one row per section the extractor failed on or
 * returned short, each with a Retry that reads that section again. Collapsed
 * to its summary line after the first look, so it doesn't crowd every page.
 */
export function ExtractIssues({
  issues,
  retrying,
  onRetry,
  className,
}: {
  issues: LabelledIssue[];
  retrying: Set<string>;
  onRetry: (ref: string) => void;
  className?: string;
}) {
  const { t } = useStableI18n();
  const [open, setOpen] = useState(true);
  if (!issues.length) return null;
  const missing = issues.reduce((sum, issue) => sum + Math.max(0, issue.expected - issue.read), 0);
  const unparsed = issues.reduce((sum, issue) => sum + issue.unparsed, 0);
  return (
    <div className={cn("rounded-2xl border border-butter-300 bg-butter-bg px-4 py-3 text-sm text-ink-700", className)}>
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left font-extrabold"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <AlertTriangle className="size-4 shrink-0" aria-hidden />
        <span className="flex-1">
          {missing === 1
            ? t("exercise.import.extractIssues.summaryOne", "1 question wasn’t read. Retry the section, or add it by hand.")
            : t("exercise.import.extractIssues.summaryOther", "{n} questions weren’t read. Retry their sections, or add them by hand.", { n: missing })}
        </span>
        <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <ul className="mt-2 space-y-1.5">
          {issues.map((issue) => (
            <li key={issue.ref} className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-0 flex-1">
                {/* A section's name is its whole rubric; two lines of it identify it, and on a phone the rest would fill the screen. */}
                <span className="line-clamp-2 font-bold">{issue.label}</span>
                <span className="block">
                  {issue.kind === "failed"
                    ? t("exercise.import.extractIssues.failed", "Couldn’t read this section")
                    : t("exercise.import.extractIssues.short", "{read} of {expected} questions read", { read: issue.read, expected: issue.expected })}
                </span>
                {issue.error ? <span className="block text-xs text-muted-foreground">{issue.error}</span> : null}
              </span>
              <Button size="sm" variant="outline" disabled={retrying.has(issue.ref)} onClick={() => onRetry(issue.ref)}>
                {retrying.has(issue.ref) ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
                {t("exercise.import.extractIssues.retry", "Retry")}
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
      {open && unparsed > 0 ? (
        // The API returned these and the review couldn't show them: a bug on
        // our side, never the paper's fault, so it is said plainly.
        <p className="mt-2 text-xs text-muted-foreground">
          {t("exercise.import.extractIssues.unparsed", "{n} of these came back from the AI but couldn’t be shown here. That’s a bug in Leap, so please tell us which paper it was.", { n: unparsed })}
        </p>
      ) : null}
    </div>
  );
}
