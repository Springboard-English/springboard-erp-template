import { describe, expect, it } from "vitest";
import {
  isRowSelected,
  pageSelectionState,
  togglePageSelection,
  toggleRowSelection,
} from "./rowSelection";

interface Row {
  id: string;
  ok?: boolean;
}

const key = (row: Row) => row.id;
const a = { id: "a" };
const b = { id: "b" };
const c = { id: "c" };

describe("toggleRowSelection", () => {
  it("adds a row that is not selected", () => {
    expect(toggleRowSelection([a], b, key)).toEqual([a, b]);
  });

  it("removes a row by key, not by identity", () => {
    expect(toggleRowSelection([a, b], { id: "a" }, key)).toEqual([b]);
  });

  it("reports membership by key", () => {
    expect(isRowSelected([a], { id: "a" }, key)).toBe(true);
    expect(isRowSelected([a], b, key)).toBe(false);
  });
});

describe("pageSelectionState", () => {
  it("is empty with nothing on the page selected", () => {
    expect(pageSelectionState([], [a, b], key).checked).toBe(false);
  });

  it("is indeterminate with part of the page selected", () => {
    expect(pageSelectionState([a], [a, b], key)).toEqual({
      checked: "indeterminate",
      selectableCount: 2,
      selectedCount: 1,
    });
  });

  it("is checked with the whole page selected, ignoring other pages", () => {
    expect(pageSelectionState([c, a, b], [a, b], key).checked).toBe(true);
  });

  it("counts only selectable rows", () => {
    const rows: Row[] = [{ id: "a", ok: true }, { id: "b", ok: false }];
    const state = pageSelectionState([rows[0]], rows, key, (row) => Boolean(row.ok));
    expect(state).toEqual({ checked: true, selectableCount: 1, selectedCount: 1 });
  });

  it("is unchecked on an empty page", () => {
    expect(pageSelectionState([a], [], key).checked).toBe(false);
  });
});

describe("togglePageSelection", () => {
  it("adds the missing rows of a partly selected page", () => {
    expect(togglePageSelection([c, a], [a, b], key)).toEqual([c, a, b]);
  });

  it("clears only the page when it is fully selected", () => {
    expect(togglePageSelection([c, a, b], [a, b], key)).toEqual([c]);
  });

  it("skips rows that cannot be selected", () => {
    const rows: Row[] = [{ id: "a", ok: true }, { id: "b", ok: false }];
    expect(togglePageSelection([], rows, key, (row) => Boolean(row.ok))).toEqual([rows[0]]);
  });
});
