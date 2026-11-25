import { describe, expect, it } from "vitest";

import {
  formatRemaining,
  isAttemptExpired,
  resolveRunnerDeadline,
} from "./use-session-timer";

// The pure half of the forced timer. Both functions decide when someone's exam
// ends, so they are pinned here rather than left to the component: getting
// either wrong cuts a paper short with nothing on screen to explain it.

const iso = (msFromNow: number) => new Date(Date.now() + msFromNow).toISOString();

describe("resolveRunnerDeadline", () => {
  it("uses the session's deadline on a class run", () => {
    const session = iso(60_000);
    // A class participant is granted no per-attempt deadline, so the join
    // response carries null and the live stream is the only source.
    expect(resolveRunnerDeadline(null, session)).toBe(session);
  });

  it("uses the taker's own deadline on a public link", () => {
    const mine = iso(60_000);
    // A public room never has a session deadline — the API leaves it null —
    // so without this the runner would count down to nothing at all.
    expect(resolveRunnerDeadline(mine, null)).toBe(mine);
  });

  it("prefers the taker's own deadline when both somehow exist", () => {
    const mine = iso(60_000);
    const session = iso(600_000);
    expect(resolveRunnerDeadline(mine, session)).toBe(mine);
  });

  it("is null for an untimed run", () => {
    expect(resolveRunnerDeadline(null, null)).toBeNull();
    // undefined is the real shape before the stream's first push, and
    // before an older API revision starts sending `deadline_at` at all.
    expect(resolveRunnerDeadline(undefined, undefined)).toBeNull();
  });
});

describe("isAttemptExpired", () => {
  it("is false while there is time left", () => {
    expect(isAttemptExpired(iso(60_000))).toBe(false);
  });

  it("is true once the deadline has passed", () => {
    expect(isAttemptExpired(iso(-1_000))).toBe(true);
  });

  it("is false for an untimed attempt", () => {
    expect(isAttemptExpired(null)).toBe(false);
    expect(isAttemptExpired(undefined)).toBe(false);
  });

  it("waits for the server clock before declaring anyone expired", () => {
    // The whole point of `ready`: a device whose clock runs fast must not throw
    // its own student out before the offset probe has landed.
    expect(isAttemptExpired(iso(-1_000), 0, false)).toBe(false);
  });

  it("reads the deadline against server time, not the device's", () => {
    // Device clock is 10 minutes SLOW, so a deadline 1 minute ago looks like it
    // is 9 minutes in the future locally. The offset has to correct for it.
    expect(isAttemptExpired(iso(-60_000), 600_000)).toBe(true);
    // ...and the reverse: a device 10 minutes FAST must not expire someone who
    // still has 5 minutes of exam left.
    expect(isAttemptExpired(iso(300_000), -600_000)).toBe(false);
  });

  it("ignores an unparseable deadline rather than expiring on it", () => {
    expect(isAttemptExpired("not a date")).toBe(false);
  });
});

describe("formatRemaining", () => {
  it("drops the hour until there is one", () => {
    expect(formatRemaining(65_000)).toBe("1:05");
    expect(formatRemaining(3_605_000)).toBe("1:00:05");
  });

  it("floors at zero rather than showing a negative countdown", () => {
    expect(formatRemaining(-5_000)).toBe("0:00");
  });
});
