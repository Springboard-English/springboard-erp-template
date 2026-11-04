import { describe, expect, it } from "vitest";

import type { Translate } from "../i18n";
import { questionLabel as questionLabelIn, questionSummary } from "./question-summary";

const t: Translate = (_k, f = "", v = {}) => f.replace(/\{(\w+)\}/g, (_, n) => String(v[n]));
const questionLabel = (type: string, content: Record<string, unknown>, title?: string | null) =>
  questionLabelIn(type, content, t, title);

// Every question list identifies a row by this. An extracted question's `title`
// is empty (its heading lives on the section), so if a content shape falls
// through to "" here, a whole test reads "Untitled question" on every row.

describe("questionSummary", () => {
  it("reads the ask out of each content shape", () => {
    expect(questionSummary("mcq", { prompt: "What does the writer suggest?" })).toBe(
      "What does the writer suggest?",
    );
    expect(
      questionSummary("true-false-not-given", { statement: "Chomsky was arrested." }),
    ).toBe("Chomsky was arrested.");
    expect(
      questionSummary("error-correction", { sentence: "She have been here." }),
    ).toBe("She have been here.");
    expect(questionSummary("essay", { prompt: "Discuss." })).toBe("Discuss.");
  });

  it("shows a gap question with its blank in place", () => {
    expect(
      questionSummary("gap-filling", { before: "She has", after: "finished." }),
    ).toBe("She has ____ finished.");
    // A blank at the end of the sentence has no `after`, and must not render a
    // trailing separator.
    expect(questionSummary("rewriting", { before: "Despite" })).toBe("Despite ____");
  });

  it("leads a rewrite with the sentence being rewritten", () => {
    // The frame alone is a blank with nothing to fill it from.
    expect(
      questionSummary("rewriting", {
        source_sentence: "He started work here in 2019.",
        before: "He has",
        after: "here since 2019.",
        given_word: "worked",
      }),
    ).toBe("He started work here in 2019. → He has ____ here since 2019. (worked)");
    // A rewrite with no frame yet still identifies itself by its sentence.
    expect(
      questionSummary("rewriting", { source_sentence: "It was too cold to swim." }),
    ).toBe("It was too cold to swim.");
  });

  it("shows a short answer as the question itself, with no blank", () => {
    // It is a prompt, not a hole in a text — listing it with the gap family
    // would print "____" on a row whose question has no blank in it anywhere.
    expect(
      questionSummary("short-answer", { prompt: "Why did the company close?" }),
    ).toBe("Why did the company close?");
  });

  it("returns empty rather than guessing when there is no text", () => {
    expect(questionSummary("mcq", {})).toBe("");
    expect(questionSummary("mcq", null)).toBe("");
    expect(questionSummary("gap-filling", { before: "  ", after: "" })).toBe("");
    // A non-string blob (a shape this build doesn't know) must not crash a row.
    expect(questionSummary("mcq", { prompt: 42 })).toBe("");
  });

  it("handles a type this build has never seen", () => {
    // New types ship on the API first; a list still has to render the row.
    expect(questionSummary("matching-headings", { prompt: "Pick a heading" })).toBe(
      "Pick a heading",
    );
  });
});

describe("questionLabel", () => {
  it("prefers the question's text over its title", () => {
    expect(questionLabel("mcq", { prompt: "The real ask" }, "Question 4")).toBe(
      "The real ask",
    );
  });

  it("names a promptless guided-cloze blank by its options", () => {
    // Its place in the passage is the question, so with no prompt every row
    // would read "Untitled question".
    expect(
      questionLabel("mcq", {
        prompt: "",
        options: [
          { id: "A", label: "was" },
          { id: "B", label: "were" },
        ],
      }),
    ).toBe("____ (was / were)");
  });

  it("falls back to the title, then to a placeholder", () => {
    expect(questionLabel("mcq", {}, "Question 4")).toBe("Question 4");
    expect(questionLabel("mcq", {}, null)).toBe("Untitled question");
  });
});
