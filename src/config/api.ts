/// <reference types="vite/client" />

/**
 * The base URL, and the auth endpoints this package calls itself.
 *
 * Nothing else. This file used to carry the LMS/HRM resource map — classes,
 * groups, schedules, feedbacks, registrations, assessments, recordings — plus
 * 29 `get*Endpoint` builders for their sub-resources, none of which were
 * exported and none of which anything here called. Every app defines its own
 * `API_CONFIG` with the endpoints it actually uses (erp-ops's is the model:
 * "Only the endpoints this console actually calls"), so those 130-odd lines
 * were a second, stale copy of five different route maps.
 *
 * A resource endpoint belongs to the app that calls it. If you are adding one,
 * add it there.
 */

let _baseURL: string = (() => {
    if (typeof import.meta !== "undefined" && import.meta.env) {
        if (import.meta.env.VITE_BASE_URL) {
            return import.meta.env.VITE_BASE_URL;
        }
        if (import.meta.env.DEV) {
            return "https://api.springboard.vn/dev";
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
        login: "/login/password",
        authenticateGoogle: "/authenticate/google",
        currentUser: "/users/me",
        refresh: "/refresh",
        logout: "/logout",
        resetPassword: "/reset/password",
        resetPasswordAuthorised: "/authenticate/reset",
    },
} as const;

// Auth predates the `/v2` prefix and is served unversioned; `currentUser` is
// the one endpoint here that is not.
const UNVERSIONED_ENDPOINTS: ReadonlySet<keyof typeof API_CONFIG.endpoints> = new Set([
    "login",
    "authenticateGoogle",
    "refresh",
    "logout",
    "resetPassword",
    "resetPasswordAuthorised",
]);

export function getEndpoint(
    endpoint: keyof typeof API_CONFIG.endpoints,
): string {
    const path = API_CONFIG.endpoints[endpoint];
    if (UNVERSIONED_ENDPOINTS.has(endpoint)) {
        return `${API_CONFIG.baseURL}${path}`;
    }
    return `${API_CONFIG.baseURL}/v2${path}`;
}
