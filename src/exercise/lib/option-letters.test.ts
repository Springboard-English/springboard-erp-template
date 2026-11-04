import { describe, expect, it } from "vitest";

import { optionLetters } from "./option-letters";

describe("optionLetters", () => {
  it("uses the paper's own letters when the ids are letters", () => {
    // "Write E for Emma, M for Mark, K for Kate" — shown as A/B/C, the buttons
    // disagree with the instruction the student is reading.
    expect(optionLetters([{ id: "E" }, { id: "M" }, { id: "K" }])).toEqual([
      "E",
      "M",
      "K",
    ]);
  });

  it("keeps a gap where an option was removed, as the paper does", () => {
    expect(optionLetters([{ id: "a" }, { id: "c" }, { id: "d" }])).toEqual([
      "A",
      "C",
      "D",
    ]);
  });

  it("falls back to position for the WHOLE list when any id is not a letter", () => {
    // An option added by hand gets `opt-N`; a mix would print "A, B, E".
    expect(optionLetters([{ id: "A" }, { id: "B" }, { id: "opt-3" }])).toEqual([
      "A",
      "B",
      "C",
    ]);
    expect(optionLetters([{ id: "opt-1" }, { id: "opt-2" }])).toEqual(["A", "B"]);
  });

  it("falls back to position when two ids would print the same letter", () => {
    expect(optionLetters([{ id: "a" }, { id: "A" }])).toEqual(["A", "B"]);
  });
});
