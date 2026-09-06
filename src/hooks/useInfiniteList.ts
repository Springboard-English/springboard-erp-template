import { useCallback, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

/**
 * One page of a list, as the caller's fetcher returns it.
 *
 * `nextPageParam` is whatever the fetcher wants handed back to ask for the
 * page after this one — a cursor string for a cursor API, `page + 1` for an
 * offset one. `null` means this is the last page.
 *
 * Deliberately the caller's answer rather than something inferred here. The
 * old shape guessed with `rows.length === pageSize`, which is wrong whenever a
 * fetch fails: the rows come back empty, the guess says "no more", and the
 * list tells the reader it has reached the end of a list it is halfway
 * through.
 */
export interface InfiniteListPage<T, TPageParam = unknown> {
    items: T[];
    nextPageParam?: TPageParam | null;
}

export interface UseInfiniteListOptions<T, TPageParam = unknown> {
    /** Must NOT include the page — the pages live inside one cache entry. */
    queryKey: readonly unknown[];
    fetchPage: (context: {
        pageParam: TPageParam | null;
        signal: AbortSignal;
    }) => Promise<InfiniteListPage<T, TPageParam>>;
    /** Page param for the first page; `null` for "start from the beginning". */
    initialPageParam?: TPageParam | null;
    /** Off on desktop, where the paged table is the surface in use. */
    enabled?: boolean;
}

export interface InfiniteList<T> {
    rows: T[];
    /** True for the first load and for each subsequent page. */
    loading: boolean;
    hasMore: boolean;
    loadMore: () => void;
    /** Set when the first load or any page failed. */
    error: Error | null;
    retry: () => void;
}

/**
 * Infinite list state, backed by the query cache rather than by component
 * state.
 *
 * This replaces a hand-rolled accumulation that every call site had to feed
 * correctly: merge pages by key, rebuild them when a filter changed (a
 * `resetKey` the caller had to remember to pass), compute `hasMore`, and hold a
 * "already asked for this" guard. Changing `queryKey` resets the pages here, so
 * the filter case cannot be forgotten, and a failed page is retried at the same
 * page param instead of the list skipping past it.
 */
export function useInfiniteList<T, TPageParam = unknown>({
    queryKey,
    fetchPage,
    initialPageParam = null,
    enabled = true,
}: UseInfiniteListOptions<T, TPageParam>): InfiniteList<T> {
    const query = useInfiniteQuery({
        queryKey,
        enabled,
        initialPageParam: initialPageParam as TPageParam | null,
        queryFn: ({ pageParam, signal }) =>
            fetchPage({ pageParam: pageParam as TPageParam | null, signal }),
        getNextPageParam: (lastPage: InfiniteListPage<T, TPageParam>) =>
            lastPage.nextPageParam ?? undefined,
    });

    const rows = useMemo(
        () => (query.data?.pages ?? []).flatMap((page) => page.items),
        [query.data],
    );

    const loadMore = useCallback(() => {
        // Guarding here rather than in the list: asking twice for the same page
        // is the caller's mistake to avoid, and react-query already knows
        // whether a fetch is in flight.
        if (query.hasNextPage && !query.isFetchingNextPage) {
            void query.fetchNextPage();
        }
    }, [query]);

    const retry = useCallback(() => {
        if (query.isError && rows.length === 0) {
            void query.refetch();
            return;
        }
        void query.fetchNextPage();
    }, [query, rows.length]);

    return {
        rows,
        loading: query.isLoading || query.isFetchingNextPage,
        hasMore: Boolean(query.hasNextPage),
        loadMore,
        error: (query.error as Error | null) ?? null,
        retry,
    };
}

export default useInfiniteList;
