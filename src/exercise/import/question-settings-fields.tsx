import { useState, type ReactNode } from "react";
import { BookOpen, ChevronDown, Lightbulb, Plus, X } from "lucide-react";

import {
  type ExerciseNode,
  joinPassage,
  splitPassage,
} from "../index";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "../../exports";
import { useStableI18n } from "./i18n";
import { caseSensitiveFlag, maxSecondsFromInput, minWordsFromInput } from "./content-fields";
import { PassageEditor } from "./passage-editor";
import { cn } from "../../lib/utils";

// The fields of a question that a student never sees, for the runner editor's
// settings dialog: the answers accepted besides the one typed on the page, the
// marking rules, the answer-box hint, explanation and title. Everything a
// student sees, and the type, skill and marks, are edited on the page itself.

type Content = Record<string, unknown>;

// The select's value for "no root": a Select item can't carry an empty value.
const NO_ROOT = "__none__";

function patch(node: ExerciseNode, content: Content): ExerciseNode {
  return { ...node, content: { ...node.content, ...content } } as ExerciseNode;
}

// The accepted-answers editor, shared by every typed-answer question.
//
// gap-filling, rewriting and short-answer ask their question differently — a
// blank in a sentence vs. a prompt — but what counts as a right answer is the
// same list, because they share `GapKey` on the API. Splitting short-answer out
// of the gap branch would otherwise have meant a second copy of this, and a
// teacher's "add an accepted answer" behaving subtly differently per type.
export function AcceptedAnswers({
  node,
  onChange,
  rootBank = null,
}: {
  node: Extract<ExerciseNode, { type: "gap-filling" | "rewriting" | "short-answer" }>;
  onChange: (node: ExerciseNode) => void;
  rootBank?: string[] | null;
}) {
  const { t } = useStableI18n();
  const answers = node.content.accepted_answers ?? [];
  const shown = answers.length ? answers : [""];
  const root = "root" in node.content ? node.content.root : undefined;
  return (
    <div className="mt-4 space-y-2">
      {/* A banked word-formation: the student picks the bank word the blank is
          formed from, and that pick is graded against this. */}
      {rootBank && node.type !== "short-answer" ? (
        <div className="mb-3 space-y-2">
          <label className="text-[11px] font-extrabold text-mint-700">
            {t("exercise.import.extractCard.rootLabel", "Root (from the word bank)")}
          </label>
          <Select
            value={root ?? NO_ROOT}
            onValueChange={(value) => onChange(patch(node, { root: value === NO_ROOT ? undefined : value }))}
          >
            <SelectTrigger
              className="w-full max-w-xs font-bold"
              aria-label={t("exercise.import.extractCard.rootLabel", "Root (from the word bank)")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_ROOT}>{t("exercise.import.extractCard.rootNotGraded", "— not graded —")}</SelectItem>
              {/* A root the bank no longer holds stays visible until it is changed. */}
              {root && !rootBank.includes(root) ? <SelectItem value={root}>{root}</SelectItem> : null}
              {rootBank.map((word) => (
                <SelectItem key={word} value={word}>
                  {word}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      <label className="text-[11px] font-extrabold text-mint-700">
        {t("exercise.import.extractCard.acceptedAnswers", "Accepted answers (any one counts)")}
      </label>
      {shown.map((answer, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={answer}
            onChange={(event) =>
              onChange(
                patch(node, {
                  accepted_answers: shown.map((a, i) =>
                    i === index ? event.target.value : a,
                  ),
                }),
              )
            }
            placeholder={t("exercise.import.extractCard.answerPlaceholder", "An answer you'll accept")}
            className="border-mint-300 bg-mint-bg font-bold text-mint-700"
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={answers.length <= 1}
            onClick={() =>
              onChange(
                patch(node, { accepted_answers: answers.filter((_, i) => i !== index) }),
              )
            }
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => onChange(patch(node, { accepted_answers: [...answers, ""] }))}
      >
        <Plus className="size-4" />
        {t("exercise.import.extractCard.addAnswer", "Add Accepted Answer")}
      </Button>
      <CaseSensitiveToggle
        checked={node.content.case_sensitive ?? false}
        onChange={(checked) =>
          onChange(patch(node, { case_sensitive: caseSensitiveFlag(checked) }))
        }
      />
    </div>
  );
}

// `case_sensitive` on the key (GapKey / ErrorCorrectionKey). The grader honours
// it and the key carries it through every save; this is where a teacher SETS
// it, so a paper where "Paris" and "paris" must be told apart need not be
// imported case-blind.
function CaseSensitiveToggle({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  const { t } = useStableI18n();
  return (
    <label
      className={cn("flex items-center gap-2 text-sm font-bold text-foreground", className)}
    >
      <input
        type="checkbox"
        className="size-4 accent-lav-500"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {t("exercise.import.extractCard.caseSensitive", "Match capital letters exactly")}
    </label>
  );
}

// Why the answer is right, written by the teacher and shown to the student with
// their result.
//
// The verification screen is where this belongs: the extractor often lifts an
// explanation straight off a worked answer key, and this is the one moment
// someone reads every question with the source to hand. It is collapsed unless
// there is already one, so it costs no space on the questions that don't need
// it — but it opens filled when the import brought one, because a wrong
// explanation is exactly the kind of thing that survives to a student.
//
// Only the content shapes that HAVE the field: essay and media questions carry
// no explanation, and reading-full-test's content model has no room for one.
const EXPLAINABLE = new Set([
  "mcq",
  "gap-filling",
  "short-answer",
  "rewriting",
  "error-correction",
  "true-false-not-given",
]);

export function ExplanationField({
  node,
  onChange,
}: {
  node: ExerciseNode;
  onChange: (node: ExerciseNode) => void;
}) {
  const { t } = useStableI18n();
  const current =
    "explanation" in node.content ? (node.content.explanation ?? "") : "";
  const [open, setOpen] = useState(Boolean(current));
  if (!EXPLAINABLE.has(node.type)) return null;
  return (
    <div className="mt-5 border-t pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-2 text-[11px] font-extrabold text-muted-foreground">
          <Lightbulb className="size-3.5 shrink-0" />
          {t("exercise.import.extractCard.explanation", "Explanation")}
          <span className="min-w-0 truncate font-semibold normal-case tracking-normal text-ink-300">
            {current ||
              t("exercise.import.extractCard.explanationHint", "optional · shown with the student's result")}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
      </button>
      {open ? (
        <Textarea
          value={current}
          onChange={(event) =>
            onChange(patch(node, { explanation: event.target.value || undefined }))
          }
          placeholder={t(
            "exercise.import.extractCard.explanationPlaceholder",
            "Why is this the answer? Shown once results are released — never during the exam.",
          )}
          className="mt-3 min-h-16"
        />
      ) : null}
    </div>
  );
}

// Per-question title and instruction, collapsed by default. A question almost
// always inherits its wording from the part/section (shown above the card), so
// these optional overrides stay tucked away until the teacher wants one —
// keeping the card focused on the prompt and answer that actually need checking.
export function TitleFields({
  node,
  onChange,
}: {
  node: ExerciseNode;
  onChange: (node: ExerciseNode) => void;
}) {
  const { t } = useStableI18n();
  const has = Boolean(node.title || node.instruction);
  const [open, setOpen] = useState(has);
  return (
    <div className="mt-5 border-t pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="text-[11px] font-extrabold text-muted-foreground">
          {t("exercise.import.extractCard.titleAndInstruction", "Question title & instruction")}
          <span className="ml-1.5 font-semibold normal-case tracking-normal text-ink-300">
            {t("exercise.import.extractCard.optional", "optional")}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
      </button>
      {open ? (
        <div className="mt-3 space-y-2">
          <Input
            value={node.title}
            onChange={(event) => onChange({ ...node, title: event.target.value })}
            placeholder={t("exercise.import.extractCard.questionTitle", "Question title")}
            className="font-bold"
          />
          <Input
            value={node.instruction}
            onChange={(event) =>
              onChange({ ...node, instruction: event.target.value })
            }
            placeholder={t("exercise.import.extractCard.instruction", "Instruction")}
            className="text-muted-foreground"
          />
        </div>
      ) : null}
    </div>
  );
}

function MoreFields({
  label,
  preview,
  children,
}: {
  label: string;
  preview?: string;
  children: ReactNode;
}) {
  const { t } = useStableI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-5 border-t pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-2 text-[11px] font-extrabold text-muted-foreground">
          <span className="shrink-0">{label}</span>
          <span className="min-w-0 truncate font-semibold normal-case tracking-normal text-ink-300">
            {preview || t("exercise.import.extractCard.optional", "optional")}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
      </button>
      {open ? <div className="mt-3 space-y-2">{children}</div> : null}
    </div>
  );
}

// The typed-answer box's hint (`placeholder`, on GapContent, ShortAnswerContent,
// ErrorCorrectionContent and EssayContent).
//
// Editable so a hint extraction wrote can be checked and cleared, but it reaches
// no student: the API strips it from the student payload (`_TEACHER_ONLY_CONTENT`
// in testing_views.py) because extraction can fill it with the ANSWER, and a
// stored hint cannot be told apart from a leaked one. Students get the
// renderer's default instead — the note says so, or a teacher would write
// guidance nobody reads.
export function PlaceholderField({
  node,
  onChange,
}: {
  node: ExerciseNode;
  onChange: (node: ExerciseNode) => void;
}) {
  const { t } = useStableI18n();
  const value =
    "placeholder" in node.content ? (node.content.placeholder ?? "") : "";
  return (
    <MoreFields label={t("exercise.import.extractCard.hintLabel", "Answer box hint")} preview={value}>
      <Input
        value={value}
        onChange={(event) => onChange(patch(node, { placeholder: event.target.value }))}
        placeholder={t("exercise.import.extractCard.hintPlaceholder", "Type your answer")}
      />
      <p className="text-[11px] font-semibold leading-4 text-muted-foreground">
        {t(
          "exercise.import.extractCard.hintNote",
          "Your preview only. Students never receive it and see the default hint — make sure it doesn’t give the answer away.",
        )}
      </p>
    </MoreFields>
  );
}

// A reading-full-test's own passage: its title and its paragraphs.
//
// Collapsed unless empty (a passage is required — SplitContent's `passage` is
// `min_length=1` — so an empty one is the case that needs attention), with the
// title on the toggle. The text is held as the RAW textarea string and split on
// every change only for the node: splitting and re-joining the value itself eats
// the blank line that starts a new paragraph as it is typed, so a paragraph
// break could never be entered. The card is keyed by question, so this state
// resets when the selection moves.
export function SplitPassageFields({
  node,
  onChange,
}: {
  node: Extract<ExerciseNode, { type: "reading-full-test" }>;
  onChange: (node: ExerciseNode) => void;
}) {
  const { t } = useStableI18n();
  const content = node.content;
  const [open, setOpen] = useState(() => content.passage.length === 0);
  const empty = content.passage.length === 0;
  return (
    <div className="mb-4 rounded-2xl border bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
      >
        <span className="flex min-w-0 items-center gap-2 text-[11px] font-extrabold text-muted-foreground">
          <BookOpen className="size-3.5 shrink-0" />
          <span className="shrink-0">{t("exercise.import.extractCard.passage", "Passage")}</span>
          <span className="min-w-0 truncate font-semibold normal-case tracking-normal text-ink-300">
            {content.passage_title ||
              (empty
                ? t("exercise.import.extractCard.passageNone", "none yet")
                : t("exercise.import.extractCard.passageUntitled", "untitled"))}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
      </button>
      {open ? (
        <div className="space-y-2 border-t p-4">
          <Input
            value={content.passage_title}
            onChange={(event) =>
              onChange(patch(node, { passage_title: event.target.value }))
            }
            placeholder={t("exercise.import.extractCard.passageTitle", "Passage title")}
            className="font-bold"
          />
          <PassageEditor
            value={joinPassage(content.passage)}
            rows={6}
            placeholder={t("exercise.import.extractCard.passagePlaceholder", "The passage")}
            onChange={(next) => onChange(patch(node, { passage: splitPassage(next) ?? [] }))}
          />
          {empty ? (
            <p className="text-xs font-bold text-rose-700">
              {t(
                "exercise.import.extractCard.passageRequired",
                "A passage is required — this question can’t be saved without one.",
              )}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}


/**
 * How a question's answer is marked, where its type has rules beyond the key:
 * an error correction's case and half credit, an essay's minimum words and a
 * speaking take's longest recording.
 */
export function AnswerRules({
  node,
  onChange,
}: {
  node: ExerciseNode;
  onChange: (node: ExerciseNode) => void;
}) {
  const { t } = useStableI18n();
  if (node.type === "error-correction") {
    const content = node.content;
    return (
      <div className="space-y-2">
        <CaseSensitiveToggle
          checked={content.case_sensitive ?? false}
          onChange={(checked) => onChange(patch(node, { case_sensitive: caseSensitiveFlag(checked) }))}
        />
        <label className="flex items-center gap-2 text-sm font-bold text-foreground">
          <input
            type="checkbox"
            className="size-4 accent-lav-500"
            checked={content.partial_credit ?? false}
            onChange={(event) => onChange(patch(node, { partial_credit: event.target.checked }))}
          />
          {t("exercise.import.extractCard.halfCredit", "Award half credit for a partial answer")}
        </label>
      </div>
    );
  }
  if (node.type === "essay") {
    // Printed to the student under the box. Blank is "no minimum": the API refuses 0.
    return (
      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <span>{t("exercise.import.extractCard.minWords", "Minimum words")}</span>
        <Input
          type="number"
          min={1}
          step={1}
          value={node.content.min_words ?? ""}
          onChange={(event) => onChange(patch(node, { min_words: minWordsFromInput(event.target.value) }))}
          placeholder={t("exercise.import.extractCard.minWordsNone", "None")}
          className="h-9 w-24"
        />
      </label>
    );
  }
  if (node.type === "speaking") {
    return (
      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <span>{t("exercise.import.extractCard.maxSeconds", "Longest recording (seconds)")}</span>
        <Input
          type="number"
          min={1}
          max={900}
          step={1}
          value={node.content.max_seconds ?? ""}
          onChange={(event) => onChange(patch(node, { max_seconds: maxSecondsFromInput(event.target.value) }))}
          placeholder={t("exercise.import.extractCard.minWordsNone", "None")}
          className="h-9 w-24"
        />
      </label>
    );
  }
  return null;
}
