import { CheckCircle2, CircleAlert, PencilLine } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { CategoryPill } from "../components/category-pill";
import type { ExerciseAnswer, SpringboardTest } from "../lib/exercises";
import { questionLabel } from "../lib/question-summary";

// Review-Before-Submit: which exercises are answered vs still blank, with a jump
// back to edit any of them. A row is named by the question's text, not its
// title: a section's questions carry an empty title, so a whole paper would read as
// "1. 2. 3." with nothing to tell a student which blank they had skipped.
export function ReviewChecklist({ test, answers, onEdit }: { test: SpringboardTest; answers: Record<string, ExerciseAnswer>; onEdit: (index: number) => void }) {
  const { t } = useI18n();
  const isAnswered = (id: string) => {
    const answer = answers[id];
    if (answer === undefined || answer === null || answer === "") return false;
    if (typeof answer === "object") return Object.keys(answer).length > 0;
    return true;
  };

  return (
    <div className="divide-y rounded-2xl border bg-card shadow-sm">
      {test.nodes.map((node, index) => {
        const answered = isAnswered(node.id);
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onEdit(index)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs font-extrabold", answered ? "bg-mint-bg text-mint-700" : "bg-butter-bg text-butter-700")}>
                {answered ? <CheckCircle2 className="size-4" /> : <CircleAlert className="size-4" />}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{index + 1}. {questionLabel(node.type, node.content, t, node.title)}</p>
                <div className="mt-1"><CategoryPill skill={node.skillTag} /></div>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-muted-foreground"><PencilLine className="size-4" />{answered ? t("exercise.checklist.edit", "Edit") : t("exercise.checklist.answer", "Answer")}</span>
          </button>
        );
      })}
    </div>
  );
}
