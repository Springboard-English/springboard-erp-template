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
// applied here rather than trusted to each call site. Four requests are the
// exception, and they are the auth exchange itself: sign-in, Google sign-in,
// sign-out and refresh. They go through `fetchAuthExchange`, which is not
// exported from the package, so sending cookies is an argument with a name
// rather than something any caller can opt into. The refresh cookie is
// untouched by all of this, which is what keeps SSO across the springboard.vn
// apps working: an app that opens with an empty memory refreshes into a session
// without anyone typing a password.
import { getEndpoint } from "../config/api";
import {
  armAccessTokenFromResponse,
  clearAccessToken,
  getAccessToken,
} from "../auth/accessToken";

export interface FetchWithRefreshOptions extends RequestInit {
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
      // The refresh token IS the credential here, and the reply carries the
      // new access token.
      const refreshResponse = await exchangeForAccessToken(getEndpoint("refresh"), {
        method: "POST",
        headers: { Accept: "application/json" },
      });

      return refreshResponse.ok;
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
        await fetchAuthExchange(getEndpoint("logout"), {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
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
export async function fetchAuthExchange(
  input: string,
  options: RequestInit,
): Promise<Response> {
  return fetchWithRetryAfter(input, { ...options, credentials: "include" });
}

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
export async function exchangeForAccessToken(
  input: string,
  options: RequestInit,
): Promise<Response> {
  const target = new URL(input);
  target.searchParams.set("token_in_body", "true");

  const response = await fetchAuthExchange(target.toString(), options);
  if (response.ok) {
    await armAccessTokenFromResponse(response);
  }
  return response;
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
