import { describe, expect, it } from "vitest";

import { answerFromKey, keyFromAnswer } from "./answer-key-bridge";
import type { ExerciseNode } from "./exercises";

const base = { id: "q1", skillTag: "reading", title: "", instruction: "", points: 1 } as const;

describe("answerFromKey / keyFromAnswer", () => {
  it("an mcq's pick is its correct option", () => {
    const node = {
      ...base,
      type: "mcq",
      content: { prompt: "Pick", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }], correct_option_id: "a" },
    } as ExerciseNode;
    expect(answerFromKey(node)).toBe("a");
    const next = keyFromAnswer(node, "b");
    expect(next.type === "mcq" && next.content.correct_option_id).toBe("b");
  });

  it("typing in a blank replaces the first accepted answer and keeps the alternates", () => {
    const node = {
      ...base,
      type: "gap-filling",
      content: { before: "She", after: "here.", accepted_answers: ["is", "'s"] },
    } as ExerciseNode;
    expect(answerFromKey(node)).toBe("is");
    const next = keyFromAnswer(node, "was");
    expect(next.type === "gap-filling" && next.content.accepted_answers).toEqual(["was", "'s"]);
    const cleared = keyFromAnswer(node, "");
    expect(cleared.type === "gap-filling" && cleared.content.accepted_answers).toEqual(["'s"]);
  });

  it("a banked word formation keys its root and word", () => {
    const node = {
      ...base,
      type: "gap-filling",
      content: { before: "It was", after: ".", root: "EXPECT", accepted_answers: ["unexpected"] },
    } as ExerciseNode;
    expect(answerFromKey(node)).toEqual({ root: "EXPECT", word: "unexpected" });
    const next = keyFromAnswer(node, { root: "CARE", word: "careless" });
    expect(next.type === "gap-filling" && next.content.root).toBe("CARE");
    expect(next.type === "gap-filling" && next.content.accepted_answers).toEqual(["careless"]);
  });

  it("a T/F/NG pick is its answer", () => {
    const node = { ...base, type: "true-false-not-given", content: { statement: "S", answer: "true" } } as ExerciseNode;
    expect(answerFromKey(node)).toBe("true");
    const next = keyFromAnswer(node, "not-given");
    expect(next.type === "true-false-not-given" && next.content.answer).toBe("not-given");
  });

  it("an error correction's picked words and fix are its mistake and correction", () => {
    const node = {
      ...base,
      type: "error-correction",
      content: { sentence: "She have been here.", placeholder: "", accepted_answers: [] },
    } as ExerciseNode;
    expect(answerFromKey(node)).toBeNull();
    const next = keyFromAnswer(node, { pick: "4", pick_end: "8", fix: "has" });
    if (next.type !== "error-correction") throw new Error("type");
    expect(next.content.error).toBe("have");
    expect(next.content.error_offset).toBe(4);
    expect(next.content.accepted_answers).toEqual(["has"]);
    expect(answerFromKey(next)).toEqual({ pick: "4", pick_end: "8", fix: "has" });
  });

  it("a hunt's pick is measured in the passage and stores its sentence", () => {
    const text = "It was fine. She have been here.";
    const node = { ...base, type: "error-correction", content: { sentence: "", placeholder: "", accepted_answers: ["has"] } } as ExerciseNode;
    const next = keyFromAnswer(node, { pick: "17", pick_end: "21", fix: "has" }, text);
    if (next.type !== "error-correction") throw new Error("type");
    expect(next.content.error).toBe("have");
    expect(next.content.error_offset).toBe(17);
    expect(next.content.sentence).toBe("She have been here.");
  });
});
