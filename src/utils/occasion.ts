/** A day that redraws the apps' backgrounds. */
export type Occasion = "womens-day" | "teachers-day";

/** Month-day in Vietnam's time, so each one runs midnight to midnight there. */
const OCCASION_DATES: Record<string, Occasion> = {
  "10-20": "womens-day",
  "11-20": "teachers-day",
};

const OCCASIONS = new Set<string>(Object.values(OCCASION_DATES));

/**
 * The occasion `now` falls on, or null. `?sb-occasion=womens-day` in `search`
 * previews one on any day. public/boot.js keeps its own copy of the dates,
 * since it runs before the app; change both together.
 */
export function currentOccasion(now: Date = new Date(), search = ""): Occasion | null {
  const preview = new URLSearchParams(search).get("sb-occasion");
  if (preview && OCCASIONS.has(preview)) return preview as Occasion;
  const vietnam = new Date(now.getTime() + 7 * 3600 * 1000);
  const month = String(vietnam.getUTCMonth() + 1).padStart(2, "0");
  const day = String(vietnam.getUTCDate()).padStart(2, "0");
  return OCCASION_DATES[`${month}-${day}`] ?? null;
}
