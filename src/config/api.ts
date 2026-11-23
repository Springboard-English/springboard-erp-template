/// <reference types="vite/client" />

/**
 * The base URL, and the auth endpoints this package calls itself.
 *
 * Nothing else. Every app defines its own `API_CONFIG` with the endpoints it
 * actually uses. A resource endpoint belongs to the app that calls it. If you are adding one,
 * add it there.
 */

/** The production API; `${PRODUCTION_API_BASE_URL}/dev` is the dev API. */
export const PRODUCTION_API_BASE_URL = "https://api.springboard.vn";
/** The dev API, which a dev server talks to when no base URL is set. */
export const DEV_API_BASE_URL = `${PRODUCTION_API_BASE_URL}/dev`;

/** The two `import.meta.env` fields `resolveApiBaseUrl` reads. */
export interface ApiBaseUrlEnv {
    VITE_BASE_URL?: string;
    DEV?: boolean;
}

/**
 * An app's API base URL from its own `import.meta.env`: `VITE_BASE_URL`
 * (trimmed, without a trailing slash) when set; else the dev API under a
 * dev server and the production API in a build. Pass the result to
 * `configureApi`. A release build always sets `VITE_BASE_URL`.
 */
export function resolveApiBaseUrl(env: ApiBaseUrlEnv): string {
    const configured = env.VITE_BASE_URL?.trim().replace(/\/+$/, "");
    if (configured) {
        return configured;
    }
    return env.DEV ? DEV_API_BASE_URL : PRODUCTION_API_BASE_URL;
}

// The package's own env is frozen at its build, so this is only a default
// until the app calls `configureApi`.
let _baseURL: string = resolveApiBaseUrl(
    typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {},
);

export function configureApi(options: { baseUrl: string }): void {
    _baseURL = options.baseUrl;
}

export const API_CONFIG = {
    get baseURL() {
        return _baseURL;
    },
    endpoints: {
        currentUser: "/users/me",
    },
} as const;

export function getEndpoint(
    endpoint: keyof typeof API_CONFIG.endpoints,
): string {
    return `${API_CONFIG.baseURL}/v2${API_CONFIG.endpoints[endpoint]}`;
}
