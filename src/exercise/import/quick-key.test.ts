import { describe, expect, it } from "vitest";
import type { ExerciseNode } from "../index";

import { applyQuickKey, parseQuickKey } from "./quick-key";

const base = { skillTag: "reading", title: "", instruction: "", points: 1 } as const;
const mcq = (id: string): ExerciseNode => ({
  ...base,
  id,
  type: "mcq",
  content: { prompt: "?", options: [{ id: "o1", label: "cat" }, { id: "o2", label: "dog" }, { id: "o3", label: "bird" }] },
});
const tfng = (id: string): ExerciseNode => ({ ...base, id, type: "true-false-not-given", content: { statement: "s" } });
const gap = (id: string): ExerciseNode => ({ ...base, id, type: "gap-filling", content: { before: "" } } as ExerciseNode);

describe("parseQuickKey", () => {
  it("reads comma, line and run-on styles", () => {
    expect(parseQuickKey("1 A, 2 C, 3 B")).toEqual([
      { number: 1, answer: "A" },
      { number: 2, answer: "C" },
      { number: 3, answer: "B" },
    ]);
    expect(parseQuickKey("1. A\n2) not given\n3 - sweeten")).toEqual([
      { number: 1, answer: "A" },
      { number: 2, answer: "not given" },
      { number: 3, answer: "sweeten" },
    ]);
    expect(parseQuickKey("1A 2C 3B")).toEqual([
      { number: 1, answer: "A" },
      { number: 2, answer: "C" },
      { number: 3, answer: "B" },
    ]);
  });
});

describe("applyQuickKey", () => {
  it("sets an option by letter, a TFNG verdict and a gap's accepted answers", () => {
    const nodes = [mcq("a"), tfng("b"), gap("c")];
    const { updates, unmatched } = applyQuickKey(nodes, parseQuickKey("1 B, 2 NG, 3 colour / color"));
    expect(unmatched).toEqual([]);
    expect(updates.get("a")).toMatchObject({ content: { correct_option_id: "o2" } });
    expect(updates.get("b")).toMatchObject({ content: { answer: "not-given" } });
    expect(updates.get("c")).toMatchObject({ content: { accepted_answers: ["colour", "color"] } });
  });

  it("reports numbers with no question and answers that don't fit", () => {
    const { updates, unmatched } = applyQuickKey([mcq("a"), tfng("b")], parseQuickKey("1 Z, 2 maybe, 9 A"));
    expect(updates.size).toBe(0);
    expect(unmatched).toEqual([1, 2, 9]);
  });
});
