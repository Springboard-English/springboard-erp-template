import { describe, expect, it } from "vitest";
import { formatPhoneNumber, isValidPhoneNumber, toE164Phone } from "../phone";

const E164 = "+84912345678";

describe("phone", () => {
  it.each(["0912345678", "0912 345 678", "0912-345-678", "+84 912 345 678", E164])(
    "reads %s as the API stores it",
    (typed) => {
      expect(isValidPhoneNumber(typed)).toBe(true);
      expect(toE164Phone(typed)).toBe(E164);
    },
  );

  it.each(["", "   ", "0985123456/0385761513", "0912345678 (so Zalo)", "12345", "A"])(
    "refuses %j",
    (bad) => {
      expect(isValidPhoneNumber(bad)).toBe(false);
      expect(toE164Phone(bad)).toBeNull();
    },
  );

  it("shows a stored Vietnamese number in the national form", () => {
    expect(formatPhoneNumber(E164)).toBe("0912 345 678");
  });

  it("shows a foreign number internationally, and a legacy value as it is", () => {
    expect(formatPhoneNumber("+12025550123")).toBe("+1 202 555 0123");
    expect(formatPhoneNumber("0985/0385")).toBe("0985/0385");
    expect(formatPhoneNumber(null)).toBe("");
  });
});
