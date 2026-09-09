/**
 * A one-shot flag saying "the last thing that happened here was a sign-out".
 *
 * `sessionStorage` because it has to survive a full-page redirect to the
 * authorization server and back, and must not outlive the tab. Consuming it
 * clears it: the answer is only true once, for the render immediately after
 * the sign-out lands.
 */

const LOGOUT_TO_SIGN_IN_TRANSITION_KEY = "auth.transition.logout-to-sign-in";

export function markLogoutToSignInTransition(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(LOGOUT_TO_SIGN_IN_TRANSITION_KEY, "true");
}

export function consumeLogoutToSignInTransition(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const shouldTransition =
    window.sessionStorage.getItem(LOGOUT_TO_SIGN_IN_TRANSITION_KEY) === "true";
  window.sessionStorage.removeItem(LOGOUT_TO_SIGN_IN_TRANSITION_KEY);
  return shouldTransition;
}
