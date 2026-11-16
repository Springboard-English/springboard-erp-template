import { GAP_TOKEN_SOURCE } from "./gap-token";

// Moving a cloze blank is moving its `{gap}` token in the section passage.
//
// The token order IS the question order (`ClozeSection` fills tokens in node
// order), so a move returns both the new passage text and the new order of the
// blanks, which the host saves as the questions' `collection_order`.

/** One piece of a tokenised passage: a run of words and spaces, or a blank. */
export type GapPiece = { kind: "word"; text: string } | { kind: "space"; text: string } | { kind: "gap"; index: number };

/** Split a passage into words, whitespace and blanks; blanks numbered 0.. in order. */
export function gapPieces(text: string): GapPiece[] {
  const pieces: GapPiece[] = [];
  const re = new RegExp(`(${GAP_TOKEN_SOURCE})|(\\s+)|([^\\s{]+|\\{)`, "gi");
  let gap = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match[1]) pieces.push({ kind: "gap", index: gap++ });
    else if (match[2]) pieces.push({ kind: "space", text: match[2] });
    else pieces.push({ kind: "word", text: match[3] });
  }
  return pieces;
}

/** Back to passage text, each blank written as the canonical `{gap}`. */
export function piecesText(pieces: GapPiece[]): string {
  return pieces.map((piece) => (piece.kind === "gap" ? "{gap}" : piece.text)).join("");
}

/**
 * Move blank `gap` (its 0-based order) to just before the word at piece index
 * `beforeWord`. Returns the new text and `order`: for each blank in its new
 * position, which old blank it was. Null when the move changes nothing.
 */
export function moveGap(
  text: string,
  gap: number,
  beforeWord: number,
): { text: string; order: number[] } | null {
  const pieces = gapPieces(text);
  const from = pieces.findIndex((piece) => piece.kind === "gap" && piece.index === gap);
  const target = pieces[beforeWord];
  if (from < 0 || !target || target.kind !== "word") return null;
  // Already sitting right before that word (gap, space, word).
  if (from + 2 === beforeWord && pieces[from + 1]?.kind === "space") return null;

  // Take the blank out with one neighbouring space, so no double space is left.
  const removeAfter = pieces[from + 1]?.kind === "space";
  const removeBefore = !removeAfter && pieces[from - 1]?.kind === "space";
  const start = removeBefore ? from - 1 : from;
  const count = removeAfter || removeBefore ? 2 : 1;
  const moved = pieces[from];
  const rest = [...pieces.slice(0, start), ...pieces.slice(start + count)];

  // The word's index shifts left by what was removed before it.
  const shifted = beforeWord > from ? beforeWord - count : beforeWord;
  const next = [...rest.slice(0, shifted), moved, { kind: "space" as const, text: " " }, ...rest.slice(shifted)];
  const order = next.filter((piece): piece is Extract<GapPiece, { kind: "gap" }> => piece.kind === "gap").map((piece) => piece.index);
  return { text: piecesText(next), order };
}
