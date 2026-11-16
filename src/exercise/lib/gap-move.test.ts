import { describe, expect, it } from "vitest";

import { gapOntoWord, gapPieces, moveGap, piecesText } from "./gap-move";

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
