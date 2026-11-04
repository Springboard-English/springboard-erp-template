// The pure half of the listening player: where a recording's play window
// stands against the server's clock, and how far into the clip that puts the
// player. Every "now" here is SERVER time in ms (device time + offset), because
// the window was opened by the server and a skewed device clock must not move
// it. Kept free of React and the DOM so the rules are testable.

import type { Translate } from "../i18n";

/** A window as the player reads it — ISO strings straight off the API/Firestore. */
export interface WindowTimes {
  startedAt: string;
  endsAt: string;
  stoppedAt: string | null;
}

export type WindowState = "waiting" | "playing" | "ended";

/** How far a player may drift from the room before it is snapped back. */
export const RESYNC_TOLERANCE_S = 2;

function ms(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const value = Date.parse(iso);
  return Number.isFinite(value) ? value : null;
}

/** When the window closes: a stop if there was one, else its scheduled end. */
export function windowCloseMs(window: WindowTimes): number | null {
  const ends = ms(window.endsAt);
  const stopped = ms(window.stoppedAt);
  if (ends === null) return stopped;
  return stopped === null ? ends : Math.min(ends, stopped);
}

/** No window yet (or one not begun) is waiting; past its close it has ended. */
export function windowState(
  window: WindowTimes | null | undefined,
  serverNowMs: number,
): WindowState {
  if (!window) return "waiting";
  const started = ms(window.startedAt);
  const closes = windowCloseMs(window);
  if (started === null || closes === null) return "waiting";
  if (serverNowMs >= closes) return "ended";
  if (serverNowMs < started) return "waiting";
  return "playing";
}

/** Seconds into the clip the room is at, never negative. */
export function playOffsetSeconds(serverNowMs: number, startedAt: string): number {
  const started = ms(startedAt);
  if (started === null) return 0;
  return Math.max(0, (serverNowMs - started) / 1000);
}

/** ms until the window closes (0 once closed), for the stop timer. */
export function msUntilClose(window: WindowTimes, serverNowMs: number): number {
  const closes = windowCloseMs(window);
  return closes === null ? 0 : Math.max(0, closes - serverNowMs);
}

/** Whether the player has drifted far enough from the room to be moved. */
export function needsResync(
  currentS: number,
  expectedS: number,
  toleranceS: number = RESYNC_TOLERANCE_S,
): boolean {
  return Math.abs(currentS - expectedS) > toleranceS;
}

/** How far off the room a player's first frame may land before it is re-seeked. */
export const FIRST_PLAY_TOLERANCE_S = 0.3;

/**
 * Where a controlled player should jump on its first `playing` after a load,
 * or null to stay. The seek lands at metadata time and buffering then delays
 * the first frame, so a cold player starts behind the room by that delay.
 */
export function firstPlayCorrection(
  currentS: number,
  expectedS: number,
  durationS: number | null | undefined,
  toleranceS: number = FIRST_PLAY_TOLERANCE_S,
): number | null {
  const target = clampSeek(expectedS, durationS);
  return needsResync(currentS, target, toleranceS) ? target : null;
}

/**
 * Seconds into the clip a Stop cut the window off, or null when it ran its
 * course: no stop, a stop at or past the scheduled end, or one after the clip
 * had already finished (the window carries a few seconds' grace).
 */
export function stoppedOffsetSeconds(
  window: WindowTimes | null | undefined,
  durationS: number | null | undefined,
): number | null {
  if (!window) return null;
  const started = ms(window.startedAt);
  const stopped = ms(window.stoppedAt);
  if (started === null || stopped === null) return null;
  const ends = ms(window.endsAt);
  if (ends !== null && stopped >= ends) return null;
  const at = Math.max(0, (stopped - started) / 1000);
  if (durationS !== null && durationS !== undefined && Number.isFinite(durationS) && durationS > 0) {
    if (at >= durationS) return null;
  }
  return clampSeek(at, durationS);
}

/** "Stopped · 0:08 / 0:20" for a window cut off early, else null. */
export function stoppedLine(
  stoppedS: number | null,
  lengthS: number | null | undefined,
  t: Translate,
): string | null {
  return stoppedS === null
    ? null
    : t("exercise.media.stopped", "Stopped · {at} / {length}", {
        at: formatClock(stoppedS),
        length: formatClock(lengthS),
      });
}

/** A seek target held inside the clip; an unknown length leaves the top open. */
export function clampSeek(targetS: number, durationS: number | null | undefined): number {
  if (!Number.isFinite(targetS) || targetS < 0) return 0;
  if (durationS === null || durationS === undefined || !Number.isFinite(durationS)) {
    return targetS;
  }
  return Math.min(targetS, Math.max(0, durationS));
}

/** "1:05" — whole seconds, minutes unpadded; nonsense reads 0:00. */
export function formatClock(seconds: number | null | undefined): string {
  const total =
    seconds === null || seconds === undefined || !Number.isFinite(seconds)
      ? 0
      : Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

/**
 * Lay one set of windows (by recording key) over another. Per key the later
 * start wins, because a replay restarts the window; on the same start the
 * overlay wins, since it carries the newer stop.
 */
export function mergeRoomWindows(
  base: Record<string, WindowTimes>,
  overlay: Record<string, WindowTimes> | null | undefined,
): Record<string, WindowTimes> {
  if (!overlay) return base;
  const merged = { ...base };
  for (const [key, window] of Object.entries(overlay)) {
    const current = merged[key];
    const starts = ms(window.startedAt) ?? Number.NEGATIVE_INFINITY;
    if (!current || starts >= (ms(current.startedAt) ?? Number.NEGATIVE_INFINITY)) {
      merged[key] = window;
    }
  }
  return merged;
}

/**
 * The request's own Resource Timing marks, in ms on the page's clock
 * (`performance.now()` scale), plus `performance.timeOrigin` to make them device time.
 */
export interface ResourceTimes {
  timeOriginMs: number;
  requestStart: number;
  responseStart: number;
}

/** Device times (ms) a request was sent and its response arrived. */
export interface RequestTiming {
  sentAtMs: number;
  receivedAtMs: number;
  /** The request's Resource Timing entry; preferred when it carries real marks. */
  resource?: ResourceTimes | null;
}

/**
 * The entry for the request made at or after `sentPerfMs`: the last such one,
 * since a retried request leaves one per attempt. An earlier call to the same
 * URL is never taken for this one; a concurrent one would be, so the caller
 * makes one call to the URL at a time.
 */
export function pickResourceEntry<T extends { startTime: number }>(
  entries: readonly T[],
  sentPerfMs: number,
): T | null {
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].startTime >= sentPerfMs) return entries[i];
  }
  return null;
}

/**
 * Device time (ms) the server stamped `server_now` at, from the request's own
 * marks: halfway from `requestStart` to `responseStart`. Null when the marks
 * are zeroed (a cross-origin answer without `Timing-Allow-Origin`) or out of order.
 */
export function resourceMidpointMs(resource: ResourceTimes | null | undefined): number | null {
  if (!resource) return null;
  const { timeOriginMs, requestStart, responseStart } = resource;
  if (!Number.isFinite(timeOriginMs) || !(requestStart > 0) || !(responseStart >= requestStart)) return null;
  return timeOriginMs + requestStart + (responseStart - requestStart) / 2;
}

/** One reading of the server's clock: its offset, and how long the request was in flight. */
export interface ClockSample {
  /** Server minus device, ms. */
  offsetMs: number;
  /** The span the stamp was placed in the middle of, ms; it bounds the error to half. */
  flightMs: number;
}

/**
 * What a fresh `server_now` says, or null without one. `server_now` is stamped
 * mid-request. Placed by the request's Resource Timing marks when they are
 * real; else by half the send/receive bracket, which also holds the CORS
 * preflight and main-thread delay, so it runs ahead.
 */
export function clockSample(serverNow: string | null | undefined, timing: RequestTiming): ClockSample | null {
  const server = ms(serverNow);
  if (server === null) return null;
  const midpoint = resourceMidpointMs(timing.resource);
  if (midpoint !== null && timing.resource) {
    return { offsetMs: server - midpoint, flightMs: timing.resource.responseStart - timing.resource.requestStart };
  }
  const flightMs = Math.max(0, timing.receivedAtMs - timing.sentAtMs);
  return { offsetMs: server + flightMs / 2 - timing.receivedAtMs, flightMs };
}

/** The offset a fresh `server_now` implies, else the one already known. */
export function offsetFromServerNow(
  serverNow: string | null | undefined,
  timing: RequestTiming,
  fallbackOffsetMs: number,
): number {
  return clockSample(serverNow, timing)?.offsetMs ?? fallbackOffsetMs;
}

/**
 * Which reading to trust: the shorter flight, since a path slower one way than
 * the other skews a midpoint by up to half its flight. A reading that cannot
 * agree with the kept one within both half-flights means the device clock
 * moved, and it replaces the kept one.
 */
export function keepClockSample(kept: ClockSample | null, next: ClockSample): ClockSample {
  if (!kept) return next;
  const agree = Math.abs(next.offsetMs - kept.offsetMs) <= (next.flightMs + kept.flightMs) / 2;
  if (!agree) return next;
  return next.flightMs <= kept.flightMs ? next : kept;
}
