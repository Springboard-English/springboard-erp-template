import { describe, expect, it, vi } from "vitest";
import {
  fetchEveryPage,
  fetchPageSlice,
  knownRowCount,
  type CursorPage,
} from "../cursorPagination";

/**
 * The tables ask for page 3; the API only knows "the page after this cursor".
 * Getting the walk between those two wrong shows a table someone then selects
 * rows from — a silently short page here is a batch job that skips people.
 */

/** A fake listing of `total` rows, paged the way the v2 endpoints page. */
function listing(total: number) {
  const rows = Array.from({ length: total }, (_, index) => ({ id: index }));

  return vi.fn(
    async (pageSize: number, cursor: string | null): Promise<CursorPage<{ id: number }>> => {
      const start = cursor ? Number(cursor) : 0;
      const items = rows.slice(start, start + pageSize);
      const next = start + items.length;

      return {
        items,
        nextCursor: next < rows.length ? String(next) : null,
      };
    },
  );
}

describe("fetchPageSlice", () => {
  it("returns the first page without walking any cursors", async () => {
    const fetchPage = listing(100);

    const slice = await fetchPageSlice(25, 0, fetchPage);

    expect(fetchPage).toHaveBeenCalledTimes(1);
    expect(slice.items.map((row) => row.id)).toEqual(
      Array.from({ length: 25 }, (_, index) => index),
    );
    expect(slice.hasMore).toBe(true);
  });

  it("walks cursors to reach a later page", async () => {
    const fetchPage = listing(100);

    const slice = await fetchPageSlice(25, 50, fetchPage);

    // Two pages skipped, then the one asked for.
    expect(fetchPage).toHaveBeenCalledTimes(3);
    expect(slice.items[0].id).toBe(50);
    expect(slice.items).toHaveLength(25);
  });

  it("reports the exact row count once the last page is in hand", async () => {
    const slice = await fetchPageSlice(25, 50, listing(60));

    expect(slice.items).toHaveLength(10);
    expect(slice.hasMore).toBe(false);
    // 50 skipped + 10 returned, and no invented total beyond that.
    expect(slice.totalHint).toBe(60);
  });

  it("keeps the next page reachable while more rows exist", async () => {
    const slice = await fetchPageSlice(25, 0, listing(100));

    expect(slice.hasMore).toBe(true);
    // One past the current page, which is the least that leaves "next"
    // clickable without claiming to know the total.
    expect(slice.totalHint).toBe(26);
  });

  it("comes back empty rather than looping when the offset is past the end", async () => {
    const fetchPage = listing(30);

    const slice = await fetchPageSlice(25, 200, fetchPage);

    expect(slice.items).toEqual([]);
    expect(slice.hasMore).toBe(false);
  });

  it("clamps the page size to what the endpoint accepts", async () => {
    const fetchPage = listing(500);

    await fetchPageSlice(1000, 0, fetchPage);

    expect(fetchPage).toHaveBeenCalledWith(200, null);
  });

  // The regression that made this a shared module. erp-crm and erp-hrm both
  // guarded the walk with `!cursor && remainingOffset > 0`, which does not fire
  // when the skip loop lands exactly on the end: the final fetch then went out
  // with a null cursor, the API restarted at page one, and its rows were shown
  // as the last page's. Any list whose count is an exact multiple of the page
  // size reached it, and the row count left "next" enabled to lead users there.
  it("does not restart at page one when the offset lands exactly at the end", async () => {
    const fetchPage = listing(20);

    const slice = await fetchPageSlice(10, 20, fetchPage);

    expect(slice.items).toEqual([]);
    expect(slice.hasMore).toBe(false);

    // The proof, not just the symptom: the first page is requested once, during
    // the walk. A second call with no cursor IS the bug.
    const cursorlessCalls = fetchPage.mock.calls.filter(([, cursor]) => cursor === null);
    expect(cursorlessCalls).toHaveLength(1);
  });

  it("keeps paging when a short page still carries a cursor", async () => {
    // The API trims a page by authorization after filling it, so a short page
    // with more behind it is possible in principle. Ending the list on length
    // alone would hide every row past it.
    const fetchPage = vi.fn(
      async (_pageSize: number, cursor: string | null): Promise<CursorPage<{ id: number }>> =>
        cursor === null
          ? { items: [{ id: 1 }, { id: 2 }], nextCursor: "more" }
          : { items: [{ id: 3 }], nextCursor: null },
    );

    const slice = await fetchPageSlice(10, 0, fetchPage);

    expect(slice.items).toHaveLength(2);
    expect(slice.hasMore).toBe(true);
  });

  it("truncates an endpoint that ignores page_size instead of reporting one huge page", async () => {
    const rows = Array.from({ length: 50 }, (_, index) => ({ id: index }));
    const fetchPage = vi.fn(async (): Promise<CursorPage<{ id: number }>> => ({
      items: rows,
      nextCursor: null,
    }));

    const slice = await fetchPageSlice(10, 0, fetchPage);

    expect(slice.items).toHaveLength(10);
    // Truncated means there is more, whatever the absent cursor claims.
    expect(slice.hasMore).toBe(true);
    expect(slice.totalHint).toBe(11);
  });
});

describe("fetchEveryPage", () => {
  it("collects every page", async () => {
    const result = await fetchEveryPage(listing(450));

    expect(result.items).toHaveLength(450);
    expect(result.truncated).toBe(false);
  });

  it("stops at the cap and says so, rather than returning a short list quietly", async () => {
    const result = await fetchEveryPage(listing(1000), 300);

    expect(result.items).toHaveLength(300);
    expect(result.truncated).toBe(true);
  });

  it("is not truncated when the cap lands exactly on the last row", async () => {
    const result = await fetchEveryPage(listing(400), 400);

    expect(result.items).toHaveLength(400);
    expect(result.truncated).toBe(false);
  });
});

describe("knownRowCount", () => {
  it("agrees with a slice's totalHint on a full page", async () => {
    const slice = await fetchPageSlice(25, 0, listing(100));

    expect(knownRowCount(0, 25, slice.items.length, slice.hasMore)).toBe(slice.totalHint);
  });

  it("is exact on the last page", async () => {
    const slice = await fetchPageSlice(25, 50, listing(60));

    expect(knownRowCount(2, 25, slice.items.length, slice.hasMore)).toBe(60);
  });

  it("is tighter than the page-size guess on a partial page", () => {
    // The "+1" strategy the apps used would say 2 * 25 + 25 + 1 = 76 here.
    expect(knownRowCount(2, 25, 10, true)).toBe(61);
  });

  it("uses a server total when the endpoint provides one", () => {
    expect(knownRowCount(2, 25, 10, true, 137)).toBe(137);
    // Zero is a real total, not a missing one.
    expect(knownRowCount(0, 25, 0, false, 0)).toBe(0);
  });

  it("ignores a null or absent total", () => {
    expect(knownRowCount(1, 10, 10, true, null)).toBe(21);
    expect(knownRowCount(1, 10, 10, true, undefined)).toBe(21);
  });
});
