import { describe, expect, it } from "vitest";

import {
  formatAnswer,
  formatAnswerKey,
  formattedAnswerText,
} from "./attempt-answer";
import type { ExerciseNode } from "./exercises";

const base = { id: "n1", skillTag: "reading", title: "T", instruction: "" } as const;

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
        { id: "c", label: "Nobody applied" },
      ],
      correct_option_id: "b",
    },
  } as ExerciseNode;
}

function gap(): ExerciseNode {
  return {
    ...base,
    type: "gap-filling",
    points: 1,
    content: {
      before: "The delay was",
      after: "long.",
      placeholder: "Type your answer",
      accepted_answers: ["unusually", "unusually long"],
    },
  } as ExerciseNode;
}

function rootedGap(): ExerciseNode {
  return {
    ...base,
    type: "gap-filling",
    points: 1,
    content: {
      before: "It arrived",
      after: ".",
      placeholder: "Type your answer",
      accepted_answers: ["unexpectedly"],
      root: "EXPECT",
    },
  } as ExerciseNode;
}

describe("a banked word-formation", () => {
  it("shows the root pick and the word as two parts, each side", () => {
    expect(formatAnswer(rootedGap(), { root: "CARE", word: "unexpectedly" })).toEqual({
      kind: "pairs",
      value: [
        { label: "Root", value: "CARE" },
        { label: "Answer", value: "unexpectedly" },
      ],
    });
    expect(formatAnswerKey(rootedGap())).toEqual({
      kind: "pairs",
      value: [
        { label: "Root", value: "EXPECT" },
        { label: "Answer", value: "unexpectedly" },
      ],
    });
  });

  it("still shows a plain typed answer verbatim", () => {
    expect(formatAnswer(rootedGap(), "unexpectedly")).toEqual({
      kind: "text",
      value: "unexpectedly",
    });
  });
});

function errorCorrection(): ExerciseNode {
  return {
    ...base,
    type: "error-correction",
    points: 1,
    content: {
      sentence: "She have been waiting since Monday.",
      placeholder: "Type the correction",
      error: "have",
      error_offset: 4,
      accepted_answers: ["has"],
    },
  } as ExerciseNode;
}

describe("formatAnswer", () => {
  it("turns an option id into the option's printed label", () => {
    // The whole point: "b" tells a teacher nothing.
    expect(formatAnswer(mcq(), "b")).toEqual({
      kind: "text",
      value: "The factory had already closed",
    });
  });

  it("falls back to the id when the option pool is gone", () => {
    const node = mcq();
    (node.content as { options: unknown }).options = [];
    expect(formatAnswer(node, "b")).toEqual({ kind: "text", value: "b" });
  });

  it("shows every pick of a merged choose-N group", () => {
    // Each question of a multi-select is handed the WHOLE selection, so a list
    // is a normal answer here even though the question is worth one mark.
    // Labelled as the group's: the same picks sit on every row of the group,
    // right on one and wrong on the next.
    expect(formatAnswer(mcq(), ["a", "b"])).toEqual({
      kind: "pairs",
      value: [
        {
          label: "Picked for the group",
          value: "The rent rose, The factory had already closed",
        },
      ],
    });
  });

  it("shows a typed answer verbatim", () => {
    // Their own words are what is being marked — nothing normalised.
    expect(formatAnswer(gap(), "  Unusually  ")).toEqual({
      kind: "text",
      value: "Unusually",
    });
  });

  it("splits an error correction into the word blamed and the fix", () => {
    // Half-right is a real outcome (the server awards partial credit), so these
    // must not collapse into one string.
    expect(formatAnswer(errorCorrection(), { pick: "4", fix: "has" })).toEqual({
      kind: "pairs",
      value: [
        { label: "Marked", value: "have" },
        { label: "Corrected to", value: "has" },
      ],
    });
  });

  it("shows every word of a selection spanning several", () => {
    expect(
      formatAnswer(errorCorrection(), { pick: "4", pick_end: "13", fix: "has been" }),
    ).toEqual({
      kind: "pairs",
      value: [
        { label: "Marked", value: "have been" },
        { label: "Corrected to", value: "has been" },
      ],
    });
  });

  it("keeps the half of a correction that was given", () => {
    expect(formatAnswer(errorCorrection(), { fix: "has" })).toEqual({
      kind: "pairs",
      value: [{ label: "Corrected to", value: "has" }],
    });
  });

  it("reports an out-of-range pick as nothing rather than guessing", () => {
    expect(formatAnswer(errorCorrection(), { pick: "999" })).toEqual({
      kind: "none",
    });
  });

  it("reads a hunt's pick against the joined passage, not the sentence", () => {
    const passage = "They have left.\n\nShe have been waiting since Monday.";
    const pick = passage.lastIndexOf("have");

    expect(formatAnswer(errorCorrection(), { pick: String(pick), fix: "has" }, passage)).toEqual({
      kind: "pairs",
      value: [
        { label: "Marked", value: "have" },
        { label: "Corrected to", value: "has" },
      ],
    });
    // The offset of "have" in its own sentence is a space in the passage.
    expect(formatAnswer(errorCorrection(), { pick: "4" }, passage)).toEqual({ kind: "none" });
  });

  it("reads a standalone pick against its own sentence, from offset zero", () => {
    expect(formatAnswer(errorCorrection(), { pick: "0" }, null)).toEqual({
      kind: "pairs",
      value: [{ label: "Marked", value: "She" }],
    });
  });

  it("prints a True/False/Not Given verdict as words, not its stored value", () => {
    // `not-given` is a wire value; the paper says "Not Given".
    const tfng = {
      ...base,
      type: "true-false-not-given",
      points: 1,
      content: { statement: "The mill closed in 1990.", answer: "not-given" },
    } as ExerciseNode;
    expect(formatAnswer(tfng, "not-given")).toEqual({ kind: "text", value: "Not given" });
    expect(formatAnswer(tfng, "true")).toEqual({ kind: "text", value: "True" });
    expect(formatAnswer(tfng, "false")).toEqual({ kind: "text", value: "False" });
    expect(formatAnswerKey(tfng)).toEqual({ kind: "text", value: "Not given" });
    // A value this build doesn't know is shown as sent, not dropped.
    expect(formatAnswer(tfng, "maybe")).toEqual({ kind: "text", value: "maybe" });
  });

  it("says nothing for a question that was never answered", () => {
    // The unanswered row is the whole reason items come from the test's links.
    expect(formatAnswer(mcq(), null)).toEqual({ kind: "none" });
    expect(formatAnswer(gap(), "   ")).toEqual({ kind: "none" });
  });
});

describe("formatAnswerKey", () => {
  it("labels the correct option", () => {
    expect(formatAnswerKey(mcq())).toEqual({
      kind: "text",
      value: "The factory had already closed",
    });
  });

  it("lists every accepted spelling", () => {
    // A teacher checking a near-miss needs to see what the grader would take.
    expect(formatAnswerKey(gap())).toEqual({
      kind: "text",
      value: "unusually / unusually long",
    });
  });

  it("has nothing to show for a question with no key", () => {
    // Extraction returns answer_key: null for a paper printed without one, and
    // that question is KEPT for the teacher to complete.
    const node = gap();
    delete (node.content as { accepted_answers?: unknown }).accepted_answers;
    expect(formatAnswerKey(node)).toEqual({ kind: "none" });
  });

  it("has nothing to show for a human-graded essay", () => {
    const essay = {
      ...base,
      type: "essay",
      points: 10,
      content: { prompt: "Discuss.", placeholder: "Write here" },
    } as ExerciseNode;
    expect(formatAnswerKey(essay)).toEqual({ kind: "none" });
    expect(formatAnswer(essay, "My answer")).toEqual({
      kind: "text",
      value: "My answer",
    });
  });

  it("names an essay or a recording handed in as a file", () => {
    const essay = {
      ...base,
      type: "essay",
      content: { prompt: "Discuss.", placeholder: "" },
    } as ExerciseNode;
    const speaking = {
      ...base,
      type: "speaking",
      content: { prompt: "Talk about a trip." },
    } as ExerciseNode;
    const handedIn = { kind: "text", value: "Handed in as a file" };
    expect(formatAnswer(essay, { file_key: "f1" })).toEqual(handedIn);
    expect(formatAnswer(speaking, { file_key: "f2" })).toEqual(handedIn);
    expect(formatAnswer(speaking, null)).toEqual({ kind: "none" });
    expect(formatAnswerKey(speaking)).toEqual({ kind: "none" });
  });
});

describe("formattedAnswerText", () => {
  it("flattens both shapes to one line", () => {
    expect(formattedAnswerText({ kind: "none" })).toBe("");
    expect(formattedAnswerText({ kind: "text", value: "x" })).toBe("x");
    expect(
      formattedAnswerText(formatAnswer(errorCorrection(), { pick: "4", fix: "has" })),
    ).toBe("Marked: have · Corrected to: has");
  });
});
