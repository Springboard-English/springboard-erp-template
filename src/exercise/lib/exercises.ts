import { z } from "zod";

import { pickMatchesMark } from "./error-correction";

export const skillTagSchema = z.enum([
  "reading",
  "listening",
  "vocab-grammar",
  "writing",
  // Backed by TEXT on the API since scripts/038, not a native Postgres enum, so
  // the set can grow — and shrink, which an enum label cannot.
  "speaking",
]);
export type SkillTag = z.infer<typeof skillTagSchema>;

/**
 * The skill's name as a teacher reads it.
 *
 * Beside the schema rather than in a component, because it has three callers —
 * the manual composer, `CategoryPill` and the question card's skill picker. A
 * new `SkillTag` needs
 * this map, `SKILL_ACCENTS` (`lib/icons.ts`) and `CategoryPill`'s icon map;
 * `Record<SkillTag, string>` is what makes the first of those a type error
 * rather than a blank label.
 */
export const SKILL_LABELS: Record<SkillTag, string> = {
  reading: "Reading",
  listening: "Listening",
  "vocab-grammar": "Vocabulary & Grammar",
  writing: "Writing",
  speaking: "Speaking",
};

export const questionTypeSchema = z.enum([
  "mcq",
  "gap-filling",
  "short-answer",
  "rewriting",
  "error-correction",
  "reading-full-test",
  "true-false-not-given",
  "essay",
  "speaking",
]);
export type QuestionType = z.infer<typeof questionTypeSchema>;

/** Each question type's English name, as the authoring screens and section labels show it. */
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  mcq: "Multiple choice",
  "gap-filling": "Gap filling",
  "short-answer": "Short answer",
  rewriting: "Sentence rewriting",
  "error-correction": "Error identification & correction",
  "reading-full-test": "Reading passage + question",
  "true-false-not-given": "True / False / Not Given",
  essay: "Essay",
  speaking: "Speaking",
};

const optionSchema = z.object({
  id: z.string(),
  label: z.string(),
  // A picture shown with the choice: its content-hash key, and the signed URL
  // the API served for it. The URL is display-only — see lib/option-images.ts.
  image_key: z.string().optional(),
  image_url: z.string().optional(),
});

const baseExerciseSchema = z.object({
  id: z.string(),
  skillTag: skillTagSchema,
  title: z.string(),
  instruction: z.string(),
  // `nonnegative`, not `positive`: the API accepts `ge=0` and 0 is a real mark
  // meaning the question is worth nothing — a worked example, an unscored
  // practice item. With `positive()` such a question would come back from the
  // server and fail to parse on the way in. Part marks (0.5, 1.25) are real
  // too; the API stores two places, so a third would be refused there.
  points: z
    .number()
    .nonnegative()
    // A tolerance, since 0.29 * 100 is 28.999999999999996 in floating point.
    .refine((n) => Math.abs(n * 100 - Math.round(n * 100)) < 1e-6, "At most two decimal places")
    .default(1),
});

// Answer fields are optional throughout: the API splits the answer out of
// `content` into `answer_key`, and the student-safe endpoint returns content
// WITHOUT it. `authoredExerciseToNode` folds the key back in for teacher views,
// so a node genuinely has no answer whenever the reader isn't allowed one.
// Authoring still requires it — see `answerKeyError` in exercise-draft.ts.
const choiceExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("mcq"),
  content: z.object({
    prompt: z.string(),
    options: z.array(optionSchema).min(2),
    correct_option_id: z.string().optional(),
    // Answer-key only, and legacy: a "choose N" cap stamped at extraction on
    // older rows. The API COUNTS the group when it grades, so nothing here sets
    // it — it is only carried, because a PATCH replaces the whole key.
    select_count: z.number().int().positive().optional(),
    explanation: z.string().optional(),
  }),
});

// A HOLE IN A PRINTED TEXT: `before`/`after` are the words either side of it,
// which is what lets a cloze drop the input back into the passage in the right
// place. They only mean anything when a hole exists.
//
// `rewriting` belongs here and `short-answer` does not: a rewrite is often
// printed as a partial sentence to complete ("Despite ______, we went out"),
// which is a blank like any other, while a short answer removes nothing from
// anything. Mirrors `GapContent` in the API's exercise_schema.py.
const gapExerciseSchema = baseExerciseSchema.extend({
  type: z.enum(["gap-filling", "rewriting"]),
  content: z.object({
    before: z.string(),
    after: z.string().optional(),
    // What the paper prints WITH the item rather than around its blank, and so
    // has no room in the anchors above. `given_word` is the word a
    // word-formation blank names, that the student supplies another FORM of;
    // `source_sentence` is the sentence a rewrite transforms, printed above the
    // one to complete. Both are shown to the student — unlike `placeholder`,
    // which the API strips, neither is or implies the answer, and the item
    // cannot be answered without them.
    given_word: z.string().optional(),
    source_sentence: z.string().optional(),
    accepted_answers: z.array(z.string()).min(1).optional(),
    // Answer-key only, like `accepted_answers`.
    case_sensitive: z.boolean().optional(),
    // Answer-key only: the bank word a banked word-formation blank is formed
    // from. The student picks it, so the answer is `{ root, word }`.
    root: z.string().optional(),
    placeholder: z.string().default("Type your answer"),
    explanation: z.string().optional(),
  }),
});

// A question, and a place to type the answer — structurally `choiceExercise`
// with the options swapped for an input. It is NOT a gap: `before`/`after`
// would have no referent, so a whole question would be split across them and
// the input drawn in the MIDDLE of it ("Why did the company ▢ close?").
//
// The ANSWER is a gap's — a typed string graded against `accepted_answers`, the
// same `GapKey` on the API — so grading and the answer-key path are shared.
const shortAnswerExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("short-answer"),
  content: z.object({
    prompt: z.string(),
    accepted_answers: z.array(z.string()).min(1).optional(),
    case_sensitive: z.boolean().optional(),
    placeholder: z.string().default("Type your answer"),
    explanation: z.string().optional(),
  }),
});

// Error identification & correction. The student reads the UNMARKED `sentence`,
// selects the wrong word or words (identification) and types the fix
// (correction) — the answer is `{ pick, pick_end, fix }`, not a bare string.
// What locates the error is character offsets, never a before/after context
// match: `error_offset` is the mistake's start offset into `sentence` and
// `error` its exact text, which may span several words; the runner reports the
// selection's start and end, so grading is integer compares with no shared
// tokenization contract. `error` and the answer fields are folded back from
// `answer_key` for teacher/result views and absent for students.
const errorCorrectionSchema = baseExerciseSchema.extend({
  type: z.literal("error-correction"),
  content: z.object({
    sentence: z.string(),
    placeholder: z.string().default("Type the correction"),
    error: z.string().optional(),
    error_offset: z.number().int().nonnegative().optional(),
    accepted_answers: z.array(z.string()).min(1).optional(),
    case_sensitive: z.boolean().optional(),
    // When true, a student who gets exactly one of {identify, correct} right
    // earns half the points; graded server-side. See grading.py.
    partial_credit: z.boolean().optional(),
    explanation: z.string().optional(),
  }),
});

// multiple-matching, word-formation and gapped-text are not node types. Each is
// a Collection (section) of independent per-item questions —
// matching/gapped-text as sections of mcq (the shared option pool rides
// on each question), word-formation as a section of gap-filling with the shared
// word box on the section's `info`. The section's `info.layout` records which
// so the runner can draw the combined UI. See collection-context.tsx.

const splitExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("reading-full-test"),
  content: z.object({
    passage_title: z.string(),
    passage: z.array(z.string()).min(1),
    prompt: z.string(),
    options: z.array(optionSchema).min(2),
    correct_option_id: z.string().optional(),
  }),
});

// true-false-not-given: one statement judged against its section's passage.
// The passage lives on the question's Collection (the section), not here —
// TFNG statements come ten to a passage, and repeating the passage per
// statement is what the collection model exists to avoid.
const tfngExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("true-false-not-given"),
  content: z.object({
    statement: z.string(),
    // Folded back from answer_key by authoredExerciseToNode; absent for students.
    answer: z.enum(["true", "false", "not-given"]).optional(),
    explanation: z.string().optional(),
  }),
});

const essayExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("essay"),
  content: z.object({
    prompt: z.string(),
    placeholder: z.string(),
    min_words: z.number().int().positive().optional(),
  }),
});

// speaking: a spoken answer the student records, marked by a teacher. In a
// topic pool the prompt is the one this attempt drew.
const speakingExerciseSchema = baseExerciseSchema.extend({
  type: z.literal("speaking"),
  content: z.object({
    prompt: z.string(),
    max_seconds: z.number().int().positive().optional(),
  }),
});

export const exerciseNodeSchema = z.discriminatedUnion("type", [
  choiceExerciseSchema,
  gapExerciseSchema,
  shortAnswerExerciseSchema,
  errorCorrectionSchema,
  splitExerciseSchema,
  tfngExerciseSchema,
  essayExerciseSchema,
  speakingExerciseSchema,
]);
export type ExerciseNode = z.infer<typeof exerciseNodeSchema>;

export const testSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  teacherName: z.string(),
  status: z.enum(["draft", "published", "completed"]),
  durationMinutes: z.number().int().positive(),
  updatedAt: z.string(),
  nodes: z.array(exerciseNodeSchema).min(1),
});
export type SpringboardTest = z.infer<typeof testSchema>;

export const studentAttemptSchema = z.object({
  testId: z.string(),
  currentIndex: z.number().int().min(0),
  answers: z.record(z.string(), z.unknown()),
  startedAt: z.string().nullable(),
  submitted: z.boolean(),
});
export type StudentAttempt = z.infer<typeof studentAttemptSchema>;

// A single choice or typed answer is a string; matching / word-bank / the
// error-correction {pick, pick_end, fix} are objects keyed by sub-item; a question
// inside a merged "choose N" group holds the WHOLE selection as an array (see
// MultiSelectSection — each question in the group grades by membership).
export type ExerciseAnswer = string | string[] | Record<string, string> | null;

/**
 * The keyed form of an answer, or {} for any other shape.
 *
 * `typeof x === "object"` admits arrays, which a merged "choose N" answer is,
 * so every reader of a `{pick, fix}` / per-sub-item answer goes through this
 * rather than repeating the narrowing and getting it wrong once.
 */
export function answerRecord(
  value: ExerciseAnswer | undefined,
): Record<string, string> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

/**
 * The submission file an essay or a speaking answer was handed in as: the API
 * records `{ file_key }` for an essay written in the student's Doc and for a
 * recording. Null for a typed answer or none.
 */
export function fileAnswerKey(value: ExerciseAnswer | undefined): string | null {
  return answerRecord(value).file_key ?? null;
}

/**
 * A gap answer as its two parts. A banked word-formation blank stores
 * `{ root, word }`; every other gap stores the word as a plain string, which
 * reads here as a word with no root.
 */
export function rootedAnswer(value: ExerciseAnswer | undefined): {
  root: string;
  word: string;
} {
  if (typeof value === "string") return { root: "", word: value };
  const record = answerRecord(value);
  return { root: record.root ?? "", word: record.word ?? "" };
}

/** The stored form of a root pick plus a typed word; null when both are empty. */
export function rootedValue(root: string, word: string): ExerciseAnswer {
  const merged: Record<string, string> = {};
  if (root) merged.root = root;
  if (word) merged.word = word;
  return Object.keys(merged).length ? merged : null;
}

/**
 * Grade an answer client-side. A node whose answer fields are absent (the
 * student-safe payload omits them) is ungradable here, and every branch says so
 * by returning false — never by comparing two undefineds, which would score a
 * blank answer as correct.
 */
export function isCorrectAnswer(node: ExerciseNode, answer: ExerciseAnswer) {
  if (answer === null) return false;
  if (node.type === "mcq" || node.type === "reading-full-test") {
    const expected = node.content.correct_option_id;
    if (expected === undefined) return false;
    // A merged "choose N" group hands every question the whole selection, and
    // each is right if its own option is among it — mirroring grading.py's
    // choice branch, which is what actually scores the run.
    if (Array.isArray(answer)) return answer.includes(expected);
    return answer === expected;
  }
  if (node.type === "gap-filling" || node.type === "short-answer" || node.type === "rewriting") {
    const accepted = node.content.accepted_answers;
    if (accepted === undefined) return false;
    // A banked word-formation answers `{ root, word }`; both must be right, as
    // the server's `correct` bool requires (half marks live on the server).
    const root = "root" in node.content ? node.content.root : undefined;
    const { root: picked, word } = rootedAnswer(answer);
    if (root !== undefined && picked.toLowerCase() !== root.toLowerCase()) return false;
    return accepted.some((item) => item.toLowerCase() === word.trim().toLowerCase());
  }
  if (node.type === "error-correction") {
    // The answer is an object { pick, pick_end, fix } (offsets stored as
    // strings so they fit ExerciseAnswer's Record<string, string>). Fully
    // correct only when the selection is the marked span AND the fix is
    // accepted — partial credit lives on the server; this pure grader is
    // binary, mirroring the API's `correct` bool.
    const { accepted_answers, error, error_offset, case_sensitive } = node.content;
    if (accepted_answers === undefined || error_offset === undefined) return false;
    const record = answerRecord(answer);
    const fix = record.fix ?? "";
    const norm = (value: string) =>
      case_sensitive ? value.trim() : value.trim().toLowerCase();
    const pickOk = pickMatchesMark(record, error_offset, error);
    const fixOk = accepted_answers.some((item) => norm(item) === norm(fix));
    return pickOk && fixOk;
  }
  if (node.type === "true-false-not-given") {
    // Matched case-insensitively, like the server's grader.
    return (
      node.content.answer !== undefined &&
      typeof answer === "string" &&
      answer.trim().toLowerCase() === node.content.answer
    );
  }
  return false;
}
