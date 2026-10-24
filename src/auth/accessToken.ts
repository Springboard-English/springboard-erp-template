/**
 * The access token, held in memory for the life of the tab.
 *
 * Not a cookie: the token carries the caller's whole scope string (~2.9KB), and
 * with the refresh cookie that passes the 4096 bytes per domain RFC 6265 obliges
 * a browser to keep. WebKit stops exactly there, drops the access token, and
 * every request after login answers 401. So the token is sent as a Bearer
 * header from here.
 *
 * **Memory only, deliberately.** Nothing is written to localStorage or
 * sessionStorage: a reload starts with no token and `OidcBoot` re-authorizes
 * against Hydra, whose own session is what carries SSO across the
 * springboard.vn apps.
 */

// Plain module scope. The package has one build entry (vite.config.ts), so
// there is exactly one instance and one session. A second entry could emit this
// module twice, letting sign-in arm one token while an app's API layer reads
// another.
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
