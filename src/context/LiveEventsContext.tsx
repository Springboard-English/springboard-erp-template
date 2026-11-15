import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";

import { LiveEventsHttpError, readLiveEvents, type LiveEvent } from "../api_calls/liveEvents";

/**
 * One live status stream per tab, shared by every screen that asks for a topic.
 *
 * A screen calls `useLiveTopic("submission:<key>", [queryKey])`; the provider
 * keeps one `GET /v2/events` open for the union of topics on screen, and on an
 * event invalidates the queries registered for it, merged into one refetch per
 * second. The stream is open only while some topic is asked for and the tab has
 * not been hidden for a minute; `useLiveTopic` returns whether it is live, so a
 * screen can keep a slow poll as the fallback.
 */

interface LiveEventsContextValue {
    register: (topic: string, keys: readonly QueryKey[]) => () => void;
    connected: boolean;
}

const LiveEventsContext = createContext<LiveEventsContextValue | null>(null);

// A topic-set change reopens the stream once the screen settles.
const REOPEN_DEBOUNCE_MS = 250;
// Invalidations within this window become one refetch per query.
const FLUSH_MS = 1_000;
const HIDDEN_CLOSE_MS = 60_000;
const BACKOFF_MIN_MS = 1_000;
const BACKOFF_MAX_MS = 30_000;

/** The backoff before reconnect attempt `attempt`, jittered so tabs spread out. */
export function reconnectDelayMs(attempt: number, random: () => number = Math.random): number {
    const ceiling = Math.min(BACKOFF_MAX_MS, BACKOFF_MIN_MS * 2 ** attempt);
    return Math.round(ceiling / 2 + random() * (ceiling / 2));
}

/** Holds the tab's live stream; mount once, inside the QueryClientProvider. */
export function LiveEventsProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    // topic -> registration id -> the query keys it refreshes
    const registrations = useRef(new Map<string, Map<number, readonly QueryKey[]>>());
    const nextId = useRef(0);
    const [topicsVersion, setTopicsVersion] = useState(0);
    const [connected, setConnected] = useState(false);
    const [visible, setVisible] = useState(
        () => typeof document === "undefined" || document.visibilityState !== "hidden",
    );

    // Stable for the provider's life: a new identity would re-run every
    // screen's registration, and each re-run would reopen the stream.
    const register = useCallback((topic: string, keys: readonly QueryKey[]) => {
        const id = nextId.current++;
        const byId = registrations.current.get(topic) ?? new Map<number, readonly QueryKey[]>();
        const isNewTopic = byId.size === 0;
        byId.set(id, keys);
        registrations.current.set(topic, byId);
        if (isNewTopic) setTopicsVersion((v) => v + 1);
        return () => {
            byId.delete(id);
            if (byId.size === 0 && registrations.current.get(topic) === byId) {
                registrations.current.delete(topic);
                setTopicsVersion((v) => v + 1);
            }
        };
    }, []);
    const value = useMemo<LiveEventsContextValue>(
        () => ({ register, connected }),
        [register, connected],
    );

    // A tab hidden for a minute drops its stream; coming back reopens it, and
    // the `ready` it gets refetches whatever moved meanwhile.
    useEffect(() => {
        if (typeof document === "undefined") return;
        let timer: number | undefined;
        const onChange = () => {
            window.clearTimeout(timer);
            if (document.visibilityState === "hidden") {
                timer = window.setTimeout(() => setVisible(false), HIDDEN_CLOSE_MS);
            } else {
                setVisible(true);
            }
        };
        document.addEventListener("visibilitychange", onChange);
        return () => {
            window.clearTimeout(timer);
            document.removeEventListener("visibilitychange", onChange);
        };
    }, []);

    useEffect(() => {
        const topics = [...registrations.current.keys()].sort();
        if (topics.length === 0 || !visible) {
            setConnected(false);
            return;
        }
        const controller = new AbortController();
        const pending = new Set<string>();
        let flushTimer: number | undefined;

        const flush = () => {
            flushTimer = undefined;
            for (const raw of pending) {
                void queryClient.invalidateQueries({ queryKey: JSON.parse(raw) as QueryKey });
            }
            pending.clear();
        };
        const queue = (keys: Iterable<readonly QueryKey[]>) => {
            for (const list of keys) for (const key of list) pending.add(JSON.stringify(key));
            if (flushTimer === undefined) flushTimer = window.setTimeout(flush, FLUSH_MS);
        };
        const onEvent = (event: LiveEvent) => {
            if (event.type === "status") {
                queue(registrations.current.get(event.topic)?.values() ?? []);
                return;
            }
            if (event.type === "ready") setConnected(true);
            if (event.type === "ready" || event.type === "resync") {
                for (const byId of registrations.current.values()) queue(byId.values());
            }
        };

        const run = async () => {
            await sleep(REOPEN_DEBOUNCE_MS, controller.signal);
            let attempt = 0;
            while (!controller.signal.aborted) {
                try {
                    await readLiveEvents(topics, onEvent, controller.signal);
                    attempt = 0; // a clean `close`: reconnect straight away
                } catch (error) {
                    if (controller.signal.aborted) return;
                    setConnected(false);
                    // A 4xx other than a rate limit will not mend by retrying soon.
                    const status = error instanceof LiveEventsHttpError ? error.status : 0;
                    const hopeless = status >= 400 && status < 500 && status !== 429;
                    await sleep(
                        hopeless ? BACKOFF_MAX_MS : reconnectDelayMs(attempt++),
                        controller.signal,
                    );
                }
            }
        };
        void run().catch(() => undefined);

        return () => {
            controller.abort();
            window.clearTimeout(flushTimer);
            setConnected(false);
        };
    }, [topicsVersion, visible, queryClient]);

    return <LiveEventsContext.Provider value={value}>{children}</LiveEventsContext.Provider>;
}

/**
 * Refetch `queryKeys` whenever `topic` (`<kind>:<key>`), or any of a list of
 * topics, moves. Pass `null` or an empty list to subscribe to nothing, as
 * while nothing on screen can still change. Returns true while the stream is
 * live, so a screen can slow its fallback poll. Without a
 * `LiveEventsProvider` it does nothing and returns false.
 */
export function useLiveTopic(
    topic: string | readonly string[] | null | undefined,
    queryKeys: readonly QueryKey[],
): boolean {
    const context = useContext(LiveEventsContext);
    const register = context?.register;
    // Keyed by value: callers build these arrays inline on every render.
    const topics = topic == null ? [] : typeof topic === "string" ? [topic] : [...topic];
    const topicsJson = JSON.stringify(topics.filter(Boolean).sort());
    const keysJson = JSON.stringify(queryKeys);
    useEffect(() => {
        if (!register) return;
        const keys = JSON.parse(keysJson) as QueryKey[];
        const releases = (JSON.parse(topicsJson) as string[]).map((t) => register(t, keys));
        return () => {
            for (const release of releases) release();
        };
    }, [register, topicsJson, keysJson]);
    return Boolean(context?.connected && topicsJson !== "[]");
}

/** Resolve after `ms`, or as soon as `signal` aborts. */
function sleep(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve) => {
        if (signal.aborted) return resolve();
        const timer = window.setTimeout(resolve, ms);
        signal.addEventListener(
            "abort",
            () => {
                window.clearTimeout(timer);
                resolve();
            },
            { once: true },
        );
    });
}
