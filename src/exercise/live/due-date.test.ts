import { describe, expect, it } from "vitest";

import type { Translate } from "./i18n";
import {
  DUE_SOON_MS,
  formatDueDate,
  fromDateTimeLocal,
  isDuePast,
  isRoomDeadline,
  timeLeftLabel as timeLeftLabelIn,
  toDateTimeLocal,
} from "./due-date";

const t: Translate = (_k, f = "", v = {}) => f.replace(/\{(\w+)\}/g, (_, n) => String(v[n]));
const timeLeftLabel = (
  remainingMs: number | null,
  deadlineIso: string | null | undefined,
  closesAt: string | null | undefined,
  format: (ms: number) => string,
) => timeLeftLabelIn(remainingMs, deadlineIso, closesAt, format, t);

// The due date's pure half. Each of these is wrong SILENTLY when it is wrong —
// a date in the wrong zone, or a due date drawn as an exam countdown — which is
// why they are pinned here rather than left to the components.

const iso = (msFromNow: number) => new Date(Date.now() + msFromNow).toISOString();
const format = (ms: number) => `${Math.round(ms / 1000)}s`;

describe("isRoomDeadline", () => {
  it("is true when the attempt's deadline IS the room's close", () => {
    // The untimed-homework case: no allowance to cap, so the server hands the
    // student the bell as their deadline.
    const bell = iso(3 * 60 * 60 * 1000);
    expect(isRoomDeadline(bell, bell)).toBe(true);
  });

  it("is false when the student has their own allowance", () => {
    expect(isRoomDeadline(iso(40 * 60 * 1000), iso(3 * 24 * 3600 * 1000))).toBe(
      false,
    );
  });

  it("compares instants, not strings", () => {
    // Both come from the same server on the same request, but one has been
    // through a `datetime` and the other has not. Byte equality would fail on a
    // trailing zero and quietly turn every untimed homework back into an exam
    // countdown.
    expect(
      isRoomDeadline("2026-09-20T16:59:00Z", "2026-09-20T16:59:00.000+00:00"),
    ).toBe(true);
  });

  it("is false when either side is missing", () => {
    expect(isRoomDeadline(null, iso(1000))).toBe(false);
    expect(isRoomDeadline(iso(1000), null)).toBe(false);
  });
});

describe("timeLeftLabel", () => {
  it("shows a due date rather than a countdown on an untimed homework", () => {
    // Nobody works to a 71-hour countdown, and a runner showing one reads as an
    // exam timer that has gone wrong.
    const bell = iso(3 * 24 * 3600 * 1000);
    const label = timeLeftLabel(3 * 24 * 3600 * 1000, bell, bell, format);
    expect(label?.startsWith("Due ")).toBe(true);
  });

  it("becomes a countdown in the last hour, when that is the question", () => {
    const bell = iso(DUE_SOON_MS - 60_000);
    expect(timeLeftLabel(DUE_SOON_MS - 60_000, bell, bell, format)).toBe(
      `${Math.round((DUE_SOON_MS - 60_000) / 1000)}s`,
    );
  });

  it("counts down a per-attempt allowance however far off the bell is", () => {
    // Their own clock is the thing running out; the due date has nothing to say
    // about it.
    const mine = iso(40 * 60 * 1000);
    expect(timeLeftLabel(40 * 60 * 1000, mine, iso(7 * 24 * 3600 * 1000), format)).toBe(
      `${40 * 60}s`,
    );
  });

  it("shows nothing on an untimed run with no due date", () => {
    expect(timeLeftLabel(null, null, null, format)).toBeUndefined();
  });
});

describe("toDateTimeLocal / fromDateTimeLocal", () => {
  it("round-trips an instant through the input's local-time string", () => {
    // The input has no zone of its own. Converting through `toISOString` on the
    // way in would shift the box by the offset, so a teacher in Vietnam would
    // open their own 23:59 deadline and find 16:59 in it.
    const original = new Date(2026, 8, 20, 23, 59, 0, 0);
    const boxed = toDateTimeLocal(original.toISOString());
    expect(boxed).toBe("2026-09-20T23:59");
    expect(fromDateTimeLocal(boxed)).toBe(original.toISOString());
  });

  it("reads the box as LOCAL time, which is what the teacher typed", () => {
    const typed = "2026-09-20T23:59";
    expect(fromDateTimeLocal(typed)).toBe(
      new Date(2026, 8, 20, 23, 59).toISOString(),
    );
  });

  it("treats an empty or half-typed box as nothing to save", () => {
    expect(fromDateTimeLocal("")).toBeNull();
    expect(fromDateTimeLocal("   ")).toBeNull();
    // `new Date("2026-09-")` does NOT refuse: it is 1 September, read as UTC.
    // So a teacher mid-keystroke would have a real, wrong date ready to save,
    // seven hours off the one the finished string would have meant.
    expect(fromDateTimeLocal("2026-09-")).toBeNull();
    expect(fromDateTimeLocal("2026-09-20")).toBeNull();
    expect(fromDateTimeLocal("tomorrow")).toBeNull();
  });

  it("refuses a date that does not exist rather than rolling it over", () => {
    // `new Date(2026, 1, 31)` is 3 March, silently.
    expect(fromDateTimeLocal("2026-02-31T09:00")).toBeNull();
  });

  it("boxes nothing for a room with no due date", () => {
    expect(toDateTimeLocal(null)).toBe("");
    expect(toDateTimeLocal("not a date")).toBe("");
  });
});

describe("formatDueDate", () => {
  it("is null when there is no due date to show", () => {
    expect(formatDueDate(null)).toBeNull();
    expect(formatDueDate("nonsense")).toBeNull();
  });

  it("renders a real instant", () => {
    expect(formatDueDate(new Date(2026, 8, 20, 23, 59).toISOString())).toContain(
      "2026",
    );
  });
});

describe("isDuePast", () => {
  it("matches what the server refuses", () => {
    expect(isDuePast(iso(-1000))).toBe(true);
    expect(isDuePast(iso(1000))).toBe(false);
    expect(isDuePast(null)).toBe(false);
  });
});
