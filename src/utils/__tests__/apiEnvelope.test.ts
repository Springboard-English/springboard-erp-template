import { describe, expect, it } from "vitest";

import {
  getArrayPayload,
  getNumericValue,
  getObjectPayload,
  getSingleObjectPayload,
  parseCursorPage,
  readInlineOption,
} from "../apiEnvelope";

describe("getArrayPayload", () => {
  it("reads the envelope's objects, a bare array, then a legacy key", () => {
    expect(getArrayPayload({ attributes: {}, objects: [1, 2] })).toEqual([1, 2]);
    expect(getArrayPayload([3])).toEqual([3]);
    expect(getArrayPayload({ sessions: [4] }, "sessions")).toEqual([4]);
  });

  it("prefers objects over the legacy key", () => {
    expect(getArrayPayload({ objects: [1], sessions: [2] }, "sessions")).toEqual([1]);
  });

  it("is empty for anything else", () => {
    expect(getArrayPayload(null)).toEqual([]);
    expect(getArrayPayload("rows")).toEqual([]);
    expect(getArrayPayload({ objects: "x" })).toEqual([]);
    expect(getArrayPayload({ sessions: [1] })).toEqual([]);
  });
});

describe("getObjectPayload", () => {
  it("returns an object as it is, without unwrapping a data field", () => {
    const body = { data: { id: 1 } };
    expect(getObjectPayload(body)).toBe(body);
  });

  it("is null for an array or a primitive", () => {
    expect(getObjectPayload([])).toBeNull();
    expect(getObjectPayload(null)).toBeNull();
    expect(getObjectPayload(3)).toBeNull();
  });
});

describe("getSingleObjectPayload", () => {
  it("reads objects[0], as /v2/users/me answers", () => {
    expect(getSingleObjectPayload({ attributes: {}, objects: [{ sub: "a" }] })).toEqual({ sub: "a" });
  });

  it("takes a bare record as the record", () => {
    expect(getSingleObjectPayload({ sub: "a" })).toEqual({ sub: "a" });
  });

  it("is null for an empty envelope rather than the envelope", () => {
    expect(getSingleObjectPayload({ attributes: {}, objects: [] })).toBeNull();
    expect(getSingleObjectPayload(null)).toBeNull();
  });
});

describe("getNumericValue", () => {
  it("reads numbers and numeric strings, and nothing else", () => {
    expect(getNumericValue(25)).toBe(25);
    expect(getNumericValue("25")).toBe(25);
    expect(getNumericValue("")).toBeNull();
    expect(getNumericValue("  ")).toBeNull();
    expect(getNumericValue(Number.NaN)).toBeNull();
    expect(getNumericValue(null)).toBeNull();
  });
});

describe("parseCursorPage", () => {
  it("reads rows and the cursor attributes", () => {
    expect(
      parseCursorPage({
        attributes: { page_size: "25", cursor: "c1", next_cursor: "c2" },
        objects: [{ id: 1 }],
      }),
    ).toEqual({ items: [{ id: 1 }], pageSize: 25, cursor: "c1", nextCursor: "c2" });
  });

  it("reads a total only when the endpoint sends one", () => {
    expect(parseCursorPage({ attributes: { total: 40 }, objects: [] }).total).toBe(40);
    expect(parseCursorPage({ attributes: {}, objects: [] })).not.toHaveProperty("total");
  });

  it("treats a bare array as one complete page", () => {
    expect(parseCursorPage([1, 2])).toEqual({ items: [1, 2], pageSize: 2, cursor: null, nextCursor: null });
  });

  it("falls back to a legacy key and to the row count for page_size", () => {
    expect(parseCursorPage({ groups: [1, 2, 3] }, "groups")).toEqual({
      items: [1, 2, 3],
      pageSize: 3,
      cursor: null,
      nextCursor: null,
    });
  });

  it("reads an empty next_cursor as the last page", () => {
    expect(parseCursorPage({ attributes: { next_cursor: "" }, objects: [] }).nextCursor).toBeNull();
  });
});

describe("readInlineOption", () => {
  it("keeps only rows with a string name and value", () => {
    expect(readInlineOption({ name: "CA27", value: "k1", extra: 1 })).toEqual({ name: "CA27", value: "k1" });
    expect(readInlineOption({ name: "CA27" })).toBeNull();
    expect(readInlineOption(null)).toBeNull();
  });
});
