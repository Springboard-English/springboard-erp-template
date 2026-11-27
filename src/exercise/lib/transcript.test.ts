import { describe, expect, it } from "vitest";

import { activeCueIndex, cueClock, transcriptContent } from "./transcript";

const cues = [
  { start_s: 0.5, end_s: 2, text: "Good morning." },
  { start_s: 2, end_s: 4, text: "Hi, Anna." },
  { start_s: 6, end_s: 8, text: "Shall we start?" },
];

describe("activeCueIndex", () => {
  it("is -1 before the first line", () => {
    expect(activeCueIndex(cues, 0.2)).toBe(-1);
  });
  it("lights the line being spoken, and the next from its start", () => {
    expect(activeCueIndex(cues, 1)).toBe(0);
    expect(activeCueIndex(cues, 2)).toBe(1);
  });
  it("keeps the last line lit through a pause and past the end", () => {
    expect(activeCueIndex(cues, 5)).toBe(1);
    expect(activeCueIndex(cues, 99)).toBe(2);
  });
  it("is -1 with no lines", () => {
    expect(activeCueIndex([], 3)).toBe(-1);
  });
});

describe("cueClock", () => {
  it("prints minutes and seconds, and hours past an hour", () => {
    expect(cueClock(0)).toBe("0:00");
    expect(cueClock(75.9)).toBe("1:15");
    expect(cueClock(3725)).toBe("1:02:05");
  });
});

describe("transcriptContent", () => {
  it("prefers timed lines, then text, then nothing", () => {
    expect(transcriptContent({ transcript: "x", transcript_cues: cues }).kind).toBe("timed");
    expect(transcriptContent({ transcript: " Hello ", transcript_cues: [] })).toEqual({ kind: "plain", text: "Hello" });
    expect(transcriptContent({ transcript: "  " }).kind).toBe("none");
    expect(transcriptContent({}).kind).toBe("none");
  });
});
