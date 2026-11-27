// Role detection from the `/users/me` response. The erp-template's
// `useAuth().user` (populated by `fetchCurrentUser`) carries `account_type`,
// whose values are "student", "employee", or "applicant". Leap has exactly two
// experiences — the teacher studio (employees) and the student space — and no
// one else is allowed in: any other account_type returns `null` and is blocked.
export type AppRole = "teacher" | "student";

// "Local mode" = running under the Vite dev server (`npm run dev`). Vite sets
// `import.meta.env.DEV` true only then and false for any built/deployed bundle
// (same signal `config/api.ts` uses). In local mode the account_type guard is
// disabled so any authenticated account can get into the studio during dev.
export function isLocalMode(): boolean {
  return import.meta.env.DEV;
}

// A disposable account minted for someone opening a public self-paced test
// link. It is a real signed-in account — that is what lets the runner and every
// live-session call work for them unchanged — but it is NOT a student: it has no
// dashboard, no scores history and no workspace. `roleForAccountType` therefore
// keeps returning null for it, and `isGuestAccountType` is what the play flow
// asks instead. Mirrors GUEST_ACCOUNT_TYPE on the API.
export const GUEST_ACCOUNT_TYPE = "guest";

export function isGuestAccountType(
  accountType: string | null | undefined,
): boolean {
  return accountType === GUEST_ACCOUNT_TYPE;
}

export function roleForAccountType(accountType: string | null | undefined): AppRole | null {
  if (accountType === "student") return "student";
  if (accountType === "employee") return "teacher";
  // A guest belongs to no workspace. Falling through to the local-dev escape
  // hatch below would hand them the teacher studio on a dev build, which is
  // exactly the class of "works locally, fails on deploy" this guard exists for.
  if (isGuestAccountType(accountType)) return null;
  // Local dev: guard disabled — let any other account_type in as a teacher so
  // the studio is reachable without a matching account. Blocked in production.
  return isLocalMode() ? "teacher" : null;
}

/**
 * Whether the account may file a "Report a problem" ticket: staff only. Asked of
 * the account_type itself, not the role, because the local-dev escape hatch
 * gives non-staff accounts the teacher role.
 */
export function canReportProblem(accountType: string | null | undefined): boolean {
  return accountType === "employee";
}

/**
 * Whether the account may take a seat in a challenge: a student, a guest or an
 * app.springboard.vn learner. Staff follow a run from its monitor instead, and
 * the API refuses their join with 403. Mirrors
 * LIVE_SESSION_TAKER_ACCOUNT_TYPES on the API, so the local-dev escape hatch
 * does not apply.
 */
export function canJoinLiveSession(accountType: string | null | undefined): boolean {
  return accountType === "student" || accountType === "learner" || isGuestAccountType(accountType);
}

/** Whether the account_type is permitted to use Leap at all. */
export function isAllowedAccountType(accountType: string | null | undefined): boolean {
  return roleForAccountType(accountType) !== null;
}
