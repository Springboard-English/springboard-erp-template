import { useEffect, useRef, useState } from "react";
import { TOUR_ANCHORS, tourAnchorProps } from "./tour-anchor";
import { Check, ChevronDown } from "lucide-react";

import { useStableI18n } from "./i18n";
import { cn } from "../../lib/utils";

// The AI import's six steps, in the one place they live for the whole import:
// the centre of the runner's top bar, with a six-segment bar along its foot
// (`ImportStepsBar`). Every screen of the import is the runner's frame, so
// they never move. A step opens a card saying what happens in it, what the
// teacher does there and where it stands.

/** The import's steps, in order. */
export type ImportStep = "source" | "detect" | "choose" | "extract" | "review" | "save";

export const IMPORT_STEPS: ImportStep[] = ["source", "detect", "choose", "extract", "review", "save"];

/** The live numbers the steps report. */
export interface ImportStepCounts {
  /** Units picked to import. */
  chosen?: number;
  /** Questions read so far of those expected. */
  read?: number;
  expected?: number;
  /** Questions kept, still needing an answer, and set aside. */
  kept?: number;
  needAnswers?: number;
  discarded?: number;
  /** The save's current step and how far it is. */
  saving?: string | null;
  /** Saved and finished. */
  done?: boolean;
  /** Opens the first kept question with no answer; makes that count a link. */
  onNeedAnswers?: () => void;
}

/** A step's label and its two explanations. */
interface StepText {
  label: string;
  what: string;
  you: string;
}

/** The step texts, translated. */
function useStepTexts(): Record<ImportStep, StepText> {
  const { t } = useStableI18n();
  return {
    source: {
      label: t("exercise.import.importProgress.source", "Source"),
      what: t("exercise.import.importProgress.sourceWhat", "The paper to read: a PDF, an image, or pasted text, and an optional note for the AI."),
      you: t("exercise.import.importProgress.sourceYou", "Upload or paste it, then press Import with AI."),
    },
    detect: {
      label: t("exercise.import.importProgress.detect", "Detect"),
      what: t("exercise.import.importProgress.detectWhat", "The AI reads the whole paper once and finds its parts, sections and questions."),
      you: t("exercise.import.importProgress.detectYou", "Nothing. A long paper takes up to a minute."),
    },
    choose: {
      label: t("exercise.import.importProgress.choose", "Choose"),
      what: t("exercise.import.importProgress.chooseWhat", "What was found, part by part, before anything is extracted."),
      you: t("exercise.import.importProgress.chooseYou", "Tick what to import and leave the rest."),
    },
    extract: {
      label: t("exercise.import.importProgress.extract", "Extract"),
      what: t("exercise.import.importProgress.extractWhat", "Each section is read in its own call: its passage, questions and answers."),
      you: t("exercise.import.importProgress.extractYou", "Start reviewing; questions appear as they arrive."),
    },
    review: {
      label: t("exercise.import.importProgress.review", "Review"),
      what: t("exercise.import.importProgress.reviewWhat", "Every question on the page a student sits it on, answered with the key the AI found."),
      you: t("exercise.import.importProgress.reviewYou", "Fix wording and answers in place, set any the AI left blank, discard what you don't want."),
    },
    save: {
      label: t("exercise.import.importProgress.save", "Save"),
      what: t("exercise.import.importProgress.saveWhat", "Parts, sections and questions are created in your library, and on the test if you chose one."),
      you: t("exercise.import.importProgress.saveYou", "Pick where it goes, then confirm."),
    },
  };
}

/** How far along the import is: the current step's index, or 6 once saved. */
function stepIndex(current: ImportStep, counts: ImportStepCounts): number {
  return counts.done ? IMPORT_STEPS.length : IMPORT_STEPS.indexOf(current);
}

/**
 * The steps for the top bar's centre: from `md` a row of numbered pills
 * (done ticked and quiet, the current one marked), below it the current step's
 * name and number. Either opens the step's card.
 */
export function ImportSteps({ current, counts }: { current: ImportStep; counts: ImportStepCounts }) {
  const { t } = useStableI18n();
  const text = useStepTexts();
  const at = stepIndex(current, counts);
  const [open, setOpen] = useState<ImportStep | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // A press outside the steps, or Escape, closes the card.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const onKey = (event: KeyboardEvent) => (event.key === "Escape" ? setOpen(null) : undefined);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /** Where a step stands now, in a line. */
  const status = (step: ImportStep): string => {
    const index = IMPORT_STEPS.indexOf(step);
    if (index > at) return t("exercise.import.importProgress.upcoming", "Not started");
    if (step === "choose" && counts.chosen !== undefined) {
      return t("exercise.import.importProgress.chosen", "{n} picked to import", { n: counts.chosen });
    }
    if (step === "extract" && counts.expected !== undefined) {
      return t("exercise.import.importProgress.readCount", "{read} of {expected} questions read", {
        read: counts.read ?? 0,
        expected: counts.expected,
      });
    }
    if (step === "review" && counts.kept !== undefined) {
      return t("exercise.import.importProgress.reviewCounts", "{kept} kept · {need} need an answer · {discarded} discarded", {
        kept: counts.kept,
        need: counts.needAnswers ?? 0,
        discarded: counts.discarded ?? 0,
      });
    }
    if (step === "save") {
      if (counts.done) return t("exercise.import.importProgress.saved", "Saved");
      if (counts.saving) return counts.saving;
    }
    return index < at ? t("exercise.import.importProgress.done", "Done") : t("exercise.import.importProgress.now", "Now");
  };

  /** The current step's live status, short enough for its pill. */
  const shortStatus = (step: ImportStep): string | null => {
    if (step === "choose" && counts.chosen !== undefined) {
      return t("exercise.import.importProgress.pickedShort", "{n} picked", { n: counts.chosen });
    }
    if (step === "extract" && counts.expected !== undefined) {
      return t("exercise.import.importProgress.readShort", "{read}/{expected} read", { read: counts.read ?? 0, expected: counts.expected });
    }
    if (step === "review" && counts.kept !== undefined) {
      return t("exercise.import.importProgress.answeredShort", "{done}/{total} with an answer", {
        done: counts.kept - (counts.needAnswers ?? 0),
        total: counts.kept,
      });
    }
    if (step === "save" && counts.saving) return counts.saving;
    return null;
  };

  const toggle = (step: ImportStep) => setOpen((value) => (value === step ? null : step));
  const shown = open ?? null;
  const currentStep = IMPORT_STEPS[Math.min(at, IMPORT_STEPS.length - 1)];

  return (
    <div ref={rootRef} {...tourAnchorProps(TOUR_ANCHORS.importSteps)} className="relative flex min-w-0 justify-center">
      <ol aria-label={t("exercise.import.importProgress.label", "Import progress")} className="flex items-center gap-1 max-md:hidden">
        {IMPORT_STEPS.map((step, index) => {
          const done = index < at;
          const isCurrent = index === at;
          return (
            <li key={step} className="flex items-center gap-1">
              {index > 0 ? (
                <span
                  aria-hidden
                  className={cn(
                    "h-0 w-3 shrink-0 border-t-2 lg:w-5",
                    index <= at ? "border-ink-500/60" : "border-dashed border-ink-300",
                  )}
                />
              ) : null}
              <button
                type="button"
                aria-current={isCurrent ? "step" : undefined}
                aria-expanded={shown === step}
                onClick={() => toggle(step)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full border pr-2.5 pl-1 text-xs transition-colors",
                  isCurrent ? "border-mint-300 bg-mint-bg" : "border-transparent hover:bg-muted",
                  shown === step && !isCurrent && "bg-muted",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-extrabold",
                    done && "border border-ink-300 bg-muted text-foreground",
                    isCurrent && "bg-mint-700 text-white",
                    !done && !isCurrent && "border border-ink-300 bg-card text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3" strokeWidth={3.5} /> : index + 1}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap",
                    isCurrent ? "font-extrabold text-mint-700" : done ? "font-bold text-foreground" : "font-semibold text-muted-foreground",
                    // A laptop names only the current step; the dots carry the rest.
                    !isCurrent && "max-lg:sr-only",
                  )}
                >
                  {text[step].label}
                </span>
                {isCurrent && shortStatus(step) ? (
                  <span className="whitespace-nowrap font-semibold text-mint-700/80">· {shortStatus(step)}</span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Below `md`: the step's number as a badge (the bar under the header shows
          the rest), which opens its card; the bar is too narrow for its name too. */}
      <button
        type="button"
        aria-expanded={shown !== null}
        aria-label={t("exercise.import.importProgress.stepOf", "{label} · {n} of {total}", {
          label: text[currentStep].label,
          n: Math.min(at + 1, IMPORT_STEPS.length),
          total: IMPORT_STEPS.length,
        })}
        onClick={() => toggle(currentStep)}
        className="inline-flex min-h-11 shrink-0 items-center gap-0.5 rounded-full px-1 md:hidden"
      >
        <span className="rounded-full border border-mint-300 bg-mint-bg px-2 py-0.5 text-xs font-extrabold tabular-nums text-mint-700">
          {Math.min(at + 1, IMPORT_STEPS.length)}/{IMPORT_STEPS.length}
        </span>
        <ChevronDown className="size-3.5 text-mint-700" />
      </button>

      {shown ? (
        <div
          role="region"
          aria-label={text[shown].label}
          className="absolute top-full left-1/2 z-40 mt-3 w-[min(92vw,22rem)] -translate-x-1/2 rounded-2xl border bg-card p-4 text-left shadow-xl max-md:fixed max-md:inset-x-3 max-md:top-16 max-md:w-auto max-md:translate-x-0"
        >
          <p className="text-sm font-extrabold text-foreground">
            {t("exercise.import.importProgress.stepN", "Step {n} · {label}", {
              n: IMPORT_STEPS.indexOf(shown) + 1,
              label: text[shown].label,
            })}
          </p>
          <p className="mt-0.5 text-xs font-bold text-mint-700">{status(shown)}</p>
          <p className="mt-2 text-sm leading-6 text-foreground">{text[shown].what}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            <span className="font-bold text-foreground">{t("exercise.import.importProgress.youLabel", "You:")}</span> {text[shown].you}
          </p>
          {shown === "review" && counts.needAnswers && counts.onNeedAnswers ? (
            <button
              type="button"
              className="mt-2 text-sm font-bold text-rose-700 underline underline-offset-2 hover:no-underline"
              onClick={() => {
                setOpen(null);
                counts.onNeedAnswers?.();
              }}
            >
              {t("exercise.import.importProgress.goToNeedAnswer", "Go to the {n} without an answer", { n: counts.needAnswers })}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The six steps as segments along the foot of the top bar, in place of the
 * runner's question line: done quiet, the current one marked, the rest empty.
 */
export function ImportStepsBar({ current, counts }: { current: ImportStep; counts: ImportStepCounts }) {
  const at = stepIndex(current, counts);
  return (
    <div aria-hidden className="grid h-1 grid-cols-6 gap-0.5 bg-background">
      {IMPORT_STEPS.map((step, index) => (
        <span
          key={step}
          className={cn(index < at ? "bg-ink-500/60" : index === at ? "bg-mint-500" : "bg-muted")}
        />
      ))}
    </div>
  );
}
