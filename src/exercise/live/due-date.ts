// The pure half of a share room's due date (`live_session.closes_at`).
//
// The due date is when the ROOM closes; `minutes` is how long ONE SITTING may
// last. They are independent, and the server holds a student to whichever comes
// first — so the client's job here is only to say which of the two a given
// deadline actually is, and to render it the way a person would read it.
//
// Everything in this file is pure and tested, because the two jobs below are
// both silently wrong rather than loudly broken when they are wrong: a due date
// rendered in the wrong zone sends a class home a day early, and a due date
// rendered as a countdown puts a 71-hour exam clock on a piece of homework.

import { dateLocale, type Translate } from "./i18n";

/**
 * Within this long of the bell, the due date is shown as a ticking countdown
 * rather than as a date.
 *
 * Two different questions wear the same clock. "When is this due?" is answered
 * by a date — nobody works to a 71-hour countdown, and a runner showing one
 * reads as an exam timer that has gone wrong. "How long have I got left?" is
 * answered by a countdown, and it is the only thing that matters in the last
 * stretch. One hour is where the second question takes over.
 */
export const DUE_SOON_MS = 60 * 60 * 1000;

/**
 * A due date as a person reads it, in the browser's own zone.
 *
 * Deliberately not pinned to Asia/Ho_Chi_Minh even though that is where every
 * student is: a device set to another zone is one a person is actually looking
 * at, and showing them a time their own clock disagrees with is how a deadline
 * gets missed. The server's refusal message names Ho Chi Minh time because it
 * has no device to ask.
 */
export function formatDueDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(dateLocale(), {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

/**
 * Is the deadline this attempt is being held to the ROOM's due date rather than
 * this person's own allowance?
 *
 * The server caps `Participant.deadline_at` at `closes_at`, and on an untimed
 * homework it IS `closes_at` — so the two being equal is exactly the case where
 * the student's clock is measuring the bell and not their sitting. Compared as
 * instants, not as strings: both come from the same server on the same request,
 * but one has been through a `datetime` and the other has not, and pinning this
 * to byte equality would make it fail on a trailing zero.
 */
export function isRoomDeadline(
  deadlineIso: string | null | undefined,
  closesAt: string | null | undefined,
): boolean {
  if (!deadlineIso || !closesAt) return false;
  const deadline = Date.parse(deadlineIso);
  const closes = Date.parse(closesAt);
  return (
    Number.isFinite(deadline) && Number.isFinite(closes) && deadline === closes
  );
}

/**
 * What the runner's clock should say: a countdown, a due date, or nothing.
 *
 * `format` is `formatRemaining` from `use-session-timer` — passed in rather than
 * imported so this module stays free of the timer's ticking half, which is a
 * hook.
 */
export function timeLeftLabel(
  remainingMs: number | null,
  deadlineIso: string | null | undefined,
  closesAt: string | null | undefined,
  format: (ms: number) => string,
  t: Translate,
): string | undefined {
  if (remainingMs === null) return undefined;
  if (isRoomDeadline(deadlineIso, closesAt) && remainingMs > DUE_SOON_MS) {
    const due = formatDueDate(closesAt);
    return due ? t("exercise.live.dueDate.due", "Due {due}", { due }) : undefined;
  }
  return format(remainingMs);
}

/**
 * An ISO instant as the value an `<input type="datetime-local">` wants:
 * `YYYY-MM-DDTHH:mm`, in LOCAL time and with no zone on it.
 *
 * The input has no zone of its own — it shows whatever string it is given and
 * hands one back — so converting through `toISOString()` here would shift the
 * displayed time by the offset and a teacher in Vietnam would open their own
 * 23:59 deadline and find 16:59 in the box.
 */
export function toDateTimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/** Exactly what `<input type="datetime-local">` produces, seconds optional. */
const DATE_TIME_LOCAL = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/;

/**
 * The inverse: what the input holds, as the ISO instant the API takes.
 *
 * Returns null for an empty or half-typed box, which is what "there is nothing
 * to save" looks like.
 *
 * **The shape is checked before anything is parsed, and the parts are assembled
 * by hand**, because `new Date(string)` is wrong here in two ways that both fail
 * quietly. A half-typed `"2026-09-"` is not rejected — it becomes 1 September —
 * so a teacher mid-keystroke would have a real, wrong date waiting to be saved.
 * And the zone a bare string is read in depends on its SHAPE: a date-only string
 * is UTC while a date-and-time string is local, so the same box would change
 * meaning by seven hours as the teacher finished typing it.
 */
export function fromDateTimeLocal(value: string): string | null {
  const match = DATE_TIME_LOCAL.exec(value.trim());
  if (!match) return null;
  const [, year, month, day, hour, minute] = match;
  // Local time, explicitly — that is what the input means, and the API reads a
  // timestamp with no offset as UTC, so it must be resolved here rather than
  // sent bare.
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
  if (Number.isNaN(date.getTime())) return null;
  // The constructor rolls 31 February over into March rather than refusing it,
  // so a date that came back different from what was typed was never a date.
  if (date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) {
    return null;
  }
  return date.toISOString();
}

/** Has the due date already passed? The server refuses one that has. */
export function isDuePast(iso: string | null, now = Date.now()): boolean {
  if (!iso) return false;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) && ms <= now;
}
