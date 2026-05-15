import { getEndpoint } from "../config/api";
import { getStoredUserInfo } from "../auth/userStorage";

interface FetchWithRefreshOptions extends RequestInit {
  skipRefresh?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;
let forceLogoutPromise: Promise<void> | null = null;
const RATE_LIMIT_STATUS = 429;
const MAX_RETRY_AFTER_RETRIES = 1;

export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

function parseErrorMessage(payload: unknown): string {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message = record.message ?? record.detail ?? record.error;

    if (typeof message === "string") {
      return message;
    }
  }

  return "";
}

async function getResponseErrorMessage(response: Response): Promise<string> {
  const clone = response.clone();
  const contentType = clone.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const body = (await clone.json()) as unknown;
      return parseErrorMessage(body);
    }

    return (await clone.text()).trim();
  } catch {
    return "";
  }
}

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

async function shouldAttemptRefresh(response: Response): Promise<boolean> {
  if (response.status !== 401) {
    return false;
  }

  const message = (await getResponseErrorMessage(response)).toLowerCase();

  return message.includes("token") && message.includes("expired");
}

function getRefreshUsername(): string | null {
  const userInfo = getStoredUserInfo();
  if (!userInfo) {
    return null;
  }

  const candidate = userInfo.username ?? userInfo.email ?? userInfo.sub;
  return typeof candidate === "string" && candidate.trim()
    ? candidate.trim()
    : null;
}

export async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const username = getRefreshUsername();
      if (!username) {
        return false;
      }

      const refreshResponse = await fetchWithRetryAfter(getEndpoint("refresh"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          username: username,
        },
        credentials: "include",
      });

      if (refreshResponse.ok) {
        return true;
      }

      return false;
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

export async function fetchWithRefresh(
  input: string,
  options: FetchWithRefreshOptions = {},
): Promise<Response> {
  const { skipRefresh = false, ...init } = options;
  const response = await fetchWithRetryAfter(input, init);

  if (skipRefresh) {
    return response;
  }

  const shouldRefresh = await shouldAttemptRefresh(response);
  if (!shouldRefresh) {
    return response;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    await forceLogoutAndNotify();
    return response;
  }

  // Retry exactly once after successful refresh.
  return fetchWithRefresh(input, { ...init, skipRefresh: true });
}
