export interface FetchWithRefreshOptions extends RequestInit {
    skipRefresh?: boolean;
}
export declare const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";
export declare function fetchWithRetryAfter(input: string, init?: RequestInit, retriesRemaining?: number): Promise<Response>;
/**
 * Trade the refresh cookie for a new access token, once at a time.
 *
 * Single-flight: a screen that fires five queries at boot gets one refresh, not
 * five — which also matters because refresh tokens rotate server-side, so
 * parallel refreshes would invalidate each other.
 */
export declare function refreshAccessToken(): Promise<boolean>;
/**
 * The cookie half of the transport: sign-in, Google sign-in, sign-out.
 *
 * These used to call `fetchWithRetryAfter` directly, which read as "this one
 * opts out of the auth layer" when it is really the opposite — they are the auth
 * layer. Routing them here keeps every request in the package on one path, and
 * makes *sending cookies* an argument with a name rather than a choice of
 * function.
 *
 * No Bearer header: a token from a previous session says nothing about the
 * credentials being presented now. No refresh either — a 401 here means the
 * password or the Google credential was rejected, and refreshing out of it would
 * ask the API to renew a session that does not exist yet. For `/logout` it would
 * mint the very session being ended.
 *
 * **Not exported from the package's entry points**, deliberately: the one thing
 * that must never happen is a screen quietly putting the cookies back on the
 * wire, which would pass review, work in every desktop browser, and fail on a
 * phone. Callers inside this package import it from this module directly; apps
 * only ever see `fetchWithRefresh`.
 */
export declare function fetchAuthExchange(input: string, options: RequestInit): Promise<Response>;
/**
 * Trade credentials for an access token: cookies out, token in, store armed.
 *
 * Sign-in, Google sign-in and refresh are the same three steps — ask for the
 * token in the body, send the cookies, arm the store from the reply — and each
 * used to spell all three out. Forgetting the last one is silent: the request
 * succeeds, nothing throws, and the app simply behaves as though nobody signed
 * in. Owning the sequence here is the point of this function; `logout` keeps the
 * plain exchange above, since it ends a session rather than starting one.
 */
export declare function exchangeForAccessToken(input: string, options: RequestInit): Promise<Response>;
export declare function fetchWithRefresh(input: string, options?: FetchWithRefreshOptions): Promise<Response>;
