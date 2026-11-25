import { useAuth } from "../../exports";

import { useCurrentUser } from "./queries";
import { isFullscreenExempt } from "./fullscreen-exempt";
import { isGuestAccountType } from "./roles";

export interface FullscreenExemption {
  /** The signed-in account lifts the fullscreen lock. */
  exempt: boolean;
  /** The account is still being read — neither answer is known yet. */
  pending: boolean;
}

/**
 * The caller's fullscreen exemption, read live from `/v2/users/me`
 * (`useAuth().user` is a sign-in snapshot and carries no `info`).
 *
 * Not asked for a guest or a signed-out visitor: a guest's account is minted
 * the moment they join, so it can never carry the flag, and the play flow
 * makes no extra request. A failed read is not exempt.
 */
export function useFullscreenExempt(): FullscreenExemption {
  const { user, isAuthenticated } = useAuth();
  const canCarry = isAuthenticated && !isGuestAccountType(user?.account_type);
  const currentUser = useCurrentUser(canCarry);
  return {
    exempt: canCarry && isFullscreenExempt(currentUser.data?.info),
    pending: canCarry && currentUser.isPending,
  };
}
