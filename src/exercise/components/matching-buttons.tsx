import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { ExerciseAnswer, ExerciseNode } from "../lib/exercises";
import { optionLetters } from "../lib/option-letters";

// A multiple-matching section: a list of items, each matched to one of a short
// shared set of labels (A-J — speakers, features, categories).
//
// Every item repeats the SAME options, so rendering each as a full MCQ card
// would reprint the whole option list once per question. The paper prints the
// key once and then a letter per item, so that is what this draws: the legend
// at the top, then a compact row of lettered buttons per item.
//
// Underneath, each item is one `mcq` question whose answer is the
// chosen option id. Labels may repeat across items (nothing depletes), which is
// what separates this from a gapped text.
export type MatchingNode = Extract<ExerciseNode, { type: "mcq" }>;

export function MatchingButtons({
  nodes,
  numbers,
  answers,
  onChange,
  mode = "practice",
  showLegend = true,
}: {
  nodes: MatchingNode[];
  /** 1-based question number per node. */
  numbers: number[];
  answers: Record<string, ExerciseAnswer>;
  onChange: (nodeId: string, value: ExerciseAnswer) => void;
  mode?: "practice" | "result";
  /**
   * Print the A-J key above the rows.
   *
   * The caller decides with `showMatchingLegend` (`lib/matching-legend.ts`): off
   * only when a passage is showing AND every label is its bare letter, i.e. the
   * passage's own sections are the choices. Everywhere else this is the only
   * place the choices are spelled out, and bare A-J buttons are unanswerable.
   */
  showLegend?: boolean;
}) {
  const { t } = useI18n();
  // The options are shared; take them from the first item. Letters are the
  // paper's own where the ids carry them ("E for Emma"), else by position.
  const options = nodes[0]?.content.options ?? [];
  const letters = optionLetters(options);
  const letterOf = (index: number) => letters[index];

  return (
    <div className="space-y-4">
      {/* The legend, once — and only when nothing else is printing it. */}
      {showLegend ? (
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <p className="mb-2 text-[11px] font-extrabold text-muted-foreground">
            {t("exercise.renderer.chooseFrom", "Choose from")}
          </p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-start gap-2 text-sm leading-6">
                <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-rose-100 text-xs font-extrabold text-rose-700">
                  {letterOf(index)}
                </span>
                <span className="min-w-0 text-foreground">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        {nodes.map((node, index) => {
          const raw = answers[node.id];
          const value = typeof raw === "string" ? raw : "";
          const correct = node.content.correct_option_id;
          return (
            <div
              key={node.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3 last:border-0"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-muted text-sm font-extrabold text-ink-700">
                {numbers[index]}
              </span>
              <span className="min-w-0 flex-1 text-sm font-semibold text-foreground">
                {node.content.prompt}
              </span>
              <div
                role="radiogroup"
                aria-label={t("exercise.renderer.questionNo", "Question {n}", { n: numbers[index] })}
                className="flex shrink-0 flex-wrap gap-1.5"
              >
                {options.map((option, optionIndex) => {
                  const picked = value === option.id;
                  // In result mode the key is present, so a wrong pick shows as
                  // wrong and the right letter is marked.
                  const isRight = mode === "result" && correct === option.id;
                  const isWrongPick = mode === "result" && picked && !isRight;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      disabled={mode !== "practice"}
                      aria-label={`${numbers[index]}: ${option.label}`}
                      aria-checked={picked}
                      // Each row is an independent single-choice group. Picking
                      // the selected letter again is therefore idempotent; it
                      // must not clear this row, and the same option id may stay
                      // selected on any number of the other rows.
                      onClick={() => {
                        if (!picked) onChange(node.id, option.id);
                      }}
                      className={cn(
                        "grid size-11 place-items-center rounded-xl border-2 md:pointer-fine:size-9 text-sm font-extrabold transition-all duration-150 ease-bounce",
                        mode === "practice" && "hover:-translate-y-0.5",
                        isRight
                          // `mint-700`, not `mint-600`: that shade is not in the
                          // palette, so its utility is never generated and the
                          // letter would be white on nothing. The dark swap is
                          // because 700 is the ramp's light end there.
                          ? "border-mint-700 bg-mint-700 text-white dark:text-mint-bg"
                          : isWrongPick
                            ? "border-error bg-error-bg text-error line-through"
                            : picked
                              ? "border-rose-400 bg-rose-600 text-white shadow-sm"
                              : "border-border bg-card text-foreground hover:border-rose-300",
                      )}
                    >
                      {letterOf(optionIndex)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
