// Leap's in-app feedback: when each moment fires and what it carries. The SDK,
// the respondent pass and hiding surveys on busy screens come from the
// template's `/feedback` entry (configured once in src/index.tsx).

import { useEffect, useRef } from "react";
import {
  scoreBand,
  trackFeedback,
  type FeedbackContext,
} from "../../feedback";

import type {
  LiveSessionJoin,
  ParticipantResult,
  ParticipantSummary,
} from "./api";
import { FEEDBACK_ACTIONS, type FeedbackRole } from "./feedback-rules";
import { isGuestAccountType } from "./roles";

export { trackFeedback, useFeedbackSuppressed } from "../../feedback";

/** The role a feedback answer is filed under, from `/users/me`'s account type. */
export function feedbackRole(accountType: string | null | undefined): FeedbackRole {
  if (isGuestAccountType(accountType)) return "guest";
  return accountType === "employee" ? "teacher" : "student";
}

/**
 * Report a student's hand-in once per attempt, after the runner moves from the
 * paper to "submitted" or "score" in this visit (reopening a finished attempt
 * reports nothing). Waits for the student's own runs, which name the test and
 * say whether this was their first; a failed read still reports, unnamed.
 */
export function useRunSubmittedFeedback({
  step,
  join,
  result,
  runs,
  runsSettled,
  accountType,
}: {
  step: string;
  join: LiveSessionJoin | null | undefined;
  result: ParticipantResult | null;
  runs: ParticipantSummary[] | undefined;
  runsSettled: boolean;
  accountType: string | null | undefined;
}): void {
  const handedInHere = useRef(false);
  const reported = useRef<string | null>(null);
  const reportedLow = useRef<string | null>(null);

  useEffect(() => {
    if (step === "answer" || step === "review") handedInHere.current = true;
  }, [step]);

  useEffect(() => {
    if (!join || !handedInHere.current || (step !== "submitted" && step !== "score")) return;
    if (!runsSettled) return;
    const thisRun = runs?.find((run) => run.participant_key === join.participant_key);
    const band = scoreBand(result?.points, result?.max_points);
    const context: FeedbackContext = {
      role: feedbackRole(accountType),
      account_type: accountType ?? undefined,
      test_key: thisRun?.test_key,
      live_session_key: join.live_session_key,
      run_key: join.participant_key,
      delivery: join.delivery,
      score_band: band ?? undefined,
    };
    if (reported.current !== join.participant_key) {
      reported.current = join.participant_key;
      void trackFeedback(FEEDBACK_ACTIONS.runSubmitted, context);
      // Also its own moment, so a first-timer survey can target it; Formbricks
      // shows at most one survey at a time.
      if (runs?.length === 1 && thisRun !== undefined) {
        void trackFeedback(FEEDBACK_ACTIONS.firstRunSubmitted, context);
      }
    }
    // The score can arrive later than the hand-in; a low band is its own moment.
    if (band === "low" && reportedLow.current !== join.participant_key) {
      reportedLow.current = join.participant_key;
      void trackFeedback(FEEDBACK_ACTIONS.runScoredLow, context);
    }
  }, [step, join, result, runs, runsSettled, accountType]);
}

/** Report a teacher opening one run's results, once per run per page load, once its test is known. */
export function useResultsViewedFeedback(sessionKey: string, testKey: string | undefined): void {
  useEffect(() => {
    if (!testKey || reportedResults.has(sessionKey)) return;
    reportedResults.add(sessionKey);
    void trackFeedback(FEEDBACK_ACTIONS.resultsViewed, {
      role: "teacher",
      account_type: "employee",
      test_key: testKey,
      live_session_key: sessionKey,
    });
  }, [sessionKey, testKey]);
}

// Coming Back from a student's attempt remounts the results screen; one report per run.
const reportedResults = new Set<string>();
