import { describe, expect, it } from "vitest";

import {
  answerSpan,
  markSpan,
  pickMatchesMark,
  relocateError,
  spanAnswerFields,
  spanText,
  toggleSpanWord,
  tokenizeSentence,
  wordAt,
} from "./error-correction";

// The offset is the whole grading contract for error-correction: the teacher
// stores where the wrong word starts, the student's click reports where the word
// they picked starts, and the server compares two integers. Nothing surfaces a
// disagreement — it just marks every attempt wrong — so the tokenizer and the
// re-anchoring that follows an edit are pinned here.

describe("tokenizeSentence", () => {
  it("covers the whole sentence, so every char keeps its offset", () => {
    const sentence = "She have been here.";
    const tokens = tokenizeSentence(sentence);
    expect(tokens.map((t) => t.text).join("")).toBe(sentence);
    expect(tokens.every((t) => sentence.startsWith(t.text, t.offset))).toBe(true);
  });

  it("keeps an inner apostrophe or hyphen inside the word", () => {
    const words = tokenizeSentence("He didn’t offer well-known analysis.")
      .filter((t) => t.isWord)
      .map((t) => t.text);
    expect(words).toEqual(["He", "didn’t", "offer", "well-known", "analysis"]);
  });
});

describe("wordAt", () => {
  it("reads back the word a stored offset points at", () => {
    expect(wordAt("She have been here.", 4)).toBe("have");
  });

  it("returns nothing for an offset inside a word", () => {
    // An offset that isn't a word start is unclickable, so it must not read as
    // a valid mark.
    expect(wordAt("She have been here.", 5)).toBe("");
  });
});

describe("relocateError", () => {
  it("follows the word when the text before it grows", () => {
    expect(relocateError("She have been here.", "have")).toBe(4);
    expect(relocateError("Actually she have been here.", "have")).toBe(13);
  });

  it("does not latch onto the word inside a longer one", () => {
    // "in" is inside "Including" at offset 0; the mark belongs on the real word.
    const sentence = "Including the risk, he was arrested in the protest.";
    expect(relocateError(sentence, "in")).toBe(sentence.indexOf(" in ") + 1);
  });

  it("anchors a phrase at its first word", () => {
    // A missing-word fix is marked on the word it attaches to: the student
    // clicks "Nor" and types "Nor was".
    expect(relocateError("Nor his engagement was rhetorical.", "Nor was")).toBe(
      null,
    );
    expect(relocateError("Nor was his engagement rhetorical.", "Nor was")).toBe(0);
  });

  it("returns null once the marked word is edited away", () => {
    expect(relocateError("She has been here.", "have")).toBe(null);
    expect(relocateError("She has been here.", "")).toBe(null);
  });
});

// A mistake may span several words. It is stored as error_offset + error, and
// the student's selection as pick + pick_end; the API compares both ends.
const S = "She will goes home, and stays.";
const w = (text: string) => ({ start: S.indexOf(text), end: S.indexOf(text) + text.length });

describe("toggleSpanWord", () => {
  it("selects one word from nothing, and clears it on a second click", () => {
    expect(toggleSpanWord(S, null, S.indexOf("will"))).toEqual(w("will"));
    expect(toggleSpanWord(S, w("will"), S.indexOf("will"))).toBeNull();
  });

  it("grows to the word after or before the selection", () => {
    expect(toggleSpanWord(S, w("will"), S.indexOf("goes"))).toEqual(w("will goes"));
    expect(toggleSpanWord(S, w("goes"), S.indexOf("will"))).toEqual(w("will goes"));
  });

  it("grows over punctuation inside a sentence", () => {
    expect(toggleSpanWord(S, w("home"), S.indexOf("and"))).toEqual(w("home, and"));
  });

  it("shrinks from either end, and collapses to a middle word", () => {
    const three = w("will goes home");
    expect(toggleSpanWord(S, three, S.indexOf("will"))).toEqual(w("goes home"));
    expect(toggleSpanWord(S, three, S.indexOf("home"))).toEqual(w("will goes"));
    expect(toggleSpanWord(S, three, S.indexOf("goes"))).toEqual(w("goes"));
  });

  it("moves to a word that does not touch the selection", () => {
    expect(toggleSpanWord(S, w("will goes"), S.indexOf("stays"))).toEqual(w("stays"));
  });

  it("does not grow across the end of a sentence", () => {
    const two = "He go. Then she";
    expect(toggleSpanWord(two, { start: 3, end: 5 }, two.indexOf("Then"))).toEqual({
      start: 7,
      end: 11,
    });
  });

  it("ignores a click that is not on a word start", () => {
    expect(toggleSpanWord(S, w("will"), S.indexOf("will") + 1)).toEqual(w("will"));
  });
});

describe("markSpan", () => {
  it("covers the stored text when the sentence still spells it", () => {
    expect(markSpan(S, S.indexOf("will"), "will goes")).toEqual(w("will goes"));
  });

  it("falls back to the word at the offset when the text no longer matches", () => {
    expect(markSpan(S, S.indexOf("will"), "will go")).toEqual(w("will"));
    expect(markSpan(S, S.indexOf("will"))).toEqual(w("will"));
  });

  it("is null with no offset or no word there", () => {
    expect(markSpan(S, undefined, "will")).toBeNull();
    expect(markSpan(S, 3, "will")).toBeNull();
  });
});

describe("answerSpan and spanAnswerFields", () => {
  it("round-trip a selection", () => {
    const fields = spanAnswerFields(w("will goes"));
    expect(fields).toEqual({ pick: "4", pick_end: "13" });
    expect(answerSpan(S, fields)).toEqual(w("will goes"));
    expect(spanText(S, w("will goes"))).toBe("will goes");
  });

  it("reads an answer with no pick_end as the one word picked", () => {
    expect(answerSpan(S, { pick: "4" })).toEqual(w("will"));
  });

  it("writes nothing for no selection", () => {
    expect(spanAnswerFields(null)).toEqual({});
    expect(answerSpan(S, {})).toBeNull();
  });
});

describe("pickMatchesMark", () => {
  it("needs both ends of the selection to match", () => {
    expect(pickMatchesMark({ pick: "4", pick_end: "13" }, 4, "will goes")).toBe(true);
    expect(pickMatchesMark({ pick: "4", pick_end: "8" }, 4, "will goes")).toBe(false);
    expect(pickMatchesMark({ pick: "9", pick_end: "13" }, 4, "will goes")).toBe(false);
  });

  it("grades an answer with no pick_end by its start, as the API does", () => {
    expect(pickMatchesMark({ pick: "4" }, 4, "will goes")).toBe(true);
  });

  it("is false with no key or no pick", () => {
    expect(pickMatchesMark({ pick: "4", pick_end: "13" }, undefined, "will goes")).toBe(false);
    expect(pickMatchesMark({}, 4, "will goes")).toBe(false);
  });
});
