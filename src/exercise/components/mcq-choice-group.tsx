import { useState } from "react";
import { Check, CircleAlert } from "lucide-react";

import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { ExerciseNode } from "../lib/exercises";
import { hasOptionImages } from "../lib/option-images";
import { optionLetters } from "../lib/option-letters";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";

import { Frame, type SubProps } from "./frame";
import { EditableText, OptionImageControls, useNodeEdit } from "./exercise-edit";
import { Plus, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { OptionImage, PICTURED_ROW, PICTURED_TILE } from "./option-image";

// Choice-based answering for mcq. Options render as boxed
// lettered rows with hover, selected, and (in result mode) correct/wrong states.
type ChoiceNode = Extract<ExerciseNode, { type: "mcq" | "reading-full-test" }>;

export function McqChoiceGroup({ node, mode, value, onChange }: SubProps<ChoiceNode>) {
  const { t } = useI18n();
  const { options, prompt, correct_option_id } = node.content;
  const letters = optionLetters(options);
  const pictured = hasOptionImages(options);
  // Controlled when a parent passes onChange (student runner). Otherwise self-manage
  // so options stay clickable in read-only previews (teacher review).
  const [local, setLocal] = useState("");
  const controlled = onChange !== undefined;
  const selected = controlled ? (typeof value === "string" ? value : "") : local;
  const edit = useNodeEdit(node);
  const relabel = (id: string, label: string) =>
    edit?.({ options: options.map((option) => (option.id === id ? { ...option, label } : option)) });
  const pick = (id: string) => {
    if (mode === "result") return;
    if (controlled) onChange?.(id);
    else setLocal(id);
  };
  return (
    <Frame node={node} mode={mode}>
      <p className={cn(promptTextClass(promptDensity(prompt)), "text-foreground")}>
        <EditableText
          value={prompt}
          onChange={edit && ((next) => edit({ prompt: next }))}
          label={t("exercise.edit.prompt", "Question")}
          placeholder={t("exercise.edit.promptPlaceholder", "Type the question")}
        />
      </p>
      <RadioGroup value={selected} onValueChange={pick} className={cn("mt-5 grid gap-2.5", pictured && PICTURED_ROW)}>
        {options.map((option, index) => {
          const isSelected = selected === option.id;
          const isCorrect = mode === "result" && option.id === correct_option_id;
          const isWrong = mode === "result" && isSelected && !isCorrect;
          return (
            <label
              key={option.id}
              // Click the whole row rather than relying on the label forwarding to the
              // sr-only radio (which doesn't reliably fire in every browser).
              onClick={() => pick(option.id)}
              className={cn(
              // Matches design-system `.choice`: 2px border, r-sm (14px), 13/16 padding,
              // hover slides right. Exactly one border-color state is active at a time so
              // the selected/result color always wins over hover — and selection is shown
              // by the rose border + rose letter chip, with no background fill.
              "flex cursor-pointer gap-3 rounded-sm border-2 px-4 py-[13px] text-[15px] font-semibold transition-all duration-200 ease-bounce",
              pictured ? PICTURED_TILE : "items-center hover:translate-x-1",
              mode !== "result" && !isSelected && "border-border hover:border-rose-300",
              mode !== "result" && isSelected && "border-rose-500 bg-rose-50",
              mode === "result" && isCorrect && "border-success bg-success-bg",
              mode === "result" && isWrong && "border-error bg-error-bg",
              mode === "result" && !isCorrect && !isWrong && "border-border",
            )}>
              <RadioGroupItem value={option.id} aria-label={option.label || t("exercise.renderer.optionAria", "Option {letter}", { letter: letters[index] })} className="sr-only" />
              <span className={cn("grid size-7 shrink-0 place-items-center rounded-[9px] bg-muted text-[13px] font-extrabold text-ink-700", mode !== "result" && isSelected && "bg-rose-600 text-white", mode === "result" && isCorrect && "bg-success text-white")}>{letters[index]}</span>
              <span className={cn("flex flex-1 flex-col gap-2", pictured ? "items-center" : "items-start")}>
                {option.image_url ? (
                  <OptionImage url={option.image_url} alt={option.label || t("exercise.renderer.optionPicture", "Picture for option {letter}", { letter: letters[index] })} />
                ) : null}
                {edit ? (
                  <EditableText
                    value={option.label}
                    onChange={(next) => relabel(option.id, next)}
                    label={t("exercise.renderer.optionAria", "Option {letter}", { letter: letters[index] })}
                    placeholder={t("exercise.renderer.optionAria", "Option {letter}", { letter: letters[index] })}
                  />
                ) : option.label ? (
                  <span>{option.label}</span>
                ) : null}
              </span>
              {isCorrect ? <span className="flex items-center gap-1 text-xs font-extrabold text-success"><Check className="springboard-pop size-4" />{t("exercise.renderer.correct", "correct")}</span> : null}
              {isWrong ? <CircleAlert className="size-4 text-error" /> : null}
              {edit ? (
                <OptionImageControls
                  option={option}
                  letter={letters[index]}
                  onChange={(next) => edit({ options: options.map((other) => (other.id === option.id ? next : other)) })}
                />
              ) : null}
              {edit && options.length > 2 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t("exercise.edit.removeOption", "Remove option {letter}", { letter: letters[index] })}
                  onClick={(event) => {
                    event.stopPropagation();
                    edit({
                      options: options.filter((other) => other.id !== option.id),
                      ...(correct_option_id === option.id ? { correct_option_id: "" } : {}),
                    });
                  }}
                >
                  <X className="size-4" />
                </Button>
              ) : null}
            </label>
          );
        })}
      </RadioGroup>
      {edit ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => {
            let n = options.length + 1;
            while (options.some((option) => option.id === `opt-${n}`)) n += 1;
            edit({ options: [...options, { id: `opt-${n}`, label: "" }] });
          }}
        >
          <Plus className="size-4" />
          {t("exercise.edit.addOption", "Add option")}
        </Button>
      ) : null}
    </Frame>
  );
}
