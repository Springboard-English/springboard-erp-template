import type {
  CollectionInfo,
  DetectStructure,
  ExtractedCollection,
} from "./api";
import type { ExerciseNode } from "../index";
import type { UnitOutcome } from "./import-issues";

// An AI import's draft paper, as one reducer: the detected structure, its
// parts and sections, every unit's extracted questions and how its call came
// out, and the teacher's edits on top (discards, order, hand-added questions,
// error-hunt flags). One owner for "this import" is what lets a new import
// start clean, and keeps each change testable without the screen.

/** One reviewable question: the node and its place in the paper. */
export interface ReviewItem {
  node: ExerciseNode;
  collectionRef: string | null;
  collectionOrder: number | null;
}

/** One detected unit's questions: `pending` until its extract call answers. */
export interface UnitState {
  status: "pending" | "done" | "failed";
  items: ReviewItem[];
}

/**
 * The `units` bucket for questions in no collection at all. Only hand-added
 * questions land here, and no detected ref can take this name. Hand-added
 * questions on a part (in no section) likewise sit in a bucket keyed by the
 * part's ref.
 */
export const LOOSE_REF = "__loose__";

/** The whole draft. */
export interface ImportDraft {
  structure: DetectStructure | null;
  collections: ExtractedCollection[];
  units: Record<string, UnitState>;
  outcomes: Record<string, UnitOutcome>;
  /** Extract calls answered, of those sent. */
  progress: { done: number; total: number };
  dropped: Set<string>;
  /** A teacher-set order over the kept questions' ids; null until one is set. */
  orderOverride: string[] | null;
  /** Questions added by hand: only these may be re-typed, and a Retry keeps them. */
  manualIds: Set<string>;
  /** Sections set as a passage error hunt, which stores no layout. */
  huntRefs: Set<string>;
  /** Monotonic, so a hand-made id or ref is never reused. */
  manualCount: number;
  /** Files read into this review; prefixes a later file's refs. */
  fileCount: number;
}

/** Where a hand-added question goes. */
export type AddTarget = { kind: "section"; ref: string } | { kind: "loose" } | { kind: "part"; partRef: string };

/**
 * A part, or a section into `toPartRef` (its own part or another), placed
 * before `beforeRef` among its siblings, or last when that is null.
 */
export type DraftCollectionMove =
  | { kind: "part"; ref: string; beforeRef: string | null }
  | { kind: "section"; ref: string; toPartRef: string; beforeRef: string | null };

/**
 * The question list's move as a draft move. The list's `index` counts only the
 * parts and sections it shows (an empty section has no questions to show), in
 * `shown` order (refs as they appear in the paper), so it is turned into the
 * sibling the moved one lands before.
 */
export function draftMoveFromNav(
  move: { kind: "part"; key: string; index: number } | { kind: "section"; key: string; toPartKey: string; index: number },
  shown: { parts: string[]; sectionsByPart: Map<string, string[]> },
): DraftCollectionMove {
  if (move.kind === "part") {
    const rest = shown.parts.filter((ref) => ref !== move.key);
    return { kind: "part", ref: move.key, beforeRef: rest[move.index] ?? null };
  }
  const rest = (shown.sectionsByPart.get(move.toPartKey) ?? []).filter((ref) => ref !== move.key);
  return { kind: "section", ref: move.key, toPartRef: move.toPartKey, beforeRef: rest[move.index] ?? null };
}

/** `list` with `item` (taken out first) put before the entry `before` picks, or last. */
function placeBefore<T>(list: T[], item: T, before: ((entry: T) => boolean) | null): T[] {
  const rest = list.filter((entry) => entry !== item);
  const at = before ? rest.findIndex(before) : -1;
  return at < 0 ? [...rest, item] : [...rest.slice(0, at), item, ...rest.slice(at)];
}

/**
 * The draft with a part or section moved: the structure (which the review is
 * drawn from), and the collections in the new order with a moved section's
 * parent, each section's position in its part, and the parts' positions
 * reassigned in their new order (parts link to a test in collection order).
 */
function moveCollection(draft: ImportDraft, move: DraftCollectionMove): ImportDraft {
  if (!draft.structure) return draft;
  let parts = draft.structure.parts;
  if (move.kind === "part") {
    const part = parts.find((p) => p.ref === move.ref);
    if (!part) return draft;
    parts = placeBefore(parts, part, move.beforeRef ? (p) => p.ref === move.beforeRef : null);
  } else {
    const from = parts.find((p) => p.sections.some((s) => s.ref === move.ref));
    const section = from?.sections.find((s) => s.ref === move.ref);
    if (!section || !parts.some((p) => p.ref === move.toPartRef)) return draft;
    const moved = { ...section, parent_ref: move.toPartRef };
    parts = parts.map((p) => {
      const others = p.sections.filter((s) => s.ref !== move.ref);
      if (p.ref !== move.toPartRef) return others.length === p.sections.length ? p : { ...p, sections: others };
      return { ...p, sections: placeBefore([...others, moved], moved, move.beforeRef ? (s) => s.ref === move.beforeRef : null) };
    });
  }
  const byRef = new Map(draft.collections.map((c) => [c.ref, c]));
  // The parts keep the positions they held between them, in their new order.
  const partPositions = draft.collections
    .filter((c) => c.kind === "part" && c.position !== null)
    .map((c) => c.position as number)
    .sort((a, b) => a - b);
  const ordered: ExtractedCollection[] = [];
  parts.forEach((part, index) => {
    const col = byRef.get(part.ref);
    if (col) ordered.push({ ...col, position: partPositions[index] ?? col.position });
    part.sections.forEach((section, sIndex) => {
      const sec = byRef.get(section.ref);
      if (sec) ordered.push({ ...sec, parent_ref: part.ref, position: sIndex });
    });
  });
  const placed = new Set(ordered.map((c) => c.ref));
  return {
    ...draft,
    structure: { ...draft.structure, parts },
    collections: [...ordered, ...draft.collections.filter((c) => !placed.has(c.ref))],
  };
}

/** Every change the import screen makes to its draft. */
export type ImportDraftAction =
  | { type: "reset" }
  | { type: "begin"; structure: DetectStructure; append: boolean }
  | { type: "unitPending"; ref: string }
  | {
      type: "unitResolved";
      ref: string;
      items: ReviewItem[];
      outcome: UnitOutcome;
      /** What the extract read for the unit's own collection (passage, word bank, prompts). */
      collection?: Partial<ExtractedCollection>;
    }
  | { type: "progressBump" }
  | { type: "updateNode"; id: string; node: ExerciseNode }
  | { type: "updateCollection"; ref: string; patch: Partial<ExtractedCollection> }
  | { type: "setSectionMarks"; ref: string; points: number }
  | { type: "toggleDropped"; id: string }
  | { type: "moveBlanks"; ref: string; passage: string[]; order: string[] }
  | { type: "setOrder"; order: string[] | null }
  | { type: "moveCollection"; move: DraftCollectionMove }
  | { type: "setHunt"; ref: string; hunt: boolean }
  | { type: "addPart" }
  | { type: "addSection"; partRef: string }
  | { type: "addQuestion"; target: AddTarget; node: ExerciseNode };

/** A draft with nothing in it. */
export function emptyDraft(): ImportDraft {
  return {
    structure: null,
    collections: [],
    units: {},
    outcomes: {},
    progress: { done: 0, total: 0 },
    dropped: new Set(),
    orderOverride: null,
    manualIds: new Set(),
    huntRefs: new Set(),
    manualCount: 0,
    fileCount: 0,
  };
}

/** The id the next hand-added question will get, so the caller can select it. */
export function nextManualId(draft: ImportDraft): string {
  return `manual-${draft.manualCount}`;
}

/** The ref the next hand-made part or section will get. */
export function nextCollectionRef(draft: ImportDraft): string {
  return `manual-col-${draft.manualCount}`;
}

/**
 * The part/section skeleton (in reading order); passages fill on extract.
 * `partOffset` places a later file's parts after the parts already reviewed.
 */
export function buildCollections(structure: DetectStructure, partOffset = 0): ExtractedCollection[] {
  const collections: ExtractedCollection[] = [];
  structure.parts.forEach((part, index) => {
    collections.push({
      ref: part.ref,
      parent_ref: null,
      kind: "part",
      title: part.title || null,
      instruction: part.instruction || null,
      passage_title: part.passage_title || null,
      passage: part.passage_excerpt ? splitParagraphs(part.passage_excerpt) : null,
      info: null,
      position: partOffset + index,
    });
    part.sections.forEach((section, sIndex) => {
      collections.push({
        ref: section.ref,
        parent_ref: part.ref,
        kind: "section",
        title: null,
        instruction: section.instruction || null,
        passage_title: section.passage_title || null,
        passage: null,
        // The layout is known from detection; word_bank fills on extract.
        info: section.layout ? { layout: section.layout as CollectionInfo["layout"] } : null,
        position: sIndex,
      });
    });
  });
  return collections;
}

/** A verbatim passage excerpt as display paragraphs. */
function splitParagraphs(excerpt: string): string[] {
  const paras = excerpt.split("\n\n").map((p) => p.trim()).filter(Boolean);
  return paras.length ? paras : excerpt.trim() ? [excerpt.trim()] : [];
}

/** Every unit in a structure, pending. */
function pendingUnits(structure: DetectStructure): Record<string, UnitState> {
  const units: Record<string, UnitState> = {};
  for (const part of structure.parts) {
    for (const section of part.sections) units[section.ref] = { status: "pending", items: [] };
  }
  return units;
}

/** Map every unit's items through `fn`. */
function mapItems(units: Record<string, UnitState>, fn: (item: ReviewItem) => ReviewItem): Record<string, UnitState> {
  const next: Record<string, UnitState> = {};
  for (const [ref, unit] of Object.entries(units)) next[ref] = { ...unit, items: unit.items.map(fn) };
  return next;
}

/** A Set with one value added or removed. */
function toggled<T>(set: Set<T>, value: T, on: boolean): Set<T> {
  const next = new Set(set);
  if (on) next.add(value);
  else next.delete(value);
  return next;
}

/** The draft after one change. Pure: the same draft and action give the same result. */
export function importDraftReducer(draft: ImportDraft, action: ImportDraftAction): ImportDraft {
  switch (action.type) {
    case "reset":
      return emptyDraft();

    case "begin": {
      const units = pendingUnits(action.structure);
      const added = Object.keys(units).length;
      if (!action.append) {
        // A new paper: nothing of the last one carries over.
        return {
          ...emptyDraft(),
          structure: action.structure,
          collections: buildCollections(action.structure),
          units,
          progress: { done: 0, total: added },
          fileCount: 1,
        };
      }
      // Everything reviewed so far stays as it is; the new file's parts follow.
      return {
        ...draft,
        structure: { parts: [...(draft.structure?.parts ?? []), ...action.structure.parts] },
        collections: [...draft.collections, ...buildCollections(action.structure, draft.structure?.parts.length ?? 0)],
        units: { ...draft.units, ...units },
        progress: { done: draft.progress.done, total: draft.progress.total + added },
        fileCount: draft.fileCount + 1,
      };
    }

    case "unitPending":
      return draft.outcomes[action.ref]
        ? { ...draft, outcomes: { ...draft.outcomes, [action.ref]: { ...draft.outcomes[action.ref], status: "pending" } } }
        : draft;

    case "unitResolved": {
      // Questions the teacher added to this unit survive a Retry's result.
      const kept = (draft.units[action.ref]?.items ?? []).filter((item) => draft.manualIds.has(item.node.id));
      return {
        ...draft,
        collections: action.collection
          ? draft.collections.map((c) =>
              c.ref === action.ref
                ? {
                    ...c,
                    ...action.collection,
                    // The extract's info (a word bank) adds to the layout detection set.
                    info: action.collection?.info ? { ...c.info, ...action.collection.info } : c.info,
                  }
                : c,
            )
          : draft.collections,
        units: {
          ...draft.units,
          [action.ref]: { status: action.items.length ? "done" : "failed", items: [...action.items, ...kept] },
        },
        outcomes: { ...draft.outcomes, [action.ref]: action.outcome },
      };
    }

    case "progressBump":
      return {
        ...draft,
        progress: { done: Math.min(draft.progress.done + 1, draft.progress.total), total: draft.progress.total },
      };

    case "updateNode":
      return { ...draft, units: mapItems(draft.units, (item) => (item.node.id === action.id ? { ...item, node: action.node } : item)) };

    case "updateCollection":
      return { ...draft, collections: draft.collections.map((c) => (c.ref === action.ref ? { ...c, ...action.patch } : c)) };

    case "setSectionMarks": {
      const unit = draft.units[action.ref];
      if (!unit) return draft;
      return {
        ...draft,
        units: {
          ...draft.units,
          [action.ref]: { ...unit, items: unit.items.map((item) => ({ ...item, node: { ...item.node, points: action.points } })) },
        },
      };
    }

    case "toggleDropped":
      return { ...draft, dropped: toggled(draft.dropped, action.id, !draft.dropped.has(action.id)) };

    case "moveBlanks": {
      // A cloze's blanks moved: its passage, and its questions in the new token order.
      const rank = new Map(action.order.map((id, index) => [id, index]));
      const unit = draft.units[action.ref];
      const members = new Set(action.order);
      const queue = [...action.order];
      return {
        ...draft,
        collections: draft.collections.map((c) => (c.ref === action.ref ? { ...c, passage: action.passage } : c)),
        units: unit
          ? {
              ...draft.units,
              [action.ref]: {
                ...unit,
                items: [...unit.items]
                  .sort((a, b) => (rank.get(a.node.id) ?? 0) - (rank.get(b.node.id) ?? 0))
                  .map((item, index) => ({ ...item, collectionOrder: index })),
              },
            }
          : draft.units,
        orderOverride: draft.orderOverride?.map((id) => (members.has(id) ? (queue.shift() ?? id) : id)) ?? null,
      };
    }

    case "setOrder":
      return { ...draft, orderOverride: action.order };

    case "moveCollection":
      return moveCollection(draft, action.move);

    case "setHunt":
      return { ...draft, huntRefs: toggled(draft.huntRefs, action.ref, action.hunt) };

    case "addPart": {
      if (!draft.structure) return draft;
      const ref = nextCollectionRef(draft);
      return {
        ...draft,
        manualCount: draft.manualCount + 1,
        structure: {
          parts: [
            ...draft.structure.parts,
            { ref, title: "New part", instruction: "", passage_title: "", passage_excerpt: "", sections: [] },
          ],
        },
        collections: [
          ...draft.collections,
          {
            ref,
            parent_ref: null,
            kind: "part",
            title: "New part",
            instruction: null,
            passage_title: null,
            passage: null,
            info: null,
            position: draft.collections.filter((c) => c.kind === "part").length,
          },
        ],
      };
    }

    case "addSection": {
      if (!draft.structure) return draft;
      const ref = nextCollectionRef(draft);
      const partRef = action.partRef;
      return {
        ...draft,
        manualCount: draft.manualCount + 1,
        structure: {
          parts: draft.structure.parts.map((part) =>
            part.ref === partRef
              ? {
                  ...part,
                  sections: [
                    ...part.sections,
                    {
                      ref,
                      parent_ref: partRef,
                      instruction: "New section",
                      question_type: "mcq",
                      skill: "reading",
                      passage_title: "",
                      passage_excerpt: "",
                      choices_excerpt: "",
                      questions_excerpt: "",
                      question_count: 0,
                      points: 1,
                      layout: "",
                    },
                  ],
                }
              : part,
          ),
        },
        collections: [
          ...draft.collections,
          {
            ref,
            parent_ref: partRef,
            kind: "section",
            title: null,
            instruction: "New section",
            passage_title: null,
            passage: null,
            info: null,
            position: draft.collections.filter((c) => c.parent_ref === partRef).length,
          },
        ],
        // An EMPTY done run: with no unit at all the rail would draw a
        // skeleton for a question that never comes.
        units: { ...draft.units, [ref]: { status: "done", items: [] } },
      };
    }

    case "addQuestion": {
      const node = action.node;
      const base = { ...draft, manualCount: draft.manualCount + 1, manualIds: toggled(draft.manualIds, node.id, true) };
      const target = action.target;
      // Each target is a `units` bucket keyed by its ref. A part's bucket holds
      // only hand-added questions (no detected unit is keyed by a part ref), and
      // the rail emits it after the part's sections.
      const ref = target.kind === "section" ? target.ref : target.kind === "part" ? target.partRef : LOOSE_REF;
      const unit = draft.units[ref] ?? { status: "done" as const, items: [] };
      return {
        ...base,
        units: {
          ...draft.units,
          [ref]: {
            status: "done",
            items: [...unit.items, { node, collectionRef: target.kind === "loose" ? null : ref, collectionOrder: unit.items.length }],
          },
        },
      };
    }
  }
}
