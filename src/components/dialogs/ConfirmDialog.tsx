import { useEffect, useRef, useState, type ReactNode } from "react";

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

export interface ConfirmOptions {
  /** Names the action and its object: `Delete "Grade 5"?`, never "Are you sure?". */
  title: string;
  /** What happens, such as "This can't be undone." */
  description?: ReactNode;
  /** The action's own words: "Delete class", never "OK". */
  confirmLabel: string;
  cancelLabel?: string;
  /** `default` for an action that isn't destructive. */
  tone?: "destructive" | "default";
}

interface PendingConfirm extends ConfirmOptions {
  resolve: (confirmed: boolean) => void;
}

let showConfirm: ((pending: PendingConfirm) => void) | null = null;

/**
 * Asks in the suite's dialog and resolves true if the person confirms. Needs a
 * mounted `ConfirmDialogHost`, which `DashboardLayout` provides. Without one it
 * resolves false, so nothing destructive runs unasked.
 */
export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (showConfirm) showConfirm({ ...options, resolve });
    else resolve(false);
  });
}

/** Renders the dialog `confirmAction` opens. It opens focused on Cancel, so Enter cannot confirm by accident. */
export function ConfirmDialogHost() {
  const { t } = useI18n();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    showConfirm = (next) => {
      setPending(next);
      setOpen(true);
    };
    return () => {
      showConfirm = null;
    };
  }, []);

  const settle = (confirmed: boolean) => {
    pending?.resolve(confirmed);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : settle(false))}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          cancelRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>{pending?.title}</DialogTitle>
          {pending?.description ? <DialogDescription>{pending.description}</DialogDescription> : null}
        </DialogHeader>
        <DialogFooter>
          <Button ref={cancelRef} type="button" variant="outline" onClick={() => settle(false)}>
            {pending?.cancelLabel ?? t("common.cancel", "Cancel")}
          </Button>
          <Button
            type="button"
            variant={pending?.tone === "default" ? "default" : "destructive"}
            onClick={() => settle(true)}
          >
            {pending?.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
