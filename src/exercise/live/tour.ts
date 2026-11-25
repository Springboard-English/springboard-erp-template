// The live runner's guided-tour anchors: `data-tour` values an app's tour
// points at. The names are Leap's, so its tour keeps finding them.

export const TOUR_ANCHORS = {
  studentJoin: "student-join",
  runnerWaiting: "runner-waiting",
  runnerTimer: "runner-timer",
  runnerQuestionList: "runner-question-list",
  runnerReviewSummary: "runner-review-summary",
  runnerSubmitted: "runner-submitted",
  runnerScore: "runner-score",
} as const;

export type RunnerTourAnchor = (typeof TOUR_ANCHORS)[keyof typeof TOUR_ANCHORS];

/** The attribute that marks an element as a tour anchor. */
export function tourAnchorProps(name: RunnerTourAnchor): { "data-tour": RunnerTourAnchor } {
  return { "data-tour": name };
}
