import { describe, expect, it } from "vitest";

import { EXERCISE_VIETNAMESE_MESSAGES } from "./messages";
import { QUESTION_TYPE_LABELS, SKILL_LABELS } from "./lib/exercises";
import { ERROR_HUNT, SECTION_LAYOUTS, sectionTaskLabel } from "./lib/section-type";

// Every source file under `src/exercise` as text, through Vite's raw import, so
// the check needs no Node APIs. Tests are left out.
const SOURCES = import.meta.glob(["./**/*.ts", "./**/*.tsx", "!./**/*.test.ts", "!./**/*.test.tsx"], {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

describe("EXERCISE_VIETNAMESE_MESSAGES", () => {
  it("has a Vietnamese entry for every `exercise.` key the code passes to t()", () => {
    const keys = new Set(
      Object.values(SOURCES).flatMap((source) =>
        [...source.matchAll(/t\(\s*"(exercise\.[^"]+)"/g)].map((match) => match[1]),
      ),
    );
    expect(keys.size).toBeGreaterThan(0);
    expect([...keys].filter((key) => !(key in EXERCISE_VIETNAMESE_MESSAGES))).toEqual([]);
  });

  it("translates every skill, question type and section task through `exercise.value.`", () => {
    const values = [
      ...Object.values(SKILL_LABELS),
      ...Object.values(QUESTION_TYPE_LABELS),
      ...SECTION_LAYOUTS.map((layout) => sectionTaskLabel(layout)),
      sectionTaskLabel(ERROR_HUNT),
    ];
    expect(values.filter((value) => !(`exercise.value.${value}` in EXERCISE_VIETNAMESE_MESSAGES))).toEqual([]);
  });
});
