interface FetchWithRefreshOptions extends RequestInit {
    skipRefresh?: boolean;
}
export declare const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";
export declare function fetchWithRetryAfter(input: string, init?: RequestInit, retriesRemaining?: number): Promise<Response>;
export declare function refreshAccessToken(): Promise<boolean>;
export declare function fetchWithRefresh(input: string, options?: FetchWithRefreshOptions): Promise<Response>;
export {};
