import { describe, expect, it } from "vitest";

import { importIssues, questionTally, type UnitOutcome } from "./import-issues";

const done = (expected: number, received: number, parsed: number): UnitOutcome => ({ status: "done", expected, received, parsed });

describe("importIssues", () => {
  it("lists failed and short units in reading order, and skips complete and pending ones", () => {
    const outcomes = {
      a: done(10, 10, 10),
      b: { status: "failed", expected: 5, received: 0, parsed: 0, error: "Model timed out" } as UnitOutcome,
      c: done(20, 13, 13),
      d: { status: "pending", expected: 4, received: 0, parsed: 0 } as UnitOutcome,
    };
    expect(importIssues(["c", "a", "b", "d"], outcomes)).toEqual([
      { ref: "c", kind: "short", expected: 20, read: 13, unparsed: 0, error: undefined },
      { ref: "b", kind: "failed", expected: 5, read: 0, unparsed: 0, error: "Model timed out" },
    ]);
  });

  it("counts questions the API returned but the review could not show", () => {
    expect(importIssues(["e"], { e: done(3, 3, 0) })).toEqual([
      { ref: "e", kind: "failed", expected: 3, read: 0, unparsed: 3, error: undefined },
    ]);
    expect(importIssues(["f"], { f: done(3, 3, 2) })[0]).toMatchObject({ kind: "short", read: 2, unparsed: 1 });
  });
});

describe("questionTally", () => {
  it("adds what was read against what was detected", () => {
    expect(questionTally({ a: done(10, 10, 10), b: done(20, 13, 13) })).toEqual({ read: 23, expected: 30 });
  });
});
