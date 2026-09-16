import { describe, expect, it } from "vitest";
import {
  FIRST_PAGE,
  MAX_TRAIL_PAGES,
  moveToPage,
  readCursorTrail,
  writeCursorTrail,
  type Cursors,
} from "../cursorTrail";

const FILTER = '[["tests",{"q":"ielts"}],10]';

describe("readCursorTrail", () => {
  it("round-trips a trail written under the same filter", () => {
    const trail: Cursors = [null, "c1", "c2"];

    expect(readCursorTrail(writeCursorTrail(FILTER, trail), FILTER)).toEqual(trail);
  });

  it("starts over when the filter has changed", () => {
    // A cursor is only valid for the filters it was minted under — the API
    // refuses one replayed against a different set — so this has to reset
    // rather than send a cursor that will 400.
    const stored = writeCursorTrail(FILTER, [null, "c1", "c2"]);

    expect(readCursorTrail(stored, '[["tests",{"q":"toefl"}],10]')).toBe(FIRST_PAGE);
  });

  it("starts over on an empty, malformed or non-trail value", () => {
    expect(readCursorTrail("", FILTER)).toBe(FIRST_PAGE);
    expect(readCursorTrail("not json", FILTER)).toBe(FIRST_PAGE);
    expect(readCursorTrail("null", FILTER)).toBe(FIRST_PAGE);
    expect(readCursorTrail('"a string"', FILTER)).toBe(FIRST_PAGE);
    expect(readCursorTrail(JSON.stringify({ filter: FILTER }), FILTER)).toBe(FIRST_PAGE);
  });

  it("refuses a trail that does not begin at the first page", () => {
    // `cursors[0]` is the absence of a cursor. Anything else means the stored
    // value did not come from here, and page 0 would fetch from the middle.
    const stored = JSON.stringify({ filter: FILTER, cursors: ["c0", "c1"] });

    expect(readCursorTrail(stored, FILTER)).toBe(FIRST_PAGE);
  });

  it("refuses a trail whose tail is not all cursors", () => {
    const stored = JSON.stringify({ filter: FILTER, cursors: [null, "c1", 7] });

    expect(readCursorTrail(stored, FILTER)).toBe(FIRST_PAGE);
  });

  it("refuses a trail longer than the cap", () => {
    const tooLong = [null, ...Array.from({ length: MAX_TRAIL_PAGES }, (_, i) => `c${i}`)];

    expect(readCursorTrail(writeCursorTrail(FILTER, tooLong), FILTER)).toBe(FIRST_PAGE);
  });
});

describe("moveToPage", () => {
  const trail: Cursors = [null, "c1", "c2"]; // currently on page 2

  it("goes forward one page with the cursor the page returned", () => {
    expect(moveToPage(trail, 3, "c3")).toEqual([null, "c1", "c2", "c3"]);
  });

  it("does not move forward without a cursor", () => {
    // No cursor means no next page. Returning the same reference is what lets
    // the caller skip a pointless write.
    expect(moveToPage(trail, 3, null)).toBe(trail);
  });

  it("does not skip forward past the next page", () => {
    expect(moveToPage(trail, 5, "c3")).toBe(trail);
  });

  it("goes back to any page already walked", () => {
    expect(moveToPage(trail, 1, "c3")).toEqual([null, "c1"]);
  });

  it("goes back to the first page", () => {
    expect(moveToPage(trail, 0, "c3")).toBe(FIRST_PAGE);
    // A negative target is a clamp, not an error.
    expect(moveToPage(trail, -2, "c3")).toBe(FIRST_PAGE);
  });

  it("stays put when asked for the page it is on", () => {
    expect(moveToPage(trail, 2, "c3")).toBe(trail);
  });
});
