/**
 * Offset paging on top of the API's cursor paging.
 *
 * Every v2 listing is cursor-paginated: it answers with `attributes.next_cursor`
 * and no total. `SimpleDataTable` asks for a page number. This walks the cursors
 * to reach the requested offset and returns just that page, plus the row count
 * the table needs to decide whether "next" is enabled.
 *
 * Cursors encode the filters they were issued under — the API rejects one
 * replayed against a different filter set — so a filter change has to restart
 * from the first page. That happens naturally here: each call starts at
 * `cursor: null`, and React Query's key carries the filters.
 *
 * Every app had its own copy of this walk and two of them were wrong; see
 * `fetchPageSlice` for the specific bug. Prefer `useCursorTable` for a new
 * table — it reaches a page in one request instead of `page` of them — and
 * reach for this when a call site is already shaped around `(limit, offset)`.
 */

/** The API's page cap; `page_size` is validated `ge=1, le=200`. */
export const MAX_PAGE_SIZE = 200;

/**
 * Ceiling on `fetchEveryPage`, so "select all matching" can't walk a filterless
 * listing forever. Callers are told when it bites rather than silently handed a
 * short list.
 */
export const EVERY_PAGE_CAP = 2000;

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

export type FetchCursorPage<T> = (
  pageSize: number,
  cursor: string | null,
) => Promise<CursorPage<T>>;

/**
 * The shape the list endpoints' envelopes parse into. Each app parses its own
 * envelope — the parsers differ over legacy keys, bare arrays and container
 * unwrapping, and each is welded to that app's error handling — so this package
 * deliberately starts at an already-parsed page and names the shape once.
 */
export interface CursorPaginatedResult<T> extends CursorPage<T> {
  pageSize: number;
  cursor: string | null;
  /** Present only on the few endpoints that count; see `knownRowCount`. */
  total?: number | null;
}

export interface PageSlice<T> {
  items: T[];
  /** Another page exists after this one. */
  hasMore: boolean;
  /**
   * What to hand `SimpleDataTable` as `totalRowCount`. Exact once the last
   * page has been seen; until then it is one row past the current page, which
   * is the least that keeps "next" clickable without inventing a total.
   */
  totalHint: number;
}

export function clampPageSize(pageSize: number, max = MAX_PAGE_SIZE): number {
  return Math.min(Math.max(Math.trunc(pageSize), 1), max);
}

/**
 * Fetches the page at `offset`, walking (and discarding) the pages before it.
 *
 * Reaching page 5 costs five requests. That is the price of a cursor API without
 * offsets, and it is why tables over this default to a 25-row page and lean on
 * filters instead of paging deep.
 *
 * **The exit guard is load-bearing.** Two apps guarded the walk with
 * `if (!cursor && remainingOffset > 0)`, which does not fire when the skip loop
 * consumes the last full page exactly: the offset reaches zero, the cursor is
 * null, the loop falls through, and the final fetch is made with no cursor —
 * so the API restarts at page one and its rows are returned as the last page's.
 * It showed up on any list whose row count was an exact multiple of the page
 * size, which the `offset + limit + 1` row count actively steers users into by
 * leaving "next" enabled on the last page. Checking `nextCursor` inside the
 * loop, before the offset is consulted, is what makes that unreachable.
 */
export async function fetchPageSlice<T>(
  limit: number,
  offset: number,
  fetchPage: FetchCursorPage<T>,
): Promise<PageSlice<T>> {
  const pageSize = clampPageSize(limit);
  const start = Math.max(0, Math.trunc(offset));

  let cursor: string | null = null;
  let remaining = start;

  while (remaining > 0) {
    const skipped: CursorPage<T> = await fetchPage(
      Math.min(pageSize, remaining),
      cursor,
    );

    // Ran out of rows before reaching the requested page — the caller is
    // past the end, usually because a filter shrank the result set while
    // they were on page 4. Also the guard described above.
    if (skipped.items.length === 0 || !skipped.nextCursor) {
      return { items: [], hasMore: false, totalHint: start };
    }

    remaining -= skipped.items.length;
    cursor = skipped.nextCursor;
  }

  const page = await fetchPage(pageSize, cursor);

  // An endpoint that ignores `page_size` and answers with the whole table would
  // otherwise be reported as one enormous page, and `totalHint` would claim a
  // total the table cannot page through. Truncating says "there is more",
  // which is both true and navigable.
  const overflowed = page.items.length > pageSize;
  const items = overflowed ? page.items.slice(0, pageSize) : page.items;

  // A SHORT page does not end the list; only an empty one or a missing cursor
  // does. The API fills a page by scanning and then trimming to what the caller
  // may see, so a page can come back short with rows still behind it — and it
  // deliberately emits a cursor when a page fills inside a short final chunk,
  // to keep those rows reachable. Ending on `items.length < pageSize` would
  // hide them. (Against today's API the two rules cannot actually disagree:
  // `paginate_v2` only leaves the scan un-exhausted when the page filled. This
  // does not rely on that.)
  const hasMore = overflowed || (items.length > 0 && page.nextCursor !== null);

  return {
    items,
    hasMore,
    // `knownRowCount`'s formula with the offset standing in for page * pageSize,
    // so the two halves of this module cannot drift apart.
    totalHint: start + items.length + (hasMore ? 1 : 0),
  };
}

export interface EveryPageResult<T> {
  items: T[];
  /** `true` when the cap stopped the walk before the last page. */
  truncated: boolean;
}

/**
 * Walks every page under the current filters, up to `cap`.
 *
 * Backs "select all N matching", and the pickers whose list would otherwise be
 * silently cut at page one — which looks complete and is not.
 */
export async function fetchEveryPage<T>(
  fetchPage: FetchCursorPage<T>,
  cap = EVERY_PAGE_CAP,
): Promise<EveryPageResult<T>> {
  const items: T[] = [];
  let cursor: string | null = null;

  do {
    const page: CursorPage<T> = await fetchPage(MAX_PAGE_SIZE, cursor);
    items.push(...page.items);
    cursor = page.nextCursor;

    if (items.length >= cap) {
      return { items: items.slice(0, cap), truncated: Boolean(cursor) };
    }
  } while (cursor);

  return { items, truncated: false };
}

/**
 * The row count to hand a server-paged `SimpleDataTable`.
 *
 * The rows before this page plus the ones on it, and ONE more while a next page
 * exists. That extra row is what enables Next, and the table reads a count it
 * cannot reach as unknown: it labels the page "Showing 11–20" rather than
 * inventing an "of N". On the last page the count is exact.
 *
 * `total` is for the few endpoints that actually count, and wins outright when
 * given. Every other strategy in the apps — the `offset + limit + 1` effect,
 * the over-fetch-by-one, the inline expression — is this function written out,
 * which is why they all live here now.
 */
export function knownRowCount(
  page: number,
  pageSize: number,
  shown: number,
  hasMore: boolean,
  total?: number | null,
): number {
  if (typeof total === "number" && total >= 0) return total;
  return page * pageSize + shown + (hasMore ? 1 : 0);
}
