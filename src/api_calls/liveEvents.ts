import { API_CONFIG } from "../config/api";
import { fetchWithRefresh } from "./fetchWithRefresh";

/**
 * The API's live status stream, `GET /v2/events`, read with `fetch`.
 *
 * Not `EventSource`: the access token lives in memory and rides an
 * Authorization header, which `EventSource` cannot send. An event only says a
 * row moved; the screen refetches it through its own GET.
 */

/** One server-sent event the API sends. */
export type LiveEvent =
    | { type: "ready" }
    | { type: "resync" }
    | { type: "close" }
    | { type: "status"; topic: string; status: string | null };

/** A frame as the wire spells it: the `event:` name and the joined `data:` lines. */
interface RawFrame {
    event: string;
    data: string;
}

/**
 * An incremental SSE parser: feed it decoded text as it arrives, get back the
 * frames completed so far. A frame ends at a blank line; comments (`:`) and
 * `retry:`/`id:` fields are skipped.
 */
export function createSseParser(): (chunk: string) => RawFrame[] {
    let buffer = "";
    return (chunk) => {
        buffer += chunk.replace(/\r\n?/g, "\n");
        const frames: RawFrame[] = [];
        let end = buffer.indexOf("\n\n");
        while (end !== -1) {
            const block = buffer.slice(0, end);
            buffer = buffer.slice(end + 2);
            let event = "message";
            const data: string[] = [];
            for (const line of block.split("\n")) {
                if (line.startsWith(":")) continue;
                const colon = line.indexOf(":");
                const field = colon === -1 ? line : line.slice(0, colon);
                const value = colon === -1 ? "" : line.slice(colon + 1).replace(/^ /, "");
                if (field === "event") event = value;
                else if (field === "data") data.push(value);
            }
            if (data.length > 0 || event !== "message") frames.push({ event, data: data.join("\n") });
            end = buffer.indexOf("\n\n");
        }
        return frames;
    };
}

/** A raw frame as a typed event; null for a frame this client does not know. */
export function toLiveEvent(frame: RawFrame): LiveEvent | null {
    switch (frame.event) {
        case "ready":
        case "resync":
        case "close":
            return { type: frame.event };
        case "status": {
            try {
                const data = JSON.parse(frame.data) as { topic?: unknown; status?: unknown };
                if (typeof data.topic !== "string") return null;
                return {
                    type: "status",
                    topic: data.topic,
                    status: typeof data.status === "string" ? data.status : null,
                };
            } catch {
                return null;
            }
        }
        default:
            return null;
    }
}

/** The stream URL for these topics. */
export function liveEventsUrl(topics: readonly string[]): string {
    const query = new URLSearchParams();
    for (const topic of topics) query.append("topic", topic);
    return `${API_CONFIG.baseURL}/v2/events?${query.toString()}`;
}

/**
 * Open one stream and hand each event to `onEvent` until it ends or `signal`
 * aborts. Resolves when the server closes it; rejects on an HTTP error (with
 * the status) or a dropped connection, so the caller decides when to retry.
 */
export async function readLiveEvents(
    topics: readonly string[],
    onEvent: (event: LiveEvent) => void,
    signal: AbortSignal,
): Promise<void> {
    const response = await fetchWithRefresh(liveEventsUrl(topics), {
        headers: { Accept: "text/event-stream" },
        signal,
    });
    if (!response.ok || !response.body) {
        throw new LiveEventsHttpError(response.status);
    }
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    const parse = createSseParser();
    for (;;) {
        const { value, done } = await reader.read();
        if (done) return;
        for (const frame of parse(value)) {
            const event = toLiveEvent(frame);
            if (event) onEvent(event);
        }
    }
}

/** The stream answered an HTTP error; `status` says which. */
export class LiveEventsHttpError extends Error {
    readonly status: number;

    /** An error for an HTTP `status` the stream answered. */
    constructor(status: number) {
        super(`The live events stream answered ${status}.`);
        this.name = "LiveEventsHttpError";
        this.status = status;
    }
}
