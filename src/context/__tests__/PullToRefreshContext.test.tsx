import { act, fireEvent, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/context/I18nContext";
import { PullToRefreshProvider, usePullToRefresh } from "../PullToRefreshContext";

/** Drags one finger from `fromY` to `toY` on the page and lifts it. */
function pull(fromY: number, toY: number) {
    fireEvent.touchStart(document.body, { touches: [{ clientY: fromY }] });
    fireEvent.touchMove(document.body, { touches: [{ clientY: toY }] });
    fireEvent.touchEnd(document.body, { touches: [] });
}

/** A page that loads through a query and wires nothing for the pull. */
function QueryPage({ fetcher }: { fetcher: () => Promise<string> }) {
    useQuery({ queryKey: ["page"], queryFn: fetcher });
    return null;
}

/** A page whose data lives outside the query cache. */
function CustomPage({ onRefresh }: { onRefresh: () => unknown }) {
    usePullToRefresh(onRefresh);
    return null;
}

function renderWith(children: React.ReactNode, enabled = true) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <I18nProvider>
                <PullToRefreshProvider enabled={enabled}>{children}</PullToRefreshProvider>
            </I18nProvider>
        </QueryClientProvider>,
    );
}

describe("PullToRefreshProvider", () => {
    it("refetches the page's active queries with nothing wired", async () => {
        const fetcher = vi.fn().mockResolvedValue("rows");
        renderWith(<QueryPage fetcher={fetcher} />);
        await act(async () => {});
        expect(fetcher).toHaveBeenCalledTimes(1);

        await act(async () => pull(0, 200));
        expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it("ignores a short pull", async () => {
        const fetcher = vi.fn().mockResolvedValue("rows");
        renderWith(<QueryPage fetcher={fetcher} />);
        await act(async () => {});

        await act(async () => pull(0, 60));
        expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it("runs a registered handler instead of the default", async () => {
        const onRefresh = vi.fn();
        renderWith(<CustomPage onRefresh={onRefresh} />);

        await act(async () => pull(0, 200));
        expect(onRefresh).toHaveBeenCalledTimes(1);
    });

    it("does nothing when turned off", async () => {
        const fetcher = vi.fn().mockResolvedValue("rows");
        renderWith(<QueryPage fetcher={fetcher} />, false);
        await act(async () => {});

        await act(async () => pull(0, 200));
        expect(fetcher).toHaveBeenCalledTimes(1);
        expect(document.documentElement.style.overscrollBehaviorY).toBe("");
    });
});
