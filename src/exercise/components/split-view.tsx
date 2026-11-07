import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { ExerciseNode } from "../lib/exercises";
import { optionLetters } from "../lib/option-letters";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";

import { Frame, type SubProps } from "./frame";

// Pinned split-view for reading-full-test: source passage stays visible beside
// the answers, and collapses to a toggle on narrow screens.
type SplitNode = Extract<ExerciseNode, { type: "reading-full-test" }>;

export function SplitView({ node, mode, value, onChange }: SubProps<SplitNode>) {
  const { t } = useI18n();
  const [showPassage, setShowPassage] = useState(true);
  // Controlled when a parent passes onChange (student runner); otherwise self-manage
  // so options stay clickable in read-only previews (teacher review).
  const [local, setLocal] = useState("");
  const controlled = onChange !== undefined;
  const chosen = controlled ? (typeof value === "string" ? value : "") : local;
  const pick = (id: string) => {
    if (mode === "result") return;
    if (controlled) onChange?.(id);
    else setLocal(id);
  };
  return (
    <Frame node={node} mode={mode}>
      <div className="mb-4 flex justify-end sm:hidden"><Button variant="secondary" size="sm" onClick={() => setShowPassage((current) => !current)}>{showPassage ? <EyeOff className="size-4" /> : <Eye className="size-4" />}{showPassage ? t("exercise.renderer.hidePassage", "Hide Passage") : t("exercise.renderer.showPassage", "Show Passage")}</Button></div>
      <div className="grid overflow-hidden rounded-xl border shadow-lg lg:grid-cols-[.9fr_1.1fr]">
        <div className={cn("border-b bg-muted p-5 lg:border-b-0 lg:border-r sm:p-8", !showPassage && "hidden sm:block")}><span className="rounded-xs border bg-card px-2.5 py-1.5 font-mono text-[11px] font-bold text-muted-foreground">{t("exercise.renderer.sourcePassage", "📌 source passage")}</span><h3 className="mt-5 text-lg font-bold text-foreground">{node.content.passage_title}</h3>{node.content.passage.map((paragraph) => <p key={paragraph} className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{paragraph}</p>)}</div>
        <div className="bg-card p-5 sm:p-8"><p className={cn(promptTextClass(promptDensity(node.content.prompt)), "text-foreground")}>{node.content.prompt}</p><RadioGroup value={chosen} onValueChange={pick} className="mt-5 grid gap-2.5">{node.content.options.map((option, index) => { const selected = chosen === option.id; return <label key={option.id} onClick={() => pick(option.id)} className={cn("flex cursor-pointer items-center gap-3 rounded-sm border-2 px-4 py-[13px] text-[15px] font-semibold transition-all duration-200 ease-bounce hover:translate-x-1", selected ? "border-rose-500 bg-rose-50" : "border-border hover:border-rose-300")}><RadioGroupItem value={option.id} className="sr-only" /><span className={cn("grid size-7 shrink-0 place-items-center rounded-[9px] bg-muted text-[13px] font-extrabold text-ink-700", selected && "bg-rose-600 text-white")}>{optionLetters(node.content.options)[index]}</span><span>{option.label}</span></label>; })}</RadioGroup></div>
      </div>
    </Frame>
  );
}
