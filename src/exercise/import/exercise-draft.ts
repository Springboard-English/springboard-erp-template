import type { Translate } from "./i18n";
import {
  spanText,
  type WordSpan,
  exerciseNodeSchema,
  type ExerciseNode,
  type QuestionType,
  type SkillTag,
} from "../index";

// The in-progress shape behind the manual "New exercise" form. A draft holds
// what the teacher has typed so far — every field a string/array the inputs can
// bind to, nothing optional-but-undefined — and `draftToNode` turns it into a
// real `ExerciseNode`, validated by `exerciseNodeSchema`.
//
// Keeping this pure (no React) means the create flow's rules are testable, and
// the form itself stays presentational. Adding a QuestionType means adding it to
// CONTENT_FAMILY plus an `emptyContent` branch and a `buildContent` branch here,
// alongside the schema/renderer changes listed in CLAUDE.md.

// multiple-matching, word-formation and gapped-text are not authorable as
// single exercises — each is a section of per-item questions built by the AI
// extractor (mcq / gap-filling under a collection). The manual composer
// only offers the atomic types below.

/** Content shapes are shared by several question types; this is that grouping. */
export type ContentFamily =
  | "choice"
  | "gap"
  | "short-answer"
  | "error-correction"
  | "split"
  | "tfng"
  | "essay"
  | "speaking";

export const CONTENT_FAMILY: Record<QuestionType, ContentFamily> = {
  mcq: "choice",
  "gap-filling": "gap",
  // A prompt and an input, not a hole in a text — see ShortAnswerDraftContent.
  "short-answer": "short-answer",
  rewriting: "gap",
  "error-correction": "error-correction",
  "reading-full-test": "split",
  "true-false-not-given": "tfng",
  essay: "essay",
  speaking: "speaking",
};

export { QUESTION_TYPE_LABELS } from "../index";

export interface DraftOption {
  id: string;
  label: string;
}

export interface ChoiceContent {
  prompt: string;
  options: DraftOption[];
  correct_option_id: string;
  explanation: string;
}

/** gap-filling, rewriting — the words either side of the blank. */
export interface GapContent {
  before: string;
  after: string;
  // Printed WITH the item rather than around its blank, so neither fits in the
  // anchors: the word a word-formation blank names (student re-forms it), and
  // the sentence a rewrite transforms. Optional on the node, so authoring keeps
  // them as "" and drops them when blank — a stored "" would render an empty
  // chip and an empty line above every question in the run.
  given_word: string;
  source_sentence: string;
  accepted_answers: string[];
  /** GapKey.case_sensitive — emitted only when true (`caseSensitiveFlag`). */
  case_sensitive: boolean;
  placeholder: string;
  explanation: string;
}

/**
 * short-answer — the question, and what counts as an answer to it.
 *
 * `ChoiceContent` with the options swapped for an input. Not `GapContent`:
 * there is nothing for before/after to mean, since a short answer removes
 * nothing from any text.
 */
export interface ShortAnswerContent {
  prompt: string;
  accepted_answers: string[];
  case_sensitive: boolean;
  placeholder: string;
  explanation: string;
}

export interface ErrorCorrectionContent {
  sentence: string;
  /** The marked wrong word or words in `sentence`, or null if unmarked. */
  errorSpan: WordSpan | null;
  accepted_answers: string[];
  case_sensitive: boolean;
  /** Half credit when only identification OR correction is right. */
  partial_credit: boolean;
  placeholder: string;
  explanation: string;
}

export interface SplitContent {
  passage_title: string;
  passage: string[];
  prompt: string;
  options: DraftOption[];
  correct_option_id: string;
}

export interface TfngContent {
  statement: string;
  answer: "" | "true" | "false" | "not-given";
  explanation: string;
}

export interface EssayContent {
  prompt: string;
  placeholder: string;
  /** Kept as a string so the number input can be cleared. */
  min_words: string;
}

export interface SpeakingContent {
  prompt: string;
  /** The longest take in seconds, kept as a string so the input can be cleared. */
  max_seconds: string;
}

export type DraftContent =
  | ChoiceContent
  | GapContent
  | ShortAnswerContent
  | ErrorCorrectionContent
  | SplitContent
  | TfngContent
  | EssayContent
  | SpeakingContent;

export interface ExerciseDraft {
  type: QuestionType;
  skillTag: SkillTag;
  title: string;
  instruction: string;
  points: number;
  content: DraftContent;
}

/** Ids are generated, never typed — teachers see labels, the schema sees ids. */
export function makeOption(index: number): DraftOption {
  return { id: `opt-${index}`, label: "" };
}

export function emptyContent(type: QuestionType): DraftContent {
  switch (CONTENT_FAMILY[type]) {
    case "choice":
      return {
        prompt: "",
        options: [makeOption(1), makeOption(2)],
        correct_option_id: "",
        explanation: "",
      };
    case "gap":
      return {
        before: "",
        after: "",
        given_word: "",
        source_sentence: "",
        accepted_answers: [""],
        case_sensitive: false,
        placeholder: "Type your answer",
        explanation: "",
      };
    case "short-answer":
      return {
        prompt: "",
        accepted_answers: [""],
        case_sensitive: false,
        placeholder: "Type your answer",
        explanation: "",
      };
    case "error-correction":
      return {
        sentence: "",
        errorSpan: null,
        accepted_answers: [""],
        case_sensitive: false,
        partial_credit: false,
        placeholder: "Type the correction",
        explanation: "",
      };
    case "split":
      return {
        passage_title: "",
        passage: [""],
        prompt: "",
        options: [makeOption(1), makeOption(2)],
        correct_option_id: "",
      };
    case "tfng":
      return { statement: "", answer: "", explanation: "" };
    case "essay":
      return { prompt: "", placeholder: "Write your answer here…", min_words: "" };
    case "speaking":
      return { prompt: "", max_seconds: "" };
  }
}

export function emptyDraft(): ExerciseDraft {
  return {
    type: "mcq",
    skillTag: "reading",
    title: "",
    instruction: "",
    points: 1,
    content: emptyContent("mcq"),
  };
}

/** Append-only ids: never reuse an index, so `correct_option_id` can't dangle. */
export function nextOption(options: DraftOption[]): DraftOption {
  const used = new Set(options.map((option) => option.id));
  let index = options.length + 1;
  while (used.has(`opt-${index}`)) index += 1;
  return makeOption(index);
}

const trimmed = (values: string[]) => values.map((v) => v.trim()).filter(Boolean);
const labelled = (options: DraftOption[]) =>
  options.filter((option) => option.label.trim().length > 0);

export type DraftResult =
  | { ok: true; node: ExerciseNode }
  | { ok: false; error: string };

function buildContent(draft: ExerciseDraft): Record<string, unknown> {
  const content = draft.content;
  switch (CONTENT_FAMILY[draft.type]) {
    case "choice": {
      const c = content as ChoiceContent;
      return {
        prompt: c.prompt.trim(),
        options: labelled(c.options),
        correct_option_id: c.correct_option_id,
        // Optional fields must be absent, not "", or they'd render as empty UI.
        ...(c.explanation.trim() ? { explanation: c.explanation.trim() } : {}),
      };
    }
    case "gap": {
      const c = content as GapContent;
      return {
        before: c.before.trim(),
        ...(c.after.trim() ? { after: c.after.trim() } : {}),
        ...(c.given_word.trim() ? { given_word: c.given_word.trim() } : {}),
        ...(c.source_sentence.trim()
          ? { source_sentence: c.source_sentence.trim() }
          : {}),
        accepted_answers: trimmed(c.accepted_answers),
        ...(c.case_sensitive ? { case_sensitive: true } : {}),
        placeholder: c.placeholder.trim() || "Type your answer",
        ...(c.explanation.trim() ? { explanation: c.explanation.trim() } : {}),
      };
    }
    case "short-answer": {
      const c = content as ShortAnswerContent;
      return {
        prompt: c.prompt.trim(),
        accepted_answers: trimmed(c.accepted_answers),
        ...(c.case_sensitive ? { case_sensitive: true } : {}),
        placeholder: c.placeholder.trim() || "Type your answer",
        ...(c.explanation.trim() ? { explanation: c.explanation.trim() } : {}),
      };
    }
    case "error-correction": {
      const c = content as ErrorCorrectionContent;
      // The sentence is stored verbatim — trimming would shift `errorSpan`,
      // which indexes the raw string. The error text is derived from the span
      // so the key can't disagree with what the teacher selected.
      return {
        sentence: c.sentence,
        placeholder: c.placeholder.trim() || "Type the correction",
        ...(c.errorSpan !== null
          ? { error: spanText(c.sentence, c.errorSpan), error_offset: c.errorSpan.start }
          : {}),
        accepted_answers: trimmed(c.accepted_answers),
        ...(c.case_sensitive ? { case_sensitive: true } : {}),
        ...(c.partial_credit ? { partial_credit: true } : {}),
        ...(c.explanation.trim() ? { explanation: c.explanation.trim() } : {}),
      };
    }
    case "split": {
      const c = content as SplitContent;
      return {
        passage_title: c.passage_title.trim(),
        passage: trimmed(c.passage),
        prompt: c.prompt.trim(),
        options: labelled(c.options),
        correct_option_id: c.correct_option_id,
      };
    }
    case "tfng": {
      const c = content as TfngContent;
      return {
        statement: c.statement.trim(),
        ...(c.answer ? { answer: c.answer } : {}),
        ...(c.explanation.trim() ? { explanation: c.explanation.trim() } : {}),
      };
    }
    case "essay": {
      const c = content as EssayContent;
      const min_words = Number.parseInt(c.min_words, 10);
      return {
        prompt: c.prompt.trim(),
        placeholder: c.placeholder.trim() || "Write your answer here…",
        ...(Number.isFinite(min_words) && min_words > 0 ? { min_words } : {}),
      };
    }
    case "speaking": {
      const c = content as SpeakingContent;
      const max_seconds = Number.parseInt(c.max_seconds, 10);
      return {
        prompt: c.prompt.trim(),
        ...(Number.isFinite(max_seconds) && max_seconds > 0 ? { max_seconds } : {}),
      };
    }
  }
}

/**
 * Checks the zod schema can't make: that a chosen answer actually exists among
 * the options, and that a word-bank answer is in the bank. Both would otherwise
 * produce an exercise no student could ever get right.
 */
function answerKeyError(draft: ExerciseDraft, t: Translate): string | null {
  switch (CONTENT_FAMILY[draft.type]) {
    case "choice":
    case "split": {
      const c = draft.content as ChoiceContent | SplitContent;
      const ids = new Set(labelled(c.options).map((option) => option.id));
      return ids.has(c.correct_option_id) ? null : t("exercise.import.draft.chooseCorrect", "Choose which option is correct.");
    }
    case "tfng": {
      const c = draft.content as TfngContent;
      return c.answer ? null : t("exercise.import.answer.chooseTfng", "Choose True, False, or Not Given.");
    }
    case "gap": {
      // `accepted_answers` is optional on the node (the student-safe payload
      // has no answers), so authoring has to require it here.
      const c = draft.content as GapContent;
      return trimmed(c.accepted_answers).length > 0
        ? null
        : t("exercise.import.draft.giveAcceptedAnswer", "Give at least one accepted answer.");
    }
    case "short-answer": {
      const c = draft.content as ShortAnswerContent;
      return trimmed(c.accepted_answers).length > 0
        ? null
        : t("exercise.import.draft.giveAcceptedAnswer", "Give at least one accepted answer.");
    }
    case "error-correction": {
      const c = draft.content as ErrorCorrectionContent;
      if (!c.sentence.trim()) return t("exercise.import.draft.writeErrorSentence", "Write the sentence containing the error.");
      if (c.errorSpan === null) return t("exercise.import.answer.clickErrorWords", "Click the word or words that contain the error.");
      return trimmed(c.accepted_answers).length > 0
        ? null
        : t("exercise.import.draft.giveAcceptedCorrection", "Give at least one accepted correction.");
    }
    default:
      // Essays and speaking are human-graded: there is no answer key to check.
      return null;
  }
}

/** Build (and validate) the ExerciseNode a draft describes. */
export function draftToNode(draft: ExerciseDraft, t: Translate): DraftResult {
  if (!draft.title.trim()) {
    return { ok: false, error: t("exercise.import.draft.giveTitle", "Give the exercise a title.") };
  }
  const keyError = answerKeyError(draft, t);
  if (keyError) return { ok: false, error: keyError };

  const parsed = exerciseNodeSchema.safeParse({
    // The backend assigns the real key; this id is only for local rendering.
    id: "draft",
    type: draft.type,
    skillTag: draft.skillTag,
    title: draft.title.trim(),
    instruction: draft.instruction.trim(),
    points: draft.points,
    content: buildContent(draft),
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue.path.filter((p) => typeof p === "string").join(" ");
    return { ok: false, error: field ? `${field}: ${issue.message}` : issue.message };
  }
  return { ok: true, node: parsed.data };
}

/**
 * A blank node of a given type, ready to be filled in.
 *
 * `draftToNode` cannot do this: it validates, and a blank has no answer yet, so
 * it would refuse. That is right for the manual composer — you finish a question
 * before it exists — and wrong for the AI review, where a hand-added question is
 * deliberately incomplete and `needAnswers` counts it until the teacher fills it,
 * exactly like a question extraction declined to answer.
 *
 * Built through `emptyContent`, so a new question type gets this for free and
 * the two paths cannot drift. The result parses against `exerciseNodeSchema` —
 * pinned in the tests, because a node that fails `safeParse` is dropped to null
 * by AI-extract's `toItem()` and vanishes with no error.
 */
export function blankNodeOfType(
  id: string,
  type: QuestionType,
  skillTag: SkillTag,
): ExerciseNode {
  const content = emptyContent(type) as unknown as Record<string, unknown>;
  const rest = Object.fromEntries(
    Object.entries(content).filter(([key]) => !BLANK_STRIPPED.has(key)),
  );
  return {
    id,
    type,
    skillTag,
    title: "",
    instruction: "",
    points: 1,
    content: rest,
  } as ExerciseNode;
}

// The content field that holds a question's own wording, per type.
const TEXT_FIELD: Record<QuestionType, string> = {
  mcq: "prompt",
  "gap-filling": "before",
  rewriting: "before",
  "short-answer": "prompt",
  "error-correction": "sentence",
  "reading-full-test": "prompt",
  "true-false-not-given": "statement",
  essay: "prompt",
  speaking: "prompt",
};

/**
 * A question switched to another type: a blank of that type (no answer, so the
 * save still asks for one) that keeps the skill, title, instruction, marks,
 * explanation and the question's wording, moved to the new type's text field.
 */
export function retypedNode(node: ExerciseNode, type: QuestionType): ExerciseNode {
  const blank = blankNodeOfType(node.id, type, node.skillTag);
  const from = node.content as Record<string, unknown>;
  const content = { ...(blank.content as Record<string, unknown>) };
  const text = from[TEXT_FIELD[node.type]];
  if (typeof text === "string" && text) content[TEXT_FIELD[type]] = text;
  // Only where the new type has an explanation at all (an essay or a speaking question has none).
  if ("explanation" in content && typeof from.explanation === "string") content.explanation = from.explanation;
  return {
    ...blank,
    title: node.title,
    instruction: node.instruction,
    points: node.points,
    content,
  } as ExerciseNode;
}

/**
 * Draft-content keys a blank node must NOT carry.
 *
 * Two different reasons, both of which bite:
 *
 * 1. THE ANSWER. `accepted_answers: [""]` / `correct_option_id: ""` read as
 *    "answered with nothing" rather than "not answered yet", so `needAnswers`
 *    would stop counting the question and the save would let a blank through.
 * 2. DRAFT-ONLY SHAPES. `emptyContent` returns what the FORM binds to, which is
 *    not the node shape: `errorSpan` is the editor's form of
 *    `error_offset` + `error`, and `answer`/`min_words` are empty strings where the node
 *    wants an enum member and a positive int. Left in, the node fails
 *    `safeParse` — and AI-extract's `toItem()` turns a failed parse into null,
 *    so the question would silently never appear.
 */
const BLANK_STRIPPED = new Set([
  "accepted_answers",
  "correct_option_id",
  "answer",
  "errorSpan",
  "min_words",
  "max_seconds",
  "partial_credit",
]);
