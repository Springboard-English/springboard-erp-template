// Reads one request's Resource Timing entry for the player's clock. Browser
// glue only: which entry to trust and what it means is `media-window.ts`.
import { pickResourceEntry, type ResourceTimes } from "../lib/media-window";

let watchingBuffer = false;

function performanceApi(): Performance | null {
  return typeof performance !== "undefined" && typeof performance.getEntriesByName === "function"
    ? performance
    : null;
}

/**
 * `performance.now()` just before a request, or null without the API. Also
 * keeps room in the entry buffer: it holds 250 by default, a sitting's
 * heartbeats and stream reconnects fill it within the hour, and a full buffer
 * records nothing new. Nothing else here reads the entries.
 */
export function markRequestStart(): number | null {
  const api = performanceApi();
  if (!api) return null;
  if (!watchingBuffer) {
    watchingBuffer = true;
    api.addEventListener?.("resourcetimingbufferfull", () => api.clearResourceTimings());
  }
  return api.now();
}

/** The marks of the request to `url` made at or after `sentPerfMs`, or null. */
export function resourceTimesFor(url: string, sentPerfMs: number | null): ResourceTimes | null {
  const api = performanceApi();
  if (!api || sentPerfMs === null) return null;
  const entries = api.getEntriesByName(url, "resource") as PerformanceResourceTiming[];
  const entry = pickResourceEntry(entries, sentPerfMs);
  if (!entry) return null;
  return { timeOriginMs: api.timeOrigin, requestStart: entry.requestStart, responseStart: entry.responseStart };
}
