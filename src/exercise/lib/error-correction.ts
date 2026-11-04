// Error identification & correction: the shared tokenizer.
//
// The student reads an UNMARKED sentence, selects the word or words they think
// are wrong (identification), and types the correction. Both the runner (where
// the student selects) and the teacher editors (where the error is marked) must
// agree on exactly which character offsets a given word starts and ends at —
// otherwise a teacher marks offset 12 and a student clicking the same word
// reports 13, and every answer grades wrong. Keeping the tokenizer here, pure and
// shared, is what makes those offsets the same integers everywhere. The backend
// never tokenizes; it compares the submitted `pick`..`pick_end` to the stored
// `error_offset`..`error_offset + error.length`.

export type SentenceToken = {
  /** The token's text as it appears in the sentence. */
  text: string;
  /** Character offset of the token's first char into the sentence. */
  offset: number;
  /** Word tokens are clickable; whitespace/punctuation runs are not. */
  isWord: boolean;
};

// A word is a run of letters/digits with internal apostrophes or hyphens
// ("don't", "well-known"). Everything else (spaces, punctuation) is a gap token,
// so the whole sentence is covered and every char keeps its offset.
const WORD = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;

/** Split a sentence into word / non-word tokens, each carrying its char offset. */
export function tokenizeSentence(sentence: string): SentenceToken[] {
  const tokens: SentenceToken[] = [];
  let last = 0;
  for (const match of sentence.matchAll(WORD)) {
    const start = match.index ?? 0;
    if (start > last) {
      tokens.push({ text: sentence.slice(last, start), offset: last, isWord: false });
    }
    tokens.push({ text: match[0], offset: start, isWord: true });
    last = start + match[0].length;
  }
  if (last < sentence.length) {
    tokens.push({ text: sentence.slice(last), offset: last, isWord: false });
  }
  return tokens;
}

/** The word beginning at `offset`, or "" if no word starts there. */
export function wordAt(sentence: string, offset: number): string {
  return tokenizeSentence(sentence).find(
    (token) => token.isWord && token.offset === offset,
  )?.text ?? "";
}

/**
 * A run of one or more whole words: `start` is the first word's offset, `end`
 * is just past the last word. A mistake may span several words ("will goes"),
 * and is stored as `error_offset` = start and `error` = the text of the run, so
 * `end` is `error_offset + error.length`.
 */
export type WordSpan = { start: number; end: number };

/** The span a stored mark covers, or null when no word starts at `offset`.
 * `error` (the stored text) sets the end when the sentence still spells it
 * there; otherwise the mark is the one word at `offset`. */
export function markSpan(
  sentence: string,
  offset: number | null | undefined,
  error?: string,
): WordSpan | null {
  if (offset === null || offset === undefined) return null;
  const word = tokenizeSentence(sentence).find(
    (token) => token.isWord && token.offset === offset,
  );
  if (!word) return null;
  const end =
    error && sentence.startsWith(error, offset) && endsOnWord(sentence, offset + error.length)
      ? offset + error.length
      : offset + word.text.length;
  return { start: offset, end };
}

function endsOnWord(sentence: string, end: number): boolean {
  return tokenizeSentence(sentence).some(
    (token) => token.isWord && token.offset + token.text.length === end,
  );
}

/** The text a span covers, as the sentence spells it. */
export function spanText(sentence: string, span: WordSpan): string {
  return sentence.slice(span.start, span.end);
}

/** True when the word starting at `offset` is inside `span`. */
export function spanHas(span: WordSpan | null, offset: number): boolean {
  return span !== null && offset >= span.start && offset < span.end;
}

export function sameSpan(a: WordSpan | null, b: WordSpan | null): boolean {
  return a !== null && b !== null && a.start === b.start && a.end === b.end;
}

// A span never crosses the end of a sentence or a line break, so a mistake
// stays inside the one sentence the API checks it against.
const SPAN_BREAK = /[.!?\n]/;

/**
 * How the word at `offset` relates to `span`: inside it, the word right before
 * or after it (so a click can extend it), or neither.
 */
export function spanRelation(
  sentence: string,
  span: WordSpan | null,
  offset: number,
): "inside" | "before" | "after" | null {
  if (span === null) return null;
  if (spanHas(span, offset)) return "inside";
  const words = tokenizeSentence(sentence).filter((token) => token.isWord);
  const index = words.findIndex((token) => token.offset === offset);
  if (index < 0) return null;
  const word = words[index];
  const next = words[index + 1];
  const prev = words[index - 1];
  const wordEnd = word.offset + word.text.length;
  if (next?.offset === span.start && !SPAN_BREAK.test(sentence.slice(wordEnd, span.start))) {
    return "before";
  }
  if (prev && prev.offset + prev.text.length === span.end && !SPAN_BREAK.test(sentence.slice(span.end, word.offset))) {
    return "after";
  }
  return null;
}

/**
 * What a click on the word at `offset` does to a selection, built a word at a
 * time so it works by tap as well as by mouse:
 * - nothing selected, or a word not touching the selection: just that word;
 * - the word right before or after the selection: the selection grows to it;
 * - the first or last word of a longer selection: it shrinks off that end;
 * - the only selected word: the selection clears;
 * - a word in the middle: the selection becomes that word alone.
 */
export function toggleSpanWord(
  sentence: string,
  span: WordSpan | null,
  offset: number,
): WordSpan | null {
  const words = tokenizeSentence(sentence).filter((token) => token.isWord);
  const word = words.find((token) => token.offset === offset);
  if (!word) return span;
  const single = { start: offset, end: offset + word.text.length };
  const relation = spanRelation(sentence, span, offset);
  if (span === null || relation === null) return single;
  if (relation === "before") return { start: offset, end: span.end };
  if (relation === "after") return { start: span.start, end: single.end };
  if (sameSpan(span, single)) return null;
  const inside = words.filter((token) => spanHas(span, token.offset));
  const first = inside[0];
  const last = inside[inside.length - 1];
  if (offset === first.offset) {
    return { start: inside[1].offset, end: span.end };
  }
  if (offset === last.offset) {
    const before = inside[inside.length - 2];
    return { start: span.start, end: before.offset + before.text.length };
  }
  return single;
}

/**
 * A student's selection as their answer stores it, or null.
 *
 * `pick` is the first word's offset and `pick_end` the end of the last. An
 * answer from a runner that picked one word has no `pick_end`; its span is that
 * word.
 */
export function answerSpan(
  sentence: string,
  record: Record<string, string>,
): WordSpan | null {
  const start = Number.parseInt(record.pick ?? "", 10);
  if (!Number.isInteger(start)) return null;
  const end = Number.parseInt(record.pick_end ?? "", 10);
  if (Number.isInteger(end)) return { start, end };
  return markSpan(sentence, start);
}

/**
 * Whether an answer's selection is the marked mistake, exactly as the API
 * grades it (`grading.py`): both ends must match. An answer with no `pick_end`
 * comes from a runner that picked one word and grades by its start alone.
 */
export function pickMatchesMark(
  record: Record<string, string>,
  errorOffset: number | undefined,
  error: string | undefined,
): boolean {
  const start = Number.parseInt(record.pick ?? "", 10);
  if (errorOffset === undefined || start !== errorOffset) return false;
  if (record.pick_end === undefined) return true;
  return error !== undefined && Number.parseInt(record.pick_end, 10) === errorOffset + error.length;
}

/** The answer fields for a selection: both ends, or neither. */
export function spanAnswerFields(span: WordSpan | null): Record<string, string> {
  return span ? { pick: String(span.start), pick_end: String(span.end) } : {};
}

/**
 * Where the marked error sits in a sentence, or null if it isn't in it.
 *
 * Editing the sentence moves every character after the edit, so a stored
 * `error_offset` stops pointing at the wrong word — and an offset that misses is
 * the worst kind of wrong: nothing looks broken, every student just grades
 * incorrect. An editor calls this after each keystroke to re-anchor the mark,
 * and clears it on null rather than keeping a stale one.
 *
 * The match is a WHOLE word ("in" must not latch onto "including"), falling back
 * to a phrase that begins at a word — a mistake may span several ("will goes").
 */
export function relocateError(sentence: string, error: string): number | null {
  if (!error) return null;
  const tokens = tokenizeSentence(sentence);
  const word = tokens.find((token) => token.isWord && token.text === error);
  if (word) return word.offset;
  const phrase = tokens.find(
    (token) => token.isWord && sentence.startsWith(error, token.offset),
  );
  return phrase ? phrase.offset : null;
}
