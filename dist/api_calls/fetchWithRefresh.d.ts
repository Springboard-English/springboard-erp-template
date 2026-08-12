interface FetchWithRefreshOptions extends RequestInit {
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
export declare function fetchWithRefresh(input: string, options?: FetchWithRefreshOptions): Promise<Response>;
export {};
