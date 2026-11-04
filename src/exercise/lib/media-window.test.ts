import { describe, expect, it } from "vitest";

import {
  clampSeek,
  clockSample,
  firstPlayCorrection,
  keepClockSample,
  formatClock,
  mergeRoomWindows,
  msUntilClose,
  needsResync,
  offsetFromServerNow,
  pickResourceEntry,
  playOffsetSeconds,
  resourceMidpointMs,
  stoppedLine as stoppedLineIn,
  stoppedOffsetSeconds,
  windowCloseMs,
  windowState,
} from "./media-window";
import type { Translate } from "../i18n";

const t: Translate = (_k, f = "", v = {}) => f.replace(/\{(\w+)\}/g, (_, n) => String(v[n]));
const stoppedLine = (stoppedS: number | null, lengthS: number) => stoppedLineIn(stoppedS, lengthS, t);

const START = "2026-10-13T10:00:00.000Z";
const END = "2026-10-13T10:02:33.000Z"; // a 150s clip + 3s
const at = (iso: string) => Date.parse(iso);

describe("windowState", () => {
  const window = { startedAt: START, endsAt: END, stoppedAt: null };

  it("waits while there is no window", () => {
    expect(windowState(null, at(START))).toBe("waiting");
    expect(windowState(undefined, at(START))).toBe("waiting");
  });

  it("plays from the start until the scheduled end", () => {
    expect(windowState(window, at("2026-10-13T09:59:59.000Z"))).toBe("waiting");
    expect(windowState(window, at(START))).toBe("playing");
    expect(windowState(window, at("2026-10-13T10:02:32.999Z"))).toBe("playing");
    expect(windowState(window, at(END))).toBe("ended");
  });

  it("ends at a stop, which beats the scheduled end", () => {
    const stopped = { ...window, stoppedAt: "2026-10-13T10:00:42.000Z" };
    expect(windowState(stopped, at("2026-10-13T10:00:41.000Z"))).toBe("playing");
    expect(windowState(stopped, at("2026-10-13T10:00:42.000Z"))).toBe("ended");
    expect(windowCloseMs(stopped)).toBe(at("2026-10-13T10:00:42.000Z"));
  });

  it("reads a garbled window as nothing to play", () => {
    expect(windowState({ startedAt: "x", endsAt: END, stoppedAt: null }, at(START))).toBe("waiting");
  });

  it("counts down to the close and stops at zero", () => {
    expect(msUntilClose(window, at(START))).toBe(153_000);
    expect(msUntilClose(window, at(END) + 5_000)).toBe(0);
  });
});

describe("playOffsetSeconds", () => {
  it("is how far the room is into the clip, never negative", () => {
    expect(playOffsetSeconds(at(START) + 42_500, START)).toBe(42.5);
    expect(playOffsetSeconds(at(START) - 3_000, START)).toBe(0);
    expect(playOffsetSeconds(at(START), "nonsense")).toBe(0);
  });
});

describe("needsResync", () => {
  it("leaves a small drift alone and corrects a large one", () => {
    expect(needsResync(10, 11.5)).toBe(false);
    expect(needsResync(10, 12.5)).toBe(true);
    expect(needsResync(30, 10)).toBe(true);
    expect(needsResync(10, 10.8, 0.5)).toBe(true);
  });
});

describe("firstPlayCorrection", () => {
  it("moves a cold player that started behind the room", () => {
    // Seeked to 20.0 at metadata, buffered 1.8s, first frame at 20.0 while the room is at 21.8.
    expect(firstPlayCorrection(20, 21.8, 60)).toBe(21.8);
  });

  it("leaves a player within the small threshold alone", () => {
    expect(firstPlayCorrection(20, 20.25, 60)).toBeNull();
    expect(firstPlayCorrection(20.2, 20, 60)).toBeNull();
  });

  it("holds the target inside the clip", () => {
    expect(firstPlayCorrection(10, 75, 60)).toBe(60);
    expect(firstPlayCorrection(59.9, 75, 60)).toBeNull();
  });

  it("takes a custom tolerance", () => {
    expect(firstPlayCorrection(20, 20.25, 60, 0.1)).toBe(20.25);
  });
});

describe("stoppedOffsetSeconds", () => {
  const clipEnd = "2026-10-13T10:00:23.000Z"; // a 20s clip + 3s grace
  const base = { startedAt: START, endsAt: clipEnd, stoppedAt: null };

  it("is where a Stop before the end cut the clip off", () => {
    const stopped = { ...base, stoppedAt: "2026-10-13T10:00:08.400Z" };
    expect(stoppedOffsetSeconds(stopped, 20)).toBe(8.4);
    expect(stoppedLine(stoppedOffsetSeconds(stopped, 20), 20)).toBe("Stopped · 0:08 / 0:20");
  });

  it("is null for a natural end, with no stop at all", () => {
    expect(stoppedOffsetSeconds(base, 20)).toBeNull();
    expect(stoppedOffsetSeconds(null, 20)).toBeNull();
    expect(stoppedLine(null, 20)).toBeNull();
  });

  it("is null for a stop pressed after the clip had already run out", () => {
    expect(stoppedOffsetSeconds({ ...base, stoppedAt: "2026-10-13T10:00:21.000Z" }, 20)).toBeNull();
    expect(stoppedOffsetSeconds({ ...base, stoppedAt: clipEnd }, null)).toBeNull();
  });

  it("clamps a stop stamped before the start to zero", () => {
    expect(stoppedOffsetSeconds({ ...base, stoppedAt: "2026-10-13T09:59:59.000Z" }, 20)).toBe(0);
  });

  it("falls back to the scheduled end when the length is unknown", () => {
    expect(stoppedOffsetSeconds({ ...base, stoppedAt: "2026-10-13T10:00:05.000Z" }, null)).toBe(5);
  });
});

describe("clampSeek", () => {
  it("holds a target inside the clip", () => {
    expect(clampSeek(-4, 150)).toBe(0);
    expect(clampSeek(80, 150)).toBe(80);
    expect(clampSeek(152, 150)).toBe(150);
    expect(clampSeek(Number.NaN, 150)).toBe(0);
    expect(clampSeek(200, null)).toBe(200);
  });
});

describe("formatClock", () => {
  it("prints m:ss with whole seconds", () => {
    expect(formatClock(0)).toBe("0:00");
    expect(formatClock(42.9)).toBe("0:42");
    expect(formatClock(150)).toBe("2:30");
    expect(formatClock(3_725)).toBe("62:05");
    expect(formatClock(-1)).toBe("0:00");
    expect(formatClock(Number.NaN)).toBe("0:00");
    expect(formatClock(null)).toBe("0:00");
  });
});

describe("mergeRoomWindows", () => {
  const a = { startedAt: START, endsAt: END, stoppedAt: null };
  const aStopped = { ...a, stoppedAt: "2026-10-13T10:01:00.000Z" };
  const aReplay = {
    startedAt: "2026-10-13T10:05:00.000Z",
    endsAt: "2026-10-13T10:07:33.000Z",
    stoppedAt: null,
  };
  const b = {
    startedAt: "2026-10-13T10:03:00.000Z",
    endsAt: "2026-10-13T10:04:00.000Z",
    stoppedAt: null,
  };

  it("keeps every recording's window, so playing B leaves A ended, not waiting", () => {
    const merged = mergeRoomWindows({ a: aStopped }, { b });
    expect(Object.keys(merged).sort()).toEqual(["a", "b"]);
    expect(windowState(merged.a, at("2026-10-13T10:03:30.000Z"))).toBe("ended");
    expect(windowState(merged.b, at("2026-10-13T10:03:30.000Z"))).toBe("playing");
  });

  it("takes the overlay's stop on the same start", () => {
    expect(mergeRoomWindows({ a }, { a: aStopped }).a).toEqual(aStopped);
  });

  it("lets a replay win, and never lets a stale window undo one", () => {
    expect(mergeRoomWindows({ a }, { a: aReplay }).a).toEqual(aReplay);
    expect(mergeRoomWindows({ a: aReplay }, { a: aStopped }).a).toEqual(aReplay);
  });

  it("treats no overlay as no change", () => {
    const base = { a };
    expect(mergeRoomWindows(base, undefined)).toBe(base);
    expect(mergeRoomWindows(base, null)).toBe(base);
  });
});

describe("offsetFromServerNow", () => {
  const instant = (deviceMs: number) => ({ sentAtMs: deviceMs, receivedAtMs: deviceMs });

  it("prefers a fresh server timestamp, else keeps the known offset", () => {
    expect(offsetFromServerNow(START, instant(at(START) - 2_000), 0)).toBe(2_000);
    expect(offsetFromServerNow(undefined, instant(at(START)), 750)).toBe(750);
    expect(offsetFromServerNow("bad", instant(at(START)), 750)).toBe(750);
  });

  it("adds half the round trip, since the server stamped it mid-request", () => {
    // Device clock 2s behind; sent 400ms before the stamp, arrived 400ms after.
    const device = at(START) - 2_000;
    const timing = { sentAtMs: device - 400, receivedAtMs: device + 400 };
    expect(offsetFromServerNow(START, timing, 0)).toBe(2_000);
  });

  it("puts the player on the room's second however slow the request was", () => {
    const sentAtMs = 1_000_000;
    for (const tripMs of [50, 900, 3_500]) {
      const receivedAtMs = sentAtMs + tripMs;
      // The server's clock at the midpoint equals the device's: offset 0.
      const serverNow = new Date(sentAtMs + tripMs / 2).toISOString();
      expect(offsetFromServerNow(serverNow, { sentAtMs, receivedAtMs }, 99)).toBeCloseTo(0);
    }
  });

  it("never lets a clock that ran backwards shorten the estimate", () => {
    const timing = { sentAtMs: at(START) + 10, receivedAtMs: at(START) };
    expect(offsetFromServerNow(START, timing, 0)).toBe(0);
  });

  describe("with the request's Resource Timing entry", () => {
    // Page opened at device time ORIGIN; marks are ms since then.
    const ORIGIN = at(START) - 60_000;
    const resource = (requestStart: number, responseStart: number) => ({
      timeOriginMs: ORIGIN,
      requestStart,
      responseStart,
    });

    it("places server_now halfway from requestStart to responseStart", () => {
      // Device 2s behind. The request left at +57.8s and its first byte came
      // back at +58.2s, so the stamp START is at device +58.0s = START - 2s.
      const timing = { sentAtMs: 0, receivedAtMs: 0, resource: resource(57_800, 58_200) };
      expect(offsetFromServerNow(START, timing, 99)).toBe(2_000);
    });

    it("ignores the preflight and the wait for the main thread", () => {
      // The bracket opened 600ms before the request (a preflight) and closed
      // 300ms after the first byte (a busy main thread); the bracket alone
      // would read 150ms ahead. The entry is exact.
      const sentAtMs = ORIGIN + 59_200;
      const receivedAtMs = ORIGIN + 60_500;
      const serverNow = new Date(ORIGIN + 60_000).toISOString();
      const exact = { sentAtMs, receivedAtMs, resource: resource(59_800, 60_200) };
      expect(offsetFromServerNow(serverNow, exact, 99)).toBe(0);
      expect(offsetFromServerNow(serverNow, { sentAtMs, receivedAtMs }, 99)).toBe(150);
    });

    it("falls back to the bracket when the entry is missing or zeroed", () => {
      const device = at(START) - 2_000;
      const bracket = { sentAtMs: device - 400, receivedAtMs: device + 400 };
      for (const entry of [null, undefined, resource(0, 0), resource(0, 60_200), resource(60_200, 59_800)]) {
        expect(offsetFromServerNow(START, { ...bracket, resource: entry }, 99)).toBe(2_000);
      }
    });

    it("still keeps the known offset without a timestamp", () => {
      expect(offsetFromServerNow(null, { sentAtMs: 0, receivedAtMs: 0, resource: resource(1, 2) }, 750)).toBe(750);
    });
  });
});

describe("clockSample", () => {
  it("carries the request's own flight when its marks are real", () => {
    const resource = { timeOriginMs: 1_000, requestStart: 100, responseStart: 500 };
    // Midpoint at device 1_300; the server read 1_350 there.
    const serverNow = new Date(1_350).toISOString();
    expect(clockSample(serverNow, { sentAtMs: 0, receivedAtMs: 9_999, resource })).toEqual({ offsetMs: 50, flightMs: 400 });
  });

  it("falls back to the bracket, flight and all", () => {
    const serverNow = new Date(10_500).toISOString();
    expect(clockSample(serverNow, { sentAtMs: 10_000, receivedAtMs: 11_000 })).toEqual({ offsetMs: 0, flightMs: 1_000 });
  });

  it("is null without a timestamp", () => {
    expect(clockSample(null, { sentAtMs: 0, receivedAtMs: 0 })).toBeNull();
  });
});

describe("keepClockSample", () => {
  const sample = (offsetMs: number, flightMs: number) => ({ offsetMs, flightMs });

  it("takes the first reading", () => {
    expect(keepClockSample(null, sample(25, 190))).toEqual(sample(25, 190));
  });

  it("keeps the quicker reading over a slow, lopsided one", () => {
    // Seen on dev: a 794 ms request read the clock 310 ms off; a 155 ms one read 25.
    const kept = sample(25, 155);
    expect(keepClockSample(kept, sample(310, 794))).toBe(kept);
  });

  it("moves to a quicker reading", () => {
    expect(keepClockSample(sample(60, 329), sample(25, 155))).toEqual(sample(25, 155));
  });

  it("drops the kept reading when the device clock has moved", () => {
    // Two seconds apart, beyond anything either flight could explain.
    expect(keepClockSample(sample(25, 155), sample(2_025, 400))).toEqual(sample(2_025, 400));
  });
});

describe("resourceMidpointMs", () => {
  it("is device time halfway between the marks", () => {
    expect(resourceMidpointMs({ timeOriginMs: 1_000, requestStart: 100, responseStart: 300 })).toBe(1_200);
  });

  it("accepts a first byte in the same millisecond", () => {
    expect(resourceMidpointMs({ timeOriginMs: 1_000, requestStart: 100, responseStart: 100 })).toBe(1_100);
  });

  it("refuses zeroed, reversed or unusable marks", () => {
    expect(resourceMidpointMs(null)).toBeNull();
    expect(resourceMidpointMs({ timeOriginMs: 1_000, requestStart: 0, responseStart: 0 })).toBeNull();
    expect(resourceMidpointMs({ timeOriginMs: 1_000, requestStart: 300, responseStart: 100 })).toBeNull();
    expect(resourceMidpointMs({ timeOriginMs: Number.NaN, requestStart: 100, responseStart: 300 })).toBeNull();
  });
});

describe("pickResourceEntry", () => {
  const entry = (startTime: number) => ({ startTime });

  it("takes the last entry made at or after the send", () => {
    const entries = [entry(10), entry(500), entry(520)];
    expect(pickResourceEntry(entries, 500)).toBe(entries[2]);
  });

  it("never takes an earlier call to the same URL", () => {
    expect(pickResourceEntry([entry(10), entry(20)], 500)).toBeNull();
    expect(pickResourceEntry([], 0)).toBeNull();
  });
});
