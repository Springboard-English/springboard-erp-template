import { describe, expect, it } from "vitest";

import {
  placeAfterGroup,
  reorderBlocks,
  reorderWithinSection,
  toBlocks,
  type Orderable,
} from "./reorder";

// A paper: standalone q1, a two-question section S, then standalone q4.
const items: Orderable[] = [
  { id: "q1", sectionKey: null },
  { id: "s1", sectionKey: "S" },
  { id: "s2", sectionKey: "S" },
  { id: "q4", sectionKey: null },
];

describe("toBlocks", () => {
  it("collapses a contiguous section into one block, leaving standalones singleton", () => {
    expect(toBlocks(items)).toEqual([
      { sectionKey: null, ids: ["q1"] },
      { sectionKey: "S", ids: ["s1", "s2"] },
      { sectionKey: null, ids: ["q4"] },
    ]);
  });

  it("treats null-section items as separate blocks even when adjacent", () => {
    const blocks = toBlocks([
      { id: "a", sectionKey: null },
      { id: "b", sectionKey: null },
    ]);
    expect(blocks).toHaveLength(2);
  });
});

describe("reorderBlocks", () => {
  it("moves a whole section as one unit, keeping its members together and in order", () => {
    // Blocks: [q1], [s1,s2], [q4]. Move the section block (1) up to the top (0).
    expect(reorderBlocks(items, 1, 0)).toEqual(["s1", "s2", "q1", "q4"]);
  });

  it("moves the section block down past the trailing standalone", () => {
    expect(reorderBlocks(items, 1, 2)).toEqual(["q1", "q4", "s1", "s2"]);
  });

  it("is a no-op when from === to", () => {
    expect(reorderBlocks(items, 1, 1)).toEqual(["q1", "s1", "s2", "q4"]);
  });

  it("never interleaves two sections — the result regroups into clean blocks", () => {
    const two: Orderable[] = [
      { id: "a1", sectionKey: "A" },
      { id: "a2", sectionKey: "A" },
      { id: "b1", sectionKey: "B" },
      { id: "b2", sectionKey: "B" },
    ];
    const order = reorderBlocks(two, 0, 1); // A down past B
    expect(order).toEqual(["b1", "b2", "a1", "a2"]);
    const regrouped = toBlocks(
      order.map((id) => ({ id, sectionKey: id[0].toUpperCase() })),
    );
    expect(regrouped.map((b) => b.ids)).toEqual([
      ["b1", "b2"],
      ["a1", "a2"],
    ]);
  });
});

describe("reorderWithinSection", () => {
  it("swaps two questions within their section", () => {
    expect(reorderWithinSection(items, "S", 0, 1)).toEqual([
      "q1",
      "s2",
      "s1",
      "q4",
    ]);
  });

  it("keeps everything outside the section untouched", () => {
    const order = reorderWithinSection(items, "S", 1, 0);
    expect(order[0]).toBe("q1");
    expect(order[3]).toBe("q4");
  });

  it("is a no-op for an unknown section key", () => {
    expect(reorderWithinSection(items, "ZZZ", 0, 1)).toEqual([
      "q1",
      "s1",
      "s2",
      "q4",
    ]);
  });
});

describe("placeAfterGroup", () => {
  // Sections A and B of one part. `a1` has just been moved from A to B.
  const sectionOf: Record<string, string | null> = {
    a1: "B",
    a2: "A",
    b1: "B",
    b2: "B",
    q: null,
  };
  const order = ["a1", "a2", "b1", "b2", "q"];

  it("moves a question that changed section to sit after its new section's last member", () => {
    const next = placeAfterGroup(order, "a1", (id) => sectionOf[id] === "B");
    expect(next).toEqual(["a2", "b1", "b2", "a1", "q"]);
  });

  it("leaves both sections contiguous afterwards — the invariant the runner pages by", () => {
    const next = placeAfterGroup(order, "a1", (id) => sectionOf[id] === "B");
    const blocks = toBlocks(next.map((id) => ({ id, sectionKey: sectionOf[id] })));
    expect(blocks.map((b) => b.ids)).toEqual([["a2"], ["b1", "b2", "a1"], ["q"]]);
  });

  it("moves backwards too, into a section that comes earlier in the paper", () => {
    const back: Record<string, string | null> = { a1: "A", a2: "A", b1: "B", b2: "A" };
    expect(
      placeAfterGroup(["a1", "a2", "b1", "b2"], "b2", (id) => back[id] === "A"),
    ).toEqual(["a1", "a2", "b2", "b1"]);
  });

  it("does not count the moved question as its own group's last member", () => {
    // Already last in B: nothing moves.
    expect(
      placeAfterGroup(["b1", "b2", "q"], "b2", (id) => ["b1", "b2"].includes(id)),
    ).toEqual(["b1", "b2", "q"]);
  });

  it("leaves the order alone when the group has no other member", () => {
    expect(placeAfterGroup(order, "q", () => false)).toEqual(order);
  });
});
