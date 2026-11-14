import { describe, expect, it } from "vitest";

import {
  ERROR_HUNT,
  layoutRequiredType,
  questionTypeLabel,
  sectionTask,
  sectionTaskLabel,
  sharesOnePool,
  taskRequiredType,
} from "./section-type";

// Six of the paper's most distinctive tasks are sections of plain `mcq` /
// `gap-filling` carrying a layout, so anything labelling a question by
// `node.type` alone would call all six "Multiple choice". In the AI-extract review
// that is the one field naming what the extractor thinks the task is.

describe("questionTypeLabel", () => {
  it("names the compound task, not the type underneath it", () => {
    expect(questionTypeLabel("mcq", "gapped-text")).toBe("Gapped text");
    expect(questionTypeLabel("mcq", "multiple-matching")).toBe("Multiple matching");
    expect(questionTypeLabel("mcq", "multi-select")).toBe("Choose several");
    expect(questionTypeLabel("mcq", "jumbled-paragraph")).toBe("Jumbled paragraphs");
    expect(questionTypeLabel("mcq", "guided-cloze")).toBe("Guided cloze");
    expect(questionTypeLabel("gap-filling", "word-formation")).toBe("Word formation");
    expect(questionTypeLabel("gap-filling", "banked-cloze")).toBe(
      "Cloze from a word bank",
    );
  });

  it("never calls a word formation 'Gap filling', in either printed shape", () => {
    // Both shapes of the task — independent sentences each naming a word, and
    // one paragraph with its words down the margin — are `gap-filling`
    // questions underneath, so the label has to come from the layout.
    expect(questionTypeLabel("gap-filling", "word-formation")).not.toBe("Gap filling");
    // And the three cloze-family tasks are distinguishable from each other,
    // since a teacher checking an extraction is checking exactly this.
    const labels = [
      questionTypeLabel("gap-filling", "cloze"),
      questionTypeLabel("gap-filling", "banked-cloze"),
      questionTypeLabel("mcq", "guided-cloze"),
    ];
    expect(new Set(labels).size).toBe(3);
  });

  it("falls back to the plain type with no layout", () => {
    // A standalone question and a plain run read as their plain type.
    expect(questionTypeLabel("mcq", null)).toBe("Multiple choice");
    expect(questionTypeLabel("mcq")).toBe("Multiple choice");
    expect(questionTypeLabel("short-answer", null)).toBe("Short answer");
  });

  it("does not invent a label for an unknown type", () => {
    expect(questionTypeLabel("something-new")).toBe("something-new");
  });
});

describe("sharesOnePool", () => {
  it("is true for the layouts that print ONE lettered list", () => {
    // A question added to one of these must copy its siblings' options, or the
    // section stops rendering as one task.
    expect(sharesOnePool("gapped-text")).toBe(true);
    expect(sharesOnePool("jumbled-paragraph")).toBe(true);
    expect(sharesOnePool("multiple-matching")).toBe(true);
    expect(sharesOnePool("multi-select")).toBe(true);
  });

  it("is false for a guided cloze, whose blanks each print their OWN options", () => {
    // The explicit exception in the API's section prompt. Copying one blank's
    // options onto another would be wrong, not merely redundant.
    expect(sharesOnePool("guided-cloze")).toBe(false);
  });

  it("is false with no layout, and for word formation", () => {
    expect(sharesOnePool(null)).toBe(false);
    expect(sharesOnePool(undefined)).toBe(false);
    // Its shared thing is a word bank on the section, not options on a question.
    expect(sharesOnePool("word-formation")).toBe(false);
    // Same for a banked cloze: the pool rides `info.word_bank`, so copying
    // options between questions would write options onto gaps that have none.
    expect(sharesOnePool("banked-cloze")).toBe(false);
  });
});

describe("layoutRequiredType", () => {
  it("pins the base type every layout is defined over", () => {
    // `pageLayout` only uses a layout when EVERY node on the page is mcq, so one
    // wrong type silently degrades the whole section to a stack of cards.
    expect(layoutRequiredType("gapped-text")).toBe("mcq");
    expect(layoutRequiredType("multiple-matching")).toBe("mcq");
    expect(layoutRequiredType("multi-select")).toBe("mcq");
    expect(layoutRequiredType("jumbled-paragraph")).toBe("mcq");
    expect(layoutRequiredType("guided-cloze")).toBe("mcq");
    expect(layoutRequiredType("word-formation")).toBe("gap-filling");
    expect(layoutRequiredType("cloze")).toBe("gap-filling");
    // A banked cloze's blanks are typed into, not chosen from — the pool is a
    // reference list beside the passage, not options on the question. Getting
    // this wrong puts an MCQ with no options in the middle of the run.
    expect(layoutRequiredType("banked-cloze")).toBe("gap-filling");
    // A topic pool is a section of speaking questions, one per prompt.
    expect(layoutRequiredType("topic-pool")).toBe("speaking");
  });

  it("leaves the choice open when the section has no layout", () => {
    expect(layoutRequiredType(null)).toBeNull();
    expect(layoutRequiredType(undefined)).toBeNull();
  });
});

describe("sectionTask", () => {
  it("reads an error hunt off its questions, since the API stores no layout for one", () => {
    expect(sectionTask(null, ["error-correction", "error-correction"])).toBe(ERROR_HUNT);
    expect(sectionTaskLabel(ERROR_HUNT)).toBe("Error correction in a passage");
  });

  it("is not a hunt when any question is another type, or there are none", () => {
    expect(sectionTask(null, ["error-correction", "mcq"])).toBeNull();
    expect(sectionTask(null, [])).toBeNull();
  });

  it("prefers a stored layout", () => {
    expect(sectionTask("gapped-text", ["mcq"])).toBe("gapped-text");
  });

  it("pins error-correction for a hunt, and the layout's type otherwise", () => {
    expect(taskRequiredType(ERROR_HUNT)).toBe("error-correction");
    expect(taskRequiredType("cloze")).toBe("gap-filling");
    expect(taskRequiredType(null)).toBeNull();
  });
});
