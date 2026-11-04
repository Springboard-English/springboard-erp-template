import { cn } from "../../lib/utils";
import type { ExerciseNode } from "../lib/exercises";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";

import { Frame, type SubProps } from "./frame";

// true-false-not-given: one statement, three fixed choices. The passage the
// statement is judged against lives on the question's collection (its
// section) and is rendered by the collection context panel, not here.
type TfngNode = Extract<ExerciseNode, { type: "true-false-not-given" }>;

const CHOICES = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
  { value: "not-given", label: "Not Given" },
] as const;

export function TrueFalse({ node, mode, value, onChange }: SubProps<TfngNode>) {
  const chosen = typeof value === "string" ? value : "";
  const pick = (next: string) => {
    if (mode === "result") return;
    onChange?.(next);
  };
  return (
    <Frame node={node} mode={mode}>
      <p
        className={cn(
          promptTextClass(promptDensity(node.content.statement)),
          "text-foreground",
        )}
      >
        {node.content.statement}
      </p>
      <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
        {CHOICES.map((choice) => {
          const selected = chosen === choice.value;
          const isCorrect =
            node.content.answer !== undefined && choice.value === node.content.answer;
          const showResult = mode === "result";
          return (
            <button
              key={choice.value}
              type="button"
              onClick={() => pick(choice.value)}
              className={cn(
                "rounded-sm border-2 px-4 py-3 text-[15px] font-bold transition-all duration-200 ease-bounce",
                selected
                  ? "border-rose-500 bg-rose-50 text-rose-700"
                  : "border-border text-foreground hover:border-rose-300 hover:-translate-y-0.5",
                showResult && isCorrect && "border-success bg-success-bg",
                showResult && selected && !isCorrect && "border-error bg-error-bg",
                mode === "result" && "cursor-default hover:translate-y-0",
              )}
            >
              {choice.label}
            </button>
          );
        })}
      </div>
    </Frame>
  );
}
