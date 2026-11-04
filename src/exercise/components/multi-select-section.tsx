import { Check, CircleAlert } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { ExerciseAnswer, ExerciseNode } from "../lib/exercises";
import { hasOptionImages } from "../lib/option-images";
import { optionLetters } from "../lib/option-letters";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";

import { OptionImage, PICTURED_ROW, PICTURED_TILE } from "./option-image";

// "Choose TWO letters", "Which THREE of the following are mentioned?"
//
// This is N `mcq` questions MERGED INTO ONE for display — which is what the
// exercise actually is: one stem, one option pool, and one mark per correct
// answer. Modelling it as its own type with a set-valued key would make it one
// question worth one mark and need a whole parallel grading path; as a section
// with `layout: "multi-select"` it reuses the existing question, answer shape
// and grader, and "choose three" is worth three marks because it IS three
// questions.
//
// HOW PICKS REACH THE QUESTIONS. Every question in the group is sent the WHOLE
// selection, and each grades right if its own option is among it (see the choice
// branch in grading.py). That is what makes partial marks come out right: picks
// {A, B, D} against keys A, D, F score two — which is what a human marker gives.
//
// The obvious alternative, handing one pick to each question, cannot: the client
// can't see the keys mid-exam, so it would have to assign positionally, and that
// same answer would score one. It would also need the keys stored in a fixed order,
// a contract nothing could enforce. Membership needs no ordering at all.
//
// Over-picking is capped both here (a further tick drops the earliest, since a
// dead checkbox reads as broken) and server-side, where the grader counts the
// group's questions on the test and passes that as `select_count` —
// otherwise a crafted request could select everything and take full marks.
export type MultiSelectNode = Extract<ExerciseNode, { type: "mcq" }>;

export function MultiSelectSection({
  nodes,
  answers,
  onChange,
  mode = "practice",
}: {
  nodes: MultiSelectNode[];
  answers: Record<string, ExerciseAnswer>;
  onChange: (nodeId: string, value: ExerciseAnswer) => void;
  mode?: "practice" | "result";
}) {
  const { t } = useI18n();
  // One stem and one option pool, shared by every question in the section.
  const first = nodes[0];
  const options = first?.content.options ?? [];
  const prompt = first?.content.prompt ?? "";
  const letters = optionLetters(options);
  const pictured = hasOptionImages(options);
  // Every question holds the same selection, so read it off the first one that
  // has an answer at all.
  const picked =
    nodes.map((node) => answers[node.id]).find(Array.isArray) ?? [];
  const chosen = new Set(picked);

  // In result mode the keys are present, so the right answers can be marked.
  const correct = new Set(
    nodes
      .map((node) => node.content.correct_option_id)
      .filter((id): id is string => Boolean(id)),
  );

  /** Give every question in the group the same selection. */
  const broadcast = (ids: string[]) => {
    // Null when nothing is ticked, so the question counts as unanswered rather
    // than as an empty array the grader would have to interpret.
    const value = ids.length ? ids : null;
    for (const node of nodes) onChange(node.id, value);
  };

  const toggle = (id: string) => {
    if (mode !== "practice") return;
    const next = chosen.has(id)
      ? picked.filter((value) => value !== id)
      : [...picked, id];
    // More ticks than the paper allows is not a valid answer to "choose three",
    // so the earliest pick drops out rather than the click being ignored —
    // silently refusing a click reads as a broken checkbox.
    broadcast(
      next.length > nodes.length ? next.slice(next.length - nodes.length) : next,
    );
  };

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <p className={cn(promptTextClass(promptDensity(prompt)), "text-foreground")}>
        {prompt}
      </p>
      {mode !== "result" ? (
        <p className="mt-1.5 text-xs font-bold text-muted-foreground">
          {t("exercise.renderer.chooseSelected", "Choose {n} · {selected} selected", { n: nodes.length, selected: chosen.size })}
        </p>
      ) : null}
      <div className={cn("mt-5 grid gap-2.5", pictured && PICTURED_ROW)}>
        {options.map((option, index) => {
          const isSelected = chosen.has(option.id);
          const isCorrect = mode === "result" && correct.has(option.id);
          const isWrongPick = mode === "result" && isSelected && !isCorrect;
          const isMissed = isCorrect && !isSelected;
          return (
            // A BUTTON, not a <label> wrapping a checkbox. A <button> is a
            // labelable element, so clicking such a label activates the checkbox
            // inside it AND the browser re-dispatches that click, which bubbles
            // back to the label's own onClick: `toggle` would run twice per click
            // and every selection undo itself. One control, one click, one toggle.
            <button
              key={option.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              disabled={mode !== "practice"}
              onClick={() => toggle(option.id)}
              className={cn(
                "flex w-full gap-3 rounded-sm border-2 px-4 py-[13px] text-[15px] font-semibold transition-all duration-200 ease-bounce",
                pictured ? PICTURED_TILE : "items-center text-left",
                mode === "practice" && "cursor-pointer",
                mode === "practice" && !pictured && "hover:translate-x-1",
                mode !== "result" && !isSelected && "border-border hover:border-rose-300",
                mode !== "result" && isSelected && "border-rose-500 bg-rose-50",
                mode === "result" && isCorrect && "border-success bg-success-bg",
                mode === "result" && isWrongPick && "border-error bg-error-bg",
                mode === "result" && !isCorrect && !isWrongPick && "border-border",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-[9px] bg-muted text-[13px] font-extrabold text-ink-700",
                  mode !== "result" && isSelected && "bg-rose-600 text-white",
                  mode === "result" && isCorrect && "bg-success text-white",
                )}
              >
                {letters[index]}
              </span>
              <span className={cn("flex flex-1 flex-col gap-2", pictured ? "items-center" : "items-start")}>
                {option.image_url ? (
                  <OptionImage url={option.image_url} alt={option.label || t("exercise.renderer.optionPicture", "Picture for option {letter}", { letter: letters[index] })} />
                ) : null}
                {option.label ? <span>{option.label}</span> : null}
              </span>
              {isCorrect ? (
                <span className="flex items-center gap-1 text-xs font-extrabold text-success">
                  <Check className="springboard-pop size-4" />
                  {isMissed ? t("exercise.renderer.missed", "missed") : t("exercise.renderer.correct", "correct")}
                </span>
              ) : null}
              {isWrongPick ? <CircleAlert className="size-4 text-error" /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
