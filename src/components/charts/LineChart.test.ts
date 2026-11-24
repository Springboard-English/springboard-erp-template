import { describe, expect, it } from "vitest";
import { linePath, linePointFigures, nearestIndex } from "./LineChart";
import { getChartPalette, skillColor } from "./palette";

describe("LineChart helpers", () => {
  it("joins across a point with no value, or breaks there when asked", () => {
    const joined = linePath([50, null, 25, 75], 400, 200);
    expect(joined.match(/M/g)).toHaveLength(1);
    expect(joined.match(/L/g)).toHaveLength(2);
    const broken = linePath([50, null, 25, 75], 400, 200, 100, true);
    expect(broken.match(/M/g)).toHaveLength(2);
    expect(broken.match(/L/g)).toHaveLength(1);
  });

  it("picks the nearest point and lists every figure there", () => {
    expect(nearestIndex(0, 5, 400)).toBe(0);
    expect(nearestIndex(400, 5, 400)).toBe(4);
    const figures = linePointFigures(
      [
        { id: "a", label: "A", color: "#000", values: [10, 20] },
        { id: "b", label: "B", color: "#111", values: [null, 30] },
      ],
      { label: "Band", color: "#222", low: [5, 15], high: [15, 25] },
      0,
      (value) => `${value}%`,
    );
    expect(figures.map((figure) => [figure.id, figure.text])).toEqual([
      ["a", "10%"],
      ["band", "5%–15%"],
    ]);
  });
});

describe("skill colours", () => {
  it("gives each skill one colour per mode and folds an unknown skill into Other", () => {
    expect(skillColor("reading")).toBe(getChartPalette("light").skill("reading"));
    expect(skillColor("reading", "dark")).not.toBe(skillColor("reading", "light"));
    expect(skillColor("geography")).toBe(getChartPalette("light").other);
    const skills = ["reading", "listening", "vocab-grammar", "writing", "speaking"].map((s) => skillColor(s));
    expect(new Set(skills).size).toBe(5);
  });
});
