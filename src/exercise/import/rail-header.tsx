import { ArrowUpDown } from "lucide-react";
import { touchHitArea } from "../../exports";

import { useStableI18n } from "./i18n";
import { cn } from "../../lib/utils";

// The head of the question rail, shared by the AI-import review and a test's
// Questions tab so the two screens read as one thing.
//
// The question COUNT belongs to the column it counts, and Reorder acts on the
// list and so belongs to the list; adding a question is the `+` in each
// part/section. So no full-width action bar sits above the one thing the screen
// exists to show.

export interface RailStatus {
  /** Questions actually in the test / import. */
  total: number;
  /** Auto-gradable but keyless — the work left before it can run. */
  needAnswers?: number;
  /** Discarded in the review, or added here and not saved yet. */
  pending?: number;
  pendingLabel?: string;
  /** Edited and not saved. */
  dirty?: number;
}

export function RailHeader({
  status,
  reordering,
  onReorder,
  busy,
}: {
  status: RailStatus;
  /** Omitted when the screen has no reorder mode. */
  reordering?: boolean;
  onReorder?: () => void;
  busy?: boolean;
}) {
  const { t } = useStableI18n();
  const { total, needAnswers = 0, pending = 0, pendingLabel, dirty = 0 } = status;
  return (
    <div className="mb-3 space-y-2 border-b pb-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-extrabold text-foreground">
          {total === 1
            ? t("exercise.import.railHeader.questionOne", "1 question")
            : t("exercise.import.railHeader.questionOther", "{n} questions", { n: total })}
        </p>
        {/* Reorder acts on this list, so it lives on it. Kept quiet — it is a
            mode switch, not the thing a teacher came here to do. */}
        {onReorder ? (
          <button
            type="button"
            disabled={busy || total < 2}
            onClick={onReorder}
            className={cn(
              touchHitArea,
              "relative inline-flex shrink-0 items-center gap-1 rounded-lg px-1.5 py-0.5 text-[11px] font-extrabold transition-colors disabled:opacity-40",
              reordering
                ? "bg-rose-600 text-white"
                : "text-muted-foreground hover:text-rose-700",
            )}
          >
            <ArrowUpDown className="size-3" />
            {reordering ? t("exercise.import.railHeader.done", "Done") : t("exercise.import.railHeader.reorder", "Reorder")}
          </button>
        ) : null}
      </div>

      {/* Only what needs acting on. A count of what is FINE is noise on a screen
          whose whole left edge already shows it. */}
      {needAnswers > 0 || pending > 0 || dirty > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {needAnswers > 0 ? (
            <Pill tone="warn">
              {needAnswers === 1
                ? t("exercise.import.railHeader.needsAnswerOne", "1 needs an answer")
                : t("exercise.import.railHeader.needsAnswerOther", "{n} need an answer", { n: needAnswers })}
            </Pill>
          ) : null}
          {pending > 0 ? (
            <Pill tone="muted">
              {t("exercise.import.railHeader.pendingCount", "{n} {label}", {
                n: pending,
                label: pendingLabel ?? t("exercise.import.railHeader.pending", "pending"),
              })}
            </Pill>
          ) : null}
          {dirty > 0 ? (
            <Pill tone="busy">
              {dirty === 1
                ? t("exercise.import.railHeader.unsavedOne", "1 unsaved edit")
                : t("exercise.import.railHeader.unsavedOther", "{n} unsaved edits", { n: dirty })}
            </Pill>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "warn" | "muted" | "busy";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
        tone === "warn" && "bg-butter-bg text-butter-700",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "busy" && "bg-lav-bg text-lav-700",
      )}
    >
      {children}
    </span>
  );
}
