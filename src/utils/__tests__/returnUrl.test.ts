import { describe, expect, it } from "vitest";

import { getDetailClosePath, readReturnUrl, withReturnUrl } from "../detailViewMode";

describe("withReturnUrl", () => {
  it("adds returnUrl to a bare path", () => {
    expect(withReturnUrl("/students/k1", "/students?page=2")).toBe("/students/k1?returnUrl=%2Fstudents%3Fpage%3D2");
  });

  it("keeps the path's own parameters and hash, and replaces an old returnUrl", () => {
    expect(withReturnUrl("/cases/k1?tab=notes&returnUrl=/old#top", "/cases")).toBe(
      "/cases/k1?tab=notes&returnUrl=%2Fcases#top",
    );
  });

  it("leaves the path alone without a returnUrl", () => {
    expect(withReturnUrl("/cases/k1", "")).toBe("/cases/k1");
    expect(withReturnUrl("/cases/k1", "  ")).toBe("/cases/k1");
    expect(withReturnUrl("/cases/k1", null)).toBe("/cases/k1");
  });
});

describe("readReturnUrl", () => {
  it("reads and trims the parameter", () => {
    expect(readReturnUrl("?returnUrl=%20%2Fusers%3Fq%3Da%20")).toBe("/users?q=a");
    expect(readReturnUrl("?returnUrl=")).toBeNull();
    expect(readReturnUrl("")).toBeNull();
  });
});

describe("getDetailClosePath", () => {
  it("returns to the returnUrl with its query and hash", () => {
    const search = `?${new URLSearchParams({ returnUrl: "/students?q=an#row" })}`;
    expect(getDetailClosePath(search, "/students")).toBe("/students?q=an#row");
  });

  it("falls back to the record's list", () => {
    expect(getDetailClosePath("?tab=notes", "/students")).toBe("/students");
  });

  it("round-trips a link built by withReturnUrl", () => {
    const link = withReturnUrl("/users/k1", "/users?page=3");
    expect(getDetailClosePath(link.slice(link.indexOf("?")), "/users")).toBe("/users?page=3");
  });
});
