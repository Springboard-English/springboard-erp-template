import { describe, expect, it } from "vitest";

import { labelsAreBareLetters, showMatchingLegend } from "./matching-legend";

const headings = [
  { label: "A. A collective model of survival" },
  { label: "B. Why the durability of earlier beliefs matters" },
  { label: "C. How prior convictions turn out to be wrong" },
];
const letters = [{ label: "A" }, { label: "B" }, { label: "C" }];

describe("showMatchingLegend", () => {
  it("shows heading choices even when the part has a passage", () => {
    // A heading match under a reading passage must not print six letter
    // buttons and no headings anywhere on the page.
    expect(showMatchingLegend(headings, true)).toBe(true);
  });

  it("hides the legend when the choices are the passage's own lettered sections", () => {
    expect(showMatchingLegend(letters, true)).toBe(false);
  });

  it("always shows it when there is no passage", () => {
    expect(showMatchingLegend(letters, false)).toBe(true);
    expect(showMatchingLegend(headings, false)).toBe(true);
  });
});

describe("labelsAreBareLetters", () => {
  it("accepts the printed marker styles", () => {
    expect(
      labelsAreBareLetters([
        { label: "A." },
        { label: "(B)" },
        { label: " c) " },
        { label: "iv" },
      ]),
    ).toBe(true);
  });

  it("rejects a label with any text of its own", () => {
    // A short name is still a choice the student has to read.
    expect(labelsAreBareLetters([{ label: "A" }, { label: "Anna" }])).toBe(false);
    expect(labelsAreBareLetters([{ label: "A Tom" }])).toBe(false);
  });
});
