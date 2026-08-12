/**
 * The access token, held in memory for the life of the tab.
 *
 * It used to live in a cookie the API set alongside the refresh token. That
 * cookie carries the caller's whole scope string — ~2.9KB of the ~4.3KB the two
 * came to on one domain — and RFC 6265 only obliges a browser to keep 4096 bytes
 * per domain. WebKit stops exactly there, drops the access token, and every
 * request after a successful login answers 401: sign-in worked in desktop Chrome
 * and failed on iOS. So the API hands the token to the body instead
 * (`token_in_body=true`) and it is sent as a Bearer header from here.
 *
 * **Memory only, deliberately.** Nothing is written to localStorage or
 * sessionStorage: a reload starts with no token, calls `/refresh` with the
 * refresh cookie, and is signed in again before the first screen paints. The
 * durable credential stays the HttpOnly refresh cookie, which is also what
 * carries SSO across the springboard.vn apps — that is untouched by any of this.
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

/**
 * Read the access token out of an auth response, if it carried one.
 *
 * Tolerates the older shape — an empty body, cookies only — so a front-end on
 * this version still works against an API that predates `token_in_body`, and so
 * an endpoint that has not been migrated does not throw here.
 */
export async function armAccessTokenFromResponse(response: Response): Promise<void> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return;
  }

  try {
    const body = (await response.clone().json()) as {
      access_token?: unknown;
      expires_at?: unknown;
    };
    if (typeof body?.access_token === "string" && body.access_token) {
      setAccessToken(
        body.access_token,
        typeof body.expires_at === "number" ? body.expires_at : null,
      );
    }
  } catch {
    // A body that isn't the token response tells us nothing; the cookie path,
    // if the API is still on it, has already done the work.
  }
}
