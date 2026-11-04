// The pure half of the recording bar: the recordings a paper carries, what each
// is called, and which one the bar holds. Kept free of React so the rules are
// testable.

import type {
  CollectionStub,
  PaperRecording,
  RecordingOwnerKind,
  SessionRecording,
} from "../types";
import type { Translate } from "../i18n";
import type { WindowTimes } from "./media-window";

/**
 * One recording the bar can play. The deck knows nothing about where it is
 * stored: `id` is the recording key, which the playback context resolves and
 * windows are keyed by, and `nodeIds` are the link keys it plays over.
 */
export interface DeckRecording {
  id: string;
  /** What it plays over: "Whole test", a part or section title, "Q3". */
  label: string;
  title: string;
  durationS: number;
  /** Changes when the file behind `id` is swapped, so the player reloads. */
  sourceKey: string;
  nodeIds: string[];
}

/** A recording from either list the API serves, before it is labelled. */
export interface RecordingSource {
  key: string;
  title: string;
  durationS: number;
  sourceKey: string;
  ownerKind: RecordingOwnerKind;
  /** Known to teachers; the runner's student-safe list leaves it out. */
  ownerKey: string | null;
  covers: string[];
}

export function paperRecordingSource(recording: PaperRecording): RecordingSource {
  return {
    key: recording.appsheet_key,
    title: recording.title,
    durationS: recording.media.duration_s,
    sourceKey: recording.media.key,
    ownerKind: recording.owner_kind,
    ownerKey: recording.owner_key,
    covers: recording.covers,
  };
}

export function sessionRecordingSource(recording: SessionRecording): RecordingSource {
  return {
    key: recording.recording_key,
    title: recording.title,
    durationS: recording.duration_s,
    // A student never sees the file key; a replaced file is a new paper read.
    sourceKey: recording.recording_key,
    ownerKind: recording.owner_kind,
    ownerKey: null,
    covers: recording.covers,
  };
}

/** A part's or section's name as the bar prints it. */
export function collectionTitle(stub: CollectionStub, t: Translate): string {
  return (
    stub.title?.trim() ||
    (stub.kind === "part" ? t("exercise.structure.part", "Part") : t("exercise.structure.section", "Section"))
  );
}

// The part or section a collection recording belongs to. By key when the owner
// is known; otherwise the collection whose questions are exactly the covered
// ones, the part winning a tie with its only section.
function ownerStub(
  source: RecordingSource,
  nodeIds: readonly string[],
  stubOf: (nodeId: string) => CollectionStub | null | undefined,
): CollectionStub | null {
  const candidates = new Map<string, CollectionStub>();
  for (const id of source.covers) {
    const stub = stubOf(id);
    if (stub) candidates.set(stub.appsheet_key, stub);
    if (stub?.parent) candidates.set(stub.parent.appsheet_key, stub.parent);
  }
  if (source.ownerKey) return candidates.get(source.ownerKey) ?? null;
  const covered = new Set(source.covers);
  const matches = [...candidates.values()].filter((candidate) => {
    const members = nodeIds.filter((id) => {
      const stub = stubOf(id);
      return (
        stub?.appsheet_key === candidate.appsheet_key ||
        stub?.parent?.appsheet_key === candidate.appsheet_key
      );
    });
    return members.length === covered.size && members.every((id) => covered.has(id));
  });
  return matches.find((stub) => stub.kind === "part") ?? matches[0] ?? null;
}

/**
 * The bar's list, labelled against the paper. `nodeIds` is the paper in order
 * (link keys); a recording covering none of it is dropped, since nothing on the
 * paper could play it.
 */
export function deckRecordings(
  sources: readonly RecordingSource[],
  nodeIds: readonly string[],
  stubOf: (nodeId: string) => CollectionStub | null | undefined,
  t: Translate,
): DeckRecording[] {
  const onPaper = new Set(nodeIds);
  const out: DeckRecording[] = [];
  for (const source of sources) {
    const covers = source.covers.filter((id) => onPaper.has(id));
    if (covers.length === 0) continue;
    let label: string;
    if (source.ownerKind === "test") label = t("exercise.recording.wholeTest", "Whole test");
    else if (source.ownerKind === "exercise") {
      label = t("exercise.recording.question", "Q{n}", { n: nodeIds.indexOf(covers[0]) + 1 });
    } else {
      const stub = ownerStub({ ...source, covers }, nodeIds, stubOf);
      label = stub ? collectionTitle(stub, t) : t("exercise.structure.part", "Part");
    }
    out.push({
      id: source.key,
      label,
      title: source.title.trim() || t("exercise.recording.untitled", "Recording"),
      durationS: source.durationS,
      sourceKey: source.sourceKey,
      nodeIds: covers,
    });
  }
  return out;
}

/** Every recording playing over any of these questions, outermost first. */
export function coveringRecordings(
  recordings: readonly DeckRecording[],
  nodeIds: readonly string[],
): DeckRecording[] {
  return recordings
    .filter((r) => r.nodeIds.some((id) => nodeIds.includes(id)))
    .sort((a, b) => b.nodeIds.length - a.nodeIds.length);
}

/**
 * The innermost recording over these questions — a question's own before its
 * section's, a section's before its part's, the whole test's last. On a tie the
 * paper's own order decides.
 */
export function innermostRecording(
  recordings: readonly DeckRecording[],
  nodeIds: readonly string[],
): DeckRecording | null {
  let best: DeckRecording | null = null;
  for (const recording of recordings) {
    if (!recording.nodeIds.some((id) => nodeIds.includes(id))) continue;
    if (!best || recording.nodeIds.length < best.nodeIds.length) best = recording;
  }
  return best;
}

/** The id whose window started last, among the given recordings. */
export function latestWindowId(
  windows: Record<string, WindowTimes>,
  ids: readonly string[],
): string | null {
  let best: string | null = null;
  let bestStart = Number.NEGATIVE_INFINITY;
  for (const id of ids) {
    const window = windows[id];
    if (!window) continue;
    const start = Date.parse(window.startedAt);
    if (Number.isFinite(start) && start > bestStart) {
      best = id;
      bestStart = start;
    }
  }
  return best;
}

/**
 * What the bar plays. A class run follows the room — the teacher's latest Play,
 * whatever the student asked for. A share room holds what the student started,
 * else (after a reload) the window they opened last. A teacher holds what they
 * pressed Play on.
 */
export function deckRecording({
  controlled,
  selfPaced,
  requested,
  roomWindows,
  ownWindows,
  ids,
}: {
  controlled: boolean;
  selfPaced: boolean;
  requested: string | null;
  roomWindows: Record<string, WindowTimes>;
  ownWindows: Record<string, WindowTimes>;
  ids: readonly string[];
}): string | null {
  const asked = requested && ids.includes(requested) ? requested : null;
  if (!controlled) return asked;
  if (!selfPaced) return latestWindowId(roomWindows, ids);
  return asked ?? latestWindowId(ownWindows, ids);
}
