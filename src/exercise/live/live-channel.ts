// The live session's state as the API's `live_session:<key>` stream pushes it,
// and what the runner does with each event. Kept free of React so it is testable.

/** The run's state; a push carries only the fields that changed. */
export interface LiveSessionDoc {
  status?: "lobby" | "live" | "ended";
  startedAt?: string | null;
  endedAt?: string | null;
  // Absolute forced-timer deadline (ISO), set at Start and moved when time is
  // added. Null for an untimed run. Drives the countdown; the server decides.
  deadlineAt?: string | null;
  // A share room's due date.
  closesAt?: string | null;
  // The room's recording windows by recording key, pushed when the teacher
  // plays or stops one. A push holds only the windows that changed.
  recordings?: Record<string, { startedAt: string; endsAt: string; stoppedAt: string | null }>;
}

/** What the runner does with one event from the API's `live_session` stream. */
export type LiveEventAction = "apply" | "skip" | "catch-up";

/**
 * A `status` carrying fields is merged in. The stream's first `ready` needs
 * nothing, since the join that opened the screen is current; a later `ready`
 * (a reconnect), a `resync` or a status without fields may have missed
 * something, so the runner catches up with one re-join.
 */
export function liveEventAction(
  event: { type: "ready" | "resync" } | { type: "status"; fields?: unknown },
  firstConnect: boolean,
): LiveEventAction {
  if (event.type === "status" && event.fields) return "apply";
  if (event.type === "ready" && firstConnect) return "skip";
  return "catch-up";
}
