import type { LiveSessionStatus } from "./api";

/**
 * Which screen the student runner should be on.
 *
 * Pure, and separate from the component, because getting the lobby wrong draws
 * the exam paper for a challenge that has not started — and the autosave then
 * POSTs answers the server refuses as "Session is not live".
 *
 * Two sources for the status, deliberately:
 *
 * - `joinStatus` seeds it, so the first paint is right before any snapshot —
 *   and stays right when the stream never connects and no push ever comes.
 * - `liveStatus` is the live stream's state, which `start_live_session`
 *   publishes. It wins once it arrives; it is the push that flips a waiting
 *   student into the paper with no polling.
 */
export type RunnerStep = "answer" | "review" | "submitted" | "score";
export type RunnerPhase =
  | "waiting"
  | "answering"
  | "review"
  | "submitted"
  | "score"
  | "expired"
  | "closed";

export function runnerPhase(input: {
  joinStatus: LiveSessionStatus;
  liveStatus: LiveSessionStatus | null;
  step: RunnerStep;
  closed: boolean;
  /**
   * THIS taker's own time has run out, on a public self-paced link.
   *
   * Distinct from `closed`, which means the room shut. A public room is `live`
   * forever, so its status can never report that a sitting is over — and
   * without a separate signal a student who reloads after expiry is handed the
   * paper back, then has every answer refused by the server with nothing on
   * screen to say why.
   */
  expired?: boolean;
}): RunnerPhase {
  const { joinStatus, liveStatus, step, closed, expired = false } = input;
  const status = liveStatus ?? joinStatus;

  // A student who already submitted keeps their confirmation or score even once
  // the run ends. The forced timer's auto-end lands seconds after their own
  // submit, and it must not overwrite the result they just earned. Expiry is
  // ranked below these for the same reason: their own submit came first.
  if (step === "submitted") return "submitted";
  if (step === "score") return "score";

  if (closed || status === "ended") return "closed";
  // Below "closed": an ended room is the bigger fact, and it is what the
  // student is told about a class run whose timer ran out.
  if (expired) return "expired";
  // Lobby outranks the step: a student cannot be answering a run that has not
  // started, whatever page they were left on.
  if (status === "lobby") return "waiting";

  return step === "review" ? "review" : "answering";
}

/**
 * Whether unsaved answers are still worth sending again. Only with the paper
 * open: on every other screen the server refuses them for good, and a tab left
 * open would retry forever.
 */
export function shouldRetrySaves(phase: RunnerPhase): boolean {
  return phase === "answering" || phase === "review";
}

/**
 * Whether highlights a failed heartbeat carried go out again on the next one.
 * Not after a 422: the same map would be refused every time, and take the
 * presence ping down with it.
 */
export function shouldResendHighlights(status: number | undefined): boolean {
  return status !== 422;
}

/**
 * Whether the runner should be asking for the paper at all.
 *
 * The API refuses `GET /{sid}/exercises` with 403 on a session still in the
 * lobby, so requesting it while waiting would render as "Couldn't load the
 * session" — a broken screen where the truth is simply "not yet". Gate the
 * fetch on this rather than handling the error.
 */
export function shouldLoadPaper(phase: RunnerPhase): boolean {
  return phase !== "waiting";
}

/**
 * Whether integrity signals should be reported.
 *
 * Off while waiting, and that is load-bearing rather than an optimisation: the
 * waiting room offers a "Leave for now" button, so a student stepping away is
 * something we invite. Reporting it would manufacture the very evidence the
 * risk score is meant to report. (The server also prices lobby events at zero,
 * so the two halves agree even against a stale client.)
 */
export function shouldReportProctoring(phase: RunnerPhase): boolean {
  return phase === "answering" || phase === "review";
}

/**
 * Whether the runner should hold the clipboard shut (`lib/use-copy-guard.ts`).
 *
 * Every phase that puts the paper on screen, which is one more than
 * `shouldReportProctoring`: the score screen is not "working" — nothing there
 * can earn a risk signal — but it is the whole paper WITH the answers and the
 * explanations, i.e. the most useful thing in Leap to hand to a classmate who
 * is still sitting it. The rest show a message and nothing else, and a student
 * whose exam is over should get their browser back.
 */
export function shouldBlockCopying(phase: RunnerPhase): boolean {
  return phase === "answering" || phase === "review" || phase === "score";
}
