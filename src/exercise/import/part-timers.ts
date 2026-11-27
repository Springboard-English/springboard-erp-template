// A part's own timers as a teacher types them (minutes, may be blank) and as
// the API takes them on the link (seconds).

import type { PartTimers } from "./api";

/** The two timer boxes, as typed. */
export interface PartTimerDraft {
  limitMinutes: string;
  prepMinutes: string;
}

export const EMPTY_PART_TIMERS: PartTimerDraft = { limitMinutes: "", prepMinutes: "" };

const minutes = (raw: string): number | null => {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? Math.round(value * 60) : NaN;
};

/**
 * The link's timer fields, or a reason they can't be sent. Preparation needs a
 * time limit, and the limit is at most three hours, as the API checks.
 */
export function partTimersBody(draft: PartTimerDraft): { timers: PartTimers } | { error: "invalid" | "prepNeedsLimit" | "tooLong" } {
  const limit = minutes(draft.limitMinutes);
  const prep = minutes(draft.prepMinutes);
  if (Number.isNaN(limit) || Number.isNaN(prep)) return { error: "invalid" };
  if (prep !== null && limit === null) return { error: "prepNeedsLimit" };
  if (limit !== null && limit > 3 * 60 * 60) return { error: "tooLong" };
  const timers: PartTimers = {};
  if (limit !== null) timers.time_limit_seconds = limit;
  if (prep !== null) timers.preparation_seconds = prep;
  return { timers };
}
