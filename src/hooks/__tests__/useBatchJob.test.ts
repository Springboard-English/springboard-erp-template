import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useBatchJob } from "../useBatchJob";

/**
 * The runner is the one piece here with real logic, and every job depends on
 * it: a concurrency bug sends N payrolls twice, a cancel bug keeps firing Zalo
 * messages after someone hits Stop.
 */

type Item = { id: string };

const items = (count: number): Item[] =>
    Array.from({ length: count }, (_, index) => ({ id: `item-${index}` }));

const keyOf = (item: Item) => item.id;

describe("useBatchJob", () => {
    it("runs every item and records each result", async () => {
        const perform = vi.fn(async (item: Item) => `done:${item.id}`);
        const { result } = renderHook(() =>
            useBatchJob<Item, string>(keyOf, perform, { concurrency: 2 }),
        );

        await act(async () => {
            await result.current.run(items(5));
        });

        expect(perform).toHaveBeenCalledTimes(5);
        expect(result.current.progress).toEqual({ done: 5, total: 5 });
        expect(result.current.results["item-3"]).toEqual({
            status: "ok",
            result: "done:item-3",
        });
    });

    it("never exceeds the concurrency limit", async () => {
        let inFlight = 0;
        let peak = 0;
        const perform = vi.fn(async () => {
            inFlight += 1;
            peak = Math.max(peak, inFlight);
            await new Promise((resolve) => setTimeout(resolve, 5));
            inFlight -= 1;
        });

        const { result } = renderHook(() =>
            useBatchJob<Item, void>(keyOf, perform, { concurrency: 3 }),
        );

        await act(async () => {
            await result.current.run(items(12));
        });

        expect(peak).toBe(3);
        expect(perform).toHaveBeenCalledTimes(12);
    });

    it("records a failure without stopping the rest of the run", async () => {
        const failure = Object.assign(new Error("boom"), { status: 404 });
        const perform = vi.fn(async (item: Item) => {
            if (item.id === "item-1") {
                throw failure;
            }
            return "ok";
        });

        const { result } = renderHook(() =>
            useBatchJob<Item, string>(keyOf, perform, { concurrency: 1 }),
        );

        await act(async () => {
            await result.current.run(items(4));
        });

        expect(result.current.results["item-1"]).toEqual({
            status: "failed",
            error: "boom",
            cause: failure,
        });
        expect(result.current.results["item-3"].status).toBe("ok");
        expect(result.current.progress.done).toBe(4);
    });

    it("retries only the failed items", async () => {
        let failFirstPass = true;
        const perform = vi.fn(async (item: Item) => {
            if (item.id === "item-1" && failFirstPass) {
                throw new Error("boom");
            }
            return "ok";
        });

        const all = items(3);
        const { result } = renderHook(() =>
            useBatchJob<Item, string>(keyOf, perform, { concurrency: 1 }),
        );

        await act(async () => {
            await result.current.run(all);
        });
        expect(perform).toHaveBeenCalledTimes(3);

        failFirstPass = false;
        await act(async () => {
            await result.current.retryFailed(all);
        });

        // One more call, not four — re-sending a succeeded item would mean a
        // second Zalo message to a parent who already got one.
        expect(perform).toHaveBeenCalledTimes(4);
        expect(result.current.results["item-1"].status).toBe("ok");
    });

    it("stops dispatching once cancelled", async () => {
        const perform = vi.fn(async () => {
            await new Promise((resolve) => setTimeout(resolve, 5));
        });

        const { result } = renderHook(() =>
            useBatchJob<Item, void>(keyOf, perform, { concurrency: 1 }),
        );

        act(() => {
            void result.current.run(items(20));
        });

        await waitFor(() => expect(perform.mock.calls.length).toBeGreaterThan(0));
        act(() => {
            result.current.cancel();
        });

        await waitFor(() => expect(result.current.isRunning).toBe(false));
        const dispatched = perform.mock.calls.length;

        // Whatever was already in flight finishes, but nothing new starts.
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(perform.mock.calls.length).toBe(dispatched);
        expect(dispatched).toBeLessThan(20);
    });

    it("keeps earlier results when a later run covers other items", async () => {
        const perform = vi.fn(async (item: Item) => `done:${item.id}`);
        const { result } = renderHook(() =>
            useBatchJob<Item, string>(keyOf, perform),
        );

        await act(async () => {
            await result.current.run([{ id: "a" }]);
        });
        await act(async () => {
            await result.current.run([{ id: "b" }]);
        });

        // A tab closed mid-run is the expected failure mode, so the second pass
        // has to still show what the first one managed.
        expect(result.current.results["a"].status).toBe("ok");
        expect(result.current.results["b"].status).toBe("ok");
    });
});
