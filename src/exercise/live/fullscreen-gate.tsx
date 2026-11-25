import { Maximize } from "lucide-react";

import { Button } from "../../exports";
import { useStableI18n } from "./i18n";

// A blocking overlay that keeps the live-session runner in fullscreen. It is
// shown whenever the exam is active but the browser is not fullscreen — both to
// start the test (first entry) and to pull the student back after they press
// Esc. It cannot enter fullscreen on its own: the button click is the user
// gesture the Fullscreen API requires.
//
// This is the enforcement half of proctoring's fullscreen tracking: leaving is
// already recorded for the teacher (use-proctoring.ts), and this makes the
// student return before they can carry on.
export function FullscreenGate({
  started,
  onEnter,
}: {
  /** True once the student has been in fullscreen — so a re-entry reads as one. */
  started: boolean;
  onEnter: () => void;
}) {
  const { t } = useStableI18n();
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-6 px-8 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-rose-100 text-rose-700">
          <Maximize className="size-7" />
        </span>
        <div className="space-y-1">
          <p className="text-lg font-extrabold text-foreground">
            {started
              ? t("exercise.live.fullscreen.return", "Return to fullscreen")
              : t("exercise.live.fullscreen.title", "This test runs in fullscreen")}
          </p>
          <p className="text-sm font-semibold text-muted-foreground">
            {started
              ? t("exercise.live.fullscreen.leftBody", "You left fullscreen. Re-enter to continue — leaving the test is recorded.")
              : t("exercise.live.fullscreen.body", "Fullscreen keeps the test distraction-free. Your answers are saved as you go.")}
          </p>
        </div>
        <Button size="lg" className="w-full" onClick={onEnter}>
          <Maximize className="size-4" />
          {started
            ? t("exercise.live.fullscreen.returnButton", "Return to Fullscreen")
            : t("exercise.live.fullscreen.enter", "Enter Fullscreen & Begin")}
        </Button>
      </div>
    </div>
  );
}
