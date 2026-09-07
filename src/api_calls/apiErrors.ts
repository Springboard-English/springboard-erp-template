// What went wrong, in the error itself.
//
// Two different failures used to reach the user as the same unhelpful sentence.
//
// 1. **"Failed to fetch."** That is the browser's own words for `fetch()`
//    rejecting, and it is deliberately vague: offline, DNS, a refused
//    connection, a TLS failure, a CORS preflight the API did not answer and an
//    extension blocking the request all produce the identical `TypeError`, with
//    no field distinguishing them. The browser will not tell us more — but *we*
//    know things it is not saying: which URL, which method, whether the device
//    reports itself offline, and how long we waited before it gave up. A
//    request that dies in 3ms did not time out; one that dies after 30s was not
//    a CORS rejection. `NetworkError` carries all of it.
//
// 2. **"Failed to fetch tests: 400 Bad Request."** Ours, and it throws away the
//    one part that says anything: the response body. The API answers an error
//    with FastAPI's `{"detail": ...}` — "test is already published", "edited_at
//    is older than the current value", a 422's field-by-field list — and the
//    call sites formatted the status line and dropped the body unread.
//    `ApiError` reads it.
//
// Both keep the status code and the detail text inside `error.message`, because
// the message is what a banner renders and what `isPermissionDeniedError` and
// `isOutdatedEditedAtConflictError` match on.

/** Long enough for a real API message; short enough for a one-line banner. */
const MAX_DETAIL_LENGTH = 300;

/**
 * A request that never got a response: no status, no body, nothing to report
 * from the server because the server was never reached.
 *
 * `cause` is the browser's original `TypeError`, kept because its wording is
 * the one thing that differs between engines ("Failed to fetch" in Chrome,
 * "Load failed" in Safari, "NetworkError when attempting to fetch a resource"
 * in Firefox) and is therefore worth having in a bug report.
 */
export class NetworkError extends Error {
    readonly url: string;
    readonly method: string;
    readonly elapsedMs: number;
    /** `navigator.onLine` at the moment it failed — false is conclusive, true is not. */
    readonly online: boolean;
    /**
     * The browser's original `TypeError`.
     *
     * Declared here rather than inherited: `Error.cause` is ES2022 and this
     * package compiles against an older lib, so the field exists at runtime but
     * not in the type.
     */
    readonly cause: unknown;

    constructor(options: {
        url: string;
        method: string;
        elapsedMs: number;
        online: boolean;
        cause: unknown;
    }) {
        super(describeNetworkFailure(options));
        this.name = "NetworkError";
        this.url = options.url;
        this.method = options.method;
        this.elapsedMs = options.elapsedMs;
        this.online = options.online;
        this.cause = options.cause;
    }
}

/** A response that arrived and said no. */
export class ApiError extends Error {
    readonly status: number;
    readonly statusText: string;
    readonly url: string;
    /** The server's explanation, pulled out of the body; null if it sent none. */
    readonly detail: string | null;

    constructor(options: {
        context: string;
        status: number;
        statusText: string;
        url: string;
        detail: string | null;
    }) {
        super(describeApiFailure(options));
        this.name = "ApiError";
        this.status = options.status;
        this.statusText = options.statusText;
        this.url = options.url;
        this.detail = options.detail;
    }
}

/**
 * The path, without the origin — `/v2/users/me` rather than the full URL.
 *
 * A banner has one line, and the origin is the same for every request in the
 * app, so it spends characters telling the reader nothing. The full URL is
 * still on the error object for anyone reading a console.
 */
function requestPath(url: string): string {
    try {
        const parsed = new URL(url, window.location.origin);
        return parsed.pathname + parsed.search;
    } catch {
        return url;
    }
}

function describeNetworkFailure({
    url,
    method,
    elapsedMs,
    online,
    cause,
}: {
    url: string;
    method: string;
    elapsedMs: number;
    online: boolean;
    cause: unknown;
}): string {
    // Offline is the one cause the browser will actually confirm, and it is
    // also the most common one, so it gets said plainly instead of listed
    // among possibilities.
    const reason = online
        ? "the server did not respond"
        : "this device is offline";
    const browserWording = cause instanceof Error ? cause.message : String(cause);

    return (
        `Could not reach the server: ${reason} ` +
        `(${method} ${requestPath(url)}, gave up after ${Math.round(elapsedMs)}ms — ${browserWording})`
    );
}

function describeApiFailure({
    context,
    status,
    statusText,
    detail,
}: {
    context: string;
    status: number;
    statusText: string;
    detail: string | null;
}): string {
    // The status line stays first and unchanged: existing messages read
    // "Failed to fetch tests: 403 Forbidden", screenshots of them are in bug
    // reports, and `isPermissionDeniedError` looks for the number.
    const statusLine = `${context}: ${status}${statusText ? ` ${statusText}` : ""}`;
    return detail ? `${statusLine} — ${detail}` : statusLine;
}

function truncate(value: string): string {
    const collapsed = value.replace(/\s+/g, " ").trim();
    return collapsed.length > MAX_DETAIL_LENGTH
        ? `${collapsed.slice(0, MAX_DETAIL_LENGTH - 1)}…`
        : collapsed;
}

/**
 * An error page rather than an API answer, reduced to its words.
 *
 * A 502 or a 504 does not come from the API at all — it comes from the load
 * balancer or Cloud Run, as a page of HTML. Pasting that into a banner is
 * worse than saying nothing, but the sentence buried in it ("upstream connect
 * error") is exactly the useful part, so keep the text and drop the markup.
 */
function stripMarkup(text: string): string {
    return text
        .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
        .replace(/<[^>]*>/g, " ");
}

/**
 * Pull the server's explanation out of an error body.
 *
 * FastAPI raises `HTTPException(detail=...)`, which serialises to
 * `{"detail": "test is already published"}`, and answers a validation failure
 * with `{"detail": [{"loc": [...], "msg": ...}, ...]}` — a shape worth
 * flattening, since "body.start_time: invalid datetime format" is exactly what
 * the person looking at the banner needs. Anything else (a proxy's HTML error
 * page, an empty body, a gateway's plain text) falls through to the raw text,
 * which is still better than nothing.
 */
function extractDetail(body: string): string | null {
    const text = body.trim();
    if (!text) {
        return null;
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(text);
    } catch {
        return truncate(text.startsWith("<") ? stripMarkup(text) : text) || null;
    }

    if (typeof parsed === "string") {
        return truncate(parsed) || null;
    }

    if (!parsed || typeof parsed !== "object") {
        return truncate(text);
    }

    const record = parsed as Record<string, unknown>;
    const detail = record.detail;

    if (typeof detail === "string") {
        return truncate(detail) || null;
    }

    if (Array.isArray(detail)) {
        const parts = detail
            .map((entry) => {
                if (!entry || typeof entry !== "object") {
                    return typeof entry === "string" ? entry : null;
                }

                const item = entry as Record<string, unknown>;
                const msg = typeof item.msg === "string" ? item.msg : null;
                if (!msg) {
                    return null;
                }

                const loc = Array.isArray(item.loc)
                    ? item.loc.filter((part) => typeof part === "string" || typeof part === "number").join(".")
                    : "";
                return loc ? `${loc}: ${msg}` : msg;
            })
            .filter((part): part is string => Boolean(part));

        return parts.length > 0 ? truncate(parts.join("; ")) : truncate(text);
    }

    // OAuth-ish and hand-rolled shapes, in the order they are worth trying.
    for (const key of ["message", "error_description", "error"]) {
        const value = record[key];
        if (typeof value === "string" && value.trim()) {
            return truncate(value);
        }
    }

    return truncate(text);
}

/**
 * Read a failed response into an `ApiError`, body and all.
 *
 * Reads a **clone**, so the caller's `response` is left untouched — this can be
 * dropped into an existing `if (!response.ok)` branch without caring whether
 * anything downstream also reads the body.
 */
export async function toApiError(
    response: Response,
    context: string,
): Promise<ApiError> {
    let detail: string | null = null;
    try {
        detail = extractDetail(await response.clone().text());
    } catch {
        // A body that cannot be read is not worth failing over: the status
        // line alone is still an improvement on nothing, and throwing here
        // would replace the real error with a confusing one.
    }

    return new ApiError({
        context,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        detail,
    });
}

/**
 * The one-liner for a call site: `await throwIfNotOk(response, "Failed to
 * fetch tests")` in place of the hand-written status-line `throw`.
 *
 * `context` keeps the wording the app already used, so the change at each call
 * site is only that the server's reason now follows the status.
 */
export async function throwIfNotOk(
    response: Response,
    context: string,
): Promise<Response> {
    if (response.ok) {
        return response;
    }

    throw await toApiError(response, context);
}
