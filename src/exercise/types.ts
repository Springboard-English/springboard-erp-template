// The paper shapes the exercise renderers read, as `/v2/collections`,
// `/v2/recordings` and the live-session reads return them. An app's API module
// re-exports these rather than declaring its own, so a renderer and its caller
// agree on one shape.

import type { AudioContentType } from "./lib/media-file";

export type CollectionKind = "part" | "section";

// `layout` names the composite task a section presents: the section is a run
// of per-item questions, and this tells the runner to draw the pool, bank or
// match UI (and, for gapped-text, to deplete). Mirrors `_SECTION_LAYOUTS` in
// the API's extraction.py.
//
// The first four are the tasks over one text with blanks in it, told apart by
// what the student does: `cloze` supplies nothing, `guided-cloze` supplies each
// blank's own options, `banked-cloze` supplies ready-made words to place
// unchanged, `word-formation` supplies a word to re-form.
export type CollectionLayout =
  | "banked-cloze"
  | "cloze"
  | "guided-cloze"
  | "word-formation"
  | "gapped-text"
  | "jumbled-paragraph"
  | "multi-select"
  | "multiple-matching"
  // A speaking task of alternative prompts; each attempt is given one.
  | "topic-pool";

/** A collection's display extras: its layout, and the one word pool a run draws on when the paper has one. */
export interface CollectionInfo {
  layout?: CollectionLayout;
  word_bank?: string[];
}

/** A part or section as a paper carries it, with its parent chain. Answer-safe. */
export interface CollectionStub {
  appsheet_key: string;
  kind: CollectionKind;
  title: string | null;
  instruction: string | null;
  passage_title: string | null;
  passage: string[] | null;
  info: CollectionInfo | null;
  parent: CollectionStub | null;
}

/** One passage highlight a student saved. `start`/`end` are character offsets into the passage text. */
export interface SavedHighlight {
  colour: "yellow" | "green" | "blue" | "pink";
  start: number;
  end: number;
  quote: string;
}

/** What a listening recording belongs to. */
export type RecordingOwnerKind = "test" | "collection" | "exercise";

/** A stored media file. */
export interface MediaRef {
  provider: "gcs";
  key: string;
  content_type: AudioContentType;
  size_bytes?: number | null;
  duration_s: number;
}

/** A listening recording as `/v2/recordings` returns it. */
export interface ListeningRecording {
  appsheet_key: string;
  edited_at: string | null;
  created_at: string | null;
  owner_kind: RecordingOwnerKind;
  owner_key: string;
  title: string;
  media: MediaRef;
  transcript: string | null;
  order: number;
}

/** A recording on a paper, with the question keys it covers. */
export interface PaperRecording extends ListeningRecording {
  covers: string[];
}

/** A recording as a live session hands it to a student: no media key, only what to fetch it by. */
export interface SessionRecording {
  recording_key: string;
  title: string;
  duration_s: number;
  owner_kind: RecordingOwnerKind;
  covers: string[];
}
