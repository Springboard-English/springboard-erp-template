import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchWithRefresh } from "../../api_calls/fetchWithRefresh";
import { API_CONFIG } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { completeSignIn, endSession } from "./client";
import { OIDC_CONFIG } from "./config";

export interface OidcCallbackProps {
    /** Where "Back to sign in" goes. Defaults to `OIDC_CONFIG.signInRoute`. */
    signInRoute?: string;
    pendingLabel?: string;
    backLabel?: string;
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

                navigate(returnTo, { replace: true });
            } catch (caught) {
                endSession();
                setError(
                    caught instanceof Error
                        ? caught.message
                        : "Sign-in failed. Please try again.",
                );
            }
        })();
    }, [navigate, setAuthenticatedUser]);

    if (error) {
        return (
            <div style={{ padding: "3rem", textAlign: "center" }}>
                <p>{error}</p>
                <button
                    type="button"
                    onClick={() =>
                        navigate(signInRoute ?? OIDC_CONFIG.signInRoute, {
                            replace: true,
                        })
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
