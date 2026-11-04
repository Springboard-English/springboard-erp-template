import { describe, expect, it } from "vitest";

import type { CollectionStub } from "../types";
import type { Translate } from "../i18n";
import {
  coveringRecordings,
  deckRecording,
  deckRecordings as deckRecordingsIn,
  innermostRecording,
  latestWindowId,
  paperRecordingSource,
  sessionRecordingSource,
  type DeckRecording,
  type RecordingSource,
} from "./recording-deck";

const t: Translate = (_k, f = "", v = {}) => f.replace(/\{(\w+)\}/g, (_, n) => String(v[n]));
const deckRecordings = (
  sources: readonly RecordingSource[],
  nodeIds: readonly string[],
  stubOf: Parameters<typeof deckRecordingsIn>[2],
) => deckRecordingsIn(sources, nodeIds, stubOf, t);

const win =(startedAt: string) => ({ startedAt, endsAt: "2026-10-13T11:00:00.000Z", stoppedAt: null });
const EARLY = "2026-10-13T10:00:00.000Z";
const LATE = "2026-10-13T10:05:00.000Z";

function stub(
  key: string,
  kind: "part" | "section",
  title: string | null,
  parent: CollectionStub | null = null,
): CollectionStub {
  return { appsheet_key: key, kind, title, instruction: null, passage_title: null, passage: null, info: null, parent };
}

// A paper: q1 loose; Part 2 holds section A (q2, q3) and its own q4.
const part = stub("part-2", "part", "Part 2");
const sectionA = stub("sec-a", "section", "Questions 2–3", part);
const PAPER = ["q1", "q2", "q3", "q4"];
const STUBS: Record<string, CollectionStub | null> = { q1: null, q2: sectionA, q3: sectionA, q4: part };
const stubOf = (id: string) => STUBS[id];

function source(over: Partial<RecordingSource>): RecordingSource {
  return {
    key: "r",
    title: "Recording",
    durationS: 20,
    sourceKey: "recordings/r.wav",
    ownerKind: "test",
    ownerKey: null,
    covers: PAPER,
    ...over,
  };
}

describe("deckRecordings", () => {
  it("labels each recording by what it plays over", () => {
    const list = deckRecordings(
      [
        source({ key: "whole", ownerKind: "test" }),
        source({ key: "part", ownerKind: "collection", ownerKey: "part-2", covers: ["q2", "q3", "q4"] }),
        source({ key: "sec", ownerKind: "collection", ownerKey: "sec-a", covers: ["q2", "q3"] }),
        source({ key: "q3", ownerKind: "exercise", ownerKey: "ex-3", covers: ["q3"] }),
      ],
      PAPER,
      stubOf,
    );
    expect(list.map((r) => [r.id, r.label])).toEqual([
      ["whole", "Whole test"],
      ["part", "Part 2"],
      ["sec", "Questions 2–3"],
      ["q3", "Q3"],
    ]);
  });

  it("finds a collection's owner from what it covers when the key is withheld", () => {
    const [partRec, secRec] = deckRecordings(
      [
        source({ key: "part", ownerKind: "collection", covers: ["q2", "q3", "q4"] }),
        source({ key: "sec", ownerKind: "collection", covers: ["q2", "q3"] }),
      ],
      PAPER,
      stubOf,
    );
    expect(partRec.label).toBe("Part 2");
    expect(secRec.label).toBe("Questions 2–3");
  });

  it("prefers the part when it and its only section cover the same questions", () => {
    const soloPart = stub("p", "part", "Part 1");
    const soloSection = stub("s", "section", "Section", soloPart);
    const [rec] = deckRecordings(
      [source({ ownerKind: "collection", covers: ["a", "b"] })],
      ["a", "b"],
      () => soloSection,
    );
    expect(rec.label).toBe("Part 1");
  });

  it("keeps only questions on this paper, drops a recording over none, and titles a blank one", () => {
    const list = deckRecordings(
      [
        source({ key: "gone", ownerKind: "exercise", covers: ["elsewhere"] }),
        source({ key: "kept", title: "  ", covers: ["q1", "elsewhere"] }),
      ],
      PAPER,
      stubOf,
    );
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: "kept", title: "Recording", nodeIds: ["q1"] });
  });

  it("reads both API lists into the same source", () => {
    const media = { provider: "gcs" as const, key: "recordings/a.mp3", content_type: "audio/mpeg" as const, duration_s: 12 };
    expect(
      paperRecordingSource({
        appsheet_key: "k",
        edited_at: null,
        created_at: null,
        owner_kind: "test",
        owner_key: "t",
        title: "T",
        media,
        transcript: null,
        order: 0,
        covers: ["q1"],
      }),
    ).toEqual({ key: "k", title: "T", durationS: 12, sourceKey: media.key, ownerKind: "test", ownerKey: "t", covers: ["q1"] });
    expect(
      sessionRecordingSource({ recording_key: "k", title: "T", duration_s: 12, owner_kind: "collection", covers: ["q1"] }),
    ).toMatchObject({ key: "k", sourceKey: "k", ownerKey: null, ownerKind: "collection" });
  });
});

describe("innermost and covering recordings", () => {
  const rec = (id: string, nodeIds: string[]): DeckRecording => ({
    id,
    label: "",
    title: id,
    durationS: 10,
    sourceKey: id,
    nodeIds,
  });
  const whole = rec("whole", PAPER);
  const partRec = rec("part", ["q2", "q3", "q4"]);
  const q3 = rec("q3", ["q3"]);
  const all = [whole, partRec, q3];

  it("picks the narrowest recording over the page", () => {
    expect(innermostRecording(all, ["q2", "q3"])?.id).toBe("q3");
    expect(innermostRecording(all, ["q4"])?.id).toBe("part");
    expect(innermostRecording(all, ["q1"])?.id).toBe("whole");
    expect(innermostRecording([partRec], ["q1"])).toBeNull();
  });

  it("breaks a tie by paper order", () => {
    const a = rec("a", ["q1"]);
    const b = rec("b", ["q1"]);
    expect(innermostRecording([a, b], ["q1"])?.id).toBe("a");
  });

  it("lists everything over the page, outermost first", () => {
    expect(coveringRecordings([q3, partRec, whole], ["q3"]).map((r) => r.id)).toEqual(["whole", "part", "q3"]);
    expect(coveringRecordings(all, ["q1"]).map((r) => r.id)).toEqual(["whole"]);
  });
});

describe("latestWindowId", () => {
  it("picks the window started last, among the given ids only", () => {
    const windows = { a: win(EARLY), b: win(LATE), stray: win("2026-10-13T10:09:00.000Z") };
    expect(latestWindowId(windows, ["a", "b"])).toBe("b");
    expect(latestWindowId(windows, ["a"])).toBe("a");
    expect(latestWindowId({}, ["a"])).toBeNull();
  });

  it("ignores a window whose start does not parse", () => {
    expect(latestWindowId({ a: win("nonsense"), b: win(EARLY) }, ["a", "b"])).toBe("b");
  });
});

describe("deckRecording", () => {
  const base = { requested: null, roomWindows: {}, ownWindows: {}, ids: ["a", "b"] };

  it("a teacher holds what they pressed, nothing before", () => {
    expect(deckRecording({ ...base, controlled: false, selfPaced: false })).toBeNull();
    expect(deckRecording({ ...base, controlled: false, selfPaced: false, requested: "b" })).toBe("b");
    expect(deckRecording({ ...base, controlled: false, selfPaced: false, requested: "zz" })).toBeNull();
  });

  it("a class run follows the room's latest window, whatever was asked for", () => {
    const roomWindows = { a: win(LATE), b: win(EARLY) };
    expect(deckRecording({ ...base, controlled: true, selfPaced: false, roomWindows, requested: "b" })).toBe("a");
    expect(deckRecording({ ...base, controlled: true, selfPaced: false })).toBeNull();
  });

  it("a share room holds what the student started, else their last window", () => {
    const ownWindows = { a: win(LATE), b: win(EARLY) };
    expect(deckRecording({ ...base, controlled: true, selfPaced: true, ownWindows, requested: "b" })).toBe("b");
    expect(deckRecording({ ...base, controlled: true, selfPaced: true, ownWindows })).toBe("a");
    expect(deckRecording({ ...base, controlled: true, selfPaced: true })).toBeNull();
  });
});
