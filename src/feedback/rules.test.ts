import { describe, expect, test } from "vitest";

import { embeddedData, feedbackActionName, mayAsk, scoreBand } from "./rules";

describe("feedbackActionName", () => {
  test("only a production build fires the real action", () => {
    expect(feedbackActionName("leap", "run_submitted", true)).toBe("leap_run_submitted");
    expect(feedbackActionName("leap", "run_submitted", false)).toBe("dev_leap_run_submitted");
    expect(feedbackActionName("lms", "class_ended", true)).toBe("lms_class_ended");
  });
});

describe("scoreBand", () => {
  test.each([
    [0, 10, "low"],
    [4.9, 10, "low"],
    [5, 10, "mid"],
    [7.9, 10, "mid"],
    [8, 10, "high"],
    [10, 10, "high"],
  ] as const)("%s of %s is %s", (points, max, band) => {
    expect(scoreBand(points, max)).toBe(band);
  });

  test("no band without a usable total", () => {
    expect(scoreBand(3, 0)).toBeNull();
    expect(scoreBand(null, 10)).toBeNull();
    expect(scoreBand(3, undefined)).toBeNull();
  });
});

describe("embeddedData", () => {
  test("sends every listed key, clearing the unset ones", () => {
    expect(embeddedData({ role: "student", test_key: "t-1" }, ["role", "test_key", "run_key"])).toEqual({
      role: "student",
      test_key: "t-1",
      run_key: null,
    });
  });

  test("never sends a key that is not listed", () => {
    const data = embeddedData({ role: "teacher", name: "An" }, ["role"]);
    expect(data).toEqual({ role: "teacher" });
  });
});

describe("mayAsk", () => {
  test("guests are not asked unless the app opts in", () => {
    expect(mayAsk("student", false)).toBe(true);
    expect(mayAsk("guest", false)).toBe(false);
    expect(mayAsk("guest", true)).toBe(true);
  });
});
