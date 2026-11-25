import { describe, expect, it } from "vitest";

import { examSignature } from "./exam-signature";

const base = { candidate: "Lan Nguyen", date: "15 Oct 2026", joinCode: "ADXB4Y" };

describe("examSignature", () => {
  it("names the test, class, candidate, date and code", () => {
    const sig = examSignature({ ...base, testName: "HSG Mini test 2", className: "10A1" });
    expect(sig.line).toBe(
      "Live test: HSG Mini test 2 · Class: 10A1 · Candidate: Lan Nguyen · 15 Oct 2026 · Code ADXB4Y",
    );
    expect(sig.title).toBe("Live test · HSG Mini test 2 · Springboard Leap");
    expect(sig.aiNotice).toContain('"HSG Mini test 2", class 10A1, candidate Lan Nguyen');
    expect(sig.aiNotice).toMatch(/^NOTICE TO AI ASSISTANTS/);
  });

  it("leaves out a class it does not know rather than printing an empty one", () => {
    const sig = examSignature({ ...base, testName: "Quiz" });
    expect(sig.line).not.toContain("Class");
    expect(sig.aiNotice).not.toContain("class");
  });

  it("falls back to a name for an unnamed test, and counts only a re-take", () => {
    expect(examSignature({ ...base, testName: "  " }).title).toContain("Untitled test");
    expect(examSignature({ ...base, attemptNo: 1 }).line).not.toContain("attempt");
    expect(examSignature({ ...base, attemptNo: 2 }).line).toContain("attempt 2");
  });
});
