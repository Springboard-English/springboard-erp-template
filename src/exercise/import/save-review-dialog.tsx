import { useState } from "react";
import { AlertTriangle, Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  errorMessage,
} from "../../exports";

import { useStableI18n } from "./i18n";
import {
  firstBlocker,
  groupChanges,
  runSaveTasks,
  SaveError,
  type EditorChange,
  type SaveTask,
} from "./editor-changes";
import { isRegradeCancelled } from "./regrade";

type RowStatus = "waiting" | "saved" | "failed";

/** Where a Save all has got to: the changes it started with and how each went. */
interface SaveRun {
  changes: EditorChange[];
  done: number;
  total: number;
  failed: Record<string, string>;
  /** Changes whose task has run. */
  ran: Set<string>;
  finished: boolean;
}

/**
 * The runner editor's final check: every unsaved change grouped by part,
 * section and question, before → after, with what it may do to work students
 * have done. Save all runs the host's tasks in order and marks each row saved
 * or failed; what failed stays with the host, unsaved.
 */
export function SaveReviewDialog({
  open,
  onOpenChange,
  changes,
  notices = [],
  tasks,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  changes: EditorChange[];
  /** Plain warnings for the whole save (the test has been run). */
  notices?: string[];
  /** The writes, built when Save all is pressed so they see current state. */
  tasks: () => SaveTask[];
  /** Every change was stored. */
  onSaved?: () => void;
}) {
  const { t } = useStableI18n();
  const [run, setRun] = useState<SaveRun | null>(null);
  const saving = run !== null && !run.finished;
  const shown = run?.changes ?? changes;
  const blocker = run ? null : firstBlocker(changes);

  async function saveAll() {
    const list = tasks();
    const snapshot = changes;
    setRun({ changes: snapshot, done: 0, total: list.length, failed: {}, ran: new Set(), finished: false });
    const failed = await runSaveTasks(
      list,
      (error) =>
        isRegradeCancelled(error)
          ? t("exercise.import.saveReview.regradeCancelled", "Not saved: the regrade question was cancelled.")
          : error instanceof SaveError
            ? error.message
            : errorMessage(error, t("exercise.import.saveReview.failed", "Couldn’t save this. Please try again.")),
      (done, soFar) =>
        setRun((current) =>
          current
            ? { ...current, done, failed: soFar, ran: new Set(list.slice(0, done).flatMap((task) => task.ids)) }
            : current,
        ),
    );
    if (Object.keys(failed).length === 0) {
      toast.success(t("exercise.import.saveReview.saved", "Saved"));
      setRun(null);
      onOpenChange(false);
      onSaved?.();
      return;
    }
    setRun((current) => (current ? { ...current, failed, finished: true } : current));
  }

  const statusOf = (id: string): RowStatus | null => {
    if (!run) return null;
    if (run.failed[id]) return "failed";
    return run.ran.has(id) ? "saved" : run.finished ? null : "waiting";
  };
  const failedCount = run ? Object.keys(run.failed).length : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // A save in progress can't be walked away from; a finished one resets.
        if (saving) return;
        if (!next) setRun(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {shown.length === 1
              ? t("exercise.import.saveReview.titleOne", "Check 1 change before saving")
              : t("exercise.import.saveReview.titleMany", "Check {n} changes before saving", { n: shown.length })}
          </DialogTitle>
          <DialogDescription>
            {t("exercise.import.saveReview.hint", "Nothing is saved until you press Save all. Back returns to the editor with your changes kept.")}
          </DialogDescription>
        </DialogHeader>

        {notices.length ? (
          <div className="space-y-2">
            {notices.map((notice) => (
              <p
                key={notice}
                className="flex gap-2 rounded-2xl border-2 border-butter-300 bg-butter-bg px-4 py-2.5 text-xs font-bold text-ink-700"
              >
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                <span>{notice}</span>
              </p>
            ))}
          </div>
        ) : null}

        <div className="space-y-4">
          {groupChanges(shown).map(({ group, changes: rows }) => (
            <section key={group} className="space-y-2">
              <h3 className="text-[11px] font-extrabold text-muted-foreground">{group}</h3>
              <ul className="divide-y rounded-2xl border bg-card">
                {rows.map((change) => (
                  <ChangeRow key={change.id} change={change} status={statusOf(change.id)} error={run?.failed[change.id]} />
                ))}
              </ul>
            </section>
          ))}
        </div>

        {run ? (
          <div className="space-y-1.5">
            <p className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              {saving ? <Loader2 className="size-3.5 animate-spin text-lav-700" aria-hidden /> : null}
              {saving
                ? t("exercise.import.saveReview.progress", "Saving {done} of {total}", { done: Math.min(run.done + 1, run.total), total: run.total })
                : failedCount === 1
                  ? t("exercise.import.saveReview.failedOne", "1 change wasn’t saved. It is still in the editor; fix it or try again.")
                  : t("exercise.import.saveReview.failedMany", "{n} changes weren’t saved. They are still in the editor; fix them or try again.", { n: failedCount })}
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-mint-500 transition-all duration-300"
                style={{ width: `${run.total ? Math.round((run.done / run.total) * 100) : 100}%` }}
              />
            </div>
          </div>
        ) : blocker ? (
          <p className="text-xs font-bold text-error">{blocker}</p>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            disabled={saving}
            onClick={() => {
              setRun(null);
              onOpenChange(false);
            }}
          >
            {t("exercise.import.saveReview.back", "Back to editing")}
          </Button>
          {run?.finished ? null : (
            <Button disabled={saving || Boolean(blocker) || changes.length === 0} onClick={() => void saveAll()}>
              {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Check className="size-4" />}
              {t("exercise.import.saveReview.saveAll", "Save all")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** One change: what, before → after, its risk or blocker, and how its save went. */
function ChangeRow({
  change,
  status,
  error,
}: {
  change: EditorChange;
  status: RowStatus | null;
  error?: string;
}) {
  return (
    <li className="flex gap-3 px-4 py-3">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-bold text-foreground">{change.label}</p>
        {change.before || change.after ? (
          <p className="break-words text-xs font-semibold text-muted-foreground">
            {change.before ? <span className="line-through">{change.before}</span> : null}
            {change.before && change.after ? " → " : null}
            {change.after ? <span className="text-foreground">{change.after}</span> : null}
          </p>
        ) : null}
        {change.risk ? (
          <p className="flex gap-1.5 text-xs font-bold text-ink-700">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-butter-700" aria-hidden />
            <span>{change.risk}</span>
          </p>
        ) : null}
        {change.blocked ? <p className="text-xs font-bold text-error">{change.blocked}</p> : null}
        {error ? <p className="text-xs font-bold text-error">{error}</p> : null}
      </div>
      {status === "saved" ? (
        <Check className="size-4 shrink-0 text-mint-700" aria-hidden />
      ) : status === "failed" ? (
        <X className="size-4 shrink-0 text-error" aria-hidden />
      ) : status === "waiting" ? (
        <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />
      ) : null}
    </li>
  );
}
