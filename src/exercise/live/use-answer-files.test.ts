import { describe, expect, it } from "vitest";

import type { SessionExercise } from "./api";
import { recordingByteCap, withEssayDocs } from "./use-answer-files";

const item = (key: string, document: SessionExercise["document"]): SessionExercise =>
  ({ exercise_key: key, order: 0, exercise: { type: "essay" }, document }) as unknown as SessionExercise;
const doc = { appsheet_key: "f1" } as SessionExercise["document"];

describe("withEssayDocs", () => {
  it("counts an essay with its Doc as answered, without touching the answers given", () => {
    const answers = { q1: "b" };
    const counted = withEssayDocs(answers, [item("q2", doc), item("q3", null)]);
    expect(counted).toEqual({ q1: "b", q2: { file_key: "f1" } });
    expect(answers).toEqual({ q1: "b" });
  });

  it("keeps a recorded answer and returns the same object when nothing changes", () => {
    const answers = { q2: { file_key: "f9" } };
    expect(withEssayDocs(answers, [item("q2", doc)])).toBe(answers);
    expect(withEssayDocs(answers, undefined)).toBe(answers);
  });
});

describe("recordingByteCap", () => {
  it("sizes the upload from the longest take, within the API's 100 MB", () => {
    expect(recordingByteCap(60)).toBe(60 * 64 * 1024 + 1024 * 1024);
    expect(recordingByteCap(null)).toBe(900 * 64 * 1024 + 1024 * 1024);
    expect(recordingByteCap(100_000)).toBe(100 * 1024 * 1024);
  });
});
