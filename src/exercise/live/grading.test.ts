import { describe, expect, it } from "vitest";

import { gradedFromResult, unansweredNodeIds } from "./grading";
import type { ExerciseNode, SpringboardTest } from "../index";
import type { ParticipantResult } from "./api";

// The test owns its data. `unansweredNodeIds` only reads node ids, so the nodes
// here are the cheapest ones that still type-check — one per answer shape the
// function has to interpret (string, record, and a node never answered at all).

function mcq(id: string): ExerciseNode {
  return {
    id,
    type: "mcq",
    skillTag: "reading",
    title: "Question",
    instruction: "Choose one.",
    points: 1,
    content: {
      prompt: "Pick a letter.",
      options: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
      correct_option_id: "b",
    },
  };
}

const test: SpringboardTest = {
  id: "t-1",
  title: "Blank detection",
  description: "Fixture for the pre-submit unanswered check.",
  teacherName: "Test",
  status: "draft",
  durationMinutes: 10,
  updatedAt: "Today",
  nodes: [mcq("q-1"), mcq("q-2"), mcq("q-3"), mcq("q-4")],
};

describe("unansweredNodeIds", () => {
  it("flags blank, empty-string, and empty-object answers", () => {
    const ids = unansweredNodeIds(test, { "q-1": "b", "q-2": "", "q-3": {} });
    expect(ids).toContain("q-2");
    expect(ids).toContain("q-3");
    expect(ids).not.toContain("q-1");
    expect(ids).toContain("q-4"); // never answered
  });

  it("treats an explicit null as unanswered", () => {
    expect(unansweredNodeIds(test, { "q-1": null })).toContain("q-1");
  });

  it("counts a partially filled record as answered", () => {
    // The pre-submit warning is deliberately coarse: any entry at all counts, so
    // a half-filled matching question doesn't nag the student.
    expect(unansweredNodeIds(test, { "q-1": { a: "x" } })).not.toContain("q-1");
  });
});

describe("gradedFromResult", () => {
  // A three-question paper as the API returns it: one right, one essay still
  // with the teacher, one never reached. Decimals arrive as strings.
  const result: ParticipantResult = {
    answer_visibility: "after-submit",
    answered: 2,
    correct: 1,
    points: "2.0000" as unknown as number,
    max_points: "15.0000" as unknown as number,
    pending: 1,
    marked_points: "5.0000" as unknown as number,
    items: [
      { exercise_key: "q-1", answered: true, answer: "b", correct: true, points: 2 },
      {
        exercise_key: "q-2",
        answered: true,
        answer: { text: "An essay." } as unknown as string,
        correct: null,
        points: null,
        pending: true,
      },
      { exercise_key: "q-3", answered: false, answer: null, correct: null, points: null },
    ],
  };

  it("is provisional over what has been marked while an essay is outstanding", () => {
    const graded = gradedFromResult(result);
    // 2 of the 5 marked points, not 2 of the paper's 15.
    expect(graded.percentage).toBe(40);
    expect(graded.pending).toBe(1);
    expect(graded.points).toBe(2);
    expect(graded.maxPoints).toBe(15);
  });

  it("counts only questions with a verdict as gradable", () => {
    const graded = gradedFromResult(result);
    // The essay and the unreached question both carry `correct: null`.
    expect(graded.gradable).toBe(1);
    expect(graded.correct).toBe(1);
    expect(graded.correctByNode).toEqual({ "q-1": true, "q-2": false, "q-3": false });
  });

  it("survives an older API that sends only the answered items", () => {
    const graded = gradedFromResult({
      ...result,
      pending: 0,
      marked_points: 15,
      items: [{ exercise_key: "q-1", correct: true, points: 2 }],
    });
    expect(graded.percentage).toBe(13);
    expect(graded.gradable).toBe(1);
  });
});
