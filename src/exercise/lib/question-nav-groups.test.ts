import { describe, expect, it } from "vitest";

import { navGroups, placeInOrder } from "./question-nav-groups";
import type { ExerciseNode } from "./exercises";
import type { CollectionStub } from "../types";

const part = { appsheet_key: "p1", kind: "part", title: "Part 1", instruction: null, passage_title: null, passage: [], info: null, parent: null } as CollectionStub;
const s1 = { ...part, appsheet_key: "s1", kind: "section", title: null, instruction: "Read", parent: part } as CollectionStub;
const s2 = { ...s1, appsheet_key: "s2", instruction: "Listen" } as CollectionStub;
const node = (id: string) => ({ id }) as ExerciseNode;

describe("navGroups", () => {
  it("groups runs by section and names each part once", () => {
    const nodes = [node("a"), node("b"), node("c"), node("d")];
    const map = new Map([["a", s1], ["b", s1], ["c", s2], ["d", null]]);
    const groups = navGroups(nodes, map);
    expect(groups.map((g) => g.indices)).toEqual([[0, 1], [2], [3]]);
    expect(groups.map((g) => g.part?.appsheet_key ?? null)).toEqual(["p1", null, null]);
    expect(groups.map((g) => g.section?.appsheet_key ?? null)).toEqual(["s1", "s2", null]);
  });

  it("is one group without collections", () => {
    expect(navGroups([node("a"), node("b")], undefined).map((g) => g.indices)).toEqual([[0, 1]]);
  });
});

describe("placeInOrder", () => {
  it("reorders a run in the slots it held and leaves the rest", () => {
    expect(placeInOrder(["a", "b", "c", "d", "e"], ["d", "b", "c"])).toEqual(["a", "d", "b", "c", "e"]);
  });

  it("ignores an id that is gone", () => {
    expect(placeInOrder(["a", "b", "c"], ["c", "x", "a"])).toEqual(["c", "b", "a"]);
  });

  it("is the same list for the same order", () => {
    expect(placeInOrder(["a", "b"], ["a", "b"])).toEqual(["a", "b"]);
  });
});
