import { describe, expect, it } from "vitest";

import { extractedExerciseToNode } from "./api";
import { SAMPLE_IMPORT_STRUCTURE, sampleSectionExtract } from "./sample-import";
import { exerciseNodeSchema } from "../index";

const SECTIONS = SAMPLE_IMPORT_STRUCTURE.parts.flatMap((part) => part.sections);

describe("the practice import", () => {
  it.each(SECTIONS.map((s) => [s.ref, s] as const))("section %s answers every question it announces", (ref, spec) => {
    const extract = sampleSectionExtract(ref);
    expect(extract.parent_ref).toBe(spec.parent_ref);
    expect(extract.exercises).toHaveLength(spec.question_count);
  });

  // The import drops a node that fails the schema without a word, which on the
  // tour would be a page that never fills.
  it.each(SECTIONS.map((s) => [s.ref] as const))("section %s maps to valid question nodes", (ref) => {
    sampleSectionExtract(ref).exercises.forEach((dto, index) => {
      const parsed = exerciseNodeSchema.safeParse(extractedExerciseToNode(dto, `draft-${ref}-${index}`));
      expect(parsed.success).toBe(true);
    });
  });

  it("numbers each section's quote from where the last one ended", () => {
    expect(SECTIONS.map((s) => s.questions_excerpt.split(".")[0])).toEqual(["1", "5", "8", "12", "16"]);
  });

  it("leaves one run without a key, so the tour can show an unanswered question", () => {
    const keys = SECTIONS.flatMap((s) => sampleSectionExtract(s.ref).exercises)
      .filter((dto) => dto.type !== "essay")
      .map((dto) => dto.answer_key);
    expect(keys.filter((key) => key === null)).toHaveLength(4);
  });
});
