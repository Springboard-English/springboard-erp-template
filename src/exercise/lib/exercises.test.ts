import { describe, expect, it } from "vitest";

import {
  exerciseNodeSchema,
  isCorrectAnswer,
  rootedAnswer,
  rootedValue,
  skillTagSchema,
  testSchema,
  SKILL_LABELS,
  type ExerciseNode,
} from "./exercises";

const choiceNode = {
  id: "choice-1",
  type: "mcq" as const,
  skillTag: "reading" as const,
  title: "Vocabulary",
  instruction: "Choose one.",
  points: 1,
  content: {
    prompt: "Meticulous means:",
    options: [{ id: "a", label: "Careless" }, { id: "b", label: "Precise" }],
    correct_option_id: "b",
  },
};

describe("Springboard exercise contracts", () => {
  it("accepts a valid typed question", () => {
    expect(exerciseNodeSchema.parse(choiceNode)).toMatchObject({ id: "choice-1", type: "mcq" });
  });

  it("rejects unsupported question types", () => {
    const invalid = { ...choiceNode, type: "invented-question" };
    expect(() => exerciseNodeSchema.parse(invalid)).toThrow();
  });

  it("checks choice answers against the verified answer key", () => {
    const parsed = exerciseNodeSchema.parse(choiceNode);
    expect(isCorrectAnswer(parsed, "b")).toBe(true);
    expect(isCorrectAnswer(parsed, "a")).toBe(false);
  });

  it("validates a complete test shape", () => {
    expect(testSchema.parse({
      id: "test-1",
      title: "Demo",
      description: "Demo test",
      teacherName: "Maya Chen",
      status: "draft",
      durationMinutes: 20,
      updatedAt: "Today",
      nodes: [choiceNode],
    }).nodes).toHaveLength(1);
  });
});

// The API splits the answer out of `content` into `answer_key`, and the
// student-safe endpoint returns content without it.
describe("rootedAnswer / rootedValue", () => {
  it("reads a plain gap answer as a word with no root", () => {
    expect(rootedAnswer("unexpectedly")).toEqual({ root: "", word: "unexpectedly" });
    expect(rootedAnswer(null)).toEqual({ root: "", word: "" });
    expect(rootedAnswer({ root: "EXPECT", word: "unexpectedly" })).toEqual({
      root: "EXPECT",
      word: "unexpectedly",
    });
  });

  it("stores only the parts given, and nothing when both are empty", () => {
    expect(rootedValue("EXPECT", "")).toEqual({ root: "EXPECT" });
    expect(rootedValue("", "")).toBeNull();
  });
});

describe("grading a node whose answer key was withheld", () => {
  it("returns false rather than throwing for a gap with no accepted answers", () => {
    const node = {
      id: "n", type: "gap-filling", skillTag: "vocab-grammar",
      title: "t", instruction: "i", points: 1,
      content: { before: "She has", after: "left." },
    } as unknown as ExerciseNode;
    expect(isCorrectAnswer(node, "already")).toBe(false);
  });

  it("grades error-correction on the clicked offset and the fix, not context", () => {
    const node = {
      id: "e", type: "error-correction", skillTag: "vocab-grammar",
      title: "t", instruction: "i", points: 1,
      content: {
        sentence: "She have been here.", placeholder: "",
        error: "have", error_offset: 4, accepted_answers: ["has"],
      },
    } as unknown as ExerciseNode;
    // Right word (offset 4) + accepted fix, case-insensitive.
    expect(isCorrectAnswer(node, { pick: "4", fix: "has" })).toBe(true);
    expect(isCorrectAnswer(node, { pick: "4", fix: "HAS" })).toBe(true);
    // Right fix but wrong word identified.
    expect(isCorrectAnswer(node, { pick: "0", fix: "has" })).toBe(false);
    // Right word but wrong fix.
    expect(isCorrectAnswer(node, { pick: "4", fix: "had" })).toBe(false);
    // A bare string is the wrong answer shape.
    expect(isCorrectAnswer(node, "has")).toBe(false);
  });

  it("grades a banked word-formation on the root pick and the word", () => {
    const node = {
      id: "w", type: "gap-filling", skillTag: "vocab-grammar",
      title: "t", instruction: "i", points: 1,
      content: {
        before: "It arrived", after: ".", placeholder: "",
        accepted_answers: ["unexpectedly"], root: "EXPECT",
      },
    } as unknown as ExerciseNode;
    expect(isCorrectAnswer(node, { root: "expect", word: "Unexpectedly" })).toBe(true);
    // Half right is half marks on the server; this binary grader says no.
    expect(isCorrectAnswer(node, { root: "CARE", word: "unexpectedly" })).toBe(false);
    expect(isCorrectAnswer(node, "unexpectedly")).toBe(false);
  });

  it("returns false for an error-correction whose key was withheld", () => {
    const node = {
      id: "e", type: "error-correction", skillTag: "vocab-grammar",
      title: "t", instruction: "i", points: 1,
      content: { sentence: "She have been here.", placeholder: "" },
    } as unknown as ExerciseNode;
    expect(isCorrectAnswer(node, { pick: "4", fix: "has" })).toBe(false);
  });

  it("returns false for a choice with no correct option recorded", () => {
    const node = {
      id: "n", type: "mcq", skillTag: "reading",
      title: "t", instruction: "i", points: 1,
      content: { prompt: "?", options: [
        { id: "opt-1", label: "a" }, { id: "opt-2", label: "b" }] },
    } as unknown as ExerciseNode;
    expect(isCorrectAnswer(node, "opt-1")).toBe(false);
  });
});

describe("merged choose-N groups", () => {
  const question = (correct: string): ExerciseNode =>
    ({
      id: correct,
      type: "mcq",
      skillTag: "reading",
      title: "",
      instruction: "",
      points: 1,
      content: {
        prompt: "Which THREE are mentioned?",
        options: [
          { id: "a", label: "A" },
          { id: "b", label: "B" },
          { id: "d", label: "D" },
          { id: "f", label: "F" },
        ],
        correct_option_id: correct,
      },
    }) as ExerciseNode;

  it("marks each question by whether its option is among the picks", () => {
    // Picks {a, b, d} against keys a, d, f: two right. Handing one pick to each
    // question positionally would have scored this one.
    const picks = ["a", "b", "d"];
    expect(isCorrectAnswer(question("a"), picks)).toBe(true);
    expect(isCorrectAnswer(question("d"), picks)).toBe(true);
    expect(isCorrectAnswer(question("f"), picks)).toBe(false);
  });

  it("does not care what order they were ticked in", () => {
    expect(isCorrectAnswer(question("d"), ["d", "a"])).toBe(true);
    expect(isCorrectAnswer(question("d"), ["a", "d"])).toBe(true);
  });

  it("leaves a single-answer question grading on exact match", () => {
    expect(isCorrectAnswer(question("a"), "a")).toBe(true);
    expect(isCorrectAnswer(question("a"), "b")).toBe(false);
  });
});

describe("every skill has a label", () => {
  // The accent half of this check lives with `CategoryPill`, beside the accent legend.
  it("resolves a label for each skill", () => {
    for (const skill of skillTagSchema.options) {
      expect(SKILL_LABELS[skill]).toBeTruthy();
    }
  });
});

describe("baseExerciseSchema.points", () => {
  // The API accepts `ge=0`, and 0 is a real mark: a worked example, an
  // unscored practice item. With `positive()` such a question would come back
  // from the server and fail to parse on the way in — stored, and never
  // editable again.
  it("accepts a question worth no marks", () => {
    const node = { ...choiceNode, points: 0 };
    expect(exerciseNodeSchema.safeParse(node).success).toBe(true);
  });

  it("accepts part marks to two places", () => {
    for (const points of [0.5, 1.25, 0.29]) {
      expect(exerciseNodeSchema.safeParse({ ...choiceNode, points }).success).toBe(true);
    }
  });

  it("rejects a third decimal place, which the API cannot store", () => {
    const node = { ...choiceNode, points: 0.125 };
    expect(exerciseNodeSchema.safeParse(node).success).toBe(false);
  });

  it("still rejects a negative mark", () => {
    const node = { ...choiceNode, points: -1 };
    expect(exerciseNodeSchema.safeParse(node).success).toBe(false);
  });

  it("defaults to one mark when omitted", () => {
    const node: Record<string, unknown> = { ...choiceNode };
    delete node.points;
    expect(exerciseNodeSchema.parse(node).points).toBe(1);
  });
});
