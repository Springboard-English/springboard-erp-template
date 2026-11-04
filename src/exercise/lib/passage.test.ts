import { describe, expect, it } from "vitest";

import { joinPassage, splitPassage } from "./passage";

describe("joinPassage", () => {
  it("joins paragraphs with a blank line, and tolerates nothing", () => {
    expect(joinPassage(["a", "b"])).toBe("a\n\nb");
    expect(joinPassage(null)).toBe("");
  });
});

describe("splitPassage", () => {
  it("splits on blank lines, not on wrapped ones", () => {
    // A line break inside a paragraph is part of that paragraph: a teacher who
    // wraps a long sentence has not started a new one.
    expect(splitPassage("one\ntwo\n\nthree")).toEqual(["one\ntwo", "three"]);
  });

  it("tolerates extra blank lines and surrounding space", () => {
    expect(splitPassage("  a  \n\n\n\n  b  ")).toEqual(["a", "b"]);
  });

  it("is null when there is nothing left, which is how a passage is cleared", () => {
    expect(splitPassage("")).toBeNull();
    expect(splitPassage("   \n\n  ")).toBeNull();
  });

  it("round-trips whatever it produced", () => {
    const paragraphs = ["First para.", "Second para."];
    expect(splitPassage(joinPassage(paragraphs))).toEqual(paragraphs);
  });
});
