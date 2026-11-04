import { describe, expect, it } from "vitest";

import { tokenizeSentence, type WordSpan } from "./error-correction";
import {
  huntMarks,
  huntParagraph,
  initialActiveRow,
  labelsByParagraphOffset,
  locateSentence,
  markFromParagraph,
  pickParagraphWord,
  sentenceAt,
  sentenceSpans,
} from "./error-hunt";

// A hunt's offsets are paragraph offsets end to end — the click, the stored key
// and the grade. An offset that is off by one grades every student wrong and
// looks like a wrong answer, not a bug.

const PARA =
  "One of those voices with me was Noam Chomsky. He didn’t just offer several " +
  "analysis; he modelled a stance. Nor his political engagement merely rhetorical.";

const at = (word: string) => PARA.indexOf(word);
/** The span of a word, or of a run of words, as the paragraph spells it. */
const span = (text: string): WordSpan => ({ start: at(text), end: at(text) + text.length });

describe("sentenceSpans", () => {
  it("covers the whole paragraph", () => {
    const spans = sentenceSpans(PARA);
    expect(spans).toHaveLength(3);
    expect(spans.map((s) => PARA.slice(s.start, s.end)).join("")).toBe(PARA);
  });

  it("keeps the terminator with its sentence", () => {
    expect(sentenceSpans("One. Two.")[0].text).toBe("One.");
  });

  it("handles a paragraph with no terminator at all", () => {
    const spans = sentenceSpans("no full stop here");
    expect(spans).toHaveLength(1);
    expect(spans[0]).toMatchObject({ start: 0, end: 17 });
  });

  it("ignores trailing whitespace rather than emitting an empty span", () => {
    expect(sentenceSpans("One.   ")).toHaveLength(1);
  });
});

describe("sentenceAt", () => {
  it("finds the sentence an offset falls in", () => {
    expect(sentenceAt(PARA, at("analysis"))?.text.trim()).toBe(
      "He didn’t just offer several analysis; he modelled a stance.",
    );
  });

  it("returns the first sentence for offset 0", () => {
    expect(sentenceAt(PARA, 0)?.start).toBe(0);
  });
});

describe("locateSentence", () => {
  it("finds a verbatim sentence", () => {
    const sentence = "Nor his political engagement merely rhetorical.";
    expect(PARA.slice(locateSentence(PARA, sentence))).toBe(sentence);
  });

  it("still finds one whose whitespace was reflowed", () => {
    const text = "The first line\nand its rest. Another.";
    expect(locateSentence(text, "The first line and its rest.")).toBe(0);
  });

  it("returns -1 when the sentence isn't there", () => {
    expect(locateSentence(PARA, "A sentence from another paper.")).toBe(-1);
    expect(locateSentence(PARA, "   ")).toBe(-1);
  });
});

describe("huntParagraph", () => {
  it("is the joined passage of a section that has one", () => {
    expect(huntParagraph({ kind: "section", passage: ["One.", "Two."] })).toBe(
      "One.\n\nTwo.",
    );
  });

  it("is null for a part, an empty passage, or no collection", () => {
    // A standalone question's offset is into its own sentence.
    expect(huntParagraph({ kind: "part", passage: ["One."] })).toBeNull();
    expect(huntParagraph({ kind: "section", passage: [] })).toBeNull();
    expect(huntParagraph({ kind: "section", passage: null })).toBeNull();
    expect(huntParagraph(null)).toBeNull();
  });
});

describe("huntMarks", () => {
  it("reads each stored offset as a paragraph position", () => {
    const { marks, unplaced } = huntMarks(PARA, [
      { error_offset: at("with"), error: "with" },
      { error_offset: at("analysis"), error: "analysis" },
    ]);
    expect(unplaced).toEqual([]);
    expect(marks).toEqual([
      { index: 0, paragraphOffset: at("with"), span: span("with"), word: "with" },
      { index: 1, paragraphOffset: at("analysis"), span: span("analysis"), word: "analysis" },
    ]);
  });

  it("covers every word of a mistake that spans several", () => {
    const { marks } = huntMarks(PARA, [
      { error_offset: at("several analysis"), error: "several analysis" },
    ]);
    expect(marks[0]).toMatchObject({ span: span("several analysis"), word: "several analysis" });
  });

  it("does not shift a sentence-relative offset by its sentence", () => {
    // 29 is where "analysis" sits in its own sentence; in the paragraph it is
    // the middle of "was", which no click can report.
    const { marks, unplaced } = huntMarks(PARA, [{ error_offset: 29, error: "analysis" }]);
    expect(marks).toEqual([]);
    expect(unplaced).toEqual([0]);
  });

  it("reports a question with no mark yet", () => {
    // Extraction returns a null key rather than guessing, so this is normal.
    expect(huntMarks(PARA, [{}]).unplaced).toEqual([0]);
  });

  it("reports a mark that doesn't land on a word start", () => {
    const { marks, unplaced } = huntMarks(PARA, [{ error_offset: at("with") + 1 }]);
    expect(marks).toEqual([]);
    expect(unplaced).toEqual([0]);
  });
});

describe("markFromParagraph", () => {
  it("stores the selection's own paragraph offset and derives the sentence", () => {
    const mark = markFromParagraph(PARA, span("analysis"));
    expect(mark).toEqual({
      sentence: "He didn’t just offer several analysis; he modelled a stance.",
      error: "analysis",
      paragraphOffset: at("analysis"),
    });
  });

  it("stores a run of words as one mistake", () => {
    expect(markFromParagraph(PARA, span("several analysis"))?.error).toBe("several analysis");
  });

  it("round-trips back through huntMarks", () => {
    const mark = markFromParagraph(PARA, span("political engagement"))!;
    const { marks } = huntMarks(PARA, [
      { error_offset: mark.paragraphOffset, error: mark.error },
    ]);
    expect(marks[0]).toMatchObject({
      paragraphOffset: at("political"),
      word: "political engagement",
    });
  });
});

describe("picking words for numbered rows", () => {
  // Five rows, numbered as the paper numbers them.
  const numbers = [52, 53, 54, 55, 56];
  const wordOffsets = tokenizeSentence(PARA)
    .filter((token) => token.isWord)
    .map((token) => token.offset);

  it("starts on the first row with no word, else the first row", () => {
    expect(initialActiveRow([span("with"), null, span("analysis"), null, null])).toBe(1);
    expect(initialActiveRow([span("One"), span("with"), span("Noam")])).toBe(0);
  });

  it("lets the last row mark a word at the very start of the paragraph", () => {
    const picked = [span("with"), span("analysis"), span("modelled"), span("political"), null];
    const active = initialActiveRow(picked);

    expect(numbers[active]).toBe(56);
    expect(pickParagraphWord(PARA, picked, active, 0)).toEqual({
      changes: [{ row: 4, span: span("One") }],
      nextActive: 4,
    });
  });

  it("lets an earlier row mark a word after a later row's sentence", () => {
    const picked = [span("with"), span("One"), span("offer"), span("stance"), span("Noam")];

    // Row 53 chosen by the student, then a word in the LAST sentence clicked.
    expect(pickParagraphWord(PARA, picked, 1, at("rhetorical")).changes).toEqual([
      { row: 1, span: span("rhetorical") },
    ]);
  });

  it("accepts a click on every word whichever row is active", () => {
    const picked = [null, null, null, null, null];
    for (let row = 0; row < picked.length; row += 1) {
      for (const offset of wordOffsets) {
        const [change] = pickParagraphWord(PARA, picked, row, offset).changes;
        expect(change).toMatchObject({ row, span: { start: offset } });
      }
    }
  });

  it("clears the active row when its own word is clicked again", () => {
    expect(pickParagraphWord(PARA, [span("with"), null], 0, at("with"))).toEqual({
      changes: [{ row: 0, span: null }],
      nextActive: 0,
    });
  });

  it("moves the active row's mark to a word not next to any mistake", () => {
    expect(
      pickParagraphWord(PARA, [span("with"), span("offer")], 0, at("analysis")).changes,
    ).toEqual([{ row: 0, span: span("analysis") }]);
  });

  it("undoes another row's word on the row that holds it, and goes there", () => {
    const picked = [span("with"), span("analysis"), null, null, null];

    expect(pickParagraphWord(PARA, picked, 2, at("with"))).toEqual({
      changes: [{ row: 0, span: null }],
      nextActive: 0,
    });
  });

  it("grows the row just marked to the next word, staying on the row after it", () => {
    // Row 52 took "several" and the student was moved on to row 53.
    const first = pickParagraphWord(PARA, [null, null], 0, at("several"));
    expect(first.nextActive).toBe(1);

    const second = pickParagraphWord(PARA, [span("several"), null], 1, at("analysis"));
    expect(second).toEqual({
      changes: [{ row: 0, span: span("several analysis") }],
      nextActive: 1,
    });
  });

  it("grows a mistake to the word before it", () => {
    expect(
      pickParagraphWord(PARA, [span("analysis"), null], 1, at("several")).changes,
    ).toEqual([{ row: 0, span: span("several analysis") }]);
  });

  it("shrinks a run of words from either end", () => {
    const picked = [span("several analysis"), null];
    expect(pickParagraphWord(PARA, picked, 1, at("several")).changes).toEqual([
      { row: 0, span: span("analysis") },
    ]);
    expect(pickParagraphWord(PARA, picked, 1, at("analysis")).changes).toEqual([
      { row: 0, span: span("several") },
    ]);
  });

  it("never grows a mistake across the end of a sentence", () => {
    // "He" follows "Chomsky." — the full stop keeps them apart.
    expect(pickParagraphWord(PARA, [span("Chomsky"), null], 1, at("He")).changes).toEqual([
      { row: 1, span: span("He") },
    ]);
  });

  it("marks two mistakes of one sentence on two rows", () => {
    const first = pickParagraphWord(PARA, [null, null], 0, at("offer"));
    expect(first).toEqual({ changes: [{ row: 0, span: span("offer") }], nextActive: 1 });

    const second = pickParagraphWord(PARA, [span("offer"), null], first.nextActive, at("modelled"));
    expect(second.changes).toEqual([{ row: 1, span: span("modelled") }]);
  });

  it("advances to the next row still missing a word, wrapping to the top", () => {
    const picked = [null, span("with"), null, span("offer"), span("stance")];
    expect(pickParagraphWord(PARA, picked, 2, at("analysis")).nextActive).toBe(0);
  });

  it("labels each mistake with its row's number at its last word", () => {
    const labels = labelsByParagraphOffset(
      PARA,
      [span("with"), null, span("several analysis")],
      [52, 53, 54],
    );
    expect([...labels]).toEqual([
      [at("with"), 52],
      [at("analysis"), 54],
    ]);
  });
});
