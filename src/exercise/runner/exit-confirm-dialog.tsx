import { LogOut } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useI18n } from "../../context/I18nContext";
import { ignoreSpaceActivation } from "../lib/keyboard";

// Exit asks before it leaves a paper in progress: as a plain button beside the
// clock, one stray click would take the student off the exam and out of
// fullscreen. Like SubmitConfirmDialog it opens on the button that keeps them
// working. It says what leaving does and does not do: answers are already
// saved, and the clock does not stop.
export function ExitConfirmDialog({
  open,
  onOpenChange,
  timed,
  onExit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  timed: boolean;
  onExit: () => void;
}) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const root = event.currentTarget;
          if (root instanceof HTMLElement) {
            root.querySelector<HTMLButtonElement>("[data-keep-working]")?.focus();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{t("exercise.exitConfirm.title", "Leave the test?")}</DialogTitle>
          <DialogDescription>
            {t("exercise.exitConfirm.body", "Your answers so far are saved and you can come back with the same code.")}{" "}
            {timed ? t("exercise.exitConfirm.clockRuns", "The clock keeps running while you are away.") : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button data-keep-working variant="outline" onClick={() => onOpenChange(false)}>
            {t("exercise.exitConfirm.keepWorking", "Keep working")}
          </Button>
          <Button variant="ghost" onClick={onExit} onKeyDown={ignoreSpaceActivation}>
            <LogOut className="size-4" />
            {t("exercise.exitConfirm.leave", "Leave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
