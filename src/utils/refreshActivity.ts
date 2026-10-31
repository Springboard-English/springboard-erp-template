// Counts how often someone refreshes, for the "found a bug?" nudge. No DOM
// rendering here: `OidcBoot` calls in before anything mounts, and the barrel
// has to stay importable from Node.

/** Refreshes inside `REFRESH_NUDGE_WINDOW_MS` that make the nudge due. */
export const REFRESH_NUDGE_THRESHOLD = 3;
export const REFRESH_NUDGE_WINDOW_MS = 2 * 60 * 1000;
/** At most one nudge per browser in this long, whatever happens to it. */
export const REFRESH_NUDGE_COOLDOWN_MS = 24 * 60 * 60 * 1000;

// Per tab: a reload in one tab says nothing about another. sessionStorage also
// outlives the Hydra round trip that follows every reload.
const REFRESHES_KEY = "springboard:refresh-times";
const LAST_NUDGE_KEY = "springboard:refresh-nudge-at";

const listeners = new Set<() => void>();
let documentChecked = false;

/** Reads a storage value; blocked storage counts as nothing stored. */
function read(storage: () => Storage, key: string): string | null {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
}

/** Writes a storage value; blocked storage just loses the count. */
function write(storage: () => Storage, key: string, value: string): void {
  try {
    storage().setItem(key, value);
  } catch {
    // Nothing to do: the nudge is optional.
  }
}

/** The refreshes still inside the window, oldest first. */
function recentRefreshes(now: number): number[] {
  const raw = read(() => sessionStorage, REFRESHES_KEY);
  if (!raw) return [];
  try {
    const times: unknown = JSON.parse(raw);
    if (!Array.isArray(times)) return [];
    return times.filter(
      (time): time is number =>
        typeof time === "number" && now - time < REFRESH_NUDGE_WINDOW_MS,
    );
  } catch {
    return [];
  }
}

/** Counts one refresh and tells whoever is listening. */
export function recordRefresh(now = Date.now()): void {
  write(() => sessionStorage, REFRESHES_KEY, JSON.stringify([...recentRefreshes(now), now]));
  listeners.forEach((listener) => listener());
}

/**
 * Counts a browser reload of this document, once. `OidcBoot` has to call it on
 * the first page: that page redirects to Hydra straight away, and the document
 * that comes back reports a plain "navigate".
 */
export function recordDocumentReload(): void {
  if (documentChecked || typeof performance === "undefined") return;
  documentChecked = true;
  const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  if (entry?.type === "reload") recordRefresh();
}

/** Whether enough refreshes are recent and no nudge has shown in the cooldown. */
export function isRefreshNudgeDue(now = Date.now()): boolean {
  const last = Number(read(() => localStorage, LAST_NUDGE_KEY)) || null;
  if (last !== null && now - last < REFRESH_NUDGE_COOLDOWN_MS) return false;
  return recentRefreshes(now).length >= REFRESH_NUDGE_THRESHOLD;
}

/** Starts the cooldown; the refresh count starts again from nothing. */
export function markRefreshNudgeShown(now = Date.now()): void {
  write(() => localStorage, LAST_NUDGE_KEY, String(now));
  write(() => sessionStorage, REFRESHES_KEY, "[]");
}

/** Calls `listener` after each counted refresh. Returns the unsubscribe. */
export function subscribeToRefreshes(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
