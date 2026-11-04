import { useMemo, useRef } from "react";
import { LayoutGrid } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { ExerciseAnswer, SpringboardTest } from "../lib/exercises";
import { unansweredNodeIds } from "../lib/grading";
import { useExerciseTourAnchor } from "../lib/tour-anchors";
import { useDismissOutside } from "../lib/use-dismiss-outside";

// The question navigator for the live-session runner, designed to sit in the
// fixed bottom bar: a compact toggle (current position + answered count) whose
// numbered palette opens UPWARD so it clears the footer. Each cell shows its
// state (current / answered / blank), so the palette doubles as "what have I
// left". Jumping is via the runner's existing `jumpToNode`.
// `open` is CONTROLLED by the bottom bar — see NotesButton for why.
export function QuestionNav({
  test,
  answers,
  currentIndex,
  onJump,
  open,
  onOpenChange,
}: {
  test: SpringboardTest;
  answers: Record<string, ExerciseAnswer>;
  currentIndex: number;
  onJump: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const anchor = useExerciseTourAnchor("questionList");
  const setOpen = onOpenChange;
  const rootRef = useRef<HTMLDivElement>(null);
  useDismissOutside(rootRef, open, () => setOpen(false));

  const unanswered = useMemo(
    () => new Set(unansweredNodeIds(test, answers)),
    [test, answers],
  );
  const answeredCount = test.nodes.length - unanswered.size;
  // Zero-pad + monospace the counts so the toggle keeps a constant width and
  // doesn't nudge the bottom bar as you move between questions.
  const width = String(test.nodes.length).length;
  const pad = (n: number) => String(n).padStart(width, "0");

  // A one-question test needs no navigator (pagination handles it).
  if (test.nodes.length < 2) return null;

  return (
    <div ref={rootRef} className="relative">
      {open ? (
        // The palette floats above the footer. A press outside it, or Escape,
        // closes it without swallowing that press — see `useDismissOutside`
        // for why there is no backdrop.
        <>
          <div className="absolute bottom-full left-1/2 z-10 mb-3 w-[min(90vw,28rem)] -translate-x-1/2 rounded-2xl border-2 border-border bg-card p-3 shadow-xl">
            {/* Six across on a phone and eight on a touch tablet keep each chip at
                least 44px; the list scrolls so a long paper stays on screen. */}
            <div className="-m-1 grid max-h-[50dvh] grid-cols-6 gap-1.5 overflow-y-auto p-1 sm:grid-cols-10 sm:gap-2 sm:pointer-coarse:grid-cols-8">
              {test.nodes.map((node, index) => {
                const isCurrent = index === currentIndex;
                const isAnswered = !unanswered.has(node.id);
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => {
                      onJump(index);
                      setOpen(false);
                    }}
                    title={node.title || t("exercise.questionNav.questionNo", "Question {n}", { n: index + 1 })}
                    aria-current={isCurrent ? "true" : undefined}
                    className={cn(
                      "grid aspect-square place-items-center rounded-xl text-sm font-extrabold transition-all duration-150 ease-bounce hover:-translate-y-0.5",
                      isCurrent
                        ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-300"
                        : isAnswered
                          // Half-strength `mint-300`: `mint-100` does not exist,
                          // so a hover on it would do nothing, and the full rung
                          // is dark enough
                          // to crowd the `mint-700` number sitting on it.
                          ? "bg-mint-bg text-mint-700 hover:bg-mint-300/50"
                          : "border-2 border-dashed border-border bg-background text-muted-foreground hover:border-rose-200",
                    )}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 border-t pt-3 text-[11px] font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded bg-rose-600" />{t("exercise.questionNav.current", "Current")}</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded bg-mint-bg" />{t("exercise.questionNav.answered", "Answered")}</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded border-2 border-dashed border-border" />{t("exercise.questionNav.blank", "Blank")}</span>
            </div>
          </div>
        </>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        {...anchor}
        className={cn(
          // Compact below `sm`: the full "Question 001 / 104 · 040 done" would
          // push Next off an iPhone's screen (see PaginationBar).
          "relative z-10 inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-2.5 py-1.5 text-xs font-bold transition-colors sm:gap-2 sm:px-3.5 md:pointer-fine:min-h-9",
          open ? "border-rose-400 bg-rose-50 text-rose-700" : "border-border bg-card text-foreground hover:border-rose-200",
        )}
      >
        <LayoutGrid className="size-4" />
        <span>
          <span className="hidden sm:inline">{t("exercise.questionNav.question", "Question")} </span>
          <span className="font-mono tabular-nums">{pad(currentIndex + 1)}</span>
          {" / "}
          <span className="font-mono tabular-nums">{pad(test.nodes.length)}</span>
        </span>
        <span className="hidden text-muted-foreground sm:inline">
          · <span className="font-mono tabular-nums">{pad(answeredCount)}</span> {t("exercise.questionNav.done", "done")}
        </span>
      </button>
    </div>
  );
}
