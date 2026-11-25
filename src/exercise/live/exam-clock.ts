// How the runner's clock warns that time is running out, as an invigilator
// would: the clock changes colour near the end, and a notice goes up at fixed
// points. Pure, so the thresholds are pinned by `exam-clock.test.ts`.

export type ClockTone = "calm" | "warning" | "critical";

const WARNING_MS = 5 * 60_000;
const CRITICAL_MS = 60_000;

/** Minutes left at which a notice goes up, largest first. */
export const TIME_WARNINGS_MIN = [10, 5, 1] as const;

export function clockTone(remainingMs: number | null): ClockTone {
  if (remainingMs === null) return "calm";
  if (remainingMs <= CRITICAL_MS) return "critical";
  if (remainingMs <= WARNING_MS) return "warning";
  return "calm";
}

/**
 * The notice due now, if any, and every threshold it settles.
 *
 * Only the nearest threshold is announced, so a student who reloads with three
 * minutes left hears "less than 5 minutes" once, not the 10-minute notice
 * first. Every threshold at or above the time left is marked as said, and none
 * is announced once time is up, since the auto-submit has its own notice.
 */
export function dueTimeWarning(
  remainingMs: number | null,
  announced: ReadonlySet<number>,
): { minutes: number; settles: number[] } | null {
  if (remainingMs === null || remainingMs <= 0) return null;
  const crossed = TIME_WARNINGS_MIN.filter((min) => remainingMs <= min * 60_000);
  const fresh = crossed.filter((min) => !announced.has(min));
  if (fresh.length === 0) return null;
  return { minutes: Math.min(...crossed), settles: crossed };
}
