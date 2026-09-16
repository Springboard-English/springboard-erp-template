// The pages of a cursor-paginated list that a table has walked through.
//
// The v2 list endpoints page with an opaque cursor and return no total, so a
// table cannot ask for "page 3" — it can only ask for the page after the one it
// holds. The trail is the cursor of every page from the first to the current
// one: Next pushes the cursor the current page handed back, Previous drops back
// to one already on the trail, and the current page is simply its length.
//
// It is kept in sessionStorage (see `useCursorTable`) so someone who opens a
// row from page 3 of a list comes back to page 3 — for one request rather than
// the four an offset walk would spend re-reaching it. A cursor is only good for
// the filters it was minted under, so the trail carries a fingerprint of them,
// and a trail minted under different filters reads as the first page.

/** `cursors[i]` fetches page `i`; the first page has none. */
export type Cursors = readonly (string | null)[];

export const FIRST_PAGE: Cursors = [null];

/**
 * A stored trail longer than this is treated as corrupt rather than restored.
 *
 * Generous on purpose. Signed cursors are long and sessionStorage is finite,
 * but at any realistic page size this is thousands of rows deep — past where
 * anyone browses. It is checked only on READ: capping forward movement instead
 * would make Next silently stop working, which is a far worse failure than a
 * rare reset to the first page.
 */
export const MAX_TRAIL_PAGES = 500;

/**
 * The trail stored for `filter`, or the first page when there is none, it was
 * minted under other filters, or it is not a trail at all.
 */
export function readCursorTrail(raw: string, filter: string): Cursors {
  if (!raw) return FIRST_PAGE;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return FIRST_PAGE;
    const { filter: storedFilter, cursors } = parsed as {
      filter?: unknown;
      cursors?: unknown;
    };
    if (storedFilter !== filter || !Array.isArray(cursors)) return FIRST_PAGE;
    if (cursors.length > MAX_TRAIL_PAGES) return FIRST_PAGE;
    const [first, ...rest] = cursors;
    if (first !== null || !rest.every((cursor) => typeof cursor === "string")) {
      return FIRST_PAGE;
    }
    return cursors as Cursors;
  } catch {
    return FIRST_PAGE;
  }
}

export function writeCursorTrail(filter: string, cursors: Cursors): string {
  return JSON.stringify({ filter, cursors });
}

/**
 * The trail after asking for page `target`.
 *
 * Forward only ever goes one page, and only with the cursor the current page
 * returned — without one there is no next page, and the trail is unchanged.
 * Backward can go anywhere already walked.
 *
 * Returns the SAME array reference when nothing moves, so a caller can skip the
 * write with `if (next === cursors) return`.
 */
export function moveToPage(
  cursors: Cursors,
  target: number,
  nextCursor: string | null,
): Cursors {
  const page = cursors.length - 1;
  if (target <= 0) return FIRST_PAGE;
  if (target < page) return cursors.slice(0, target + 1);
  if (target === page + 1 && nextCursor) return [...cursors, nextCursor];
  return cursors;
}
