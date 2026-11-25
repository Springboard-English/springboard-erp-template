// A per-account switch that lifts the live runner's fullscreen lock.
//
// Read from the `info` blob on `/v2/users/me` — the same place as the welcome
// acknowledgement (`welcome-ack.ts`), under a flat top-level key for the same
// reason: the API shallow-merges `info` one level deep. Leap never writes it; it
// is set on the account by whoever grants the exemption.
//
// Exempt lifts the lock: the runner draws no FullscreenGate, and a device that
// cannot hold the lock (`device-support.ts`) is not reported as
// `fullscreen-unsupported`, since the account was never held to it. Every other
// proctor signal is untouched — see the note at `useProctoring` in the runner.
//
// Not a security boundary. `info` on your own record is patchable with no scope
// (the API's `endpoint_patch_own_v2` exempts it), so a student who knows this
// key can set it on themselves.
export const FULLSCREEN_EXEMPT_INFO_KEY = "leap_fullscreen_exempt";

/**
 * Whether this record lifts the fullscreen lock. Only a literal `true` does: the
 * safe answer to a malformed value is the lock, not the exemption.
 */
export function isFullscreenExempt(
  info: Record<string, unknown> | null | undefined,
): boolean {
  return info?.[FULLSCREEN_EXEMPT_INFO_KEY] === true;
}
