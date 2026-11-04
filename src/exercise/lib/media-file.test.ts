import { describe, expect, it } from "vitest";

import type { Translate } from "../i18n";
import {
  audioContentTypeFor,
  formatBytes,
  MAX_MEDIA_BYTES,
  mediaFileError as mediaFileErrorIn,
} from "./media-file";

const t: Translate = (_k, f = "", v = {}) => f.replace(/\{(\w+)\}/g, (_, n) => String(v[n]));
const mediaFileError = (name: string, reported: string, sizeBytes: number) =>
  mediaFileErrorIn(name, reported, sizeBytes, t);

describe("audioContentTypeFor", () => {
  it("takes the reported type when it is one the API lists", () => {
    expect(audioContentTypeFor("a.mp3", "audio/mpeg")).toBe("audio/mpeg");
    expect(audioContentTypeFor("a.wav", "audio/x-wav")).toBe("audio/x-wav");
  });

  it("maps browser spellings and falls back to the extension", () => {
    expect(audioContentTypeFor("a.mp3", "audio/mp3")).toBe("audio/mpeg");
    expect(audioContentTypeFor("Lecture.M4A", "")).toBe("audio/x-m4a");
    expect(audioContentTypeFor("clip.ogg", "application/octet-stream")).toBe("audio/ogg");
    expect(audioContentTypeFor("notes.pdf", "application/pdf")).toBeNull();
  });
});

describe("mediaFileError", () => {
  it("refuses what isn't audio, what is too big, and what is empty", () => {
    expect(mediaFileError("a.mp3", "audio/mpeg", 1_000)).toBeNull();
    expect(mediaFileError("a.pdf", "application/pdf", 1_000)).toMatch(/audio file/);
    expect(mediaFileError("a.mp3", "audio/mpeg", MAX_MEDIA_BYTES + 1)).toMatch(/limit is 60\.0 MB/);
    expect(mediaFileError("a.mp3", "audio/mpeg", 0)).toBe("That file is empty.");
  });
});

describe("formatBytes", () => {
  it("prints a size a teacher reads at a glance", () => {
    expect(formatBytes(4_404_019)).toBe("4.2 MB");
    expect(formatBytes(839_680)).toBe("820 KB");
    expect(formatBytes(null)).toBe("");
  });
});
