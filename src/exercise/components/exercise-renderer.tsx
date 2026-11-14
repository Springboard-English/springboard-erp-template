import { CircleAlert, RotateCcw } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useI18n } from "../../context/I18nContext";
import type { ExerciseAnswer, ExerciseNode } from "../lib/exercises";

import { ErrorCorrection } from "./error-correction";
import { EssayResponse } from "./essay-response";
import type { ExerciseMode } from "./frame";
import { InlineBlank } from "./inline-blank";
import { McqChoiceGroup } from "./mcq-choice-group";
import { ShortAnswer } from "./short-answer";
import { SpeakingResponse } from "./speaking-response";
import { SplitView } from "./split-view";
import { TrueFalse } from "./true-false";

export type { ExerciseMode } from "./frame";

type RendererProps = {
  node: ExerciseNode;
  mode?: ExerciseMode;
  value?: ExerciseAnswer;
  onChange?: (value: ExerciseAnswer) => void;
  /** Its section's bank, when a word-formation blank picks its root from one. */
  rootBank?: string[] | null;
};

// The single switch that maps node.type -> a render component. Used by both the
// student runner (practice/result) and the teacher review preview (review).
export function ExerciseRenderer({ node, mode = "practice", value, onChange, rootBank }: RendererProps) {
  const { t } = useI18n();
  switch (node.type) {
    case "mcq":
      return <McqChoiceGroup node={node} mode={mode} value={value} onChange={onChange} />;
    case "gap-filling":
    case "rewriting":
      return <InlineBlank node={node} mode={mode} value={value} onChange={onChange} rootBank={rootBank} />;
    // A question plus a place to type — not a hole in a sentence, so the input
    // goes UNDER the question rather than inside it.
    case "short-answer":
      return <ShortAnswer node={node} mode={mode} value={value} onChange={onChange} />;
    case "error-correction":
      return <ErrorCorrection node={node} mode={mode} value={value} onChange={onChange} />;
    case "reading-full-test":
      return <SplitView node={node} mode={mode} value={value} onChange={onChange} />;
    case "true-false-not-given":
      return <TrueFalse node={node} mode={mode} value={value} onChange={onChange} />;
    case "essay":
      return <EssayResponse node={node} mode={mode} value={value} onChange={onChange} />;
    case "speaking":
      return <SpeakingResponse node={node} mode={mode} value={value} onChange={onChange} />;
    default:
      return <Card><CardContent className="flex items-center gap-3 p-6 text-sm font-bold text-muted-foreground"><CircleAlert className="size-5 text-warning" />{t("exercise.renderer.unsupported", "This question type is not supported yet.")}<Button variant="ghost" size="sm"><RotateCcw className="size-4" />{t("exercise.renderer.reset", "Reset")}</Button></CardContent></Card>;
  }
}
