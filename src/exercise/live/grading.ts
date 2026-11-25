import type { ParticipantResult } from "./api";
import type { GradedResult } from "./grading";
import { provisionalScore } from "./results";

// The view model and the blank check are the template's; Leap's screens keep importing them from here.
export { formatMarks, type GradedResult, unansweredNodeIds } from "../lib/grading";

// Score view models and pre-submit checks — no client-side grading.
//
// The API grades live sessions server-side (Postgres is the source of truth) and
// the results dashboard reads `GET /v2/live-sessions/{sid}/results`, so nothing
// in the app scores an attempt in the browser; re-deriving a score client-side
// would only invite it to disagree with the server's.
//
// Two things live here, and neither is a grader:
//
//  - `GradedResult` is a *view model*, built from the gated
//    `ParticipantResult` the API returns by `gradedFromResult` below, and handed
//    to ScoreSummary by both the runner's score step and the review screen.
//  - `unansweredNodeIds` is a pre-submit UI check — it asks what the student
//    left blank, which needs no answer key and so has no server to ask.

/**
 * The ScoreSummary's view model, from the gated API result.
 *
 * Pure, so the two screens that draw a student's score (the runner after
 * Submit, the review of a past run) cannot disagree about it. `gradable`
 * counts the items with a verdict — an unreached question carries
 * `correct: null` and stays out, as does an essay, marked or not. The
 * percentage is the provisional one while anything is unmarked; see
 * `provisionalScore`. Decimal fields arrive as strings, hence `Number`.
 */
export function gradedFromResult(result: ParticipantResult): GradedResult {
  const items = result.items ?? [];
  const correctByNode: Record<string, boolean> = {};
  for (const item of items) {
    correctByNode[item.exercise_key] = item.correct === true;
  }
  const points = Number(result.points ?? 0);
  const maxPoints = Number(result.max_points ?? 0);
  const pending = result.pending ?? 0;
  return {
    correct: result.correct ?? 0,
    gradable: items.filter((item) => item.correct !== null).length,
    points,
    maxPoints,
    percentage: provisionalScore(
      points,
      maxPoints,
      pending,
      Number(result.marked_points ?? 0),
    ).percentage,
    correctByNode,
    pending,
  };
}
