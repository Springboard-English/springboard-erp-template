import type { ReactNode } from "react";

import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useI18n } from "../../context/I18nContext";
import { valueLabel } from "../i18n";
import type { ExerciseAnswer, ExerciseNode } from "../lib/exercises";
import { formatMarks } from "../lib/grading";
import { questionTypeLabel } from "../lib/section-type";
import { CategoryPill } from "./category-pill";
import { Explanation, explanationOf } from "./explanation";

export type ExerciseMode = "practice" | "review" | "result";

/** Shared prop shape for every exercise sub-renderer. */
export type SubProps<T extends ExerciseNode = ExerciseNode> = {
  node: T;
  mode: ExerciseMode;
  value?: ExerciseAnswer;
  onChange?: (value: ExerciseAnswer) => void;
};

/** The white learner-shell card that wraps every question type (skill pill, title, instruction, points). */
export function Frame({ node, children, mode }: { node: ExerciseNode; children: ReactNode; mode: ExerciseMode }) {
  const { t } = useI18n();
  // Not while answering: a printed paper names no skill or task type, and the
  // instruction already says what to do.
  const showPill = mode !== "practice";
  const hasText = Boolean(node.title?.trim() || node.instruction?.trim());
  const points = (
    <Badge variant={mode === "result" ? "secondary" : "outline"}>
      {node.points === 1 ? t("exercise.renderer.pointOne", "1 point") : t("exercise.renderer.pointOther", "{n} points", { n: formatMarks(node.points) })}
    </Badge>
  );
  // With no pill and no text the header would be a tinted band holding only
  // the marks, so the marks sit at the top of the question instead.
  if (!showPill && !hasText) {
    return (
      <Card className="gap-0 overflow-hidden border bg-card pt-0 shadow-sm">
        <CardContent className="p-5 sm:p-7">
          <div className="float-right mb-2 ml-3">{points}</div>
          {children}
          <Explanation text={explanationOf(node.content)} mode={mode} />
        </CardContent>
      </Card>
    );
  }
  return (
    // `gap-0 pt-0`: the template's Card spaces its children by 24px and pads its
    // top, which would leave an untinted strip above the header and a gap below it on
    // top of the content's own padding.
    <Card className="gap-0 overflow-hidden border bg-card pt-0 shadow-sm">
      {/* `flex` spelled out: the template's CardHeader is a grid, where the
          row classes do nothing and the points badge stacks under the pills. */}
      <CardHeader className="flex flex-col gap-4 border-b bg-muted/30 pt-5 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          {showPill ? (
            <CategoryPill skill={node.skillTag} type={valueLabel(t, questionTypeLabel(node.type))} />
          ) : null}
          {/* Most questions carry no title of their own (the instruction sits on
              the section), and an empty block leaves a blank band above the prompt. */}
          {hasText ? (
            <div>
              {node.title?.trim() ? <CardTitle>{node.title}</CardTitle> : null}
              {node.instruction?.trim() ? (
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{node.instruction}</p>
              ) : null}
            </div>
          ) : null}
        </div>
        {points}
      </CardHeader>
      <CardContent className="p-5 sm:p-7">
        {children}
        {/* Every per-question renderer goes through here, so the explanation is
            drawn once rather than in each of the nine, whatever the question
            type. Practice mode never draws it — see Explanation. */}
        <Explanation text={explanationOf(node.content)} mode={mode} />
      </CardContent>
    </Card>
  );
}
