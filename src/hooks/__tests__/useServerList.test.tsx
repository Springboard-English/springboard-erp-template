import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import useServerList from "../useServerList";
import { pageSize, type CursorPage, type PageSize } from "../../utils/cursorPagination";

/**
 * The trail and its two recovery effects are the subtlest code in this package,
 * and they are the part an app cannot easily test for itself. The value of the
 * trail is a request COUNT, so most of these assert how many trips were made.
 */

const SIZE: PageSize = pageSize(25);

/** A listing of `total` rows whose cursor is just the next row's index. */
function listing(total: number) {
    return vi.fn(
        async (size: PageSize, cursor: string | null): Promise<CursorPage<{ id: number }>> => {
            const start = cursor ? Number(cursor) : 0;
            const end = Math.min(start + size, total);
            return {
                items: Array.from({ length: Math.max(0, end - start) }, (_, i) => ({
                    id: start + i,
                })),
                nextCursor: end < total ? String(end) : null,
            };
        },
    );
}

function wrapper() {
    // Matches what lms, erp-crm and erp-ops configure globally, and both values
    // matter to the assertions below. `gcTime` decides whether the previous page
    // is still in the cache at all; `staleTime` decides whether looking at it
    // again ALSO fires a background refetch. erp-hrm sets neither, so Back there
    // re-requests in the background — it still renders instantly from cache.
    const client = new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 5 * 60_000, staleTime: 60_000 },
        },
    });
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
}

function renderList(fetchPage: ReturnType<typeof listing>, options = {}) {
    return renderHook(
        () =>
            useServerList({
                queryKey: ["rows"],
                fetchPage,
                defaultPageSize: SIZE,
                mobile: false,
                ...options,
            }),
        { wrapper: wrapper() },
    );
}

beforeEach(() => {
    sessionStorage.clear();
});

describe("useServerList", () => {
    it("asks for the first page with no cursor", async () => {
        const fetchPage = listing(100);
        const { result } = renderList(fetchPage);

        await waitFor(() => expect(result.current.rows).toHaveLength(25));
        expect(fetchPage).toHaveBeenCalledTimes(1);
        expect(fetchPage.mock.calls[0]?.[1]).toBeNull();
        expect(result.current.page).toBe(0);
    });

    // The whole point of the trail. An offset read reaches page 1 in two
    // requests and page 3 in four; this is one apiece, every time.
    it("reaches the next page in ONE request, using the cursor it was given", async () => {
        const fetchPage = listing(100);
        const { result } = renderList(fetchPage);

        await waitFor(() => expect(result.current.rows).toHaveLength(25));
        act(() => result.current.tableProps.onPageChange(1));
        await waitFor(() => expect(result.current.rows[0]?.id).toBe(25));

        expect(fetchPage).toHaveBeenCalledTimes(2);
        expect(fetchPage.mock.calls[1]?.[1]).toBe("25");
    });

    it("goes back without asking the server again", async () => {
        const fetchPage = listing(100);
        const { result } = renderList(fetchPage);

        await waitFor(() => expect(result.current.rows).toHaveLength(25));
        act(() => result.current.tableProps.onPageChange(1));
        await waitFor(() => expect(result.current.rows[0]?.id).toBe(25));

        const afterForward = fetchPage.mock.calls.length;
        act(() => result.current.tableProps.onPageChange(0));
        await waitFor(() => expect(result.current.rows[0]?.id).toBe(0));

        // The cursor is part of the query key, so page 0 is still cached — and
        // within `staleTime` it is not re-requested either.
        expect(fetchPage).toHaveBeenCalledTimes(afterForward);
    });

    it("will not move forward without a cursor to move with", async () => {
        const fetchPage = listing(10); // one short page, no next cursor
        const { result } = renderList(fetchPage);

        await waitFor(() => expect(result.current.rows).toHaveLength(10));
        act(() => result.current.tableProps.onPageChange(1));

        expect(result.current.page).toBe(0);
        expect(fetchPage).toHaveBeenCalledTimes(1);
    });

    it("steps back when a restored page has gone empty", async () => {
        // Page 1 exists on the first pass and is empty on the next, as it would
        // be if the rows under it were deleted.
        let total = 50;
        const fetchPage = vi.fn(
            async (size: PageSize, cursor: string | null): Promise<CursorPage<{ id: number }>> => {
                const start = cursor ? Number(cursor) : 0;
                const end = Math.min(start + size, total);
                return {
                    items: Array.from({ length: Math.max(0, end - start) }, (_, i) => ({
                        id: start + i,
                    })),
                    nextCursor: end < total ? String(end) : null,
                };
            },
        );

        const { result } = renderList(fetchPage as never);
        await waitFor(() => expect(result.current.rows).toHaveLength(25));
        act(() => result.current.tableProps.onPageChange(1));
        await waitFor(() => expect(result.current.page).toBe(1));

        total = 0;
        act(() => result.current.refetch());

        await waitFor(() => expect(result.current.page).toBe(0));
    });

    it("resets to the first page when the page size changes", async () => {
        const fetchPage = listing(100);
        const { result } = renderList(fetchPage);

        await waitFor(() => expect(result.current.rows).toHaveLength(25));
        act(() => result.current.tableProps.onPageChange(1));
        await waitFor(() => expect(result.current.page).toBe(1));

        // A cursor is minted against a page size, so every cursor already walked
        // is invalid the moment it changes.
        act(() => result.current.tableProps.onPageSizeChange(50));
        await waitFor(() => expect(result.current.pageSize).toBe(50));
        expect(result.current.page).toBe(0);
    });

    it("clamps a nonsense page size rather than throwing in a render", async () => {
        const fetchPage = listing(100);
        const { result } = renderList(fetchPage);

        await waitFor(() => expect(result.current.rows).toHaveLength(25));
        act(() => result.current.tableProps.onPageSizeChange(-1));

        await waitFor(() => expect(result.current.pageSize).toBe(1));
    });

    it("fetches nothing while disabled", async () => {
        const fetchPage = listing(100);
        const { result } = renderList(fetchPage, { enabled: false });

        // Not `isLoading`: a disabled query is pending but not fetching, so v5
        // reports `isLoading: false`. What matters is that nothing went out.
        await waitFor(() => expect(result.current.isFetching).toBe(false));
        expect(fetchPage).not.toHaveBeenCalled();
        expect(result.current.rows).toEqual([]);
    });

    it("hands back the error object, not a message", async () => {
        const failure = Object.assign(new Error("nope"), { status: 403 });
        const fetchPage = vi.fn(async () => {
            throw failure;
        });

        const { result } = renderList(fetchPage as never);

        await waitFor(() => expect(result.current.error).toBe(failure));
        expect((result.current.error as { status?: number }).status).toBe(403);
    });

    it("counts one past the page while more exist, and exactly on the last", async () => {
        const fetchPage = listing(30);
        const { result } = renderList(fetchPage);

        await waitFor(() => expect(result.current.rows).toHaveLength(25));
        expect(result.current.tableProps.totalRowCount).toBe(26);

        act(() => result.current.tableProps.onPageChange(1));
        await waitFor(() => expect(result.current.rows).toHaveLength(5));
        expect(result.current.tableProps.totalRowCount).toBe(30);
    });

    it("remembers the page under a scope, and reopens it in one request", async () => {
        const first = listing(100);
        const { result, unmount } = renderList(first, { scope: "rows-table" });

        await waitFor(() => expect(result.current.rows).toHaveLength(25));
        act(() => result.current.tableProps.onPageChange(1));
        await waitFor(() => expect(result.current.page).toBe(1));
        unmount();

        // A fresh mount, a fresh query cache: the trail is the only thing that
        // survives, and it is what makes this ONE request instead of two.
        const second = listing(100);
        const { result: reopened } = renderList(second, { scope: "rows-table" });

        await waitFor(() => expect(reopened.current.rows[0]?.id).toBe(25));
        expect(second).toHaveBeenCalledTimes(1);
        expect(second.mock.calls[0]?.[1]).toBe("25");
    });

    /**
     * Both surfaces are always MOUNTED — the table is `hidden md:block` and the
     * card list the reverse — so the only thing keeping them from both fetching
     * is the viewport gate. Without it every list in the suite opens with two
     * requests for page one instead of one.
     */
    describe("only one surface fetches", () => {
        function setViewport(isMobile: boolean) {
            window.matchMedia = ((query: string) =>
                ({
                    matches: isMobile,
                    media: query,
                    onchange: null,
                    addListener: () => undefined,
                    removeListener: () => undefined,
                    addEventListener: () => undefined,
                    removeEventListener: () => undefined,
                    dispatchEvent: () => false,
                }) as MediaQueryList) as typeof window.matchMedia;
        }

        it("leaves the phone list alone on a desktop", async () => {
            setViewport(false);
            const fetchPage = listing(100);
            const { result } = renderList(fetchPage, { mobile: true });

            await waitFor(() => expect(result.current.rows).toHaveLength(25));
            expect(fetchPage).toHaveBeenCalledTimes(1);
            expect(result.current.mobile.rows).toHaveLength(0);
        });

        it("leaves the numbered pages alone on a phone", async () => {
            setViewport(true);
            const fetchPage = listing(100);
            const { result } = renderList(fetchPage, { mobile: true });

            await waitFor(() =>
                expect(result.current.mobile.rows).toHaveLength(25),
            );
            expect(fetchPage).toHaveBeenCalledTimes(1);
            expect(result.current.rows).toHaveLength(0);
        });

        // The caller's gate is the whole list's, not just the table's: it is
        // how a tabbed view keeps a list it is not showing from fetching.
        it("fetches neither while the caller's gate is closed", async () => {
            setViewport(true);
            const fetchPage = listing(100);
            renderList(fetchPage, { mobile: true, enabled: false });

            await new Promise((resolve) => setTimeout(resolve, 20));
            expect(fetchPage).not.toHaveBeenCalled();
        });
    });
});
