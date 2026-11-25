// A disposable account minted for someone opening a public self-paced link: a
// real signed-in account with no workspace. Mirrors GUEST_ACCOUNT_TYPE on the API.
export const GUEST_ACCOUNT_TYPE = "guest";

/** Whether an account type is the public link's guest. */
export function isGuestAccountType(accountType: string | null | undefined): boolean {
  return accountType === GUEST_ACCOUNT_TYPE;
}
