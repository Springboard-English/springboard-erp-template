import { Lightbulb } from "lucide-react";

import { cn } from "../../lib/utils";

// Why the answer is what it is, shown once the score is out, for every question
// type that carries one.
//
// **It is never rendered in practice mode.** The explanation gives the answer
// away, which is why the API strips it out of the live question payload
// (`build_student_exercise_response`) and releases it with the gated result
// instead. This component only ever has something to draw once that has
// happened; the `mode` guard is the second lock, so a future caller that passes
// a teacher-side node into a student screen still can't leak it.
export function Explanation({
  text,
  mode,
  className,
}: {
  text: string | undefined;
  mode?: "practice" | "review" | "result";
  className?: string;
}) {
  if (!text || mode === "practice") return null;
  return (
    <div
      className={cn(
        "mt-5 flex items-start gap-2.5 rounded-2xl bg-success-bg p-4 text-sm font-semibold text-mint-700",
        className,
      )}
    >
      <Lightbulb className="mt-0.5 size-4 shrink-0" />
      <span className="min-w-0">{text}</span>
    </div>
  );
}

/** The explanation off any node whose content shape carries one. */
export function explanationOf(content: unknown): string | undefined {
  if (!content || typeof content !== "object") return undefined;
  const value = (content as { explanation?: unknown }).explanation;
  return typeof value === "string" && value.trim() ? value : undefined;
}
