import { describe, expect, it } from "vitest";

import type { ExerciseNode } from "../index";
import { releasedAnswerKey } from "./released-key";

const base = { id: "n1", skillTag: "reading", title: "T", instruction: "" } as const;

// Student-safe nodes, as the session exercises arrive: no key in `content`.
function mcq(): ExerciseNode {
  return {
    ...base,
    type: "mcq",
    points: 1,
    content: {
      prompt: "Why did it close?",
      options: [
        { id: "a", label: "The rent rose" },
        { id: "b", label: "The factory had already closed" },
      ],
    },
  } as ExerciseNode;
}

function gap(): ExerciseNode {
  return {
    ...base,
    type: "gap-filling",
    points: 1,
    content: { before: "The delay was", after: "long." },
  } as ExerciseNode;
}

function tfng(): ExerciseNode {
  return {
    ...base,
    type: "true-false-not-given",
    points: 1,
    content: { statement: "The shop opened in 1990." },
  } as ExerciseNode;
}

function essay(): ExerciseNode {
  return {
    ...base,
    type: "essay",
    points: 10,
    content: { prompt: "Describe your town." },
  } as ExerciseNode;
}

describe("releasedAnswerKey", () => {
  it("names the correct option by its text, not its id", () => {
    expect(releasedAnswerKey(mcq(), { correct_option_id: "b" })).toEqual({
      kind: "text",
      value: "The factory had already closed",
    });
  });

  it("lists every accepted spelling of a gap", () => {
    expect(
      releasedAnswerKey(gap(), { accepted_answers: ["unusually", "very"] }),
    ).toEqual({ kind: "text", value: "unusually / very" });
  });

  it("prints a True/False/Not Given key as its label", () => {
    expect(releasedAnswerKey(tfng(), { answer: "false" })).toEqual({
      kind: "text",
      value: "False",
    });
  });

  it("prints nothing when the key was not released", () => {
    expect(releasedAnswerKey(mcq(), null)).toEqual({ kind: "none" });
    expect(releasedAnswerKey(mcq(), undefined)).toEqual({ kind: "none" });
  });

  it("prints nothing for a human-graded question, which has no key", () => {
    expect(releasedAnswerKey(essay(), {})).toEqual({ kind: "none" });
  });

  it("leaves the node it was handed without a key", () => {
    const node = mcq();
    releasedAnswerKey(node, { correct_option_id: "b" });
    expect("correct_option_id" in (node.content as object)).toBe(false);
  });
});
