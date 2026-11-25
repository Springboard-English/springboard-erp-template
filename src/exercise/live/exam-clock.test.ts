import { describe, expect, it } from "vitest";

import { clockTone, dueTimeWarning } from "./exam-clock";

describe("clockTone", () => {
  it("stays calm on an untimed paper and until the last five minutes", () => {
    expect(clockTone(null)).toBe("calm");
    expect(clockTone(5 * 60_000 + 1)).toBe("calm");
  });

  it("warns in the last five minutes and is critical in the last one", () => {
    expect(clockTone(5 * 60_000)).toBe("warning");
    expect(clockTone(60_001)).toBe("warning");
    expect(clockTone(60_000)).toBe("critical");
    expect(clockTone(0)).toBe("critical");
  });
});

describe("dueTimeWarning", () => {
  it("says nothing while more than ten minutes are left, or with no clock", () => {
    expect(dueTimeWarning(10 * 60_000 + 1, new Set())).toBeNull();
    expect(dueTimeWarning(null, new Set())).toBeNull();
  });

  it("announces each threshold once as it is crossed", () => {
    expect(dueTimeWarning(10 * 60_000, new Set())).toEqual({ minutes: 10, settles: [10] });
    expect(dueTimeWarning(9 * 60_000, new Set([10]))).toBeNull();
    expect(dueTimeWarning(5 * 60_000, new Set([10]))).toEqual({ minutes: 5, settles: [10, 5] });
  });

  it("announces only the nearest threshold to a student who arrives late", () => {
    // A reload with three minutes left must not say "10 minutes left".
    expect(dueTimeWarning(3 * 60_000, new Set())).toEqual({ minutes: 5, settles: [10, 5] });
  });

  it("is quiet once time is up, which the auto-submit announces itself", () => {
    expect(dueTimeWarning(0, new Set())).toBeNull();
  });
});
