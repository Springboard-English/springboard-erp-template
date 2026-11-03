/// <reference types="vite/client" />

/**
 * The base URL, and the auth endpoints this package calls itself.
 *
 * Nothing else. Every app defines its own `API_CONFIG` with the endpoints it
 * actually uses. A resource endpoint belongs to the app that calls it. If you are adding one,
 * add it there.
 */

let _baseURL: string = (() => {
    if (typeof import.meta !== "undefined" && import.meta.env) {
        if (import.meta.env.VITE_BASE_URL) {
            return import.meta.env.VITE_BASE_URL;
        }
        if (import.meta.env.DEV) {
            return "https://api.dev.springboard.vn";
        }
    }
    return "https://api.springboard.vn";
})();

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
