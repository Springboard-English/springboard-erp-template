import { X } from "lucide-react";
import { useState } from "react";

import { Input } from "../../components/ui/input";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import {
  answerSpan,
  pickMatchesMark,
  spanAnswerFields,
  spanText,
} from "../lib/error-correction";
import {
  huntMarks,
  initialActiveRow,
  labelsByParagraphOffset,
  pickParagraphWord,
} from "../lib/error-hunt";
import { joinPassage } from "../lib/passage";
import {
  answerRecord,
  type ExerciseAnswer,
  type ExerciseNode,
} from "../lib/exercises";
import { EXAM_FIELD_PROPS } from "../lib/exam-field";
import { ClickableSentence, type HighlightRun } from "./clickable-sentence";

// A paragraph-wide error hunt as the STUDENT sits it: "the passage below
// contains FIVE mistakes — underline them and write their correct forms."
//
// The paper gives one passage and a numbered box per mistake, and that is what
// this draws — the same paragraph the teacher's review (ErrorHuntReview) shows,
// rather than one card per question each repeating a single sentence.
//
// The numbered row says which mistake; the click says where. Any word in the
// passage can go in any row: a row is not tied to the sentence its question was
// stored with. Answers stay per question,
// `{ pick, pick_end, fix }`, with the selection's offsets into the JOINED
// passage: the same integers the review stores as `error_offset` (and
// `error_offset + error.length`) and the API grades against.
// `lib/error-hunt.ts` holds the rules, so they are tested without a DOM.

export type ErrorHuntNode = Extract<ExerciseNode, { type: "error-correction" }>;

export function ErrorHuntSection({
  passage,
  nodes,
  numbers,
  answers,
  onChange,
  mode = "practice",
}: {
  /** The section's passage — the paragraph the mistakes are hidden in. */
  passage: string[] | null;
  nodes: ErrorHuntNode[];
  /** 1-based question number per node, as the paper numbers them. */
  numbers: number[];
  answers: Record<string, ExerciseAnswer>;
  onChange: (nodeId: string, value: ExerciseAnswer) => void;
  mode?: "practice" | "result";
}) {
  const { t } = useI18n();
  const text = joinPassage(passage);
  // The row the student chose. Null until they choose one, which reads as "the
  // first row still missing a word".
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const answerOf = (node: ErrorHuntNode) => answerRecord(answers[node.id]);

  const pickedSpans = nodes.map((node) => answerSpan(text, answerOf(node)));
  const labels = labelsByParagraphOffset(text, pickedSpans, numbers);

  // In result mode the key is present, so the right answers can be shown too.
  const { marks } = huntMarks(
    text,
    nodes.map((node) => node.content),
  );
  // A row is right when its selection is exactly its own question's mistake.
  const rowCorrect = nodes.map((node) =>
    pickMatchesMark(answerOf(node), node.content.error_offset, node.content.error),
  );

  const chosen = nodes.findIndex((node) => node.id === activeRowId);
  const activeIndex = chosen >= 0 ? chosen : initialActiveRow(pickedSpans);

  // Each row's pick is one block, coloured by its row; in result mode a
  // mistake nobody picked follows the picks. The active row is a shade deeper.
  const runs: HighlightRun[] = [];
  pickedSpans.forEach((span, row) => {
    if (span === null) return;
    runs.push({
      span,
      className:
        mode === "result"
          ? rowCorrect[row]
            ? "bg-mint-bg font-extrabold text-mint-700"
            : "bg-rose-100 font-extrabold text-rose-700 line-through"
          : cn(
              "font-extrabold text-lav-700",
              row === activeIndex ? "bg-lav-300" : "bg-lav-bg",
            ),
    });
  });
  if (mode === "result") {
    for (const mark of marks) {
      runs.push({
        span: mark.span,
        className: "bg-butter-bg font-bold text-ink-700",
      });
    }
  }

  const pickWord = (paragraphOffset: number) => {
    if (mode !== "practice" || !nodes[activeIndex]) return;
    const { changes, nextActive } = pickParagraphWord(
      text,
      pickedSpans,
      activeIndex,
      paragraphOffset,
    );
    for (const change of changes) {
      const node = nodes[change.row];
      const { fix } = answerOf(node);
      // The typed correction stays whatever happens to the words.
      const next = { ...spanAnswerFields(change.span), ...(fix ? { fix } : {}) };
      onChange(node.id, Object.keys(next).length ? next : null);
    }
    setActiveRowId(nodes[nextActive]?.id ?? null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 bg-card p-4 shadow-sm sm:p-5">
        <p className="mb-3 text-[11px] font-extrabold text-muted-foreground">
          {mode === "practice" ? (
            <>
              {t("exercise.renderer.huntInstruction", "Click the {n} mistakes in the passage — click the next word to add it to a mistake · marking", { n: nodes.length })}{" "}
              <span className="text-lav-700">{numbers[activeIndex]}</span>
            </>
          ) : (
            t("exercise.renderer.thePassage", "The passage")
          )}
        </p>
        <ClickableSentence
          sentence={text}
          selected={null}
          disabled={mode !== "practice"}
          onSelect={pickWord}
          className="text-[15px] leading-8"
          wordBadge={(paragraphOffset) => labels.get(paragraphOffset)}
          runs={runs}
        />
      </div>

      <div className="space-y-2">
        {nodes.map((node, index) => {
          const record = answerOf(node);
          const span = pickedSpans[index];
          const word = span === null ? "" : spanText(text, span);
          const isActive = mode === "practice" && index === activeIndex;
          return (
            <div
              key={node.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl border-2 p-3 transition-colors",
                isActive ? "border-lav-300 bg-lav-bg/40" : "border-border bg-card",
              )}
            >
              <button
                type="button"
                disabled={mode !== "practice"}
                aria-pressed={isActive}
                aria-label={t("exercise.renderer.mistakeNo", "Mistake {n}", { n: numbers[index] })}
                onClick={() => setActiveRowId(node.id)}
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-lg text-[13px] font-extrabold transition-colors md:pointer-fine:size-9",
                  isActive
                    ? "bg-lav-500 text-white"
                    : "bg-muted text-ink-700 enabled:hover:bg-lav-bg",
                )}
              >
                {numbers[index]}
              </button>
              <span
                className={cn(
                  "min-w-[6rem] shrink-0 rounded-lg px-2 py-1 text-sm font-extrabold",
                  word
                    ? "bg-muted text-ink-700 line-through"
                    : mode === "practice"
                      ? "border border-dashed border-lav-300 text-lav-700"
                      : "text-muted-foreground",
                )}
              >
                {word ||
                  (mode !== "practice"
                    ? "—"
                    : isActive
                      ? t("exercise.renderer.clickWord", "click a word")
                      : t("exercise.renderer.needsWord", "needs a word"))}
              </span>
              <span className="shrink-0 text-muted-foreground">→</span>
              <Input
                {...EXAM_FIELD_PROPS}
                value={record.fix ?? ""}
                disabled={mode !== "practice"}
                placeholder={t("exercise.renderer.correctForm", "Correct form")}
                onFocus={() => setActiveRowId(node.id)}
                onChange={(event) =>
                  onChange(node.id, { ...record, fix: event.target.value })
                }
                className="h-11 flex-1"
              />
              {mode === "practice" && (
                // Clears the whole row, word and correction, and leaves it active
                // for the next click. Hidden (not removed) on an empty row so the
                // correction boxes stay aligned down the list.
                <button
                  type="button"
                  aria-label={t("exercise.renderer.clearMistake", "Clear mistake {n}", { n: numbers[index] })}
                  title={t("exercise.renderer.clearAnswer", "Clear this answer")}
                  disabled={!word && !record.fix}
                  onClick={() => {
                    onChange(node.id, null);
                    setActiveRowId(node.id);
                  }}
                  className="grid size-11 shrink-0 place-items-center rounded-lg text-muted-foreground md:pointer-fine:size-9 transition-colors hover:bg-rose-100 hover:text-rose-700 disabled:invisible"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
