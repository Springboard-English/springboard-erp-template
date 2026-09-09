/**
 * The authorization-code + PKCE client.
 *
 * Ordinary PKCE: generate a verifier, send its SHA-256 as the challenge, keep
 * the verifier, exchange it with the code. The only unusual part of this
 * deployment is invisible from here — the authorization server has no login
 * screen of its own and redirects to our API's bridge, which decides who the
 * user is and hands Hydra back the `appsheet_key` as the subject.
 *
 * **Tokens are held in memory only**, never in localStorage. That is the
 * standing rule in this codebase — an access token in a cookie is what broke
 * iOS sign-in, and a refresh token in localStorage is an XSS away from being
 * someone else's session. The cost is that a reload has no tokens and has to
 * re-authorize; with Hydra's own session that round trip is silent.
 */

import { clearAccessToken, setAccessToken } from "../accessToken";
import { OIDC_CONFIG } from "./config";

const VERIFIER_KEY = "oidc.verifier";
const STATE_KEY = "oidc.state";
const RETURN_KEY = "oidc.return_to";

/**
 * Set the moment a sign-out starts, and never cleared — the page is on its way
 * to the authorization server and this module dies with it.
 *
 * It exists because signing out and signing in are both redirects, and clearing
 * the auth state *causes* the second one: `logout()` sets `user = null`, React
 * re-renders, the guard sees an unauthenticated route and calls `beginSignIn()`
 * — all before `beginSignOut()` on the next line gets to navigate. Whichever
 * `location.assign` lands first wins, and when the login one won, Hydra's
 * session was still alive, so it completed silently and put the user straight
 * back where they started. It looks exactly like a Logout button that does
 * nothing.
 */
let signingOut = false;

/** In memory, deliberately. See the note at the top of this file. */
let refreshToken: string | null = null;
/** Kept only to hint the logout endpoint which session to end. */
let idToken: string | null = null;
let refreshTimer: number | null = null;
let refreshInFlight: Promise<boolean> | null = null;

function randomUrlSafe(bytes = 40): string {
    const raw = crypto.getRandomValues(new Uint8Array(bytes));
    return btoa(String.fromCharCode(...raw))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

async function s256(verifier: string): Promise<string> {
    const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(verifier),
    );
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

/**
 * Send the browser to Hydra.
 *
 * `sessionStorage`, not `localStorage`: the verifier is single-use and belongs
 * to this tab's flow. Two tabs signing in at once must not overwrite each
 * other's, and neither should outlive the tab.
 */
export async function beginSignIn(returnTo?: string): Promise<void> {
    // A sign-out already owns this page. Anything that notices the cleared
    // session and reaches for the authorization server is too late, and would
    // undo the sign-out.
    if (signingOut) return;

    const verifier = randomUrlSafe();
    const state = randomUrlSafe(16);

    sessionStorage.setItem(VERIFIER_KEY, verifier);
    sessionStorage.setItem(STATE_KEY, state);
    if (returnTo) sessionStorage.setItem(RETURN_KEY, returnTo);

    const params = new URLSearchParams({
        client_id: OIDC_CONFIG.clientId,
        response_type: "code",
        scope: OIDC_CONFIG.scope,
        redirect_uri: OIDC_CONFIG.redirectUri,
        audience: OIDC_CONFIG.audience,
        state,
        code_challenge: await s256(verifier),
        code_challenge_method: "S256",
    });

    window.location.assign(`${OIDC_CONFIG.issuer}/oauth2/auth?${params}`);
}

interface TokenResponse {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in?: number;
}

async function postToken(body: Record<string, string>): Promise<TokenResponse> {
    const response = await fetch(`${OIDC_CONFIG.issuer}/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        // No credentials: this is a PUBLIC client with no secret, and PKCE is
        // what proves possession instead.
        body: new URLSearchParams(body),
    });
    if (!response.ok) {
        throw new Error(`token endpoint answered ${response.status}`);
    }
    return response.json();
}

function arm(tokens: TokenResponse): void {
    const expiresAt = tokens.expires_in
        ? Math.floor(Date.now() / 1000) + tokens.expires_in
        : null;
    setAccessToken(tokens.access_token, expiresAt);
    if (tokens.refresh_token) refreshToken = tokens.refresh_token;
    if (tokens.id_token) idToken = tokens.id_token;
    scheduleRefresh(tokens.expires_in);
}

/**
 * Renew a minute before expiry rather than waiting for a 401.
 *
 * `fetchWithRefresh` answers a 401 by POSTing `/refresh` with the refresh
 * COOKIE — which this flow never sets, because the OAuth login page
 * deliberately returns only an accepted challenge and no first-party session.
 * So that fallback cannot work for an OIDC session, and renewing early is what
 * keeps it from ever being reached.
 */
function scheduleRefresh(expiresIn?: number): void {
    if (refreshTimer !== null) window.clearTimeout(refreshTimer);
    if (!expiresIn) return;

    const delay = Math.max((expiresIn - 60) * 1000, 5_000);
    refreshTimer = window.setTimeout(() => {
        void refreshSession();
    }, delay);
}

/** Single-flight: refresh tokens rotate, so two in parallel invalidate each other. */
export function refreshSession(): Promise<boolean> {
    if (!refreshToken) return Promise.resolve(false);
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
        try {
            const tokens = await postToken({
                grant_type: "refresh_token",
                refresh_token: refreshToken as string,
                client_id: OIDC_CONFIG.clientId,
            });
            arm(tokens);
            return true;
        } catch {
            // The refresh token is spent or revoked. Drop everything and let
            // the caller start a fresh authorization.
            endSession();
            return false;
        }
    })().finally(() => {
        refreshInFlight = null;
    });

    return refreshInFlight;
}

/**
 * Complete the redirect back from Hydra.
 *
 * Returns where to send the user next. Throws with a message worth showing if
 * the flow was tampered with or the exchange failed.
 */
export async function completeSignIn(search: string): Promise<string> {
    const params = new URLSearchParams(search);

    const error = params.get("error");
    if (error) {
        throw new Error(params.get("error_description") || error);
    }

    const code = params.get("code");
    const state = params.get("state");
    const expectedState = sessionStorage.getItem(STATE_KEY);
    const verifier = sessionStorage.getItem(VERIFIER_KEY);

    // `state` is what binds this response to the request THIS tab started. A
    // response carrying someone else's code is exactly what it exists to catch.
    if (!code || !state || !verifier || state !== expectedState) {
        throw new Error("This sign-in link is not valid. Please try again.");
    }

    sessionStorage.removeItem(VERIFIER_KEY);
    sessionStorage.removeItem(STATE_KEY);

    arm(
        await postToken({
            grant_type: "authorization_code",
            code,
            redirect_uri: OIDC_CONFIG.redirectUri,
            client_id: OIDC_CONFIG.clientId,
            code_verifier: verifier,
        }),
    );

    const returnTo = sessionStorage.getItem(RETURN_KEY);
    sessionStorage.removeItem(RETURN_KEY);
    return returnTo || "/";
}

export function endSession(): void {
    refreshToken = null;
    idToken = null;
    if (refreshTimer !== null) window.clearTimeout(refreshTimer);
    refreshTimer = null;
    clearAccessToken();
}

export function hasOidcSession(): boolean {
    return refreshToken !== null;
}

/**
 * Claim the page for a sign-out, before anything clears the auth state.
 *
 * Called at the top of a logout handler so that the re-render which follows
 * `logout()` cannot start a competing authorization. Separate from
 * `beginSignOut` because the API logout has to happen in between, and that is
 * an await — which is precisely where the race lives.
 */
export function markSigningOut(): void {
    signingOut = true;
}

/**
 * Sign out for real — RP-initiated logout, not just dropping our tokens.
 *
 * Clearing local state alone would be a lie: Hydra keeps its own SSO session,
 * so the next sign-in completes silently and the user, who just pressed Logout,
 * is back in without being asked for anything. On a shared machine that is the
 * whole problem.
 *
 * `id_token_hint` tells Hydra which session to end. Without it Hydra shows its
 * own "are you sure" screen, which we cannot style and the user has no reason
 * to expect.
 */
export function beginSignOut(): void {
    signingOut = true;
    const hint = idToken;
    endSession();

    const params = new URLSearchParams();
    if (hint) params.set("id_token_hint", hint);
    params.set("post_logout_redirect_uri", OIDC_CONFIG.postLogoutRedirectUri);

    window.location.assign(
        `${OIDC_CONFIG.issuer}/oauth2/sessions/logout?${params}`,
    );
}
