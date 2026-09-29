/**
 * The access token, held in memory for the life of the tab.
 *
 * It used to live in a cookie the API set alongside the refresh token. That
 * cookie carries the caller's whole scope string — ~2.9KB of the ~4.3KB the two
 * came to on one domain — and RFC 6265 only obliges a browser to keep 4096 bytes
 * per domain. WebKit stops exactly there, drops the access token, and every
 * request after a successful login answers 401: sign-in worked in desktop Chrome
 * and failed on iOS. So the token is sent as a Bearer header from here.
 *
 * **Memory only, deliberately.** Nothing is written to localStorage or
 * sessionStorage: a reload starts with no token and `OidcBoot` re-authorizes
 * against Hydra, whose own session is what carries SSO across the
 * springboard.vn apps.
 */

// Plain module scope. The package ships two entry points — the component library
// and `/transport` — and the worry was that the bundler would inline this module
// into both, leaving sign-in arming one token while an app's API layer read
// another. It doesn't: Rollup emits `transport.js` as the shared chunk and
// `index.js` imports from it, so there is exactly one instance and one session.
// `pins-one-token-instance.test.ts` holds that build shape in place.
let accessToken: string | null = null;
let expiresAt: number | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

/** @param expiresAtSeconds the API's `expires_at`, a Unix timestamp in seconds. */
export function setAccessToken(token: string, expiresAtSeconds?: number | null): void {
  accessToken = token;
  expiresAt = typeof expiresAtSeconds === "number" ? expiresAtSeconds : null;
}

export function clearAccessToken(): void {
  accessToken = null;
  expiresAt = null;
}

/** When the token expires, as a Unix timestamp in seconds, if the API said. */
export function getAccessTokenExpiry(): number | null {
  return expiresAt;
}
