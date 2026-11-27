import { describe, expect, it } from "vitest";

import type { DetectStructure, DetectedSectionSpec } from "./api";

import {
  chosenQuestionCount,
  detectedTask,
  detectedUnitRefs,
  missingPassage,
  retypeDetectedSection,
  pickDetected,
  prefixDetectedRefs,
} from "./detect-selection";

function section(ref: string, parent: string, count: number): DetectedSectionSpec {
  return {
    ref,
    parent_ref: parent,
    instruction: "",
    question_type: "mcq",
    skill: "reading",
    passage_title: "",
    passage_excerpt: "",
    choices_excerpt: "",
    questions_excerpt: "",
    question_count: count,
    points: 1,
    layout: "",
  };
}

const paper: DetectStructure = {
  parts: [
    {
      ref: "p1",
      title: "Part 1",
      instruction: "",
      passage_title: "The harbour",
      passage_excerpt: "A passage.",
      // q1 is a question printed on its own: detection returns it as a one-question section.
      sections: [section("s1", "p1", 5), section("s2", "p1", 3), section("q1", "p1", 1)],
    },
    {
      ref: "p2",
      title: "Part 2",
      instruction: "",
      passage_title: "",
      passage_excerpt: "",
      sections: [section("s3", "p2", 10)],
    },
  ],
};

describe("detectedUnitRefs", () => {
  it("lists every section, a one-question one included, in reading order", () => {
    expect(detectedUnitRefs(paper)).toEqual(["s1", "s2", "q1", "s3"]);
  });
});

describe("pickDetected", () => {
  it("keeps only the chosen units, and a part with any of them keeps its passage", () => {
    const picked = pickDetected(paper, new Set(["s2"]));
    expect(picked.parts).toHaveLength(1);
    expect(picked.parts[0].passage_excerpt).toBe("A passage.");
    expect(picked.parts[0].sections.map((s) => s.ref)).toEqual(["s2"]);
  });

  it("drops a part with nothing chosen", () => {
    expect(pickDetected(paper, new Set(["s3"])).parts.map((p) => p.ref)).toEqual(["p2"]);
    expect(pickDetected(paper, new Set()).parts).toEqual([]);
  });
});

describe("chosenQuestionCount", () => {
  it("counts a section's whole run, and a one-question section as one", () => {
    expect(chosenQuestionCount(paper, new Set(["s1", "q1"]))).toBe(6);
    expect(chosenQuestionCount(paper, new Set(detectedUnitRefs(paper)))).toBe(19);
    expect(chosenQuestionCount(paper, new Set())).toBe(0);
  });
});

describe("prefixDetectedRefs", () => {
  it("renames every ref and keeps each unit pointing at its own part", () => {
    const second = prefixDetectedRefs(paper, "f2-");
    expect(detectedUnitRefs(second)).toEqual(["f2-s1", "f2-s2", "f2-q1", "f2-s3"]);
    for (const part of second.parts) {
      expect(part.ref.startsWith("f2-")).toBe(true);
      for (const unit of part.sections) {
        expect(unit.parent_ref).toBe(part.ref);
      }
    }
  });

  it("leaves no ref shared with the file it is added to", () => {
    const first = new Set(detectedUnitRefs(paper));
    expect(detectedUnitRefs(prefixDetectedRefs(paper, "f2-")).some((ref) => first.has(ref))).toBe(
      false,
    );
  });
});

describe("retypeDetectedSection", () => {
  it("pins a layout's type, clears it for a plain type, and makes a hunt error-correction", () => {
    const gapped = retypeDetectedSection(paper, "s2", { kind: "layout", layout: "word-formation" });
    expect(gapped.parts[0].sections[1]).toMatchObject({ layout: "word-formation", question_type: "gap-filling" });
    expect(gapped.parts[0].sections[0]).toBe(paper.parts[0].sections[0]);
    const plain = retypeDetectedSection(gapped, "s2", { kind: "type", type: "true-false-not-given" });
    expect(plain.parts[0].sections[1]).toMatchObject({ layout: "", question_type: "true-false-not-given" });
    const hunt = retypeDetectedSection(paper, "s3", { kind: "hunt" });
    expect(hunt.parts[1].sections[0]).toMatchObject({ layout: "", question_type: "error-correction" });
  });

  it("reads a section's current task back", () => {
    expect(detectedTask({ question_type: "mcq", layout: "gapped-text" })).toEqual({ kind: "layout", layout: "gapped-text" });
    expect(detectedTask({ question_type: "mcq", layout: "" })).toEqual({ kind: "type", type: "mcq" });
  });
});

describe("missingPassage", () => {
  it("flags a reading run with no text on it or its part", () => {
    expect(missingPassage(paper.parts[1], paper.parts[1].sections[0])).toBe(true);
    expect(missingPassage(paper.parts[0], paper.parts[0].sections[0])).toBe(false);
  });

  it("leaves other skills and tasks that carry their own text alone", () => {
    expect(missingPassage(paper.parts[1], { ...section("x", "p2", 4), skill: "vocab-grammar" })).toBe(false);
    expect(missingPassage(paper.parts[1], { ...section("x", "p2", 4), question_type: "gap-filling" })).toBe(false);
  });
});
