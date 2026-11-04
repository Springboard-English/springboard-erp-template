import {
  markSpan,
  spanHas,
  spanRelation,
  spanText,
  toggleSpanWord,
  tokenizeSentence,
  type WordSpan,
} from "./error-correction";
import { joinPassage } from "./passage";

// A paragraph-wide error hunt: "the passage below contains FIVE mistakes —
// underline them and write their correct forms."
//
// Each mistake is still its own question, which is what makes each one
// independently gradable. But nobody answers one a sentence at a time: the
// student clicks words in the paragraph the paper prints, and the teacher marks
// them there. So every offset in a hunt is a PARAGRAPH offset — an index into
// the section's passage joined with `PARAGRAPH_SEPARATOR` (`lib/passage.ts`).
// It is the integer a click on that word reports, the integer the review stores
// as `error_offset`, and the integer the API grades `pick` against, with nothing
// translated in between. A question's `content.sentence` is kept for its
// summary and for a question shown on its own; it positions nothing.
//
// Pure, because an offset that is off by one grades every student wrong without
// looking broken.

/** A sentence's span inside the paragraph. */
export interface SentenceSpan {
  text: string;
  start: number;
  end: number;
}

/** One question's mistake, positioned in the paragraph. */
export interface HuntMark {
  /** Index into the questions array. */
  index: number;
  /** Offset of the mistake's first word into the JOINED paragraph text. */
  paragraphOffset: number;
  /** The mistake's words in the paragraph — one or several. */
  span: WordSpan;
  /** The mistake as the paragraph spells it. */
  word: string;
}

/**
 * The text an error-correction question's offsets measure when it is one
 * mistake of a hunt — its section's joined passage — or null when it stands on
 * its own and they measure its sentence.
 *
 * A SECTION with a passage, which is the rule `pageLayout` draws a hunt by and
 * the API's `hunt_paragraph` validates by. A part's passage is a reading text
 * beside its questions, not one the student clicks in.
 */
export function huntParagraph(
  collection: { kind: string; passage: string[] | null } | null | undefined,
): string | null {
  if (collection?.kind !== "section" || !collection.passage?.length) return null;
  return joinPassage(collection.passage);
}

// A sentence ends at . ! ? (or their runs), optionally followed by a closing
// quote/bracket, then whitespace. Abbreviations ("Mr.", "e.g.") would split
// early; that only costs a slightly short `content.sentence`, never a wrong
// offset, since the offset is the click's own position in the paragraph.
const SENTENCE_END = /[.!?]+["'”’)\]]*(?=\s|$)/g;

/** Split the paragraph into sentence spans covering all of it. */
export function sentenceSpans(text: string): SentenceSpan[] {
  const spans: SentenceSpan[] = [];
  const re = new RegExp(SENTENCE_END.source, "g");
  let start = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const end = match.index + match[0].length;
    if (text.slice(start, end).trim()) spans.push({ text: text.slice(start, end), start, end });
    start = end;
  }
  if (text.slice(start).trim()) {
    spans.push({ text: text.slice(start), start, end: text.length });
  }
  return spans;
}

/** The sentence containing `offset`, or null when the text has none. */
export function sentenceAt(text: string, offset: number): SentenceSpan | null {
  const spans = sentenceSpans(text);
  return (
    spans.find((span) => offset >= span.start && offset < span.end) ??
    spans[spans.length - 1] ??
    null
  );
}

/**
 * Where a stored sentence sits in the paragraph, or -1.
 *
 * Exact match first — extraction stores the passage's own copy of the sentence,
 * so that is the normal case. Whitespace-insensitive matching is the fallback,
 * because a line break inside the paragraph becomes a space in one copy and not
 * the other, and a sentence that can't be found is flagged to the teacher as
 * having left the passage.
 */
export function locateSentence(text: string, sentence: string): number {
  const needle = sentence.trim();
  if (!needle) return -1;
  const exact = text.indexOf(needle);
  if (exact >= 0) return exact;

  // Compare with runs of whitespace collapsed, tracking the original index of
  // each kept character so the answer is still an offset into `text`.
  const map: number[] = [];
  let flat = "";
  let inSpace = false;
  for (let i = 0; i < text.length; i += 1) {
    if (/\s/.test(text[i])) {
      if (inSpace) continue;
      inSpace = true;
      map.push(i);
      flat += " ";
    } else {
      inSpace = false;
      map.push(i);
      flat += text[i];
    }
  }
  const flatNeedle = needle.replace(/\s+/g, " ");
  const at = flat.indexOf(flatNeedle);
  return at >= 0 ? map[at] : -1;
}

/**
 * Position every question's mistake in the paragraph.
 *
 * Each stored `error_offset` IS its paragraph position, and `error` its text;
 * all this checks is that a word starts there. A question with no mark yet, or
 * one that lands on no word (the passage was edited under it), is left out of
 * `marks` and named in `unplaced` — the review shows those as needing attention
 * rather than pretending they're somewhere.
 */
export function huntMarks(
  text: string,
  stored: Array<{ error_offset?: number; error?: string }>,
): { marks: HuntMark[]; unplaced: number[] } {
  const marks: HuntMark[] = [];
  const unplaced: number[] = [];
  stored.forEach(({ error_offset, error }, index) => {
    const span = markSpan(text, error_offset, error);
    if (span === null) {
      unplaced.push(index);
      return;
    }
    marks.push({ index, paragraphOffset: span.start, span, word: spanText(text, span) });
  });
  return { marks, unplaced };
}

/**
 * Turn a selection in the paragraph into the fields one question stores.
 *
 * The offset is stored exactly as selected. The sentence is derived from the
 * same position, so a question's summary always names the sentence its mistake
 * is really in.
 */
export function markFromParagraph(
  text: string,
  span: WordSpan,
): { sentence: string; error: string; paragraphOffset: number } | null {
  const first = sentenceAt(text, span.start);
  const last = sentenceAt(text, span.end - 1);
  if (!first || !last) return null;
  return {
    sentence: text.slice(first.start, last.end).trim(),
    error: spanText(text, span),
    paragraphOffset: span.start,
  };
}

/** A student's picks in a hunt, one per numbered row: the words chosen for
 * that row, or null while it has none. */
export type PickedSpans = Array<WordSpan | null>;

/** The row a student starts on: the first with no word yet, else the first. */
export function initialActiveRow(picked: PickedSpans): number {
  const first = picked.findIndex((span) => span === null);
  return first === -1 ? 0 : first;
}

/**
 * What a click on a paragraph word does to the rows.
 *
 * Every word is fair game for whichever row is active — the row says which
 * mistake, the click says where, and nothing ties a row to a sentence. A
 * mistake may be several words, built a click at a time (`toggleSpanWord`):
 * - On a word a row already holds, that row's selection shrinks (or clears, if
 *   it was the only word) — a misclick is undone where it was made, on
 *   whichever row made it. A row left empty becomes the active one.
 * - On the word right next to a row's selection, that row grows to it — the
 *   active row first, else any row. The active row stays where it was, since
 *   the student auto-advanced past the row they are extending.
 * - Anywhere else, the active row's selection moves there.
 *
 * So two mistakes on neighbouring words cannot be told apart: the second click
 * extends the first. Papers don't set those.
 *
 * `nextActive` is where the student goes next: once an empty row gains a word,
 * the next row still without one — searching forward, then from the top — or
 * the same row when every row has a word.
 */
export function pickParagraphWord(
  text: string,
  picked: PickedSpans,
  activeRow: number,
  paragraphOffset: number,
): {
  changes: Array<{ row: number; span: WordSpan | null }>;
  nextActive: number;
} {
  const holder = picked.findIndex((span) => spanHas(span, paragraphOffset));
  if (holder >= 0) {
    const span = toggleSpanWord(text, picked[holder], paragraphOffset);
    return {
      changes: [{ row: holder, span }],
      nextActive: span === null ? holder : activeRow,
    };
  }
  const touches = (row: number) =>
    spanRelation(text, picked[row], paragraphOffset) !== null;
  const rows = picked.map((_, row) => row);
  const neighbour = touches(activeRow) ? activeRow : rows.find(touches);
  if (neighbour !== undefined) {
    return {
      changes: [{ row: neighbour, span: toggleSpanWord(text, picked[neighbour], paragraphOffset) }],
      nextActive: activeRow,
    };
  }

  const span = toggleSpanWord(text, null, paragraphOffset);
  if (span === null) return { changes: [], nextActive: activeRow };
  const after = [...picked];
  after[activeRow] = span;
  const order = [
    ...rows.filter((row) => row > activeRow),
    ...rows.filter((row) => row < activeRow),
  ];
  const nextActive =
    picked[activeRow] === null
      ? (order.find((row) => after[row] === null) ?? activeRow)
      : activeRow;
  return { changes: [{ row: activeRow, span }], nextActive };
}

/** Each picked mistake's row number, keyed by its LAST word's offset — what
 * the passage prints after it so the student can see which box it fills.
 * After the last word, so the number never splits a run of words. */
export function labelsByParagraphOffset(
  text: string,
  picked: PickedSpans,
  numbers: number[],
): Map<number, number> {
  const words = tokenizeSentence(text).filter((token) => token.isWord);
  const labels = new Map<number, number>();
  picked.forEach((span, row) => {
    if (span === null) return;
    const inside = words.filter((word) => spanHas(span, word.offset));
    const last = inside[inside.length - 1];
    labels.set(last?.offset ?? span.start, numbers[row]);
  });
  return labels;
}
