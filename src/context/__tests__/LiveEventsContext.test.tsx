import { act, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { createSseParser, liveEventsUrl, toLiveEvent } from "../../api_calls/liveEvents";
import { LiveEventsProvider, reconnectDelayMs, useLiveTopic } from "../LiveEventsContext";

describe("createSseParser", () => {
    it("joins frames split across chunks and skips comments", () => {
        const parse = createSseParser();
        expect(parse("retry: 3000\n\nevent: ready\nda")).toEqual([]);
        expect(parse('ta: {"topics":"a"}\n\n: ping\n\nevent: status\r\ndata: {"topic":"class:k","status":"x"}\r\n\r\n')).toEqual([
            { event: "ready", data: '{"topics":"a"}' },
            { event: "status", data: '{"topic":"class:k","status":"x"}' },
        ]);
    });

    it("types the frames it knows and drops the rest", () => {
        expect(toLiveEvent({ event: "resync", data: "{}" })).toEqual({ type: "resync" });
        expect(toLiveEvent({ event: "status", data: '{"topic":"t","status":null}' })).toEqual({
            type: "status",
            topic: "t",
            status: null,
        });
        expect(toLiveEvent({ event: "status", data: "nope" })).toBeNull();
        expect(toLiveEvent({ event: "other", data: "" })).toBeNull();
    });

    it("repeats the topic parameter", () => {
        expect(liveEventsUrl(["a:1", "b:2"])).toMatch(/\/v2\/events\?topic=a%3A1&topic=b%3A2$/);
    });
});

describe("reconnectDelayMs", () => {
    it("doubles up to a ceiling and keeps at least half of it", () => {
        expect(reconnectDelayMs(0, () => 0)).toBe(500);
        expect(reconnectDelayMs(0, () => 1)).toBe(1000);
        expect(reconnectDelayMs(20, () => 1)).toBe(30_000);
    });
});

/** A fetch whose stream the test writes into. */
function streamingFetch() {
    const encoder = new TextEncoder();
    const streams: ReadableStreamDefaultController<Uint8Array>[] = [];
    const urls: string[] = [];
    const fetchMock = vi.fn(async (url: string) => {
        urls.push(url);
        const body = new ReadableStream<Uint8Array>({ start: (c) => void streams.push(c) });
        return new Response(body, { status: 200, headers: { "Content-Type": "text/event-stream" } });
    });
    const send = (text: string) => streams[streams.length - 1].enqueue(encoder.encode(text));
    return { fetchMock, send, urls, opened: () => streams.length };
}

describe("LiveEventsProvider", () => {
    let client: QueryClient;
    let fake: ReturnType<typeof streamingFetch>;

    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        fake = streamingFetch();
        vi.stubGlobal("fetch", fake.fetchMock);
        client = new QueryClient();
    });
    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    function Screen({ topic, live }: { topic: string | null; live: (v: boolean) => void }) {
        live(useLiveTopic(topic, [["submission", "k"]]));
        return null;
    }

    function mount(node: ReactNode) {
        return render(
            <QueryClientProvider client={client}>
                <LiveEventsProvider>{node}</LiveEventsProvider>
            </QueryClientProvider>,
        );
    }

    it("opens one stream, goes live on ready, and invalidates the topic's queries once", async () => {
        const spy = vi.spyOn(client, "invalidateQueries");
        const seen: boolean[] = [];
        mount(<Screen topic="submission:k" live={(v) => seen.push(v)} />);

        await act(() => vi.advanceTimersByTimeAsync(300));
        expect(fake.opened()).toBe(1);
        expect(fake.urls[0]).toContain("topic=submission%3Ak");

        await act(async () => {
            fake.send('event: ready\ndata: {"topics":"submission:k"}\n\n');
            await vi.advanceTimersByTimeAsync(10);
        });
        expect(seen[seen.length - 1]).toBe(true);

        await act(async () => {
            fake.send('event: status\ndata: {"topic":"submission:k","status":"ready"}\n\n');
            fake.send('event: status\ndata: {"topic":"submission:k","status":"ready"}\n\n');
            await vi.advanceTimersByTimeAsync(1_100);
        });
        // `ready` and two statuses inside one second: one refetch.
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ queryKey: ["submission", "k"] });
        expect(fake.opened()).toBe(1);
    });

    it("opens nothing while no topic is asked for", async () => {
        mount(<Screen topic={null} live={() => undefined} />);
        await act(() => vi.advanceTimersByTimeAsync(1_000));
        expect(fake.opened()).toBe(0);
    });

    it("is a no-op without a provider", () => {
        let live: boolean | undefined;
        function Bare() {
            live = useLiveTopic("class:k", [["k"]]);
            return null;
        }
        render(<Bare />);
        expect(live).toBe(false);
    });
});
