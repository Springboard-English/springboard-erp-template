// A question's marks as a teacher types them. The API stores two places
// (numeric(6,2)), so the inputs step by a quarter and keep part marks.

/** The step every marks input uses, so 0.5 and 1.25 are one arrow-press away. */
export const MARKS_STEP = 0.25;

/**
 * A typed mark as the number to send: never negative, rounded to two places,
 * and 0 for anything that is not a number. "0.5" stays 0.5; "1.257" is 1.26.
 */
export function marksFromInput(value: string): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100) / 100;
}
