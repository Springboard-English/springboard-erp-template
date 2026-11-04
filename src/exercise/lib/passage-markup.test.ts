import { describe, expect, it } from "vitest";

import { insertText, parseMarkup, toggleMarkup } from "./passage-markup";

// The passage toolbar writes the markers so a teacher never has to type them;
// what it writes must be exactly what `parseMarkup` reads back.
describe("toggleMarkup", () => {
  it("wraps the selection and keeps it selected", () => {
    const edit = toggleMarkup("the big dog", 4, 7, "__");
    expect(edit).toEqual({ text: "the __big__ dog", selectionStart: 6, selectionEnd: 9 });
    expect(parseMarkup(edit.text)[1]).toEqual({ text: "big", underline: true });
  });

  it("unwraps a selection that is already marked", () => {
    expect(toggleMarkup("the **big** dog", 6, 9, "**")).toEqual({
      text: "the big dog",
      selectionStart: 4,
      selectionEnd: 7,
    });
  });

  it("drops an empty pair at the cursor with nothing selected", () => {
    expect(toggleMarkup("ab", 1, 1, "*")).toEqual({ text: "a**b", selectionStart: 2, selectionEnd: 2 });
  });
});

describe("insertText", () => {
  it("replaces the selection and puts the cursor after the insert", () => {
    expect(insertText("It was ___ late", 7, 10, "{gap}")).toEqual({
      text: "It was {gap} late",
      selectionStart: 12,
      selectionEnd: 12,
    });
  });
});

describe("parseMarkup", () => {
  it("gives plain text back as one unstyled span", () => {
    expect(parseMarkup("Just prose.")).toEqual([{ text: "Just prose." }]);
    expect(parseMarkup("")).toEqual([]);
  });

  it("reads the three marks", () => {
    expect(parseMarkup("a **b** c")).toEqual([
      { text: "a " },
      { text: "b", bold: true },
      { text: " c" },
    ]);
    expect(parseMarkup("a *b* c")).toEqual([
      { text: "a " },
      { text: "b", italic: true },
      { text: " c" },
    ]);
    // `__` is UNDERLINE here, not CommonMark's strong — the whole point.
    expect(parseMarkup("a __b__ c")).toEqual([
      { text: "a " },
      { text: "b", underline: true },
      { text: " c" },
    ]);
  });

  it("nests, so a bold run can carry an underlined word", () => {
    expect(parseMarkup("**a __b__**")).toEqual([
      { text: "a ", bold: true },
      { text: "b", bold: true, underline: true },
    ]);
  });

  it("leaves a ruled line alone", () => {
    // The one that matters: a gapped text prints its holes as a run of
    // underscores, and a mark that latched onto them would underline the words
    // between two blanks and eat half of each.
    const ruled = "Fill ______ in ______ please";
    expect(parseMarkup(ruled)).toEqual([{ text: ruled }]);
    expect(parseMarkup("___")).toEqual([{ text: "___" }]);
  });

  it("leaves a lone or unclosed marker as the character it is", () => {
    expect(parseMarkup("2 * 3 = 6")).toEqual([{ text: "2 * 3 = 6" }]);
    expect(parseMarkup("a *b")).toEqual([{ text: "a *b" }]);
    expect(parseMarkup("snake_case_name")).toEqual([{ text: "snake_case_name" }]);
  });

  it("will not open on a space, or run past the end of a line", () => {
    expect(parseMarkup("a * b * c")).toEqual([{ text: "a * b * c" }]);
    expect(parseMarkup("*a\nb*")).toEqual([{ text: "*a\nb*" }]);
  });

  it("keeps a gap token intact for the caller to print", () => {
    // PassageText replaces the token AFTER parsing; the parser must not touch
    // it, or the marker the cloze counts its blanks by would be gone.
    expect(parseMarkup("The __delay__ was {gap} long")).toEqual([
      { text: "The " },
      { text: "delay", underline: true },
      { text: " was {gap} long" },
    ]);
  });

  it("round-trips the text it was given, minus the delimiters", () => {
    const source = "A **bold** and an __underlined__ word, 3 * 4, and a ______.";
    expect(parseMarkup(source).map((span) => span.text).join("")).toBe(
      "A bold and an underlined word, 3 * 4, and a ______.",
    );
  });
});
