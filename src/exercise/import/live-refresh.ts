import type { LiveSessionStatus } from "./api";

/**
 * One refresh cadence for every teacher-facing read of a running session.
 *
 * One value, so every screen gives the same answer to "how old is this
 * number?" for the same run.
 *
 * 5s. The ceiling on how low this can go isn't the server — `GET /results` is
 * three reads and TanStack won't stack a second request while one is in
 * flight, so a slow response backs the interval off on its own. The
 * teacher's scoreboard, presence included, is this poll: there is no pushed
 * copy of it.
 */
export const LIVE_POLL_MS = 5_000;

/**
 * How often to re-read a *session-scoped* resource (results, one attempt).
 *
 * Polled through the LOBBY as well as the run: the results table is where a
 * teacher takes the register, so a lobby that didn't refresh would show nobody
 * joining until Start was pressed. `false` once ended, when the numbers are final, and before
 * the session record has loaded.
 */
export function livePollMs(
  status: LiveSessionStatus | undefined,
): number | false {
  return status === "live" || status === "lobby" ? LIVE_POLL_MS : false;
}

/**
 * How often to re-read the *session record itself*.
 *
 * Polled through the lobby too, and that is the load-bearing part: every other
 * live read is gated on `status === "live"`, so a status left at `lobby` — a
 * teacher who deep-linked to results before pressing Start, or opened it in a
 * second tab — freezes the whole screen with no timer running to unfreeze it.
 * Stops at `ended`, which is the one status that can't change again.
 */
export function sessionPollMs(
  status: LiveSessionStatus | undefined,
): number | false {
  return status === "ended" ? false : LIVE_POLL_MS;
}

/**
 * Query options for a session-scoped read that must track a run in flight.
 *
 * `staleTime: 0` is not redundant with the interval. The app sets a global 60s
 * staleTime, and both the focus refetch and the on-mount refetch are *gated* on
 * staleness — so without this, walking back into a student's attempt within a
 * minute would re-render minute-old answers and fire no request at all.
 *
 * Background polling stays off (TanStack's default): a teacher who alt-tabs
 * away shouldn't keep hitting the API. `refetchOnWindowFocus` is what makes
 * that safe — coming back refreshes immediately, instead of waiting out the
 * rest of a tick that was never running while the tab was hidden.
 */
export function liveQueryOptions(status: LiveSessionStatus | undefined) {
  const interval = livePollMs(status);
  return {
    refetchInterval: interval,
    refetchOnWindowFocus: interval !== false,
    staleTime: interval === false ? undefined : 0,
  };
}
