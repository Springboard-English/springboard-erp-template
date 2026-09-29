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
// So a request sends **no cookies at all** — `credentials: "omit"`, applied
// here rather than trusted to each call site. There are no exceptions: this
// package holds no first-party session code. Every app signs in through OIDC
// and renews with its refresh_token grant.
//
// The first-party `/refresh` cookie is what made a session switch issuers
// mid-tab: a failed OIDC renewal fell back to it, and a stale cookie from an
// old sign-in minted a first-party token carrying every role the person holds,
// so whether a call was allowed depended on which token it happened to carry.
// It is gone rather than guarded. The one session with no OIDC behind it — a
// Leap guest — renews through `configureSessionRenewal`, which Leap owns.
import { NetworkError } from "./apiErrors";
import { clearAccessToken, getAccessToken } from "../auth/accessToken";
import { hasOidcSession, refreshSession } from "../auth/oidc/client";

export interface FetchWithRefreshOptions extends RequestInit {
  skipRefresh?: boolean;
}

let sessionRenewal: (() => Promise<boolean>) | null = null;
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

/**
 * `fetch`, but a network failure says which request failed and what we know.
 *
 * Every request in every app funnels through here, which is the reason the
 * wrapping lives at this line and not at the hundred call sites: the bare
 * "Failed to fetch" banner the apps show today is this rejection, rendered as
 * `error.message`, and it names neither the endpoint nor the cause. See
 * `apiErrors.ts` for what the browser will and will not tell us.
 *
 * An abort is deliberately left alone. React Query cancels in-flight queries on
 * unmount and on a key change, and it recognises that cancellation by the
 * `AbortError` it gets back — dressing it up as a network failure would make
 * every navigation raise an error banner for a request nobody was waiting for.
 */
async function sendRequest(input: string, init: RequestInit): Promise<Response> {
  const startedAt = Date.now();

  try {
    return await fetch(input, init);
  } catch (error) {
    if (init.signal?.aborted || (error instanceof Error && error.name === "AbortError")) {
      throw error;
    }

    throw new NetworkError({
      url: input,
      method: init.method ?? "GET",
      elapsedMs: Date.now() - startedAt,
      // Anything other than a definite `false` counts as online. Node has a
      // `navigator` with no `onLine` on it, and reading that as "offline"
      // would put a wrong reason in front of every app's node-side tests.
      online: typeof navigator?.onLine === "boolean" ? navigator.onLine : true,
      cause: error,
    });
  }
}

export async function fetchWithRetryAfter(
  input: string,
  init?: RequestInit,
  retriesRemaining = MAX_RETRY_AFTER_RETRIES,
): Promise<Response> {
  const response = await sendRequest(input, {
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
 * user on the sign-in screen with a live session still renewable.
 */
function shouldAttemptRefresh(response: Response): boolean {
  return response.status === 401;
}

/**
 * Renew a session that has no OIDC refresh token behind it.
 *
 * For an app whose users can hold a session this package did not mint — Leap's
 * guests, signed in at `POST /authenticate/guest` to sit a public test. The app
 * owns the whole exchange and must decide for itself whether the tab holds such
 * a session: this is called on every 401 without an OIDC session, including a
 * staff member's, and a renewer that answers for them brings back the
 * issuer-switch bug. Return whether a new token was armed.
 */
export function configureSessionRenewal(
  renew: (() => Promise<boolean>) | null,
): void {
  sessionRenewal = renew;
}

/**
 * Renew the access token, once at a time.
 *
 * An OIDC session renews with its own refresh token. Without one there is
 * nothing to renew unless the app registered `configureSessionRenewal` — and a
 * failed renewal tears the session down, so the next screen re-authorizes.
 */
export async function refreshAccessToken(): Promise<boolean> {
  // `refreshSession` holds its own single-flight — refresh tokens rotate, so
  // two in parallel invalidate each other.
  if (hasOidcSession()) return refreshSession();
  return sessionRenewal ? sessionRenewal() : false;
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
    // Only tear down a session that existed. A first visit has no token, so its
    // 401 is simply "not signed in" — and treating that as an expiry notified
    // on every cold load of the sign-in page.
    if (hadToken) {
      window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
    }
    return response;
  }

  // Retry exactly once, now carrying the token the refresh just handed us.
  return fetchWithRefresh(input, { ...init, skipRefresh: true });
}
