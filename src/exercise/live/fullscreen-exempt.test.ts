import { describe, expect, it } from "vitest";

import {
  FULLSCREEN_EXEMPT_INFO_KEY,
  isFullscreenExempt,
} from "./fullscreen-exempt";

describe("isFullscreenExempt", () => {
  it("reads the exemption out of info", () => {
    expect(isFullscreenExempt({ [FULLSCREEN_EXEMPT_INFO_KEY]: true })).toBe(true);
  });

  // A record with other apps' keys but not ours, and the two empty shapes the
  // API can return: all of them keep the lock.
  it.each([
    ["another app's info", { department: "Academic" }],
    ["an empty info", {}],
    ["a null info", null],
    ["a missing info", undefined],
  ])("is false for %s", (_label, info) => {
    expect(isFullscreenExempt(info)).toBe(false);
  });

  // Only a literal `true` lifts it — a value that merely looks truthy is a
  // malformed record, and the lock is the safe reading of one.
  it.each([
    ["false", false],
    ["the string 'true'", "true"],
    ["1", 1],
    ["a timestamp", "2026-09-14T09:00:00Z"],
  ])("is false for %s", (_label, value) => {
    expect(isFullscreenExempt({ [FULLSCREEN_EXEMPT_INFO_KEY]: value })).toBe(false);
  });
});
