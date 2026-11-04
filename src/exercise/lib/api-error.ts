// Read structurally: an app may throw its own error class, so `instanceof` against the template's `ApiError` would miss it.

/** The HTTP status an API error carries, or null when `err` is not one. */
export function errorStatus(err: unknown): number | null {
  if (typeof err !== "object" || err === null) return null;
  const status = (err as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

/** The server's explanation an API error carries, or null when there is none. */
export function errorDetail(err: unknown): string | null {
  if (typeof err !== "object" || err === null) return null;
  const detail = (err as { detail?: unknown }).detail;
  return typeof detail === "string" && detail ? detail : null;
}
