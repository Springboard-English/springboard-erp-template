// Client side of the forced live-session timer. The server owns the deadline
// (an absolute timestamp) and enforces it — rejecting late answers and
// auto-ending the run; these hooks only *display* the remaining time and signal
// local expiry so the runner can auto-submit a moment before the server cutoff.
//
// The countdown is anchored to server time via a one-shot read of an API
// response's `Date` header, so a device whose clock is skewed can't quietly
// lengthen or shorten the exam.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { API_CONFIG } from "./api";

const TICK_MS = 1000;
// A re-sync that cannot reach the server tries again this often, this many
// times — half a minute, longer than any room's answer grace.
const RESYNC_RETRY_MS = 5_000;
const RESYNC_ATTEMPTS = 6;

export interface ServerClock {
  /** serverNow − clientNow, in ms. Add to `Date.now()` for server time. */
  offsetMs: number;
  /** True once the probe has resolved (success or failure); until then, untrusted. */
  ready: boolean;
  /** Probe again — when the server has just said this clock is wrong. */
  resync: () => void;
}

/**
 * Server-clock offset from an API response's `Date` header.
 *
 * `Date` is NOT a CORS-safelisted response header, so this depends on the API
 * listing it in `expose_headers` (main.py); without it the read is null, the
 * offset silently stays 0, and a phone set a few minutes fast auto-submits a
 * few minutes early. The server also refuses a timer finish that lands before
 * its deadline, and `resync` is what the runner calls when it does.
 *
 * On any failure the offset stays 0 (fall back to the client clock) and `ready`
 * still flips true, so callers that gate on `ready` aren't stuck.
 */
export function useServerClockOffset(): ServerClock {
  const [clock, setClock] = useState({ offsetMs: 0, ready: false });
  const [probe, setProbe] = useState(0);
  const resync = useCallback(() => setProbe((n) => n + 1), []);
  useEffect(() => {
    let cancelled = false;
    let retryId: number | undefined;
    // A re-sync is asked for because the server just refused this clock, so a
    // probe that fails then is retried rather than settled on: settling would
    // leave the countdown parked at 0:00 until the server ended the room. The
    // first probe gives up at once.
    const attempt = (left: number) => {
      fetch(API_CONFIG.baseURL, { method: "HEAD" })
        .then((res) => {
          if (cancelled) return;
          const header = res.headers.get("date");
          const serverMs = header ? Date.parse(header) : NaN;
          if (Number.isFinite(serverMs)) {
            setClock({ offsetMs: serverMs - Date.now(), ready: true });
          } else {
            throw new Error("no readable Date header");
          }
        })
        .catch(() => {
          if (cancelled) return;
          if (probe > 0 && left > 0) {
            retryId = window.setTimeout(() => attempt(left - 1), RESYNC_RETRY_MS);
            return;
          }
          // Keep whatever offset was already known — a failed re-probe is not
          // evidence that the device clock became right.
          setClock((current) => ({ ...current, ready: true }));
        });
    };
    attempt(RESYNC_ATTEMPTS);
    return () => {
      cancelled = true;
      window.clearTimeout(retryId);
    };
  }, [probe]);
  return useMemo(() => ({ ...clock, resync }), [clock, resync]);
}

export interface SessionTimer {
  /** ms until the deadline (clamped at 0), or null for an untimed run. */
  remainingMs: number | null;
  /** True once the deadline has passed — only when `armed` (see below). */
  expired: boolean;
}

/**
 * A ticking countdown to `deadlineIso`, corrected by `offsetMs`.
 *
 * `armed` gates the `expired` signal: pass the server-clock `ready` flag (and
 * whatever "the exam is in progress" condition applies) so a not-yet-anchored
 * clock can't fire a premature auto-submit. The displayed `remainingMs` ticks
 * regardless; only the actionable `expired` waits for `armed`.
 */
export function useSessionTimer(
  deadlineIso: string | null | undefined,
  offsetMs = 0,
  armed = true,
): SessionTimer {
  const deadlineMs = deadlineIso ? Date.parse(deadlineIso) : NaN;
  const hasDeadline = Number.isFinite(deadlineMs);
  // Kept in a ref so the interval closure always sees the latest offset without
  // being torn down and recreated on every re-anchor.
  const offsetRef = useRef(offsetMs);
  offsetRef.current = offsetMs;

  const [remainingMs, setRemainingMs] = useState<number | null>(() =>
    hasDeadline ? Math.max(0, deadlineMs - (Date.now() + offsetMs)) : null,
  );

  useEffect(() => {
    if (!hasDeadline) {
      setRemainingMs(null);
      return;
    }
    const compute = () => Math.max(0, deadlineMs - (Date.now() + offsetRef.current));
    setRemainingMs(compute());
    const id = window.setInterval(() => {
      const next = compute();
      setRemainingMs(next);
      if (next <= 0) window.clearInterval(id);
    }, TICK_MS);
    return () => window.clearInterval(id);
    // `offsetMs` restarts the tick on a re-anchor: the interval stops itself at
    // zero, so a countdown that hit zero on a fast clock would otherwise stay at
    // zero — reading expired — after the server said there was time left.
  }, [deadlineMs, hasDeadline, offsetMs]);

  return {
    remainingMs: hasDeadline ? remainingMs : null,
    // `remainingMs ?? 1` so a still-initialising null never reads as expired.
    expired: armed && hasDeadline && (remainingMs ?? 1) <= 0,
  };
}

/**
 * Which deadline the runner is actually held to.
 *
 * Two sources, and the taker's own wins:
 *
 * - `participantDeadline` — this attempt's deadline on a **public self-paced
 *   link**, handed back by `POST /join/{code}`. Each taker's clock starts when
 *   they join, so there is nothing shared to broadcast; it never moves, and a
 *   re-join returns the same value.
 * - `sessionDeadline` — the class run's shared deadline, which arrives over
 *   the live stream and *does* move when the teacher adds time.
 *
 * They are never both set: the API leaves `LiveSession.deadline_at` null on a
 * public room and never stamps `Participant.deadline_at` on a class run. The
 * precedence is here so that if that ever stops being true, the answer is the
 * one about this person rather than whichever arrived first.
 *
 * Pure and tested because getting it wrong ends someone's exam early, silently.
 */
export function resolveRunnerDeadline(
  participantDeadline: string | null | undefined,
  sessionDeadline: string | null | undefined,
): string | null {
  return participantDeadline ?? sessionDeadline ?? null;
}

/**
 * Has this attempt's own deadline already passed?
 *
 * The runner needs this as a *state*, not just as a countdown that fires once.
 * A public room is `live` forever, so a student who reloads after their time ran
 * out would otherwise be handed the paper again — and every answer they wrote
 * into it would be refused by the server with nothing on screen to say why.
 *
 * `offsetMs` anchors it to server time, and `ready` gates it: before the clock
 * probe resolves, a skewed device must not be able to declare itself expired.
 */
export function isAttemptExpired(
  deadlineIso: string | null | undefined,
  offsetMs = 0,
  ready = true,
): boolean {
  if (!ready || !deadlineIso) return false;
  const deadlineMs = Date.parse(deadlineIso);
  return Number.isFinite(deadlineMs) && deadlineMs <= Date.now() + offsetMs;
}

/** `H:MM:SS` (or `M:SS` under an hour) for a remaining-ms value. */
export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
