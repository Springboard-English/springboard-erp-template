import { describe, expect, it } from "vitest";

import { hasHighlightRoom, locate, MAX_HIGHLIGHTS } from "./highlighter";

const saved = (start: number, end: number, quote: string) => ({
  colour: "yellow" as const,
  start,
  end,
  quote,
});

describe("hasHighlightRoom", () => {
  const marks = (count: number) => Array.from({ length: count }, () => saved(0, 1, "a"));

  it("counts every scope against the one allowance", () => {
    expect(hasHighlightRoom({})).toBe(true);
    expect(hasHighlightRoom({ a: marks(MAX_HIGHLIGHTS - 1) })).toBe(true);
    expect(
      hasHighlightRoom({ a: marks(MAX_HIGHLIGHTS - 1), b: marks(1) }),
    ).toBe(false);
  });
});

describe("locate", () => {
  const text = "The cat sat. The cat ran. The dog sat.";

  it("keeps the saved offsets while the quote is still there", () => {
    expect(locate(text, saved(13, 20, "The cat"))).toEqual([13, 20]);
  });

  it("follows the text when something above it grew", () => {
    // An answer drawn as text before it pushed everything 5 characters right.
    expect(locate(`XXXXX${text}`, saved(13, 20, "The cat"))).toEqual([18, 25]);
  });

  it("takes the occurrence nearest the saved offset, not the first", () => {
    expect(locate(`XX${text}`, saved(13, 20, "The cat"))).toEqual([15, 22]);
  });

  it("keeps the full length when the quote is only the start of it", () => {
    // Quotes are capped; the saved span is what sets the length.
    expect(locate(`__${text}`, saved(0, 12, "The cat"))).toEqual([2, 14]);
  });

  it("drops a highlight whose text is gone", () => {
    expect(locate(text, saved(0, 8, "The bird"))).toBeNull();
  });
});
