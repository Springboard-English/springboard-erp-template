import { describe, expect, it } from "vitest";
import { currentOccasion } from "../occasion";

describe("currentOccasion", () => {
  it("turns over at midnight in Vietnam, not UTC", () => {
    // 20/10 00:30 ICT is still 19/10 in UTC.
    expect(currentOccasion(new Date("2026-10-19T17:30:00Z"))).toBe("womens-day");
    expect(currentOccasion(new Date("2026-10-19T16:30:00Z"))).toBeNull();
    // 21/10 00:30 ICT is still 20/10 in UTC.
    expect(currentOccasion(new Date("2026-10-20T17:30:00Z"))).toBeNull();
  });

  it("finds Teachers' Day", () => {
    expect(currentOccasion(new Date("2026-11-20T05:00:00Z"))).toBe("teachers-day");
  });

  it("previews a known occasion and ignores anything else", () => {
    const ordinary = new Date("2026-10-19T05:00:00Z");
    expect(currentOccasion(ordinary, "?sb-occasion=teachers-day")).toBe("teachers-day");
    expect(currentOccasion(ordinary, "?sb-occasion=halloween")).toBeNull();
  });
});
