// Leap's feedback moments and context. The SDK, the dev_ prefix, score bands
// and hiding surveys on busy screens live in the template's `/feedback` entry;
// this is only what Leap reports.

/** The moments Leap reports. Formbricks maps each to a survey; Leap never picks the survey. */
export const FEEDBACK_ACTIONS = {
  /** A student's paper was handed in (the confirmation or score screen). */
  runSubmitted: "run_submitted",
  /** The released score fell in the low band. Fires after `runSubmitted`. */
  runScoredLow: "run_scored_low",
  /** The student's first ever sitting was handed in (fires alongside `runSubmitted`). */
  firstRunSubmitted: "first_run_submitted",
  /** A teacher opened a run's results. */
  resultsViewed: "results_viewed",
  /** A teacher created a test. */
  testCreated: "test_created",
} as const;

/** Every context key Leap sends; unset ones are cleared on each report. Never names, answers or scores. */
export const FEEDBACK_CONTEXT_KEYS = [
  "account_type",
  "test_key",
  "live_session_key",
  "run_key",
  "delivery",
  "score_band",
] as const;

/** The role a feedback answer is filed under. */
export type FeedbackRole = "student" | "teacher" | "guest";
