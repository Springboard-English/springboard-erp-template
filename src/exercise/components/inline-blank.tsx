import { Input } from "../../components/ui/input";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { rootedAnswer, rootedValue, type ExerciseNode } from "../lib/exercises";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";
import { EXAM_FIELD_PROPS } from "../lib/exam-field";

import { Frame, type SubProps } from "./frame";
import { RootPick } from "./root-pick";

// Inline gap-fill / rewriting: a HOLE IN A PRINTED TEXT, so the input stays
// embedded in the sentence and grows with its content.
//
// Not short-answer — that has no hole to sit in and renders through
// `short-answer.tsx`, with the input under the question instead of inside it.
type GapNode = Extract<ExerciseNode, { type: "gap-filling" | "rewriting" }>;

// The box does not size itself to the hint: sizing to the answer or placeholder
// would telegraph the answer's length before a word was typed.
const MIN_BLANK_CHARS = 12;

export function InlineBlank({
  node,
  mode,
  value,
  onChange,
  rootBank,
}: SubProps<GapNode> & {
  /** A banked word-formation's bank: the student picks the root first. */
  rootBank?: string[] | null;
}) {
  const { t } = useI18n();
  // The API strips `placeholder` from the student payload — an extracted one can
  // hold the answer — so a student's node carries none and this is what they see.
  const answerHint = t("exercise.renderer.typeAnswer", "Type your answer");
  const { root, word: answer } = rootedAnswer(value);
  // With a bank the answer is `{ root, word }`; without, the word alone.
  const emit = (nextRoot: string, nextWord: string) =>
    onChange?.(rootBank ? rootedValue(nextRoot, nextWord) : nextWord);
  // Absent whenever the reader isn't allowed the answer key (the student-safe
  // payload drops it), so this can't be indexed blind.
  const correct = node.content.accepted_answers?.[0];
  const isCorrect =
    mode === "result" &&
    correct !== undefined &&
    answer.trim().toLowerCase() === correct.toLowerCase();
  const keyedRoot = node.content.root;
  const rootOk =
    mode === "result" && keyedRoot !== undefined
      ? root.toLowerCase() === keyedRoot.toLowerCase()
      : undefined;
  // The stem is one sentence with the input in the middle, so both halves count
  // toward how big it should be rendered.
  const density = promptDensity(node.content.before, node.content.after);
  return (
    <Frame node={node} mode={mode}>
      {/* The sentence a rewrite transforms. Printed ABOVE the frame because
          that is where the paper puts it, and because it is not part of the
          sentence the student completes — folding it into `before` would put it
          inside the line the input sits in. */}
      {node.content.source_sentence ? <p className="mb-3 text-sm leading-6 text-muted-foreground">{node.content.source_sentence}</p> : null}
      <div className={cn(promptTextClass(density, "inline"), "text-foreground")}>
        {node.content.before}{" "}
        {rootBank ? <RootPick bank={rootBank} value={root} disabled={mode === "result"} verdict={rootOk} onChange={(next) => emit(next, answer)} /> : null}
        {/* text-[inherit] per the DS's `.iblank { font-size: inherit }` — a fixed
            16px input inside a 15px sentence sits visibly proud of the line. */}
        <Input {...EXAM_FIELD_PROPS} value={answer} placeholder={node.content.placeholder ?? answerHint} disabled={mode === "result"} onChange={(event) => emit(root, event.target.value)} size={Math.max(answer.length, MIN_BLANK_CHARS)} className={cn("field-sizing-content mx-1 inline-flex h-9 w-auto min-w-[100px] max-w-full shrink-0 align-middle rounded-sm border-2 bg-card px-2.5 py-1 text-center text-[inherit] font-bold focus-visible:translate-y-0", mode === "result" && (isCorrect ? "border-success bg-success-bg text-mint-700" : "border-error bg-error-bg text-error line-through decoration-2"))} />{" "}
        {node.content.after}
        {/* The word the blank NAMES, that the student re-forms. Inline and last,
            as the paper prints it — it belongs to this blank, so it must not be
            mistaken for a bank the whole run draws on (that is `info.word_bank`,
            drawn once by CollectionContext). Never the answer: the answer is a
            form derived from it. */}
        {/* Not beside a root picker: a banked blank's `given_word`, where older
            imports stored one, IS the root the student is asked to pick. */}
        {node.content.given_word && !rootBank ? <span className="ml-2 inline-flex items-center rounded-sm border-2 border-lav-300 bg-lav-bg px-2 py-0.5 align-middle text-xs font-extrabold text-lav-700">{node.content.given_word}</span> : null}
      </div>
      {rootOk !== undefined ? <p className={cn("mt-4 text-sm font-extrabold", rootOk ? "text-mint-700" : "text-error")}>{rootOk ? t("exercise.renderer.rightRoot", "Right root") : t("exercise.renderer.rootIs", "Root: {root}", { root: keyedRoot ?? "" })}</p> : null}
      {mode === "result" && correct !== undefined ? <p className={cn(rootOk === undefined ? "mt-4" : "mt-1", "text-sm font-extrabold", isCorrect ? "text-mint-700" : "text-error")}>{isCorrect ? t("exercise.renderer.correctAnswer", "Correct answer") : t("exercise.renderer.expected", "Expected: {answer}", { answer: correct })}</p> : null}
    </Frame>
  );
}
