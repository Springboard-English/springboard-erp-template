import type { ReactNode } from "react";
import { ListOrdered } from "lucide-react";
import { QuestionNavPanel, type QuestionNavPanelProps } from "../runner/question-nav";
import { type ExerciseAnswer, type SpringboardTest } from "../lib/exercises";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../exports";
import type { CollectionStub } from "./api";
import { cn } from "../../lib/utils";
import { useStableI18n } from "./i18n";
import { unansweredNodeIds } from "./grading";
import { TOUR_ANCHORS, tourAnchorProps } from "./tour";

interface QuestionListDialogProps {
  test: SpringboardTest;
  answers: Record<string, ExerciseAnswer>;
  currentIndex: number;
  onJump: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionByNode?: Map<string, CollectionStub | null>;
  /** The host's controls at the foot of the list (the editor's Add). */
  actions?: ReactNode;
  states?: QuestionNavPanelProps["states"];
  onReorder?: QuestionNavPanelProps["onReorder"];
  onMoveCollection?: QuestionNavPanelProps["onMoveCollection"];
  /** Leaves the count off the button (the AI import shows it in its steps). */
  hideCount?: boolean;
}

/**
 * The bottom bar's "Question n / N" button and the centred dialog it opens:
 * the paper's questions grouped by part and section, with the legend. Jumping
 * to one closes the dialog.
 */
export function QuestionListDialog({
  test,
  answers,
  currentIndex,
  onJump,
  open,
  onOpenChange,
  collectionByNode,
  actions,
  states = "answers",
  onReorder,
  onMoveCollection,
  hideCount = false,
}: QuestionListDialogProps) {
  const { t } = useStableI18n();
  const total = test.nodes.length;
  if (total < 2 && !actions) return null;
  const done = total - unansweredNodeIds(test, answers).length;
  const width = String(total).length;
  const pad = (n: number) => String(n).padStart(width, "0");

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-haspopup="dialog"
        aria-expanded={open}
        {...tourAnchorProps(TOUR_ANCHORS.runnerQuestionList)}
        className={cn(
          // Compact below `sm` so Next stays on screen.
          "inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-2.5 py-1.5 text-xs font-bold transition-colors sm:gap-2 sm:px-3.5 md:pointer-fine:min-h-9",
          open ? "border-rose-400 bg-rose-50 text-rose-700" : "border-border bg-card text-foreground hover:border-rose-200",
        )}
      >
        <ListOrdered className="size-4" />
        <span>
          <span className="hidden sm:inline">{t("exercise.live.questionList.question", "Question")} </span>
          <span className="font-mono tabular-nums">{pad(currentIndex + 1)}</span> /{" "}
          <span className="font-mono tabular-nums">{pad(total)}</span>
        </span>
        <span className={cn("hidden text-muted-foreground sm:inline", hideCount && "sm:hidden")}>
          {/* A teacher's count is read once, not watched, so it is a plain phrase. */}
          {states === "keys" ? (
            <>· {t("exercise.live.questionList.answered", "{done} of {total} with an answer", { done, total })}</>
          ) : (
            <>
              · <span className="font-mono tabular-nums">{pad(done)}</span> {t("exercise.live.questionList.done", "done")}
            </>
          )}
        </span>
      </button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent aria-describedby={undefined} className="max-h-[85dvh] overflow-y-auto sm:max-w-[40rem]">
          <DialogHeader>
            <DialogTitle>{t("exercise.live.questionList.title", "Questions")}</DialogTitle>
          </DialogHeader>
          <QuestionNavPanel
            untitled
            test={test}
            answers={answers}
            currentIndex={currentIndex}
            onJump={(index) => {
              onJump(index);
              onOpenChange(false);
            }}
            collectionByNode={collectionByNode}
            actions={actions}
            states={states}
            onReorder={onReorder}
            onMoveCollection={onMoveCollection}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
