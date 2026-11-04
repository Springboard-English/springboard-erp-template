import { describe, expect, it } from "vitest";

import {
  countGapTokens,
  hasGapToken,
  showGapTokens,
  splitPassageOnGaps,
} from "./gap-token";

describe("countGapTokens", () => {
  it("counts every blank, numbered or not", () => {
    expect(countGapTokens("a {gap} b {gap_2} c { gap }")).toBe(3);
    expect(countGapTokens("no blanks")).toBe(0);
  });
});

// `{gap}` is the renderer's contract with extraction, not something a reader
// should ever see. `ClozeSection` turns each token into an input; every other
// surface renders the same passage as prose and must not print the token raw —
// "The delay was {gap} long" on the teacher's detail page or in the
// side-by-side passage column.

describe("showGapTokens", () => {
  it("draws each token as a printed blank", () => {
    expect(showGapTokens("The delay was {gap} long.")).toBe(
      "The delay was ______ long.",
    );
  });

  it("matches the one spelling the API sends, with its allowed variations", () => {
    // `{gap}` is the canonical token — `_GAP_TOKEN` in the API's extraction.py,
    // written there exactly once. Whitespace and an index are tolerated because
    // they don't change meaning; order is what's authoritative.
    expect(showGapTokens("a {gap} b {gap_1} c {GAP} d { gap } e {gap 2}")).toBe(
      "a ______ b ______ c ______ d ______ e ______",
    );
    expect(hasGapToken("one {gap} here")).toBe(true);
  });

  it("does NOT quietly accept a second spelling", () => {
    // If this and the API ever disagree on the spelling, every cloze renders
    // the token as text with its input in the wrong place. Accepting both would
    // hide that instead of settling it: a divergence should be obvious.
    expect(showGapTokens("a {{gap}} b")).not.toBe("a ______ b");
  });

  it("leaves text with no tokens untouched", () => {
    const plain = "A passage with ____ printed blanks and {braces}.";
    expect(showGapTokens(plain)).toBe(plain);
  });
});

describe("splitPassageOnGaps", () => {
  // A gapped text is the one passage extraction does NOT tokenise — the section
  // prompt asks for it "with its numbered gaps marked", i.e. however the paper
  // printed them. Matching only `{gap}` would find nothing, so every gapped
  // text would fall back to a stacked list of slots under a wall of text.

  it("splits on the canonical token", () => {
    expect(splitPassageOnGaps("one {gap} two {gap} three", 2)).toEqual([
      "one ",
      " two ",
      " three",
    ]);
  });

  it("splits on a number alone on its own line — how a paper prints one", () => {
    const passage = "First paragraph.\n\n37\n\nSecond paragraph.\n\n38\n\nThird.";
    expect(splitPassageOnGaps(passage, 2)).toEqual([
      "First paragraph.\n",
      "\n\nSecond paragraph.\n",
      "\n\nThird.",
    ]);
  });

  it("splits on a bracketed number", () => {
    expect(splitPassageOnGaps("a [37] b [38] c", 2)).toEqual(["a ", " b ", " c"]);
  });

  it("splits on a numbered ruled line", () => {
    expect(splitPassageOnGaps("a (37) ______ b (38) ______ c", 2)).toEqual([
      "a ",
      " b ",
      " c",
    ]);
  });

  it("returns null when no marker style accounts for exactly the gaps", () => {
    // The count is what makes trying several styles safe. A passage cut at the
    // wrong places reads as mangled prose AND anchors inputs at the wrong holes,
    // so refusing is better than a best effort — the caller falls back to
    // listing the gaps below the text, which is at least answerable.
    expect(splitPassageOnGaps("a [37] b [38] c", 3)).toBeNull();
    expect(splitPassageOnGaps("no markers at all", 2)).toBeNull();
    expect(splitPassageOnGaps("", 2)).toBeNull();
  });

  it("does not splice the marker back in as text", () => {
    // `String.split` puts CAPTURE groups into its output, so every alternative
    // in the pattern has to be non-capturing or the numbers would reappear
    // mid-passage as content.
    const chunks = splitPassageOnGaps("a [37] b", 1);
    expect(chunks).toEqual(["a ", " b"]);
    expect(chunks?.join("")).not.toContain("37");
  });

  it("leaves a number inside prose alone", () => {
    // Only a number on its OWN line is a gap; "in 1997 the" is not.
    expect(splitPassageOnGaps("It closed in 1997 and never reopened.", 1)).toBeNull();
  });
});

describe("hasGapToken", () => {
  it("detects a token regardless of how often it is asked", () => {
    const text = "a {gap} b";
    // A /g regex advances lastIndex between calls; repeated asks must agree.
    expect(hasGapToken(text)).toBe(true);
    expect(hasGapToken(text)).toBe(true);
  });

  it("is false without one", () => {
    expect(hasGapToken("no markers here")).toBe(false);
  });
});
