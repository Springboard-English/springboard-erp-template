import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { ExerciseNode } from "../lib/exercises";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";
import { EXAM_FIELD_PROPS } from "../lib/exam-field";

import { Frame, type SubProps } from "./frame";

// Large textarea response for essay / longer writing tasks, with a live word count.
type EssayNode = Extract<ExerciseNode, { type: "essay" }>;

export function EssayResponse({ node, mode, value, onChange }: SubProps<EssayNode>) {
  const { t } = useI18n();
  const answer = typeof value === "string" ? value : "";
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  return (
    <Frame node={node} mode={mode}>
      <p className={cn(promptTextClass(promptDensity(node.content.prompt)), "text-foreground")}>{node.content.prompt}</p>
      <Textarea {...EXAM_FIELD_PROPS} value={answer} disabled={mode === "result"} onChange={(event) => onChange?.(event.target.value)} placeholder={node.content.placeholder} className="mt-5 min-h-48 rounded-2xl border-2 bg-card p-4 text-base leading-7" />
      <div className="mt-3 flex justify-between text-xs font-bold text-muted-foreground"><span>{node.content.min_words ? t("exercise.renderer.aimForWords", "Aim for at least {n} words", { n: node.content.min_words }) : t("exercise.renderer.writeClearly", "Write clearly and support your ideas")}</span><span>{t("exercise.renderer.wordCount", "{n} words", { n: wordCount })}</span></div>
    </Frame>
  );
}
