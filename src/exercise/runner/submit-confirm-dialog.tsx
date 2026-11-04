import type { ReactNode } from "react";
import { Loader2, RotateCw, Send } from "lucide-react";

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

// The exam asks once before it is finalised.
//
// "Submit answers" sits in the bottom bar's right-hand slot — exactly where
// "Review answers" was a moment earlier, because both bars anchor their buttons
// in the same place. Finishing on the click would let a double-click or a
// double-tap on Review answers land its second half on Submit and end the
// exam. This dialog is centred,
// well away from that slot, and opens with focus on the button that does NOT
// submit, so neither a stray tap nor Enter can finish the exam.
//
// A hand-in that could not reach the server stays here, `retrying`: the runner
// keeps sending and finishes the attempt by itself once every answer is
// confirmed, and `children` — the student's answers with what is and isn't
// saved — shows below. The student already chose to submit, so there is no
// "Keep working" while it retries.
//
// The timer's auto-submit does not come through here — time up is not a choice.
export function SubmitConfirmDialog({
  open,
  onOpenChange,
  unansweredCount,
  submitting,
  retrying,
  unconfirmedCount,
  onConfirm,
  onRetryNow,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unansweredCount: number;
  submitting: boolean;
  retrying: boolean;
  unconfirmedCount: number;
  onConfirm: () => void;
  onRetryNow: () => void;
  children?: ReactNode;
}) {
  const { t } = useI18n();
  const locked = submitting || retrying;
  return (
    <Dialog
      open={open}
      // Mid-submit, and while a failed hand-in retries, the dialog stays: it is
      // the only thing saying so.
      onOpenChange={(next) => {
        if (!locked) onOpenChange(next);
      }}
    >
      <DialogContent
        className={retrying ? "sm:max-w-lg" : "sm:max-w-md"}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const root = event.currentTarget;
          if (root instanceof HTMLElement) {
            root.querySelector<HTMLButtonElement>("[data-keep-working]")?.focus();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {retrying
              ? t("exercise.submitConfirm.retryTitle", "Couldn’t submit yet")
              : t("exercise.submitConfirm.title", "Submit your answers?")}
          </DialogTitle>
          <DialogDescription>
            {retrying ? (
              unconfirmedCount === 1 ? (
                t("exercise.submitConfirm.retryOne", "1 answer couldn’t be saved. We’re retrying, and your answers will be submitted as soon as they are — keep this page open.")
              ) : (
                t("exercise.submitConfirm.retryOther", "{n} answers couldn’t be saved. We’re retrying, and your answers will be submitted as soon as they are — keep this page open.", { n: unconfirmedCount })
              )
            ) : (
              <>
                {unansweredCount === 0
                  ? t("exercise.submitConfirm.allAnswered", "Every question is answered.")
                  : unansweredCount === 1
                    ? t("exercise.submitConfirm.unansweredOne", "1 question is still unanswered.")
                    : t("exercise.submitConfirm.unansweredOther", "{n} questions are still unanswered.", { n: unansweredCount })}{" "}
                {t("exercise.submitConfirm.final", "You can’t change your answers after you submit.")}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        {retrying && children ? (
          <div className="max-h-[50vh] overflow-y-auto">{children}</div>
        ) : null}
        <DialogFooter className="gap-2">
          {retrying ? (
            <Button onClick={onRetryNow} onKeyDown={ignoreSpaceActivation} disabled={submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RotateCw className="size-4" />
              )}
              {submitting
                ? t("exercise.submitConfirm.submitting", "Submitting…")
                : t("exercise.submitConfirm.tryAgain", "Try again now")}
            </Button>
          ) : (
            <>
              <Button
                data-keep-working
                variant="outline"
                disabled={submitting}
                onClick={() => onOpenChange(false)}
              >
                {t("exercise.submitConfirm.keepWorking", "Keep working")}
              </Button>
              <Button
                onClick={onConfirm}
                onKeyDown={ignoreSpaceActivation}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {submitting
                  ? t("exercise.submitConfirm.submitting", "Submitting…")
                  : t("exercise.submitConfirm.submit", "Submit")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
