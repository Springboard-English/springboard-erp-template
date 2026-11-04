import { describe, expect, it } from "vitest";

import { promptDensity, promptTextClass } from "./prompt-scale";

describe("promptDensity", () => {
  it("buckets by total length across every part of the stem", () => {
    expect(promptDensity("She has")).toBe("short");
    // A gap-fill's halves are one sentence: neither half alone is long, but the
    // sentence they form is what wraps, so they must be totalled.
    expect(promptDensity("a".repeat(50), "b".repeat(50))).toBe("medium");
    expect(promptDensity("a".repeat(150), "b".repeat(150))).toBe("long");
  });

  it("ignores absent and whitespace-only parts", () => {
    // `before`/`after` are optional on a gap node and `undefined` when the blank
    // starts or ends the sentence — that must not count toward the length.
    expect(promptDensity("Short stem.", undefined, null)).toBe("short");
    expect(promptDensity("   ", "")).toBe("short");
  });

  it("scales down rather than up as a stem grows", () => {
    const sizeOf = (density: ReturnType<typeof promptDensity>) =>
      promptTextClass(density);
    expect(sizeOf("short")).toContain("text-base");
    expect(sizeOf("medium")).toContain("text-[15px]");
    expect(sizeOf("long")).toContain("text-[15px]");
    // Weight eases off only at the long end, so a long stem reads as a
    // paragraph instead of a headline.
    expect(sizeOf("short")).toContain("font-bold");
    expect(sizeOf("long")).toContain("font-semibold");
  });
});

describe("promptTextClass", () => {
  it("gives inline stems more leading than static ones at every density", () => {
    // A control sitting on the baseline needs room above it; without this the
    // input's border overlaps the previous line.
    for (const density of ["short", "medium", "long"] as const) {
      const inline = promptTextClass(density, "inline");
      const isStatic = promptTextClass(density, "static");
      expect(inline).not.toBe(isStatic);
      expect(inline).toContain("leading-[");
    }
  });

  it("defaults to the static variant", () => {
    expect(promptTextClass("short")).toBe(promptTextClass("short", "static"));
  });
});
