import { useRef } from "react";
import { StickyNote } from "lucide-react";

import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { EXAM_FIELD_PROPS } from "../lib/exam-field";
import { useExerciseTourAnchor } from "../lib/tour-anchors";
import { useDismissOutside } from "../lib/use-dismiss-outside";

// A scratch pad in the runner's bottom bar. It lives here (rather than in the
// passage) so a single note carries across the whole test — every section, both
// answering and review. Local only; nothing is submitted. The panel opens
// upward to clear the fixed footer.
// `open` is CONTROLLED by the bottom bar rather than held here, so opening this
// closes the question list and vice versa. Held internally, the two panels
// would stack on top of each other in the same corner of the footer.
export function NotesButton({
  value,
  onChange,
  open,
  onOpenChange,
}: {
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const anchor = useExerciseTourAnchor("notes");
  const setOpen = onOpenChange;
  const hasNotes = value.trim().length > 0;
  const rootRef = useRef<HTMLDivElement>(null);
  useDismissOutside(rootRef, open, () => setOpen(false));

  return (
    <div ref={rootRef} className="relative">
      {open ? (
        // Closed by a press outside or Escape, never by a backdrop — see
        // `useDismissOutside`.
        <>
          <div className="absolute bottom-full left-1/2 z-10 mb-3 w-[min(90vw,26rem)] -translate-x-1/2 rounded-2xl border-2 border-border bg-card p-3 shadow-xl">
            <p className="mb-2 text-[11px] font-extrabold text-muted-foreground">
              {t("exercise.notes.heading", "Notes · kept for the whole test, not submitted")}
            </p>
            <Textarea
              {...EXAM_FIELD_PROPS}
              autoFocus
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={t("exercise.notes.placeholder", "Jot notes while you work…")}
              className="min-h-40 bg-butter-bg/40"
            />
          </div>
        </>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        // An icon below `sm` (the footer has no room — see PaginationBar), so
        // the name lives here rather than in the hidden label.
        aria-label={t("exercise.notes.label", "Notes")}
        {...anchor}
        className={cn(
          "relative z-10 inline-flex min-h-11 min-w-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 px-2.5 py-1.5 text-xs font-bold transition-colors sm:px-3.5 md:pointer-fine:min-h-9 md:pointer-fine:min-w-9",
          open
            ? "border-rose-400 bg-rose-50 text-rose-700"
            : "border-border bg-card text-foreground hover:border-rose-200",
        )}
      >
        <StickyNote className="size-4" />
        <span className="hidden sm:inline">{t("exercise.notes.label", "Notes")}</span>
        {hasNotes ? <span className="size-1.5 rounded-full bg-rose-500" /> : null}
      </button>
    </div>
  );
}
