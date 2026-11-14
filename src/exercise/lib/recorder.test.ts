import { describe, expect, it } from "vitest";

import { pickRecordingType, uploadType } from "./recorder";

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
