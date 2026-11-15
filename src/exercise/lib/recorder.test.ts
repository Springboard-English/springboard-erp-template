import { describe, expect, it } from "vitest";

import { pickRecordingType, secondsUntil, takeEndsAt, uploadType, windowStage, type RecordingWindow } from "./recorder";

const at = (iso: string) => Date.parse(iso);
const window: RecordingWindow = {
  openedAt: "2026-11-15T05:00:00Z",
  prepEndsAt: "2026-11-15T05:01:00Z",
  deadlineAt: "2026-11-15T05:03:00Z",
  autoStart: true,
};

describe("windowStage", () => {
  it("prepares until prep ends, is open until the deadline, then over", () => {
    expect(windowStage(window, at("2026-11-15T05:00:30Z"))).toBe("preparing");
    expect(windowStage(window, at("2026-11-15T05:01:00Z"))).toBe("open");
    expect(windowStage(window, at("2026-11-15T05:03:00Z"))).toBe("over");
  });

  it("never blocks on a missing time", () => {
    expect(windowStage({ ...window, prepEndsAt: null, deadlineAt: null }, at("2026-11-15T05:00:30Z"))).toBe("open");
  });
});

describe("takeEndsAt", () => {
  it("stops at the longest take or the deadline, whichever is first", () => {
    const start = at("2026-11-15T05:02:00Z");
    expect(takeEndsAt(start, 30, window.deadlineAt)).toBe(start + 30_000);
    expect(takeEndsAt(start, 120, window.deadlineAt)).toBe(at("2026-11-15T05:03:00Z"));
    expect(takeEndsAt(start, null, null)).toBeNull();
  });
});

describe("secondsUntil", () => {
  it("counts down and stops at zero", () => {
    expect(secondsUntil(11_000, 1_000)).toBe(10);
    expect(secondsUntil(1_000, 5_000)).toBe(0);
  });
});

describe("pickRecordingType", () => {
  it("takes the first container the browser records", () => {
    expect(pickRecordingType((type) => type === "audio/mp4")).toBe("audio/mp4");
    expect(pickRecordingType(() => true)).toBe("audio/webm;codecs=opus");
  });

  it("leaves the choice to the browser when it names none", () => {
    expect(pickRecordingType(() => false)).toBe("");
  });
});

describe("uploadType", () => {
  it("drops codec parameters", () => {
    expect(uploadType("audio/webm;codecs=opus")).toBe("audio/webm");
    expect(uploadType("audio/mp4")).toBe("audio/mp4");
  });

  it("falls back to WebM for an empty or non-audio type", () => {
    expect(uploadType("")).toBe("audio/webm");
    expect(uploadType("video/webm")).toBe("audio/webm");
  });
});
