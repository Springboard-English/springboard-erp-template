import { describe, expect, it } from "vitest";

import { pickRecordingType, resolveRecordingTimes, secondsLeft, uploadType } from "./recorder";

describe("resolveRecordingTimes", () => {
  it("takes the runner's times over the question's longest take", () => {
    expect(resolveRecordingTimes({ prepareSeconds: 60, speakSeconds: 120 }, 30)).toEqual({ prepareSeconds: 60, speakSeconds: 120 });
  });

  it("falls back to the question's longest take, and reads 0 as none", () => {
    expect(resolveRecordingTimes(undefined, 45)).toEqual({ prepareSeconds: null, speakSeconds: 45 });
    expect(resolveRecordingTimes({ prepareSeconds: 0 }, undefined)).toEqual({ prepareSeconds: null, speakSeconds: null });
  });
});

describe("secondsLeft", () => {
  it("counts down from the start and stops at zero", () => {
    expect(secondsLeft(30, 1000, 11_000)).toBe(20);
    expect(secondsLeft(30, 1000, 40_000)).toBe(0);
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
