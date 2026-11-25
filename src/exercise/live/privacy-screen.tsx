import { EyeOff } from "lucide-react";

import { useStableI18n } from "./i18n";

// Covers the paper while the exam window does not have focus (see
// `useWindowAway`). Below `FullscreenGate` (z-60), which is the stronger
// message when both apply. Clicking anywhere returns focus to the window, which
// is all it takes to dismiss it.
export function PrivacyScreen() {
  const { t } = useStableI18n();
  return (
    <div
      role="alert"
      className="fixed inset-0 z-[55] flex items-center justify-center bg-background/80 backdrop-blur-2xl"
    >
      <div className="w-full max-w-sm space-y-4 px-8 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-rose-100 text-rose-700">
          <EyeOff className="size-7" />
        </span>
        <div className="space-y-1">
          <p className="text-lg font-extrabold text-foreground">{t("exercise.live.privacy.title", "The paper is hidden")}</p>
          <p className="text-sm font-semibold text-muted-foreground">
            {t("exercise.live.privacy.body", "The test window lost focus. Click here to carry on. Leaving the test is recorded.")}
          </p>
        </div>
      </div>
    </div>
  );
}
