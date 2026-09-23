import { useCallback, useEffect, useMemo } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
    knownRowCount,
    toPageSize,
    type FetchCursorPage,
    type PageSize,
    DEFAULT_PAGE_SIZE,
} from "../utils/cursorPagination";
import {
    FIRST_PAGE,
    moveToPage,
    readCursorTrail,
    writeCursorTrail,
} from "../utils/cursorTrail";
import { usePersistentFilter } from "../utils/viewFilterState";
import useInfiniteList, { type InfiniteList } from "./useInfiniteList";
import useIsMobile from "./useIsMobile";

// On a phone the table's query is disabled and has no data, so a fresh `[]`
// each render would hand callers a new `rows` every time — and any caller
// syncing it into state through an effect loops forever.
const NO_ROWS: never[] = [];

/**
 * One server-paged list: the desktop table, the phone's infinite list, and the
 * state between them.
 *
 * **It keeps the cursors instead of re-walking them.** An offset read reaches
 * page `p` by fetching and discarding the `p` pages before it, every single
 * time, because the walk lives inside the query function and nothing is
 * remembered between queries. This keeps the cursor each page returned, so Next
 * costs one request and reopening a saved page 3 costs one instead of four.
 *
 * Previous renders instantly either way — the cursor is part of the query key,
 * so the page is still in the cache — but whether it ALSO refetches in the
 * background is the app's `staleTime`, not this hook's doing. lms, erp-crm and
 * erp-ops set 60s and so pay nothing; erp-hrm sets none and will re-request.
 *
 * That works only because `SimpleDataTable`'s footer calls `onPageChange` with
 * `page ± 1` and nothing else — no jump control exists anywhere in the suite, so
 * a trail that can only step forward one page serves every navigation the UI can
 * produce. If a jump control is ever added, this hook has to gain a walk for the
 * unvisited case; it cannot invent a cursor it has never seen.
 */
export interface UseServerListOptions<T> {
    /**
     * The list's invalidation prefix.
     *
     * Slot 0 MUST be the exact resource string every mutation already passes to
     * `invalidateQueries` — nothing in this suite uses `exact: true`, so a key
     * that does not start with it is simply never refetched. Pin whatever else
     * the app pins after it (several lists key on `user?.username` or an
     * `accountType`, and their invalidations name that slot), then the filters.
     *
     * This hook APPENDS the page size and the cursor. It never prepends, and it
     * never reorders what you passed.
     */
    queryKey: readonly unknown[];

    /** The resource's page closure, already bound to its filters. */
    fetchPage: FetchCursorPage<T>;

    /**
     * sessionStorage scope for the page and the page size, so opening a row from
     * page 3 and coming back lands on page 3 — for ONE request, not four.
     *
     * Opt in per view. A table someone navigates away from expecting a reset
     * will be surprised to find it where they left it.
     */
    scope?: string;

    defaultPageSize?: PageSize;

    /**
     * The caller's gate, in full. Real ones in use include `!isMobile`,
     * `!isMobile && Boolean(testKey) && tab === "sessions"`, and permission
     * checks — so this is a predicate the caller computes, not something the
     * hook can work out.
     */
    enabled?: boolean;

    /**
     * Keep the previous page on screen under the skeleton while the next loads.
     *
     * Defaults FALSE because most tables in the suite blank between pages today,
     * and quietly changing that everywhere is a bigger surprise than leaving it.
     * Pass `true` for a new table; it is the better behaviour.
     */
    keepPreviousPage?: boolean;

    /**
     * Also drive a phone list from the same key and closure.
     *
     * Only ONE surface ever fetches: the numbered-page query is suppressed on a
     * phone and the infinite list is suppressed off it, on `useIsMobile`. Pass
     * `false` for a table that has no phone list at all — a detail panel, say —
     * and nothing but the paged query runs.
     */
    mobile?: boolean;
}

export interface ServerList<T> {
    /**
     * The page's rows, as the fetcher returned them. The hook deliberately does
     * NOT own row identity: several tables synthesise a fallback key, and one
     * app holds edit-mode snapshots keyed by row, so `rowKey` stays the
     * caller's.
     */
    rows: T[];
    /**
     * The error OBJECT, not a message — call sites narrow on `ApiError`, on
     * `.status`, and on a permission-denied predicate.
     */
    error: Error | null;
    isLoading: boolean;
    isFetching: boolean;
    refetch: () => void;

    page: number;
    pageSize: PageSize;
    /** Call from a filter's onChange; the trail restarts at page 1. */
    resetPage: () => void;

    /** Spread onto `SimpleDataTable`, or onto an app's own table wrapper. */
    tableProps: {
        paginationMode: "server";
        page: number;
        pageSize: number;
        totalRowCount: number;
        loading: boolean;
        onPageChange: (page: number) => void;
        onPageSizeChange: (pageSize: number) => void;
    };

    /** The phone's copy, walked forward. Pass to `MobileCardList`. */
    mobile: InfiniteList<T>;
}

export default function useServerList<T>({
    queryKey,
    fetchPage,
    scope,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    enabled = true,
    keepPreviousPage = false,
    mobile = true,
}: UseServerListOptions<T>): ServerList<T> {
    // A scope-less list still needs somewhere to hold its trail; `usePersistentFilter`
    // over a per-instance scope keeps it in memory for the mount and no longer.
    const storageScope = scope ?? "";
    const [storedSize, setStoredSize] = usePersistentFilter(
        storageScope,
        "size",
        defaultPageSize as number,
    );
    const [storedTrail, setStoredTrail] = usePersistentFilter(storageScope, "cursors", "");

    const pageSize = toPageSize(storedSize, defaultPageSize);

    // The fingerprint a trail is only valid under. A cursor is minted against
    // one filter set and one page size, and the API refuses one replayed against
    // another — so a trail whose fingerprint no longer matches reads as page 1.
    const filter = useMemo(
        () => JSON.stringify([queryKey, pageSize]),
        [queryKey, pageSize],
    );

    const cursors = readCursorTrail(storedTrail, filter);
    const page = cursors.length - 1;
    const cursor = cursors[page];

    // Which surface is on screen. Both are mounted — the table is `hidden
    // md:block` and the card list the reverse — so without this BOTH would
    // fetch page one, doubling the request every list makes on open. Every
    // hand-rolled pair this hook replaced gated on exactly this.
    const isMobile = useIsMobile();
    const showMobile = mobile && isMobile;

    const query = useQuery({
        queryKey: [...queryKey, pageSize, cursor],
        queryFn: ({ signal }) => fetchPage(pageSize, cursor, signal),
        enabled: enabled && !showMobile,
        ...(keepPreviousPage ? { placeholderData: keepPreviousData } : {}),
    });

    const settled = query.isPlaceholderData ? undefined : query.data;
    // An empty page carrying a cursor would otherwise offer Next forever.
    const nextCursor = settled?.items.length ? settled.nextCursor : null;

    // The first page needs no trail, so nothing is stored for it — which also
    // clears a trail left behind by filters that have since changed.
    useEffect(() => {
        if (page === 0 && storedTrail !== "") setStoredTrail("");
    }, [page, storedTrail, setStoredTrail]);

    // A restored page can be gone by the time it is asked for again: rows deleted
    // under it, or a cursor the server no longer accepts. Step back rather than
    // strand the table on an empty page whose only way out is Previous. A 5xx is
    // NOT this — it is transient, and stepping back would hide the retry.
    const status = (query.error as { status?: number } | null)?.status;
    const pageGone =
        page > 0 &&
        ((settled !== undefined && settled.items.length === 0) ||
            (typeof status === "number" && status >= 400 && status < 500));

    useEffect(() => {
        if (!pageGone) return;
        const back = readCursorTrail(storedTrail, filter).slice(0, -1);
        setStoredTrail(back.length > 1 ? writeCursorTrail(filter, back) : "");
    }, [pageGone, storedTrail, filter, setStoredTrail]);

    const onPageChange = useCallback(
        (target: number) => {
            const next = moveToPage(cursors, target, nextCursor);
            if (next === cursors) return;
            setStoredTrail(next.length > 1 ? writeCursorTrail(filter, next) : "");
        },
        [cursors, nextCursor, filter, setStoredTrail],
    );

    const onPageSizeChange = useCallback(
        (next: number) => {
            // A cursor is minted against a page size, so changing it invalidates
            // every cursor already walked.
            setStoredSize(toPageSize(next, defaultPageSize) as number);
            setStoredTrail("");
        },
        [setStoredSize, setStoredTrail, defaultPageSize],
    );

    const resetPage = useCallback(() => setStoredTrail(""), [setStoredTrail]);

    // The phone walks forward by CURSOR, not by page index. Every hand-rolled
    // mobile list in the suite pages by index through an offset read, so
    // scrolling N pages costs N(N+1)/2 requests; this costs N.
    const mobileList = useInfiniteList<T, string>({
        queryKey: [...queryKey, pageSize, "infinite"],
        enabled: enabled && showMobile,
        initialPageParam: null,
        fetchPage: async ({ pageParam, signal }) => {
            const result = await fetchPage(pageSize, pageParam, signal);
            return {
                items: result.items,
                // The fetcher's own answer, not `items.length < pageSize` — a
                // short page can carry a cursor, and a FAILED page would read as
                // the end of the list.
                nextPageParam: result.items.length ? result.nextCursor : null,
            };
        },
    });

    const rows = query.data?.items ?? NO_ROWS;

    return {
        rows,
        error: query.error,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        refetch: () => void query.refetch(),
        page,
        pageSize,
        resetPage,
        tableProps: {
            paginationMode: "server",
            page,
            pageSize,
            totalRowCount: knownRowCount(
                page,
                pageSize,
                rows.length,
                // While a page loads, the one before it is known to have had a
                // next — otherwise Next would flicker off mid-fetch.
                nextCursor !== null || query.isPlaceholderData,
            ),
            loading: query.isLoading || query.isPlaceholderData,
            onPageChange,
            onPageSizeChange,
        },
        mobile: mobileList,
    };
}

export { FIRST_PAGE };
