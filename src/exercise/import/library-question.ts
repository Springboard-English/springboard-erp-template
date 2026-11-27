import type {
  AuthoredExercise,
  CollectionLayout,
  CollectionStub,
} from "./api";
import { valueLabel, type Translate } from "./i18n";
import { nodeAnswerError } from "./answer-key";
import { nodeToExercisePost } from "./exercise-import";
import {
  type ExerciseNode,
  QUESTION_TYPE_LABELS,
  sharesOnePool,
  taskRequiredType,
} from "../index";

// The library question page (`/teacher/exercises/:exerciseKey`) edits ONE row
// through ONE PATCH. What is pure about that — which fields moved, what goes in
// the body, what one PATCH cannot safely carry — lives here so it can be tested
// without a screen.

/** What the teacher changed, in the order the bar lists it. */
export type LibraryQuestionField =
  | "type"
  | "skill"
  | "points"
  | "title"
  | "instruction"
  | "question"
  | "explanation"
  | "answer";

export type LibraryQuestionBody = Partial<
  Pick<AuthoredExercise, "type" | "skill" | "points" | "title" | "instruction" | "content" | "answer_key">
>;

export interface LibraryQuestionEdit {
  fields: LibraryQuestionField[];
  /** Only the fields that changed — without `edited_at`, which the screen owns. */
  body: LibraryQuestionBody;
  /** Why this cannot be saved as it stands, or null. */
  blocked: string | null;
}

// Key order and `undefined` members are noise here: the card spreads a patch
// over the content, so a field it added and then cleared leaves an `undefined`
// key behind, and a field it re-set moves to the end. Neither is an edit.
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, member]) => member !== undefined)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([key, member]) => [key, canonical(member)]),
    );
  }
  return value;
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(canonical(a) ?? null) === JSON.stringify(canonical(b) ?? null);
}

/** The layout of the SECTION a question sits in; a part has none. */
export function sectionLayoutOf(
  stub: CollectionStub | null | undefined,
): CollectionLayout | null {
  return stub?.kind === "section" ? (stub.info?.layout ?? null) : null;
}

/**
 * The edit between the stored question and the card's copy of it.
 *
 * Both sides go through `nodeToExercisePost`, the same split the create and the
 * Questions tab use, so a node that round-trips unchanged produces no fields —
 * and `select_count` / `case_sensitive` ride the key exactly as they do there.
 * `source` is never sent: editing an imported question does not make it
 * hand-written. A changed `type` is sent together with the content and the
 * key, because the API validates the three as one.
 */
export function libraryQuestionEdit(
  stored: ExerciseNode,
  edited: ExerciseNode,
  layout: CollectionLayout | null,
  t: Translate,
): LibraryQuestionEdit {
  const before = nodeToExercisePost(stored);
  const after = nodeToExercisePost(edited);
  const fields: LibraryQuestionField[] = [];
  const body: LibraryQuestionBody = {};

  const retyped = stored.type !== edited.type;
  if (retyped) {
    fields.push("type");
    body.type = after.type;
  }
  if (!same(before.skill, after.skill)) {
    fields.push("skill");
    body.skill = after.skill;
  }
  if (!same(before.points, after.points) && after.points !== undefined) {
    fields.push("points");
    body.points = after.points;
  }
  if (!same(before.title, after.title)) {
    fields.push("title");
    body.title = after.title;
  }
  if (!same(before.instruction, after.instruction)) {
    fields.push("instruction");
    body.instruction = after.instruction;
  }

  // The explanation lives in `content`, but it is named on its own: "Question
  // changed" for a typo fixed in the explanation would send a teacher looking at
  // the wording for a change that is not there.
  const { explanation: beforeExplanation, ...beforeRest } = before.content ?? {};
  const { explanation: afterExplanation, ...afterRest } = after.content ?? {};
  if (!same(beforeRest, afterRest)) fields.push("question");
  if (!same(beforeExplanation || undefined, afterExplanation || undefined)) {
    fields.push("explanation");
  }
  if (retyped || fields.includes("question") || fields.includes("explanation")) {
    body.content = after.content;
  }
  if (!same(before.answer_key, after.answer_key)) fields.push("answer");
  if (retyped || fields.includes("answer")) body.answer_key = after.answer_key;

  return { fields, body, blocked: blockedReason(stored, edited, layout, body, t) };
}

/**
 * Why a question switched to another type cannot stay in a section whose
 * layout fixes the type, or null. The API does not check this, so without it
 * the section would break silently.
 */
export function sectionTypeBlock(
  stored: ExerciseNode,
  edited: ExerciseNode,
  layout: CollectionLayout | null,
  t: Translate,
): string | null {
  const required = taskRequiredType(layout);
  if (!required || stored.type === edited.type || edited.type === required) return null;
  return t(
    "exercise.import.libraryQuestion.sectionType",
    "This section only holds {type} questions. Keep that type, or move the question out of the section first.",
    { type: valueLabel(t, QUESTION_TYPE_LABELS[required]).toLowerCase() },
  );
}

function blockedReason(
  stored: ExerciseNode,
  edited: ExerciseNode,
  layout: CollectionLayout | null,
  body: LibraryQuestionBody,
  t: Translate,
): string | null {
  const wrongType = sectionTypeBlock(stored, edited, layout, t);
  if (wrongType) return wrongType;
  // The API re-runs the registry whenever content or the key is sent, so a
  // question left keyless is refused there; say which rather than a 400.
  if (body.content !== undefined || body.answer_key !== undefined) {
    const answerError = nodeAnswerError(edited, t);
    if (answerError) return answerError;
  }
  // A pool section's questions each hold a COPY of one option list, and the
  // student sees the first question's. The Questions tab carries such an edit to
  // every sibling; one PATCH to one row cannot, so it would change a copy nobody
  // sees — or leave the section disagreeing with itself.
  if (sharesOnePool(layout) && stored.type === "mcq" && edited.type === "mcq") {
    if (!same(stored.content.options, edited.content.options)) {
      return t(
        "exercise.import.libraryQuestion.sharedOptions",
        "These options are shared by every question in the section, and this page saves only this one. Change them on the Questions tab of a test the section is on, where the edit reaches them all.",
      );
    }
    if (layout === "multi-select" && stored.content.prompt !== edited.content.prompt) {
      return t(
        "exercise.import.libraryQuestion.sharedWording",
        "Every question in a “choose several” section shares this wording, and this page saves only this one. Change it on the Questions tab of a test the section is on, where the edit reaches them all.",
      );
    }
  }
  return null;
}

/**
 * The part to open for a question that belongs to a collection — a section is
 * reached through its part, as the parts library does. Null for a standalone.
 */
export function partKeyOf(stub: CollectionStub | null | undefined): string | null {
  if (!stub) return null;
  if (stub.kind === "section") return stub.parent?.appsheet_key ?? stub.appsheet_key;
  return stub.appsheet_key;
}

const NAMED_TESTS = 3;

/**
 * What deleting a library question destroys, in the teacher's words.
 *
 * `linkedTests` is the names of the caller's tests that link it, or null when
 * that could not be established. It is a LOWER bound either way: the API cascades
 * the delete onto every test that links the question, including tests the
 * caller cannot see, and there is no endpoint that counts them.
 */
export function questionDeletionConsequences(
  {
    linkedTests,
    collection,
  }: {
    linkedTests: string[] | null;
    collection: CollectionStub | null | undefined;
  },
  t: Translate,
): string[] {
  const lines: string[] = [];
  if (linkedTests === null) {
    lines.push(
      t(
        "exercise.import.libraryQuestion.deleteUnchecked",
        "Leap couldn’t check which tests use it. Every test that does loses it, and every answer students gave to it there is deleted.",
      ),
    );
  } else if (linkedTests.length === 0) {
    lines.push(t("exercise.import.libraryQuestion.deleteNone", "It isn’t on any of your tests."));
  } else {
    const shown = linkedTests.slice(0, NAMED_TESTS).map((name) => `“${name}”`);
    const more = linkedTests.length - shown.length;
    const names = shown.join(", ");
    if (more > 0) {
      lines.push(
        t("exercise.import.libraryQuestion.deleteFromManyMore", "It comes off {n} of your tests: {names} and {more} more.", {
          n: linkedTests.length,
          names,
          more,
        }),
      );
    } else if (linkedTests.length === 1) {
      lines.push(t("exercise.import.libraryQuestion.deleteFromOne", "It comes off 1 of your tests: {names}.", { names }));
    } else {
      lines.push(
        t("exercise.import.libraryQuestion.deleteFromMany", "It comes off {n} of your tests: {names}.", {
          n: linkedTests.length,
          names,
        }),
      );
    }
    lines.push(
      t(
        "exercise.import.libraryQuestion.deleteAnswers",
        "Every answer students gave to it on those tests is deleted, including past runs — their scores and attempt reviews change, and nothing brings the answers back.",
      ),
    );
  }
  lines.push(
    t("exercise.import.libraryQuestion.deleteHiddenTests", "Tests you can’t see lose it too, with their students’ answers to it."),
  );
  if (collection) {
    const name = collection.title?.trim();
    if (collection.kind === "section") {
      lines.push(
        name
          ? t(
              "exercise.import.libraryQuestion.leavesNamedSection",
              "It leaves its section “{name}”; the section keeps its other questions.",
              { name },
            )
          : t("exercise.import.libraryQuestion.leavesSection", "It leaves its section; the section keeps its other questions."),
      );
    } else {
      lines.push(
        name
          ? t(
              "exercise.import.libraryQuestion.leavesNamedPart",
              "It leaves its part “{name}”; the part keeps its other questions.",
              { name },
            )
          : t("exercise.import.libraryQuestion.leavesPart", "It leaves its part; the part keeps its other questions."),
      );
    }
  }
  return lines;
}
