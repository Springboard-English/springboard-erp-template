import { describe, expect, it } from "vitest";

import { gapOntoWord, gapPieces, moveGap, piecesText, wordAtRunOffset } from "./gap-move";

describe("moveGap", () => {
  const text = "People used honey to {gap} their food. It was a {gap} trade.";
  const wordIndex = (word: string) => gapPieces(text).findIndex((piece) => piece.kind === "word" && piece.text === word);

  it("round-trips a passage unchanged", () => {
    expect(piecesText(gapPieces(text))).toBe(text);
  });

  it("moves a blank before a later word and keeps single spaces", () => {
    const result = moveGap(text, 0, wordIndex("food."));
    expect(result?.text).toBe("People used honey to their {gap} food. It was a {gap} trade.");
    expect(result?.order).toEqual([0, 1]);
  });

  it("reorders the blanks when one passes another", () => {
    const result = moveGap(text, 1, wordIndex("honey"));
    expect(result?.text).toBe("People used {gap} honey to {gap} their food. It was a trade.");
    expect(result?.order).toEqual([1, 0]);
  });

  it("does nothing when dropped where it already is", () => {
    expect(moveGap(text, 0, wordIndex("their"))).toBeNull();
  });

  it("keeps paragraph breaks", () => {
    const two = "One {gap} here.\n\nTwo there.";
    const target = gapPieces(two).findIndex((piece) => piece.kind === "word" && piece.text === "there.");
    expect(moveGap(two, 0, target)?.text).toBe("One here.\n\nTwo {gap} there.");
  });
});

describe("gapOntoWord", () => {
  it("moves a blank onto a word, prints its old answer back and keeps punctuation", () => {
    const text = "People used honey to {gap} their food.";
    const at = gapPieces(text).findIndex((piece) => piece.kind === "word" && piece.text === "food.");
    const result = gapOntoWord(text, 0, at, "sweeten");
    expect(result?.text).toBe("People used honey to sweeten their {gap}.");
    expect(result?.word).toBe("food");
    expect(result?.order).toEqual([0]);
  });
});

describe("wordAtRunOffset", () => {
  // Runs: "The cat " | " on the mat." ; pieces: The,_,cat,_,{gap},_,on,_,the,_,mat.
  const pieces = gapPieces("The cat {gap} on the mat.");
  const word = (at: number | null) => (at === null ? null : (pieces[at] as { text: string }).text);

  it("finds the word a caret sits in, or the nearest in its run", () => {
    expect(word(wordAtRunOffset(pieces, 0, 5, "on"))).toBe("cat");
    expect(word(wordAtRunOffset(pieces, 0, 3, "on"))).toBe("The");
    expect(word(wordAtRunOffset(pieces, 1, 0, "on"))).toBe("on");
    expect(word(wordAtRunOffset(pieces, 1, 9, "on"))).toBe("mat.");
  });

  it("drops before the word under the caret's first half, else the next", () => {
    expect(word(wordAtRunOffset(pieces, 0, 4, "before"))).toBe("cat");
    expect(word(wordAtRunOffset(pieces, 0, 6, "before"))).toBe("on");
    expect(word(wordAtRunOffset(pieces, 1, 4, "before"))).toBe("the");
    expect(wordAtRunOffset(pieces, 1, 12, "before")).toBeNull();
  });
});
