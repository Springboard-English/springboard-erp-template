import { describe, expect, it } from "vitest";

import type { RunPart } from "./api";
import { partClockState } from "./timed-part-gates";

const T0 = Date.parse("2026-11-26T10:00:00Z");
const at = (s: number) => new Date(T0 + s * 1000).toISOString();

function part(fields: Partial<RunPart>): RunPart {
  return {
    part_key: "p",
    order: 0,
    title: null,
    time_limit_seconds: 120,
    preparation_seconds: 30,
    questions: [],
    opened_at: at(0),
    prep_ends_at: at(30),
    deadline_at: at(150),
    ...fields,
  };
}

describe("partClockState", () => {
  it("prepares, then answers, then is over", () => {
    expect(partClockState(part({}), T0 + 10_000)).toEqual({ stage: "prepare", secondsLeft: 20 });
    expect(partClockState(part({}), T0 + 40_000)).toEqual({ stage: "answer", secondsLeft: 110 });
    expect(partClockState(part({}), T0 + 200_000)).toEqual({ stage: "over", secondsLeft: 0 });
  });

  it("has no clock for an unopened or untimed part", () => {
    expect(partClockState(part({ opened_at: null }), T0)).toBeNull();
    expect(partClockState(part({ time_limit_seconds: null, preparation_seconds: null }), T0)).toBeNull();
  });

  it("goes straight to answering without preparation", () => {
    expect(partClockState(part({ preparation_seconds: null, prep_ends_at: null }), T0 + 1_000)).toEqual({
      stage: "answer",
      secondsLeft: 149,
    });
  });
});
