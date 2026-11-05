// Pure rules for in-app feedback surveys, shared by every app that reports
// moments to Formbricks. The moments themselves (their names, where they fire)
// belong to each app; this is only how a moment becomes something Formbricks
// can match and how its context is shaped.

/** One value an app may attach to a feedback answer: keys and enums, never names or answers. */
export type FeedbackValue = string | number | boolean | null | undefined;

/** What rides on one report. `role` decides whether the person may be asked at all. */
export interface FeedbackContext {
  role: string;
  [key: string]: FeedbackValue;
}

/**
 * The action key Formbricks sees: `<app>_<moment>` from a production build,
 * `dev_<app>_<moment>` from anything else, so a dev bundle never opens a real
 * survey and a test survey can target the `dev_` twin.
 */
export function feedbackActionName(app: string, moment: string, isProduction: boolean): string {
  return `${isProduction ? "" : "dev_"}${app}_${moment}`;
}

export type ScoreBand = "low" | "mid" | "high";

/** A score as a coarse band, never the number: under 50% low, under 80% mid, else high. */
export function scoreBand(
  points: number | null | undefined,
  maxPoints: number | null | undefined,
): ScoreBand | null {
  if (points == null || maxPoints == null || !(maxPoints > 0)) return null;
  const ratio = points / maxPoints;
  if (ratio < 0.5) return "low";
  if (ratio < 0.8) return "mid";
  return "high";
}

/**
 * The context as Formbricks embedded data. Every key in `keys` is sent, unset
 * ones as `null` (which clears them, since the SDK's bag outlives one report);
 * a key not listed is never sent, whatever the context carries.
 */
export function embeddedData(
  context: FeedbackContext,
  keys: readonly string[],
): Record<string, string | number | boolean | null> {
  return Object.fromEntries(keys.map((key) => [key, context[key] ?? null]));
}

/** Guests (public links) are often outside candidates: asked only when an app opts in. */
export function mayAsk(role: string, askGuests: boolean): boolean {
  return role !== "guest" || askGuests;
}
