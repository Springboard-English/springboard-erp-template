import type {
  AuthoredExercise,
  CollectionStub,
  TestExerciseLink,
} from "./api";
import { valueLabel, type Translate } from "./i18n";
import { questionTypeLabel } from "../index";

// A test's paper structure, derived from what its questions carry.
//
// There is no endpoint that lists a test's parts and sections: the API embeds a
// `CollectionStub` on each exercise (the section it sits in, plus that section's
// part), and `TestCollection` — which does record structure — has no read route.
// So the tree is folded out of the question list here. A part or section with no
// question in the test genuinely is not in the test, which is why a newly added
// one has to travel as a DRAFT until its first question is saved.
//
// The numbering is the other half of the job, and the reason this is a pure
// function with tests rather than inline in the screen. A draft is drawn at the
// position it WILL take — directly after its group's last question, because
// that is where `settleIntoGroup` moves it — and every question after it shifts
// up. Numbering the saved rows alone and tacking drafts onto the end reads as
// "this one goes last", which is exactly what adding to a section must not do:
// a section's questions have to stay contiguous or the runner pages the
// eleventh away from the ten it shares a passage with (see lib/reorder.ts).

export type StructureRow = TestExerciseLink & { exercise: AuthoredExercise };

export interface StructureQuestion {
  /** A saved question's `test_exercise` link key, or a draft's local ref. */
  id: string;
  /** Its 1-based place in the order students will see. */
  number: number;
  /** Auto-gradable but keyless — the work left before the test can run. */
  needsAnswer: boolean;
  /** Added on this screen and not saved yet. */
  draft: boolean;
}

export interface StructureGroup {
  /** The collection's key, a draft's local ref, or null for the loose group. */
  id: string | null;
  kind: "part" | "section" | "loose";
  label: string;
  /** A section's compound task ("Gapped text"), when it declares one. */
  task: string | null;
  draft: boolean;
  questions: StructureQuestion[];
  /** Sections under a part. Always empty on a section and on the loose group. */
  sections: StructureGroup[];
}

/** A part/section the teacher has added but not saved. */
export interface DraftCollectionSpec {
  ref: string;
  kind: "part" | "section";
  /** A draft part this section hangs off, before that part exists. */
  parentRef: string | null;
  /** A saved part this section hangs off. */
  parentKey: string | null;
  title: string;
  instruction: string;
}

/** A question the teacher has added but not saved. */
export interface DraftQuestionSpec {
  ref: string;
  collectionRef: string | null;
  collectionKey: string | null;
  needsAnswer: boolean;
}

export function partOf(stub: CollectionStub | null | undefined): CollectionStub | null {
  if (!stub) return null;
  return stub.kind === "part" ? stub : stub.parent;
}

/**
 * The unit a question's collection is linked to a test through: its part, or
 * a section linked on its own. Empty for a question in no collection.
 */
export function unitOf(stub: CollectionStub | null | undefined): string {
  return (partOf(stub) ?? stub)?.appsheet_key ?? "";
}

export function sectionOf(
  stub: CollectionStub | null | undefined,
): CollectionStub | null {
  return stub?.kind === "section" ? stub : null;
}

export function partLabel(stub: CollectionStub, t: Translate): string {
  return stub.title || t("exercise.import.structure.part", "Part");
}

export function sectionLabel(stub: CollectionStub, t: Translate): string {
  return stub.instruction || stub.title || t("exercise.import.structure.section", "Section");
}

/**
 * The order the test will have once every draft is saved: saved links in their
 * stored order, with each draft spliced in after the last question of the group
 * it belongs to (or appended, for a standalone or a brand-new group).
 */
export function projectedOrder(
  rows: StructureRow[],
  draftQuestions: DraftQuestionSpec[],
): string[] {
  const groupOf = new Map<string, string | null>();
  const parentOf = new Map<string, string | null>();
  for (const row of rows) {
    const stub = row.exercise.collection;
    groupOf.set(row.exercise_key, stub?.appsheet_key ?? null);
    parentOf.set(row.exercise_key, stub?.parent?.appsheet_key ?? null);
  }
  const inGroup = (id: string, groupKey: string): boolean =>
    groupOf.get(id) === groupKey || parentOf.get(id) === groupKey;

  const order = rows.map((row) => row.exercise_key);
  for (const draft of draftQuestions) {
    const groupKey = draft.collectionKey ?? draft.collectionRef;
    groupOf.set(draft.ref, groupKey);
    parentOf.set(draft.ref, null);
    let insertAt = order.length;
    if (groupKey) {
      let last = -1;
      order.forEach((id, index) => {
        if (inGroup(id, groupKey)) last = index;
      });
      if (last >= 0) insertAt = last + 1;
    }
    order.splice(insertAt, 0, draft.ref);
  }
  return order;
}

export function buildStructure({
  rows,
  draftCollections,
  draftQuestions,
  needsAnswer,
  t,
}: {
  rows: StructureRow[];
  draftCollections: DraftCollectionSpec[];
  draftQuestions: DraftQuestionSpec[];
  /** Whether a saved question is missing the key it needs to be graded. */
  needsAnswer: (row: StructureRow) => boolean;
  t: Translate;
}): StructureGroup[] {
  const numberOf = new Map<string, number>();
  projectedOrder(rows, draftQuestions).forEach((id, index) =>
    numberOf.set(id, index + 1),
  );

  const cell = (row: StructureRow): StructureQuestion => ({
    id: row.exercise_key,
    number: numberOf.get(row.exercise_key) ?? 0,
    needsAnswer: needsAnswer(row),
    draft: false,
  });

  const loose: StructureQuestion[] = [];
  const parts: StructureGroup[] = [];
  const partIndex = new Map<string, StructureGroup>();
  const sectionIndex = new Map<string, StructureGroup>();

  const ensurePart = (stub: CollectionStub): StructureGroup => {
    const existing = partIndex.get(stub.appsheet_key);
    if (existing) return existing;
    const group: StructureGroup = {
      id: stub.appsheet_key,
      kind: "part",
      label: partLabel(stub, t),
      task: null,
      draft: false,
      questions: [],
      sections: [],
    };
    partIndex.set(stub.appsheet_key, group);
    parts.push(group);
    return group;
  };

  for (const row of rows) {
    const stub = row.exercise.collection ?? null;
    const part = partOf(stub);
    const section = sectionOf(stub);
    if (!part && !section) {
      loose.push(cell(row));
      continue;
    }
    if (!section) {
      ensurePart(part!).questions.push(cell(row));
      continue;
    }
    // A section whose parent stub the API didn't embed still needs a home, so
    // it is promoted to a top-level group rather than dropped.
    const parent = part ? ensurePart(part) : null;
    let group = sectionIndex.get(section.appsheet_key);
    if (!group) {
      group = {
        id: section.appsheet_key,
        kind: "section",
        label: sectionLabel(section, t),
        task: section.info?.layout
          ? valueLabel(t, questionTypeLabel("mcq", section.info.layout))
          : null,
        draft: false,
        questions: [],
        sections: [],
      };
      sectionIndex.set(section.appsheet_key, group);
      if (parent) parent.sections.push(group);
      else parts.push(group);
    }
    group.questions.push(cell(row));
  }

  // Drafts join the tree they will be saved into, so a new part reads as a part
  // and a question added to a section sits in that section's grid.
  for (const draft of draftCollections) {
    const group: StructureGroup = {
      id: draft.ref,
      kind: draft.kind,
      label:
        draft.kind === "part"
          ? draft.title || t("exercise.import.structure.newPart", "New part")
          : draft.instruction || draft.title || t("exercise.import.structure.newSection", "New section"),
      task: null,
      draft: true,
      questions: [],
      sections: [],
    };
    if (draft.kind === "part") {
      partIndex.set(draft.ref, group);
      parts.push(group);
    } else {
      sectionIndex.set(draft.ref, group);
      const parent =
        (draft.parentKey ? partIndex.get(draft.parentKey) : null) ??
        (draft.parentRef ? partIndex.get(draft.parentRef) : null);
      if (parent) parent.sections.push(group);
      else parts.push(group);
    }
  }

  for (const draft of draftQuestions) {
    const key = draft.collectionKey ?? draft.collectionRef;
    const target = key
      ? (sectionIndex.get(key) ?? partIndex.get(key) ?? null)
      : null;
    const entry: StructureQuestion = {
      id: draft.ref,
      number: numberOf.get(draft.ref) ?? 0,
      needsAnswer: draft.needsAnswer,
      draft: true,
    };
    if (target) target.questions.push(entry);
    else loose.push(entry);
  }

  const out: StructureGroup[] = [];
  // The loose group is kept when empty only if there is nothing else — it is
  // then the one place a first question can be added.
  if (loose.length > 0 || parts.length === 0) {
    out.push({
      id: null,
      kind: "loose",
      label: t("exercise.import.structure.questions", "Questions"),
      task: null,
      draft: false,
      questions: loose,
      sections: [],
    });
  }
  return [...out, ...parts];
}

/** The number a question carries in the rail, for the pane's header. */
export function numberIn(
  groups: StructureGroup[],
  id: string | null,
): number | null {
  if (!id) return null;
  for (const group of groups) {
    for (const question of group.questions) {
      if (question.id === id) return question.number;
    }
    const nested = numberIn(group.sections, id);
    if (nested !== null) return nested;
  }
  return null;
}
