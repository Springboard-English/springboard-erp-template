import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useI18n } from "../../context/I18nContext";
import { ignoreSpaceActivation } from "../lib/keyboard";
import { useExerciseTourAnchor } from "../lib/tour-anchors";

// Prev / Next for the one-exercise-per-screen runner. Rendered into
// StudentShell's fixed `footer` slot, so it owns no outer spacing of its own —
// the shell places it and reserves the room. `center` fills the middle (the
// question palette); without it, the plain position counter is shown.
//
// The two buttons carry equal fixed widths and hug the outer edges, so they stay
// anchored in place even as the Next label changes ("Next" → "Review answers")
// or the disabled state toggles — nothing under the cursor shifts between pages.
//
// Below `sm` the slots stop being fixed-width and the labels shrink. Two 11rem
// slots plus the question toggle and Notes are wider than a 390px phone, so on an
// iPhone Next would sit past the right edge of the screen. Previous is an icon
// there, with its name
// kept in `aria-label` — text hidden by `display: none` is not part of a
// button's accessible name.
export function PaginationBar({ index, total, onPrev, onNext, nextLabel, center }: { index: number; total: number; onPrev: () => void; onNext: () => void; nextLabel?: string; center?: ReactNode }) {
  const { t } = useI18n();
  const anchor = useExerciseTourAnchor("next");
  const isLast = index === total - 1;
  const width = String(total).length;
  const pad = (n: number) => String(n).padStart(width, "0");
  return (
    // Below `sm` the gaps and Next's arrow go so the tools between fit 390px.
    <div className="flex items-center justify-between gap-1 sm:gap-3">
      {/* Fixed-width slots anchor the buttons' positions; the buttons themselves
          keep their natural size (and hitbox) inside them. */}
      <div className="flex shrink-0 justify-start sm:w-44">
        <Button variant="ghost" aria-label={t("exercise.pagination.previous", "Previous")} disabled={index === 0} onClick={onPrev} onKeyDown={ignoreSpaceActivation}><ArrowLeft className="size-4" /><span className="hidden sm:inline">{t("exercise.pagination.previous", "Previous")}</span></Button>
      </div>
      {center ?? <span className="font-mono text-xs font-bold tabular-nums text-muted-foreground">{pad(index + 1)} / {pad(total)}</span>}
      <div className="flex shrink-0 justify-end sm:w-44">
        {/* Space is ignored here: a focused Next re-fires on every press, which
            would let a student space-bar through the whole paper into submit. See
            lib/keyboard.ts. */}
        <Button
          onClick={onNext}
          onKeyDown={ignoreSpaceActivation}
          {...anchor}
        >
          {isLast ? (
            nextLabel ?? (
              <>
                <span className="sm:hidden">{t("exercise.pagination.review", "Review")}</span>
                <span className="hidden sm:inline">{t("exercise.pagination.reviewAnswers", "Review Answers")}</span>
              </>
            )
          ) : (
            t("exercise.pagination.next", "Next")
          )}
          <ArrowRight className="size-4 max-sm:hidden" />
        </Button>
      </div>
    </div>
  );
}
