// The authed fetch for every Springboard front-end. It lived as a near-identical
// copy in each app (lms and erp-ops' copies were byte-for-byte this file); they
// import it from here now, so the auth transport is described once.
//
// **Bearer, not cookies.** The API used to set the access token as a cookie, and
// that cookie plus the refresh one came to ~4.3KB on one domain — past the
// 4096-byte per-domain floor RFC 6265 lets a browser stop at. WebKit stops
// there, drops the access token, and every request after login answers 401,
// which is why sign-in failed on iOS and worked in desktop Chrome. The token now
// arrives in the login body, lives in memory (see auth/accessToken.ts) and rides
// an Authorization header.
//
// So a normal request sends **no cookies at all** — `credentials: "omit"`,
// applied here rather than trusted to each call site. The one exception is
// `/refresh`, which needs the refresh cookie and asks for it explicitly. That
// cookie is untouched by any of this, which is what keeps SSO across the
// springboard.vn apps working: an app that opens with an empty memory refreshes
// into a session without anyone typing a password.
import { getEndpoint } from "../config/api";
import {
  armAccessTokenFromResponse,
  clearAccessToken,
  getAccessToken,
} from "../auth/accessToken";

interface FetchWithRefreshOptions extends RequestInit {
  skipRefresh?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;
let forceLogoutPromise: Promise<void> | null = null;
const RATE_LIMIT_STATUS = 429;
const MAX_RETRY_AFTER_RETRIES = 1;

export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

function parseRetryAfterMs(retryAfter: string | null): number | null {
  if (!retryAfter) {
    return null;
  }

  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1000;
  }

  const retryAt = Date.parse(retryAfter);
  if (Number.isNaN(retryAt)) {
    return null;
  }

  return Math.max(retryAt - Date.now(), 0);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function fetchWithRetryAfter(
  input: string,
  init?: RequestInit,
  retriesRemaining = MAX_RETRY_AFTER_RETRIES,
): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    cache: init?.cache ?? "no-store",
  });

  if (response.status !== RATE_LIMIT_STATUS || retriesRemaining <= 0) {
    return response;
  }

  const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
  if (retryAfterMs === null) {
    return response;
  }

  await delay(retryAfterMs);
  return fetchWithRetryAfter(input, init, retriesRemaining - 1);
}

/**
 * Any 401 is worth one refresh.
 *
 * This used to insist the message said both "token" and "expired", which was
 * survivable while the access token was a cookie the browser re-sent by itself:
 * the only 401 you met was an expired one. With the token in memory, the common
 * case is having **no** token at all — a fresh tab, a reload — and the API
 * answers that with "Invalid token. Expected Bearer token, App token, or
 * Cookie.". Under the old rule that never refreshed, so every reload dropped the
 * user on the sign-in screen with a live session sitting in the refresh cookie.
 */
function shouldAttemptRefresh(response: Response): boolean {
  return response.status === 401;
}

/**
 * Trade the refresh cookie for a new access token, once at a time.
 *
 * Single-flight: a screen that fires five queries at boot gets one refresh, not
 * five — which also matters because refresh tokens rotate server-side, so
 * parallel refreshes would invalidate each other.
 */
export async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshUrl = new URL(getEndpoint("refresh"));
      refreshUrl.searchParams.set("token_in_body", "true");

      // The one request that sends cookies: the refresh token is the credential.
      const refreshResponse = await fetchWithRetryAfter(refreshUrl.toString(), {
        method: "POST",
        headers: { Accept: "application/json" },
        credentials: "include",
      });

      if (!refreshResponse.ok) {
        return false;
      }

      await armAccessTokenFromResponse(refreshResponse);
      return true;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function forceLogoutAndNotify(): Promise<void> {
  if (!forceLogoutPromise) {
    forceLogoutPromise = (async () => {
      try {
        await fetchWithRetryAfter(getEndpoint("logout"), {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "include",
        });
      } catch {
        // Best effort: still clear client auth state even if logout request fails.
      } finally {
        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
      }
    })().finally(() => {
      forceLogoutPromise = null;
    });
  }

  return forceLogoutPromise;
}

/** The request as it goes out: Bearer if we hold one, and never any cookies. */
function authedInit(init: RequestInit): RequestInit {
  const headers = new Headers(init.headers);
  const token = getAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set here rather than per call site: a stray `credentials: "include"` in one
  // of the hundred callers would put the 4.3KB of cookies back on the wire for
  // that request, and it would work everywhere except the browser this exists
  // for.
  return { ...init, headers, credentials: "omit" };
}

export async function fetchWithRefresh(
  input: string,
  options: FetchWithRefreshOptions = {},
): Promise<Response> {
  const { skipRefresh = false, ...init } = options;
  const response = await fetchWithRetryAfter(input, authedInit(init));

  if (skipRefresh || !shouldAttemptRefresh(response)) {
    return response;
  }

  // Whether we were signed in a moment ago decides what a failed refresh means.
  const hadToken = getAccessToken() !== null;
  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    clearAccessToken();
    // Only tear down a session that existed. A first visit has no token and no
    // refresh cookie, so its 401 is simply "not signed in" — and treating that
    // as an expiry logged out and notified on every cold load of the sign-in
    // page, which is both noise and a needless round trip.
    if (hadToken) {
      await forceLogoutAndNotify();
    }
    return response;
  }

  // Retry exactly once, now carrying the token the refresh just handed us.
  return fetchWithRefresh(input, { ...init, skipRefresh: true });
}
