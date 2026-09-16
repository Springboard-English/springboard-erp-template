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

declare const PAGE_SIZE: unique symbol;

/**
 * A validated `page_size`: an integer in `[1, MAX_PAGE_SIZE]`.
 *
 * It is a type rather than a number because a bad one is silent. `-1` used to be
 * a sentinel meaning "drain the list" in four apps' private walks; when the walk
 * moved in here it became a page size, and clamping turned it into ONE — so nine
 * CSV exports wrote a single row and a timeline tab rendered a single class. No
 * compiler could see it: `-1` is a perfectly good `number`.
 *
 * Build one with {@link pageSize} (throws — for literals and anything whose being
 * wrong is a bug) or {@link toPageSize} (clamps — for values restored from
 * sessionStorage or a URL, where a bad value should reset rather than crash).
 */
export type PageSize = number & { readonly [PAGE_SIZE]: true };

const MAX_PAGE_SIZE_VALUE = 200;

/** The API's page cap; `page_size` is validated `ge=1, le=200`. */
export const MAX_PAGE_SIZE = MAX_PAGE_SIZE_VALUE as PageSize;

/** What a table opens on when nothing has been remembered for it. */
export const DEFAULT_PAGE_SIZE = 25 as PageSize;

/**
 * A page size, or a `RangeError` naming what was wrong with it.
 *
 * For literals and computed values: if this throws, the call site is wrong, and
 * failing at the first request beats serving one row for a year.
 */
export function pageSize(value: number): PageSize {
  if (!Number.isInteger(value)) {
    throw new RangeError(`page_size must be a whole number, got ${value}`);
  }
  if (value < 1 || value > MAX_PAGE_SIZE_VALUE) {
    throw new RangeError(
      `page_size must be between 1 and ${MAX_PAGE_SIZE_VALUE}, got ${value}`,
    );
  }
  return value as PageSize;
}

/**
 * A page size, clamped into range.
 *
 * For values that arrive from outside the code — sessionStorage, a query string,
 * a saved view — where the right answer to nonsense is a usable default, not an
 * exception in a render.
 */
export function toPageSize(value: number, fallback: PageSize = DEFAULT_PAGE_SIZE): PageSize {
  if (!Number.isFinite(value)) return fallback;
  const whole = Math.trunc(value);
  return Math.min(Math.max(whole, 1), MAX_PAGE_SIZE_VALUE) as PageSize;
}

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

/**
 * THE canonical fetcher: one page of a listing, at the size asked for, after
 * `cursor`. Everything else in this module is a read over one of these, and a
 * resource should expose exactly one — bound to its filters by a closure — so
 * that its paged read, its drain-all and its phone list cannot drift apart.
 */
export type FetchCursorPage<T> = (
  size: PageSize,
  cursor: string | null,
  signal?: AbortSignal,
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

/** @deprecated Use {@link pageSize} or {@link toPageSize}. */
export function clampPageSize(size: number, max = MAX_PAGE_SIZE_VALUE): number {
  return Math.min(Math.max(Math.trunc(size), 1), max);
}

/** Which page, and how big. Replaces a positional `(limit, offset)` pair. */
export interface PageParams {
  /** Zero-based. */
  page: number;
  pageSize: PageSize;
}

/**
 * The page at `start`, walking — and discarding — the pages before it.
 *
 * Reaching page 5 costs five requests: the first four are fetched, parsed and
 * thrown away, and the only thing kept from each is its cursor. That is the
 * price of offset paging on a cursor API, and it is why `useServerList` keeps
 * the cursors instead.
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
async function walkToOffset<T>(
  size: PageSize,
  start: number,
  fetchPage: FetchCursorPage<T>,
  signal?: AbortSignal,
): Promise<PageSlice<T>> {
  let cursor: string | null = null;
  let remaining = start;

  while (remaining > 0) {
    const skipped: CursorPage<T> = await fetchPage(
      toPageSize(Math.min(size, remaining)),
      cursor,
      signal,
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

  const page = await fetchPage(size, cursor, signal);

  // An endpoint that ignores `page_size` and answers with the whole table would
  // otherwise be reported as one enormous page, and `totalHint` would claim a
  // total the table cannot page through. Truncating says "there is more",
  // which is both true and navigable.
  const overflowed = page.items.length > size;
  const items = overflowed ? page.items.slice(0, size) : page.items;

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

/**
 * The page at `params.page`, walking (and discarding) the pages before it.
 *
 * Prefer `useServerList`, which reaches the next page in ONE request by keeping
 * the cursor the current page returned. Reach for this only where a call site is
 * genuinely offset-shaped — an endpoint that pages by offset server-side, or a
 * jump to a page no trail has visited.
 */
export async function fetchSlice<T>(
  params: PageParams,
  fetchPage: FetchCursorPage<T>,
  signal?: AbortSignal,
): Promise<PageSlice<T>> {
  const page = Math.max(0, Math.trunc(params.page));
  return walkToOffset(params.pageSize, page * params.pageSize, fetchPage, signal);
}

/**
 * @deprecated Use {@link fetchSlice}, which takes a {@link PageSize} that cannot
 * be `-1`. This clamps instead, which is how a sentinel became a one-row page.
 */
export async function fetchPageSlice<T>(
  limit: number,
  offset: number,
  fetchPage: FetchCursorPage<T>,
): Promise<PageSlice<T>> {
  return walkToOffset(
    toPageSize(limit),
    Math.max(0, Math.trunc(offset)),
    fetchPage,
  );
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
  signal?: AbortSignal,
): Promise<EveryPageResult<T>> {
  const items: T[] = [];
  let cursor: string | null = null;

  do {
    const page: CursorPage<T> = await fetchPage(MAX_PAGE_SIZE, cursor, signal);
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
