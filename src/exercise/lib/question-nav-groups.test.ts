import { describe, expect, it } from "vitest";

import { collectionDrop, moveSection, navGroups, navPartBlocks, navPartUnits, placeInOrder } from "./question-nav-groups";
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

describe("navPartBlocks", () => {
  it("puts a part's own questions before its section cards", () => {
    const own = { ...part } as CollectionStub;
    const nodes = [node("a"), node("b"), node("c"), node("d")];
    const map = new Map([["a", own], ["b", s1], ["c", s2], ["d", null]]);
    const blocks = navPartBlocks(navGroups(nodes, map));
    expect(blocks.map((b) => [b.partKey, b.loose.map((g) => g.indices), b.sections.map((g) => g.indices)])).toEqual([
      ["p1", [[0]], [[1], [2]]],
      [null, [[3]], []],
    ]);
  });
});

describe("moveSection", () => {
  it("moves a whole section, its questions in order", () => {
    const nodes = [node("a"), node("b"), node("c"), node("d")];
    const map = new Map([["a", s1], ["b", s1], ["c", s2], ["d", s2]]);
    const [block] = navPartBlocks(navGroups(nodes, map));
    const ids = moveSection(nodes, block.sections, 1, 0);
    expect(ids).toEqual(["c", "d", "a", "b"]);
    expect(placeInOrder(["a", "b", "c", "d"], ids)).toEqual(["c", "d", "a", "b"]);
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

describe("collectionDrop", () => {
  const p2 = { ...part, appsheet_key: "p2", title: "Part 2" } as CollectionStub;
  const s3 = { ...s1, appsheet_key: "s3", instruction: "Write", parent: p2 } as CollectionStub;
  const nodes = [node("a"), node("b"), node("c"), node("d")];
  const map = new Map([["a", s1], ["b", s2], ["c", s3], ["d", p2]]);
  const units = navPartUnits(navPartBlocks(navGroups(nodes, map)));

  it("gathers a part's blocks into one unit", () => {
    expect(units.map((u) => [u.partKey, u.sections.map((g) => g.key)])).toEqual([
      ["p1", ["s1", "s2"]],
      ["p2", ["s3"]],
    ]);
  });

  it("moves a part to the dropped-on part's place", () => {
    expect(collectionDrop(units, "part:p2", "part:p1")).toEqual({ kind: "part", key: "p2", index: 0 });
    expect(collectionDrop(units, "part:p1", "part:p1")).toBeNull();
  });

  it("moves a section within its part or into another", () => {
    expect(collectionDrop(units, "section:s1:0", "section:s2:1")).toEqual({ kind: "section", key: "s1", toPartKey: "p1", index: 1 });
    expect(collectionDrop(units, "section:s1:0", "section:s3:2")).toEqual({ kind: "section", key: "s1", toPartKey: "p2", index: 0 });
  });

  it("puts a section dropped on a part's card at that part's end", () => {
    expect(collectionDrop(units, "section:s1:0", "part:p2")).toEqual({ kind: "section", key: "s1", toPartKey: "p2", index: 1 });
    expect(collectionDrop(units, "section:s2:1", "part:p1")).toBeNull();
  });
});
