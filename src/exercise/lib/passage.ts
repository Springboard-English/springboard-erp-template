// A passage is STORED as paragraphs (`Collection.passage`) and EDITED as one
// block of text, so every screen that offers a passage textarea needs the same
// pair of conversions.
//
// They live together because they have to agree. Splitting on a SINGLE newline
// would turn one paragraph into ten the moment a teacher wrapped a line, and the
// error hunt measures its mistake offsets against exactly this joining — an
// editor that split differently from the way the marks are placed would move
// every offset in the passage without looking broken.

/** How paragraphs are joined into the single string offsets are measured in. */
export const PARAGRAPH_SEPARATOR = "\n\n";

/** The stored paragraphs as one string — a textarea's value, and what marks
 * are measured against. */
export function joinPassage(passage: string[] | null | undefined): string {
  return (passage ?? []).join(PARAGRAPH_SEPARATOR);
}

/**
 * A passage textarea's text back into verbatim paragraphs (blank-line split).
 *
 * Null — not `[]` — when nothing is left: null is what "this part has no
 * passage" is stored as, and PATCHing null is how an existing one is cleared.
 */
export function splitPassage(text: string): string[] | null {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.length ? paragraphs : null;
}
