import { describe, expect, it } from "vitest";

import { explanationOf } from "./explanation";

// The explanation gives the answer away, so where it is read from matters. The
// API strips it from the live question payload and releases it with the gated
// result; this reader must not resurrect one from a shape that shouldn't have it.

describe("explanationOf", () => {
  it("reads an explanation off a content blob", () => {
    expect(explanationOf({ explanation: "Because paragraph 3." })).toBe(
      "Because paragraph 3.",
    );
  });

  it("treats blank and missing as absent", () => {
    // A stored empty string must not render an empty green box.
    expect(explanationOf({ explanation: "   " })).toBeUndefined();
    expect(explanationOf({ explanation: "" })).toBeUndefined();
    expect(explanationOf({})).toBeUndefined();
  });

  it("survives a content shape it doesn't recognise", () => {
    expect(explanationOf(null)).toBeUndefined();
    expect(explanationOf(undefined)).toBeUndefined();
    expect(explanationOf("a string")).toBeUndefined();
    expect(explanationOf({ explanation: 42 })).toBeUndefined();
  });
});
