import type { SessionParticipantResult } from "./api";
import type { Translate } from "./i18n";
import { formatMarks } from "./grading";

// Presentation helpers for the teacher Results Dashboard. The API's
// GET /v2/live-sessions/{sid}/results already does the aggregation (participant
// totals + per-question accuracy, straight from answer_event), so nothing here
// grades or sums answers — these only turn its numbers into percentages, and
// the table into CSV.

// Points arrive as `Numeric(12,4)` strings ("3.0000"); the template's `formatMarks` trims them to "3".
export { formatMarks };

/** A participant's score as a percentage of the test's earnable points. */
export function scorePercentage(points: number, maxPoints: number): number {
  return maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
}

/**
 * The score to show while some answers are still being marked.
 *
 * Written once because three screens need it — the results table, the teacher's
 * attempt view and the student's own score — and getting it wrong is invisible
 * rather than loud: it just renders a plausible number that happens to be the
 * wrong one.
 *
 * While anything is pending the percentage is over what has been MARKED, not
 * over the paper's total. Over the total, a student who wrote a good essay is
 * shown a score that counts it as zero — indistinguishable from having written a
 * bad one — and it then jumps once someone marks it, with nothing on screen to
 * explain the change. `provisional` is what a caller labels the number with, so
 * the change is never unexplained.
 */
export function provisionalScore(
  points: number,
  maxPoints: number,
  pending: number,
  markedPoints: number,
): { percentage: number; provisional: boolean } {
  const provisional = pending > 0;
  return {
    percentage: scorePercentage(points, provisional ? markedPoints : maxPoints),
    provisional,
  };
}

/**
 * An average or median in points to one decimal place ("73.4", "6"), or "—"
 * when the room has none. The API sends these as Decimal strings and an
 * average can run to 28 places, so this rounds where `formatMarks` keeps four.
 */
export function formatScore(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return String(parseFloat(n.toFixed(1)));
}

/** Participants who pressed submit (`finished_at` set by POST .../finish). */
export function finishedCount(participants: SessionParticipantResult[]): number {
  return participants.filter((p) => p.finished_at !== null).length;
}

/**
 * Mean progress through the test, as a percentage of its questions — "how far
 * the room got", which is not the same as how many submitted.
 */
export function averageCompletion(
  participants: SessionParticipantResult[],
  questionCount: number,
): number {
  if (participants.length === 0 || questionCount <= 0) return 0;
  const total = participants.reduce(
    (sum, p) => sum + Math.min(p.answered / questionCount, 1),
    0,
  );
  return Math.round((total / participants.length) * 100);
}

/**
 * A 0..1 percentile as a whole percentage, or "—" when there is none.
 *
 * The chart shows this on hover, and a tooltip must never be the only way to
 * reach a value — so the results table prints it in a column too, and both go
 * through here to be sure they agree.
 */
export function formatPercentile(
  value: number | string | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return "—";
  // The API sends it as a Decimal string ("0.6667"), like points, though the
  // type says number.
  const fraction = Number(value);
  if (!Number.isFinite(fraction)) return "—";
  return `${Math.round(Math.max(0, Math.min(1, fraction)) * 100)}%`;
}

/**
 * How long an attempt took, in milliseconds — or null when that is unknown.
 *
 * **Null is a real answer here and must stay one.** An attempt has no duration
 * until both ends exist: the student never opened the paper (`started_at`
 * null), never submitted (`finished_at` null), or sat the test before the API
 * recorded a start at all. The temptation is to fall back to `joined_at`, which
 * is always populated — and on a class run that is when they walked into the
 * lobby, so the fallback would quietly bill every student for however long the
 * teacher took to start, and bill whoever arrived earliest the most. A missing
 * number reads as missing; a wrong one reads as data.
 *
 * Negative durations are treated as unknown too. Nothing should produce one,
 * but the two timestamps come from different writes, and "-3 min" on a report a
 * teacher may show a student is worse than a dash.
 */
export function attemptDuration(attempt: {
  started_at: string | null;
  finished_at: string | null;
}): number | null {
  if (!attempt.started_at || !attempt.finished_at) return null;
  const started = new Date(attempt.started_at).getTime();
  const finished = new Date(attempt.finished_at).getTime();
  if (!Number.isFinite(started) || !Number.isFinite(finished)) return null;
  const elapsed = finished - started;
  return elapsed >= 0 ? elapsed : null;
}

/** A translator that always answers in English, for exported files. */
const ENGLISH: Translate = (_key, fallback = "", values = {}) =>
  fallback.replace(/\{(\w+)\}/g, (_, name: string) => String(values[name]));

/**
 * A duration a teacher reads at a glance: "38 min", "1h 04m", "45s".
 *
 * Leaving `t` out gives the English the CSV export uses; a screen passes its own.
 *
 * Minutes are the unit an exam is set in, so they lead; seconds appear only
 * below a minute, where "0 min" would be the only alternative. Past an hour it
 * pads the minutes, because these sit in a column and 1h 4m / 1h 40m are one
 * glance apart otherwise.
 */
export function formatDuration(ms: number | null, t: Translate = ENGLISH): string {
  if (ms === null) return "—";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return t("exercise.live.results.durationSeconds", "{s}s", { s: seconds });
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return t("exercise.live.results.durationMinutes", "{m} min", { m: minutes });
  return t("exercise.live.results.durationHours", "{h}h {m}m", {
    h: Math.floor(minutes / 60),
    m: String(minutes % 60).padStart(2, "0"),
  });
}

/** One CSV field, quoted when it holds a comma, a quote or a line break. */
export function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Results as CSV, in the column order the on-screen table uses. */
export function resultsCsv(
  participants: SessionParticipantResult[],
  maxPoints: number,
  questionCount: number,
): string {
  const header = [
    "Student",
    "Score %",
    "Percentile",
    "Correct",
    "Points",
    "Max points",
    "Answered",
    "Questions",
    "Started",
    "Submitted",
    "Time taken",
    // Appended rather than interleaved, so a spreadsheet built on the old
    // columns still lines up.
    "Marks pending",
    "Email",
    "Risk",
  ];
  const rows = participants.map((p) => [
    csvCell(p.display_name || "Student"),
    // The table's figure, not a second one: over what has been MARKED while
    // answers are pending, which "Marks pending" beside it explains. Over the
    // paper's total, an unmarked essay would export as a zero.
    provisionalScore(p.points, maxPoints, p.pending ?? 0, p.marked_points ?? 0)
      .percentage,
    p.percentile === null ? "" : Math.round(p.percentile * 100),
    p.correct,
    // Marks arrive as "3.0000" strings (Numeric on the API); the screen trims
    // them and so does the file.
    formatMarks(p.points),
    formatMarks(maxPoints),
    p.answered,
    questionCount,
    csvCell(p.started_at ?? ""),
    csvCell(p.finished_at ?? ""),
    // The formatted duration, not the raw milliseconds: this file is opened in
    // a spreadsheet by a teacher, and both ISO timestamps are already in the
    // row for anyone who wants to do their own arithmetic.
    csvCell(formatDuration(attemptDuration(p))),
    p.pending ?? 0,
    // A guest's typed address is readable nowhere else.
    csvCell(p.guest_email ?? ""),
    formatMarks(p.risk_score),
  ]);
  return [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
