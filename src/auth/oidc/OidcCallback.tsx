import { useEffect, useRef, useState } from "react";
import { useHref, useNavigate } from "react-router-dom";

import { fetchWithRefresh } from "../../api_calls/fetchWithRefresh";
import { API_CONFIG } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import {
    clearAuthRetries,
    completeSignIn,
    endSession,
    OidcAuthError,
    retryAuthorization,
} from "./client";
import { OIDC_CONFIG } from "./config";

export interface OidcCallbackProps {
    /** Where "Back to sign in" goes. Defaults to `OIDC_CONFIG.signInRoute`. */
    signInRoute?: string;
    pendingLabel?: string;
    backLabel?: string;
}

function stripBasename(path: string, basename: string): string {
    if (!basename) return path;
    if (path === basename) return "/";
    return path.startsWith(`${basename}/`) || path.startsWith(`${basename}?`)
        ? path.slice(basename.length) || "/"
        : path;
}

/**
 * Where Hydra sends the browser back with `?code=…&state=…`.
 *
 * Exchanges the code, arms the token, loads the user, and gets out of the way.
 * It renders almost nothing on purpose — anything a person can read here they
 * read for a fraction of a second, and any state worth showing is either "still
 * working" or an error they can act on.
 */
export default function OidcCallback({
    signInRoute,
    pendingLabel = "Signing you in…",
    backLabel = "Back to sign in",
}: OidcCallbackProps = {}) {
    const navigate = useNavigate();
    // The router's base path ("" at the root, "/crm" for CRM).
    const basename = useHref("/").replace(/\/$/, "");
    const { setAuthenticatedUser } = useAuth();
    const [error, setError] = useState<string | null>(null);
    // React 18 mounts effects twice in StrictMode, and an authorization code is
    // single-use — a second exchange fails and would show an error over a
    // sign-in that actually worked.
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        (async () => {
            try {
                const returnTo = await completeSignIn(window.location.search);

                const response = await fetchWithRefresh(
                    `${API_CONFIG.baseURL}/v2/users/me`,
                    { headers: { Accept: "application/json" } },
                );
                if (!response.ok) {
                    throw new Error(
                        "Signed in, but your account could not be loaded.",
                    );
                }
                const body = await response.json();
                // v2 reads answer in an envelope; be tolerant of both shapes.
                setAuthenticatedUser(body?.objects?.[0] ?? body);

                clearAuthRetries();
                // `OidcBoot` stores the browser path, base included, and
                // `navigate` would prepend the base again — `/crm/crm/…`,
                // which only the catch-all matches.
                navigate(stripBasename(returnTo, basename), { replace: true });
            } catch (caught) {
                // A flow that lost the CSRF race is not a failed sign-in, it is
                // a tab that has to go round again — and saying so out loud is
                // worse than useless, because the sentence Hydra sends is about
                // its own cookie store and the person reading it can do nothing
                // with it. Run the flow again instead; this page keeps saying
                // "Signing you in…" while it does. See `OidcAuthError`.
                const raced =
                    caught instanceof OidcAuthError && caught.retryable;
                if (raced && (await retryAuthorization())) return;

                endSession();
                clearAuthRetries();
                setError(
                    raced
                        ? // The budget is spent, so this is the one case where
                          // the race is worth naming. Hydra's own sentence is
                          // about its cookie store and would only mislead.
                          "Sign-in kept being interrupted, usually by this app being open in more than one tab. Close the others and try again."
                        : caught instanceof Error
                          ? caught.message
                          : "Sign-in failed. Please try again.",
                );
            }
        })();
    }, [basename, navigate, setAuthenticatedUser]);

    if (error) {
        return (
            <div style={{ padding: "3rem", textAlign: "center" }}>
                <p>{error}</p>
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            stripBasename(
                                signInRoute ?? OIDC_CONFIG.signInRoute,
                                basename,
                            ),
                            { replace: true },
                        )
                    }
                >
                    {backLabel}
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: "3rem", textAlign: "center" }}>{pendingLabel}</div>
    );
}
