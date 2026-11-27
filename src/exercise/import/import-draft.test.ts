import { describe, expect, it } from "vitest";
import type { DetectStructure, DetectedSectionSpec } from "./api";
import type { ExerciseNode } from "../index";

import { draftMoveFromNav, emptyDraft, importDraftReducer as reduce, LOOSE_REF, nextManualId, type ImportDraft, type ReviewItem } from "./import-draft";

const section = (ref: string, count: number): DetectedSectionSpec => ({
  ref,
  parent_ref: "p1",
  instruction: `Section ${ref}`,
  question_type: "mcq",
  skill: "reading",
  passage_title: "",
  passage_excerpt: "",
  choices_excerpt: "",
  questions_excerpt: "",
  question_count: count,
  points: 1,
  layout: "",
});
const paper = (prefix = ""): DetectStructure => ({
  parts: [
    {
      ref: `${prefix}p1`,
      title: "Part 1",
      instruction: "",
      passage_title: "",
      passage_excerpt: "First paragraph.\n\nSecond.",
      sections: [section(`${prefix}s1`, 2), section(`${prefix}s2`, 1)],
    },
  ],
});
const node = (id: string): ExerciseNode => ({
  id,
  type: "true-false-not-given",
  skillTag: "reading",
  title: "",
  instruction: "",
  points: 1,
  content: { statement: id },
});
const item = (id: string, ref: string, order: number): ReviewItem => ({ node: node(id), collectionRef: ref, collectionOrder: order });
const outcome = (parsed: number) => ({ status: "done" as const, expected: 2, received: parsed, parsed });

/** A started import with s1 read. */
function started(): ImportDraft {
  const begun = reduce(emptyDraft(), { type: "begin", structure: paper(), append: false });
  return reduce(begun, { type: "unitResolved", ref: "s1", items: [item("a", "s1", 0), item("b", "s1", 1)], outcome: outcome(2) });
}

describe("importDraftReducer", () => {
  it("begins a paper with every unit pending and its collections built", () => {
    const draft = reduce(emptyDraft(), { type: "begin", structure: paper(), append: false });
    expect(draft.units).toEqual({ s1: { status: "pending", items: [] }, s2: { status: "pending", items: [] } });
    expect(draft.progress).toEqual({ done: 0, total: 2 });
    expect(draft.collections.map((c) => c.ref)).toEqual(["p1", "s1", "s2"]);
    expect(draft.collections[0].passage).toEqual(["First paragraph.", "Second."]);
  });

  it("starts a new paper clean: no order, discards, hunts or hand-added ids carry over", () => {
    let draft = started();
    draft = reduce(draft, { type: "toggleDropped", id: "a" });
    draft = reduce(draft, { type: "setOrder", order: ["b", "a"] });
    draft = reduce(draft, { type: "setHunt", ref: "s1", hunt: true });
    draft = reduce(draft, { type: "addQuestion", target: { kind: "loose" }, node: node(nextManualId(draft)) });
    const next = reduce(draft, { type: "begin", structure: paper(), append: false });
    expect(next.dropped.size + next.manualIds.size + next.huntRefs.size).toBe(0);
    expect(next.orderOverride).toBeNull();
    expect(next.units[LOOSE_REF]).toBeUndefined();
  });

  it("appends a second file after the first, keeping what was reviewed", () => {
    const draft = reduce(started(), { type: "begin", structure: paper("f2-"), append: true });
    expect(draft.units.s1.items).toHaveLength(2);
    expect(draft.units["f2-s1"].status).toBe("pending");
    expect(draft.collections.find((c) => c.ref === "f2-p1")?.position).toBe(1);
    expect(draft.progress.total).toBe(4);
    expect(draft.fileCount).toBe(2);
  });

  it("keeps hand-added questions when a unit's Retry answers", () => {
    let draft = started();
    draft = reduce(draft, { type: "addQuestion", target: { kind: "section", ref: "s1" }, node: node("manual-0") });
    draft = reduce(draft, { type: "unitResolved", ref: "s1", items: [item("a2", "s1", 0)], outcome: outcome(1) });
    expect(draft.units.s1.items.map((i) => i.node.id)).toEqual(["a2", "manual-0"]);
  });

  it("marks a unit that came back empty as failed", () => {
    const draft = reduce(started(), { type: "unitResolved", ref: "s2", items: [], outcome: { status: "failed", expected: 1, received: 0, parsed: 0 } });
    expect(draft.units.s2.status).toBe("failed");
    expect(draft.outcomes.s2.status).toBe("failed");
  });

  it("reorders a cloze's questions to the new blank order, in the teacher's order too", () => {
    let draft = reduce(started(), { type: "setOrder", order: ["a", "b"] });
    draft = reduce(draft, { type: "moveBlanks", ref: "s1", passage: ["{gap} then {gap}"], order: ["b", "a"] });
    expect(draft.units.s1.items.map((i) => [i.node.id, i.collectionOrder])).toEqual([["b", 0], ["a", 1]]);
    expect(draft.orderOverride).toEqual(["b", "a"]);
    expect(draft.collections.find((c) => c.ref === "s1")?.passage).toEqual(["{gap} then {gap}"]);
  });

  it("files a question added to a part in the part's own bucket, in the order added", () => {
    let draft = reduce(started(), { type: "addQuestion", target: { kind: "part", partRef: "p1" }, node: node("manual-0") });
    draft = reduce(draft, { type: "addQuestion", target: { kind: "part", partRef: "p1" }, node: node("manual-1") });
    expect(draft.units.p1.items.map((i) => [i.node.id, i.collectionRef, i.collectionOrder])).toEqual([
      ["manual-0", "p1", 0],
      ["manual-1", "p1", 1],
    ]);
    expect(draft.structure).toEqual(started().structure);
    expect(draft.manualCount).toBe(2);
  });

  it("adds a section as an empty finished run, and a part at the end", () => {
    let draft = reduce(started(), { type: "addSection", partRef: "p1" });
    expect(draft.units["manual-col-0"]).toEqual({ status: "done", items: [] });
    draft = reduce(draft, { type: "addPart" });
    expect(draft.collections.find((c) => c.ref === "manual-col-1")).toMatchObject({ kind: "part", position: 1 });
  });

  it("caps progress at the total", () => {
    let draft = reduce(emptyDraft(), { type: "begin", structure: paper(), append: false });
    for (let i = 0; i < 5; i += 1) draft = reduce(draft, { type: "progressBump" });
    expect(draft.progress).toEqual({ done: 2, total: 2 });
  });
});

describe("unitResolved collection patch", () => {
  it("fills the section's passage and adds the extract's info to the detected layout", () => {
    const begun = reduce(emptyDraft(), {
      type: "begin",
      structure: { parts: [{ ...paper().parts[0], sections: [{ ...section("s1", 1), layout: "banked-cloze" }] }] },
      append: false,
    });
    const draft = reduce(begun, {
      type: "unitResolved",
      ref: "s1",
      items: [item("a", "s1", 0)],
      outcome: outcome(1),
      collection: { passage: ["One {gap}."], info: { word_bank: ["cat"] } },
    });
    expect(draft.collections.find((c) => c.ref === "s1")).toMatchObject({
      passage: ["One {gap}."],
      info: { layout: "banked-cloze", word_bank: ["cat"] },
    });
  });
});

describe("moveCollection", () => {
  // Two parts: p1 holds s1 and s2, then a new p2 with one section.
  function twoParts(): ImportDraft {
    const withPart = reduce(started(), { type: "addPart" });
    const p2 = withPart.structure!.parts[1].ref;
    return reduce(withPart, { type: "addSection", partRef: p2 });
  }
  const shape = (draft: ImportDraft) =>
    draft.collections.map((c) => [c.ref, c.parent_ref, c.position]);

  it("moves a section into another part, its parent and positions following", () => {
    const draft = twoParts();
    const [p1, p2] = draft.structure!.parts;
    const s3 = p2.sections[0].ref;
    const next = reduce(draft, { type: "moveCollection", move: { kind: "section", ref: "s1", toPartRef: p2.ref, beforeRef: s3 } });
    expect(next.structure!.parts.map((p) => p.sections.map((s) => s.ref))).toEqual([["s2"], ["s1", s3]]);
    expect(next.structure!.parts[1].sections[0].parent_ref).toBe(p2.ref);
    expect(shape(next)).toEqual([
      [p1.ref, null, 0],
      ["s2", p1.ref, 0],
      [p2.ref, null, 1],
      ["s1", p2.ref, 0],
      [s3, p2.ref, 1],
    ]);
    // Its questions stay with it.
    expect(next.units.s1.items.map((i) => i.node.id)).toEqual(["a", "b"]);
  });

  it("reorders parts, keeping the positions they held", () => {
    const draft = twoParts();
    const [p1, p2] = draft.structure!.parts;
    const next = reduce(draft, { type: "moveCollection", move: { kind: "part", ref: p2.ref, beforeRef: p1.ref } });
    expect(next.structure!.parts.map((p) => p.ref)).toEqual([p2.ref, p1.ref]);
    expect(next.collections.filter((c) => c.kind === "part").map((c) => [c.ref, c.position])).toEqual([
      [p2.ref, 0],
      [p1.ref, 1],
    ]);
  });

  it("puts a section last when nothing follows it, and ignores an unknown ref", () => {
    const draft = twoParts();
    const next = reduce(draft, { type: "moveCollection", move: { kind: "section", ref: "s1", toPartRef: "p1", beforeRef: null } });
    expect(next.structure!.parts[0].sections.map((s) => s.ref)).toEqual(["s2", "s1"]);
    expect(reduce(draft, { type: "moveCollection", move: { kind: "part", ref: "nope", beforeRef: null } })).toBe(draft);
  });
});

describe("draftMoveFromNav", () => {
  const shown = { parts: ["p1", "p2"], sectionsByPart: new Map([["p1", ["s1", "s2"]], ["p2", ["s3"]]]) };

  it("names the sibling a moved part or section lands before", () => {
    expect(draftMoveFromNav({ kind: "part", key: "p2", index: 0 }, shown)).toEqual({ kind: "part", ref: "p2", beforeRef: "p1" });
    expect(draftMoveFromNav({ kind: "part", key: "p1", index: 1 }, shown)).toEqual({ kind: "part", ref: "p1", beforeRef: null });
    expect(draftMoveFromNav({ kind: "section", key: "s1", toPartKey: "p1", index: 1 }, shown)).toEqual({
      kind: "section", ref: "s1", toPartRef: "p1", beforeRef: null,
    });
    expect(draftMoveFromNav({ kind: "section", key: "s1", toPartKey: "p2", index: 0 }, shown)).toEqual({
      kind: "section", ref: "s1", toPartRef: "p2", beforeRef: "s3",
    });
  });
});
