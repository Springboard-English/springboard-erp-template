import type { LiveSessionStatus } from "./api";

// Whether a run's control popup is open on its results screen.
//
// The controls of a run — join code, Start/End, its time limit — are a popup on
// the results screen, and "open" lives in the URL rather than in component
// state for the same reason a test's tab does: starting a challenge navigates
// here and must land on the join code, the legacy
// `/teacher/live-sessions/:sessionKey` address redirects here and must too, and
// a state flag could be set by neither.

/** The search param that opens the control popup (`?control=1`). */
export const SESSION_CONTROL_PARAM = "control";

export function isControlOpen(params: URLSearchParams): boolean {
  return params.get(SESSION_CONTROL_PARAM) === "1";
}

/**
 * `params` with the popup opened or closed, everything else untouched — the
 * results screen may carry other params, and closing the popup must not drop
 * them.
 */
export function withControlOpen(
  params: URLSearchParams,
  open: boolean,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (open) next.set(SESSION_CONTROL_PARAM, "1");
  else next.delete(SESSION_CONTROL_PARAM);
  return next;
}

/**
 * Whether arriving on a run's results should open its controls unasked.
 *
 * Only a run still in the LOBBY: nothing has happened there yet, so the only
 * useful thing on screen is the join code to read out and the Start button —
 * a teacher who opens a lobby run from the list, a bookmark or a second tab is
 * there to start it. A live run opens on the table, because watching the room
 * is what a teacher returns to it for, and an ended one has nothing to control.
 * (A public link is created already live, so it never qualifies.)
 */
export function opensControlOnArrival(
  status: LiveSessionStatus | undefined,
): boolean {
  return status === "lobby";
}
