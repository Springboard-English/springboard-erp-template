import { describe, expect, it } from "vitest";

import type { RunPart, SessionExercise } from "./api";
import { partIndexOf, partsToOpen, paperState } from "./paper-parts";

const part = (key: string, extra: Partial<RunPart> = {}): RunPart => ({
  part_key: key,
  order: 0,
  title: null,
  time_limit_seconds: null,
  preparation_seconds: null,
  questions: [{ exercise_key: `${key}-q1`, order: 0, type: "mcq" }],
  opened_at: null,
  prep_ends_at: null,
  deadline_at: null,
  ...extra,
});
const timed = (key: string, extra: Partial<RunPart> = {}) => part(key, { time_limit_seconds: 60, ...extra });
const ex = (key: string, order: number): SessionExercise => ({ exercise_key: key, order, exercise: {} }) as unknown as SessionExercise;

describe("partsToOpen", () => {
  it("opens the part on screen and preloads the next", () => {
    const parts = [part("a"), part("b"), part("c")];
    expect(partsToOpen(parts, 0, new Set())).toEqual(["a", "b"]);
    expect(partsToOpen(parts, 1, new Set())).toEqual(["a", "b", "c"]);
  });

  it("never preloads a fresh timed part, but reopens one already started or asked for", () => {
    expect(partsToOpen([part("a"), timed("b")], 0, new Set())).toEqual(["a"]);
    expect(partsToOpen([part("a"), timed("b", { opened_at: "2026-11-15T05:00:00Z" })], 0, new Set())).toEqual(["a", "b"]);
    expect(partsToOpen([part("a"), timed("b")], 0, new Set(["b"]))).toEqual(["a", "b"]);
  });
});

describe("paperState", () => {
  it("joins opened parts in order and stops at the first one not open", () => {
    const parts = [part("a"), part("b"), part("c")];
    const opened = new Map([["a", [ex("a2", 1), ex("a1", 0)]], ["c", [ex("c1", 0)]]]);
    const state = paperState(parts, opened);
    expect(state.exercises.map((e) => e.exercise_key)).toEqual(["a1", "a2"]);
    expect(state).toMatchObject({ gate: null, more: true });
  });

  it("names the timed part waiting at its gate", () => {
    const state = paperState([part("a"), timed("b")], new Map([["a", [ex("a1", 0)]]]));
    expect(state.gate?.part_key).toBe("b");
    expect(state.more).toBe(false);
  });

  it("is complete once every part is open", () => {
    expect(paperState([part("a")], new Map([["a", [ex("a1", 0)]]]))).toMatchObject({ gate: null, more: false });
  });
});

describe("partIndexOf", () => {
  it("finds a question's part from the map", () => {
    expect(partIndexOf([part("a"), part("b")], "b-q1")).toBe(1);
    expect(partIndexOf([part("a")], "zzz")).toBe(-1);
  });
});
