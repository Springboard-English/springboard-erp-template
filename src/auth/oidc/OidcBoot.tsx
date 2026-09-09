import type { ReactNode } from "react";

import { getAccessToken } from "../accessToken";
import { consumeLogoutToSignInTransition } from "../transitionStorage";
import { beginSignIn } from "./client";
import { isOidcEnabled, OIDC_CONFIG } from "./config";

export interface OidcBootProps {
    children: ReactNode;
    /** Shown after an explicit sign-out, instead of signing straight back in. */
    signedOutMessage?: string;
    signInLabel?: string;
}

function SignedOut({ message, label }: { message: string; label: string }) {
    return (
        <div style={{ padding: "3rem", textAlign: "center" }}>
            <p>{message}</p>
            <button type="button" onClick={() => void beginSignIn()}>
                {label}
            </button>
        </div>
    );
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
export default function OidcBoot({
    children,
    signedOutMessage = "You have been signed out.",
    signInLabel = "Sign in",
}: OidcBootProps) {
    if (!isOidcEnabled()) {
        return <>{children}</>;
    }

    const onCallback = window.location.pathname.endsWith(
        OIDC_CONFIG.callbackRoute,
    );
    if (onCallback || getAccessToken()) {
        return <>{children}</>;
    }

    // Someone who just pressed Logout must not be signed straight back in.
    // If the authorization server's own session somehow survived — a failed
    // RP-initiated logout, a missing `id_token_hint` — an automatic redirect
    // would complete silently and land them exactly where they left. That is
    // indistinguishable from a broken Logout button, so after an explicit
    // sign-out we stop and let them choose.
    if (consumeLogoutToSignInTransition()) {
        return <SignedOut message={signedOutMessage} label={signInLabel} />;
    }

    // Read during render rather than in an effect, deliberately: an effect runs
    // after the children mount, which is precisely the mount we are trying to
    // prevent. Navigating away means nothing below ever renders.
    void beginSignIn(window.location.pathname + window.location.search);
    return null;
}
