import type { ReactNode } from "react";

import { getAccessToken } from "../accessToken";
import { consumeLogoutToSignInTransition } from "../transitionStorage";
import { beginSignIn } from "./client";
import { isOidcEnabled, OIDC_CONFIG } from "./config";

export interface OidcBootProps {
    children: ReactNode;
    /**
     * @deprecated No longer rendered. A sign-out goes straight to the sign-in
     * page rather than to an interstitial. Still accepted so that passing it is
     * not a build error in an app that has not dropped the prop yet.
     */
    signedOutMessage?: string;
    /** @deprecated No longer rendered. See {@link OidcBootProps.signedOutMessage}. */
    signInLabel?: string;
}


/**
 * Sits **above** `AuthProvider` and decides whether the app should boot at all.
 *
 * Why it has to be above it: `AuthProvider` bootstraps by calling
 * `/v2/users/me`, and treats failure as "logged out" — it clears the stored
 * user and the transport's 401 handling calls `/logout` and fires
 * `AUTH_SESSION_EXPIRED_EVENT` on the way. Under OIDC that is exactly what
 * happens on every reload, because the access token lives in memory and a
 * reload has none. The bootstrap would race the restore, and lose noisily.
 *
 * So when there is no token, we never render the provider — we go straight to
 * the authorization server instead. With a live Hydra session that round trip
 * is invisible; without one the user sees the sign-in page, which is correct.
 *
 * Two exemptions, and both matter:
 *
 * - **The callback route**, which is mid-flow and legitimately has no token
 *   yet. Redirecting from there would loop forever.
 * - **OIDC not configured**, which is every build without `VITE_OIDC_ISSUER`.
 *   Then this is a pass-through and the app boots exactly as it always has.
 */
// The two deprecated props are accepted and not destructured: naming them here
// would be an unused binding, and dropping them from the interface would break
// an app still passing one.
export default function OidcBoot({ children }: OidcBootProps) {
    if (!isOidcEnabled()) {
        return <>{children}</>;
    }

    const onCallback = window.location.pathname.endsWith(
        OIDC_CONFIG.callbackRoute,
    );
    if (onCallback || getAccessToken()) {
        return <>{children}</>;
    }

    // Someone who just pressed Logout goes to the sign-in page, not to an
    // interstitial telling them they signed out. It is the same redirect as
    // below; the flag is still consumed here so it cannot survive into the next
    // boot and be read as a sign-out that never happened.
    //
    // This is safe only because RP-initiated logout actually ends Hydra's
    // session now — it was sending `post_logout_redirect_uri` with no
    // `id_token_hint`, which Hydra refuses outright. While that was broken, an
    // automatic redirect here would have completed silently against the
    // surviving session and put the person straight back where they were, with
    // nothing on screen to say the Logout button had failed. If that regresses,
    // this is where it hides.
    consumeLogoutToSignInTransition();

    // Read during render rather than in an effect, deliberately: an effect runs
    // after the children mount, which is precisely the mount we are trying to
    // prevent. Navigating away means nothing below ever renders.
    void beginSignIn(window.location.pathname + window.location.search);
    return null;
}
