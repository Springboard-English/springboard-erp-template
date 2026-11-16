import { useEffect, useMemo, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { LayoutGrid } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { ExerciseAnswer, SpringboardTest } from "../lib/exercises";
import { unansweredNodeIds } from "../lib/grading";
import { useExerciseTourAnchor } from "../lib/tour-anchors";
import { navGroups } from "../lib/question-nav-groups";
import type { CollectionStub } from "../types";
import { collectionHeading } from "../components/collection-context";

// The question navigator for the runner, in the fixed bottom bar: a compact
// toggle (current position + answered count) that opens the paper's question
// list as a side panel down the left edge (a bottom sheet on a phone, per the
// mobile contract). Numbers sit under their part and section, and each shows
// its state (current / answered / blank), so the list doubles as "what have I
// left". Jumping is via the runner's existing `jumpToNode`.
// `open` is CONTROLLED by the bottom bar — see NotesButton for why.
export function QuestionNav({
  test,
  answers,
  currentIndex,
  onJump,
  open,
  onOpenChange,
  collectionByNode,
  actions,
}: {
  /** Each question's part/section, so the numbers sit under their headings. */
  collectionByNode?: Map<string, CollectionStub | null>;
  /** Extra controls under the numbers (the editor's new question, section and part). */
  actions?: ReactNode;
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
  // The panel closes on Escape and on its backdrop.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => (event.key === "Escape" ? setOpen(false) : undefined);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);
  const groups = useMemo(() => navGroups(test.nodes, collectionByNode), [test.nodes, collectionByNode]);

  const unanswered = useMemo(
    () => new Set(unansweredNodeIds(test, answers)),
    [test, answers],
  );
  const answeredCount = test.nodes.length - unanswered.size;
  // Zero-pad + monospace the counts so the toggle keeps a constant width and
  // doesn't nudge the bottom bar as you move between questions.
  const width = String(test.nodes.length).length;
  const pad = (n: number) => String(n).padStart(width, "0");

  // A one-question test needs no navigator (pagination handles it), unless it has actions.
  if (test.nodes.length < 2 && !actions) return null;

  const chip = (index: number) => {
    const node = test.nodes[index];
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
              // Half-strength `mint-300`: `mint-100` does not exist, so a hover on
              // it would do nothing, and the full rung crowds the `mint-700` number.
              ? "bg-mint-bg text-mint-700 hover:bg-mint-300/50"
              : "border-2 border-dashed border-border bg-background text-muted-foreground hover:border-rose-200",
        )}
      >
        {index + 1}
      </button>
    );
  };

  const palette = (
    <div
      role="dialog"
      aria-label={t("exercise.questionNav.title", "Questions")}
      className={cn(
        "fixed z-[60] flex flex-col overflow-y-auto border-border bg-card shadow-xl",
        // A bottom sheet on a phone, a side panel from `md` up.
        "inset-x-0 bottom-0 max-h-[80dvh] rounded-t-3xl border-t-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
        "md:inset-x-auto md:inset-y-0 md:left-0 md:max-h-none md:w-[min(90vw,24rem)] md:rounded-none md:border-r-2 md:border-t-0 md:pt-[max(1rem,env(safe-area-inset-top))]",
      )}
    >
      <p className="mb-3 text-sm font-extrabold text-foreground">{t("exercise.questionNav.title", "Questions")}</p>
      <div className="space-y-4">
        {groups.map((group) => {
          const heading = collectionHeading(group.section ?? group.part, t);
          return (
            <div key={`${group.key}:${group.indices[0]}`} className="space-y-2">
              {group.part ? (
                <p className="text-[11px] font-extrabold text-rose-700">{collectionHeading(group.part, t).part}</p>
              ) : null}
              {group.section && heading.section ? (
                <p className="line-clamp-2 text-xs font-bold text-muted-foreground">{heading.section}</p>
              ) : null}
              {/* Six across keeps each chip at least 44px in the panel's width. */}
              <div className="grid grid-cols-6 gap-1.5 sm:gap-2">{group.indices.map(chip)}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t pt-3 text-[11px] font-semibold text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded bg-rose-600" />{t("exercise.questionNav.current", "Current")}</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded bg-mint-bg" />{t("exercise.questionNav.answered", "Answered")}</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded border-2 border-dashed border-border" />{t("exercise.questionNav.blank", "Blank")}</span>
      </div>
      {actions ? <div className="mt-3 flex flex-col gap-2 border-t pt-3">{actions}</div> : null}
    </div>
  );

  return (
    <div className="relative">
      {open
        ? // Portalled so a transformed footer can't trap it, with a backdrop
          // that closes it.
          createPortal(
            <>
              <button
                type="button"
                aria-label={t("exercise.questionNav.close", "Close")}
                className="fixed inset-0 z-[59] cursor-default bg-black/30"
                onClick={() => setOpen(false)}
              />
              {palette}
            </>,
            document.body,
          )
        : null}

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
