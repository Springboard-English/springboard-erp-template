import type {
  CollectionLayout,
  DetectedPartSpec,
  DetectedSectionSpec,
  DetectStructure,
} from "./api";
import {
  layoutRequiredType,
  SECTION_LAYOUTS,
  type QuestionType,
} from "../index";

// Choosing what to import from a detected paper. The unit is what the fan-out
// extracts in one call — a section, which may hold a single question — so
// choosing is done at that grain and a part is only ever a way to tick its
// sections at once.

/** Every extractable unit's ref, in reading order. */
export function detectedUnitRefs(structure: DetectStructure): string[] {
  return structure.parts.flatMap((part) => part.sections.map((section) => section.ref));
}

/**
 * The structure narrowed to the chosen units. A part keeps its title and
 * passage whichever of its units are chosen — a section often reads the part's
 * passage — and a part left with nothing chosen is dropped.
 */
export function pickDetected(
  structure: DetectStructure,
  chosen: ReadonlySet<string>,
): DetectStructure {
  return {
    parts: structure.parts
      .map((part) => ({
        ...part,
        sections: part.sections.filter((section) => chosen.has(section.ref)),
      }))
      .filter((part) => part.sections.length),
  };
}

/**
 * The structure with every ref prefixed, for a second file read into the same
 * review. Detection numbers refs from scratch each call ("part-1", …), so two
 * files' refs collide — and the review keys units, collections and node ids on
 * them. The extract calls echo whatever ref they are sent, so renaming here is
 * enough.
 */
export function prefixDetectedRefs(
  structure: DetectStructure,
  prefix: string,
): DetectStructure {
  return {
    parts: structure.parts.map((part) => ({
      ...part,
      ref: prefix + part.ref,
      sections: part.sections.map((section) => ({
        ...section,
        ref: prefix + section.ref,
        parent_ref: prefix + section.parent_ref,
      })),
    })),
  };
}

/** How many questions the chosen units hold, as detected — a section is its run. */
export function chosenQuestionCount(
  structure: DetectStructure,
  chosen: ReadonlySet<string>,
): number {
  return pickDetected(structure, chosen).parts.reduce(
    (total, part) => total + part.sections.reduce((sum, section) => sum + section.question_count, 0),
    0,
  );
}

/** What a detected section is to be read as: a plain type, a laid-out task, or an error hunt. */
export type DetectedTask = { kind: "type"; type: QuestionType } | { kind: "layout"; layout: CollectionLayout } | { kind: "hunt" };

/** A detected section's task, from its type and layout. */
export function detectedTask(section: Pick<DetectedSectionSpec, "question_type" | "layout">): DetectedTask {
  if (section.layout && (SECTION_LAYOUTS as string[]).includes(section.layout)) {
    return { kind: "layout", layout: section.layout as CollectionLayout };
  }
  return { kind: "type", type: section.question_type };
}

/**
 * The structure with one section re-typed before it is read. Extraction reads a
 * section the way its spec says, so this is the only point where a wrong
 * detection can be corrected without starting over. A laid-out task pins its
 * question type; an error hunt is error-correction questions with no layout.
 */
export function retypeDetectedSection(structure: DetectStructure, ref: string, task: DetectedTask): DetectStructure {
  const spec =
    task.kind === "layout"
      ? { layout: task.layout as string, question_type: layoutRequiredType(task.layout) ?? "mcq" }
      : task.kind === "hunt"
        ? { layout: "", question_type: "error-correction" as QuestionType }
        : { layout: "", question_type: task.type };
  return {
    parts: structure.parts.map((part) => ({
      ...part,
      sections: part.sections.map((section) => (section.ref === ref ? { ...section, ...spec } : section)),
    })),
  };
}

// Tasks that are answered from a text: a reading section without one has lost it.
const NEEDS_TEXT: ReadonlySet<string> = new Set(["mcq", "true-false-not-given", "short-answer", "multi-select", "multiple-matching", "gapped-text"]);

/**
 * True when a reading section asks about a passage detection never captured,
 * on the section or its part. Caught here, before reading, rather than by a
 * student facing questions about nothing.
 */
export function missingPassage(part: DetectedPartSpec, section: DetectedSectionSpec): boolean {
  if (section.skill !== "reading") return false;
  if (section.passage_excerpt.trim() || part.passage_excerpt.trim()) return false;
  return NEEDS_TEXT.has(section.layout || section.question_type);
}
