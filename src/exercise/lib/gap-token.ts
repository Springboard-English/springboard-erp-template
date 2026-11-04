// The API's canonical blank marker, and how to show it when nobody is filling it
// in.
//
// Extraction emits one `{gap}` per blank in a cloze/word-formation/summary
// passage, in question order. `ClozeSection` consumes that and drops a real
// input at each one — but every OTHER surface renders the same passage as prose:
// the side-by-side reading column, the stacked passage on a question's detail
// page, the teacher's preview. Printed literally, a guided cloze would read
// "The delay was {gap} long" — machine punctuation shown to a student where the
// paper has a ruled line.
//
// This is display only. The stored passage keeps the token, because it is the
// contract that tells the renderer where the inputs go; a passage rewritten to
// underscores would lose the ordering `ClozeSection` depends on.

/**
 * The blank marker, as source so every consumer shares ONE definition.
 *
 * Exactly `{gap}` — ONE spelling, matching `_GAP_TOKEN` in the API's
 * `extraction.py`, which is the only place it is written on that side (its
 * prompt template is a `str.format()` string, so doubled braces there unescape
 * to `{gap}`). Accepting a second spelling would hide a disagreement rather than
 * settle it — if these two ever diverge it should break loudly, not degrade
 * quietly.
 *
 * Whitespace is tolerated and an index (`{gap_1}`) is ignored: order is what's
 * authoritative, so a numbered token must not mean something different.
 */
export const GAP_TOKEN_SOURCE = "\\{\\s*gap(?:[_:\\s-]*\\d+)?\\s*\\}";

const GAP_TOKEN = new RegExp(GAP_TOKEN_SOURCE, "gi");

/** What a blank looks like on paper. */
const PRINTED_BLANK = "______";

/** Replace every gap token with a printed blank, for prose rendering. */
export function showGapTokens(text: string): string {
  return text.replace(GAP_TOKEN, PRINTED_BLANK);
}

/** How many gap tokens the text carries — the blanks a cloze will draw. */
export function countGapTokens(text: string): number {
  return text.match(new RegExp(GAP_TOKEN_SOURCE, "gi"))?.length ?? 0;
}

/** True when the text carries at least one gap token. */
export function hasGapToken(text: string): boolean {
  // `test` on a /g regex advances lastIndex, so use a fresh one each call.
  return new RegExp(GAP_TOKEN_SOURCE, "i").test(text);
}

// How a GAPPED TEXT marks its holes, best (most deterministic) first.
//
// A gapped text is the one passage the API does NOT tokenise: the section prompt
// asks for "the passage with its numbered gaps marked", i.e. whatever the paper
// itself printed — a bare number on its own line between two paragraphs, a
// bracketed number, or a ruled line. So splitting on `{gap}` alone would find
// nothing and return the whole passage as one chunk, dropping every gap into a
// stacked list under the text instead of inline where it belongs.
//
// Every alternative is NON-CAPTURING on purpose: `String.split` splices capture
// groups into its result, so one stray `(...)` would inject the gap markers back
// into the passage as text.
const GAP_MARKERS = [
  // 1. The canonical token, when the passage happens to carry it.
  GAP_TOKEN_SOURCE,
  // 2. A ruled line / ellipsis run, optionally tagged with its number.
  "(?:\\(\\s*\\d+\\s*\\)|\\d+\\s*[.)])?\\s*(?:_{2,}|\\u2026+|\\.{3,})",
  // 3. A number in brackets or parentheses: "[37]", "(37)".
  "(?:\\[\\s*\\d+\\s*\\]|\\(\\s*\\d+\\s*\\))",
  // 4. A number alone on its own line — how a paper usually prints a paragraph
  //    gap. Anchored to line boundaries so a number inside prose is left alone.
  "(?:^|\\n)[ \\t]*\\**[ \\t]*\\d+[ \\t]*\\**[ \\t]*(?=\\n|$)",
];

/**
 * Split a gapped-text passage into the chunks AROUND its gaps.
 *
 * Returns `expected + 1` chunks, or **null** when no marker style accounts for
 * exactly `expected` gaps. Null rather than a best effort on purpose: a passage
 * cut at the wrong places reads as mangled prose and anchors inputs at the wrong
 * holes, which is worse than the honest fallback of listing the gaps separately.
 * The count is the check that makes guessing at marker styles safe.
 */
export function splitPassageOnGaps(
  passage: string,
  expected: number,
): string[] | null {
  if (!passage || expected < 1) return null;
  for (const source of GAP_MARKERS) {
    const chunks = passage.split(new RegExp(source, "gi"));
    if (chunks.length - 1 === expected) return chunks;
  }
  return null;
}
