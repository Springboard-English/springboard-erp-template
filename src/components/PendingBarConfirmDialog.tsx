import { useEffect, useRef, useState, type ReactNode } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/context/I18nContext";

/**
 * A confirmation step in front of a `PendingChangesBar` action or its Save.
 *
 * `prepare` runs each time the dialog opens (a dry run, a count, a list of
 * blockers); its result `P` is passed to `description`, `confirmLabel`,
 * `canConfirm` and finally to the action's `onRun`. Without `prepare`, `P` is
 * `undefined`.
 */
export interface PendingBarConfirm<P = undefined> {
  title: ReactNode;
  description?: ReactNode | ((prepared: P) => ReactNode);
  /** Defaults to the action's label (or "Confirm" for Save). */
  confirmLabel?: string | ((prepared: P) => string);
  /** Defaults to "Cancel". */
  cancelLabel?: string;
  /** Draws the confirm button red. */
  destructive?: boolean;
  /** Runs when the dialog opens; a throw shows its message with a retry. */
  prepare?: () => Promise<P>;
  /** Return false to block the confirm button, e.g. on server-reported blockers. */
  canConfirm?: (prepared: P) => boolean;
}

export interface PendingBarConfirmDialogProps<P> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The step to show. Read when the dialog opens; `null` renders nothing. */
  confirm: PendingBarConfirm<P> | null;
  /** The confirm button's text when `confirm.confirmLabel` is not given. */
  fallbackConfirmLabel: string;
  /** Runs on confirm with the prepared value; the dialog closes once it resolves. */
  onRun: (prepared: P) => void | Promise<void>;
}

type Phase = "preparing" | "ready" | "failed";

/** The text of a thrown value, or null when it carries none. */
function thrownMessage(error: unknown): string | null {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }
  return null;
}

/**
 * The dialog behind a confirmed pending-bar action. It runs `prepare` on open
 * with a loading state and a retry on failure, holds a running state while
 * `onRun` resolves, refuses to close mid-run, and closes once the run succeeds.
 * A run that throws keeps the dialog open with the error under the text.
 */
export default function PendingBarConfirmDialog<P>({
  open,
  onOpenChange,
  confirm,
  fallbackConfirmLabel,
  onRun,
}: PendingBarConfirmDialogProps<P>) {
  const { t } = useI18n();
  // "ready" with no prepared value still reads as preparing when there is a
  // `prepare` (see `ready` below), so this is the right state before any open.
  const [phase, setPhase] = useState<Phase>("ready");
  // Boxed, so "prepared to `undefined`" and "not prepared yet" differ.
  const [prepared, setPrepared] = useState<{ value: P } | null>(null);
  const [prepareError, setPrepareError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  // Read through a ref: callers pass `confirm` as an inline literal, and a new
  // object every render must not re-run `prepare`.
  const confirmRef = useRef(confirm);
  confirmRef.current = confirm;
  // `t` is a new function every render, so the effect reads it through a ref.
  const tRef = useRef(t);
  tRef.current = t;
  // Bumped on every open and retry, so a slow `prepare` from an earlier open
  // cannot land in a later one.
  const requestRef = useRef(0);

  useEffect(() => {
    if (!open) {
      requestRef.current += 1;
      setPrepared(null);
      setPhase("ready");
      return;
    }
    const request = ++requestRef.current;
    setRunning(false);
    setRunError(null);
    setPrepareError(null);
    setPrepared(null);
    const prepare = confirmRef.current?.prepare;
    if (!prepare) {
      setPhase("ready");
      return;
    }
    setPhase("preparing");
    prepare().then(
      (value) => {
        if (request !== requestRef.current) return;
        setPrepared({ value });
        setPhase("ready");
      },
      (error: unknown) => {
        if (request !== requestRef.current) return;
        setPrepareError(thrownMessage(error) ?? tRef.current("pendingChanges.failed"));
        setPhase("failed");
      },
    );
  }, [open, attempt]);

  if (!confirm) {
    return null;
  }

  // Without `prepare`, `P` is `undefined`. With it, nothing below reads the
  // value until `prepare` has resolved in this open, so the caller's functions
  // never see a missing one.
  const value = (prepared?.value ?? undefined) as P;
  const ready = phase === "ready" && (!confirm.prepare || prepared !== null);
  const failed = phase === "failed";
  const preparing = !ready && !failed;
  const allowed = ready && (confirm.canConfirm ? confirm.canConfirm(value) : true);
  const confirmLabel = !ready
    ? typeof confirm.confirmLabel === "string"
      ? confirm.confirmLabel
      : fallbackConfirmLabel
    : typeof confirm.confirmLabel === "function"
      ? confirm.confirmLabel(value)
      : (confirm.confirmLabel ?? fallbackConfirmLabel);
  const description = ready
    ? typeof confirm.description === "function"
      ? confirm.description(value)
      : confirm.description
    : null;
  const hasDescription = !ready || description != null;

  const handleOpenChange = (next: boolean) => {
    // A run in flight cannot be abandoned by Escape, the overlay or the ✕.
    if (!next && running) return;
    onOpenChange(next);
  };

  const handleConfirm = async () => {
    if (!allowed || running) return;
    setRunning(true);
    setRunError(null);
    try {
      await onRun(value);
      setRunning(false);
      onOpenChange(false);
    } catch (error) {
      setRunning(false);
      setRunError(thrownMessage(error) ?? t("pendingChanges.failed"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={!running}
        // Radix warns when no description is wired; say there is none instead.
        {...(hasDescription ? {} : { "aria-describedby": undefined })}
      >
        <DialogHeader>
          <DialogTitle>{confirm.title}</DialogTitle>
          {hasDescription ? (
            <DialogDescription asChild>
              <div className="space-y-2">
                {preparing ? (
                  <span className="flex items-center gap-2" aria-live="polite">
                    <Loader2 className="size-4 animate-spin" />
                    {t("pendingChanges.preparing")}
                  </span>
                ) : failed ? (
                  <span className="block text-destructive" role="alert">
                    {prepareError}
                  </span>
                ) : (
                  description
                )}
              </div>
            </DialogDescription>
          ) : null}
        </DialogHeader>
        {runError ? (
          <p className="text-sm text-destructive" role="alert">
            {runError}
          </p>
        ) : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={running}
            onClick={() => onOpenChange(false)}
          >
            {confirm.cancelLabel ?? t("common.cancel")}
          </Button>
          {failed ? (
            <Button type="button" onClick={() => setAttempt((n) => n + 1)}>
              <RotateCcw className="size-4" />
              {t("pendingChanges.retry")}
            </Button>
          ) : (
            <Button
              type="button"
              variant={confirm.destructive ? "destructive" : "default"}
              disabled={!allowed || running}
              onClick={handleConfirm}
            >
              {running || preparing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {running ? t("pendingChanges.working") : confirmLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
