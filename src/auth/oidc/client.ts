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
const RETRY_KEY = "oidc.retries";

/**
 * How many times one tab may restart an authorization that came back
 * retryable. Three covers a browser restoring a handful of tabs of the same app
 * at once (see {@link OidcAuthError}); past that something is wrong in a way a
 * fourth redirect will not fix, and looping would hide it.
 */
const MAX_AUTH_RETRIES = 3;

/**
 * An authorization the server refused, carrying the OAuth2 `error` code.
 *
 * The code is what decides whether to retry, and it has to be the code rather
 * than the sentence: `error_description` is English prose from Hydra that can
 * be reworded in any release, while `error` is the protocol.
 */
export class OidcAuthError extends Error {
    readonly code: string;

    constructor(code: string, description?: string | null) {
        super(description || code);
        this.name = "OidcAuthError";
        this.code = code;
    }

    /**
     * Whether starting a fresh authorization is likely to succeed.
     *
     * **`request_forbidden` is the one that matters, and it is not the caller's
     * fault.** Hydra names its login CSRF cookie per CLIENT —
     * `ory_hydra_login_csrf_<hash(client_id)>`, verified against production —
     * so two authorization flows for the same app in one browser share one
     * cookie and the second overwrites the first. The first flow can then never
     * be verified, and Hydra sends the app
     *
     *     error=request_forbidden
     *     error_description=The request is not allowed. The CSRF value from the
     *     token does not match the CSRF value from the data store.
     *
     * That is what a browser restoring several tabs of the same app does: each
     * tab boots with an empty in-memory token, each calls `beginSignIn`, and
     * every one but the last dies here. Nothing is wrong with the session — the
     * tab simply lost a race — so the answer is to run the flow again, which by
     * then usually completes silently against the session the winning tab
     * established.
     *
     * Everything else is deliberately NOT retried. `invalid_scope` in
     * particular is how a scope missing from the Hydra client registration
     * presents, and it takes sign-in down for everyone: retrying would turn a
     * loud outage into a redirect loop that hammers the authorization server
     * and tells nobody why.
     */
    get retryable(): boolean {
        return this.code === "request_forbidden";
    }
}

function readRetries(): number {
    return Number(sessionStorage.getItem(RETRY_KEY)) || 0;
}

/**
 * Restart an authorization that lost the CSRF race, if this tab has tries left.
 *
 * Returns false when the budget is spent, which is the caller's cue to show the
 * error instead. The wait is **jittered**, and that is the load-bearing part:
 * the tabs arriving here are the ones that just collided, so retrying them all
 * on the same tick would collide them again. Spreading them over a second lets
 * one land at a time.
 */
export async function retryAuthorization(): Promise<boolean> {
    const attempt = readRetries() + 1;
    if (attempt > MAX_AUTH_RETRIES) return false;

    sessionStorage.setItem(RETRY_KEY, String(attempt));
    await new Promise((resolve) =>
        window.setTimeout(resolve, Math.random() * 250 * 2 ** attempt),
    );

    // The one caller allowed to start a second flow in one page load. Today the
    // callback route never calls `beginSignIn` itself, so the guard would not be
    // set anyway — but relying on that makes this a silent no-op the day it
    // changes, and a no-op here leaves the screen saying "Signing you in…" for
    // ever, which is a worse failure than the one being fixed.
    authorizing = false;

    // No `returnTo`: the one this flow started with is still in sessionStorage,
    // and `beginSignIn` only overwrites it when given a new one. A retry must
    // land where the original attempt was headed, not at the callback route it
    // is currently sitting on.
    await beginSignIn();
    return true;
}

/** Called once a sign-in completes, so the next failure starts from zero. */
export function clearAuthRetries(): void {
    sessionStorage.removeItem(RETRY_KEY);
}

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

/** Set once this page load has committed to an authorization. See `beginSignIn`. */
let authorizing = false;

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

    // One flow per page load. `OidcBoot` calls this during RENDER — deliberately,
    // so nothing below it mounts — and a render can happen more than once before
    // `location.assign` commits. A second call would overwrite the verifier and
    // state the first one stored while the first navigation was still in flight,
    // so the code that came back could not be exchanged. Module state, so it
    // resets with the page: a retry after a failed flow is a new load and is not
    // blocked by this.
    if (authorizing) return;
    authorizing = true;

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
        throw new OidcAuthError(error, params.get("error_description"));
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
 * `id_token_hint` tells Hydra which session to end, and the two parameters go
 * together or not at all: `post_logout_redirect_uri` on its own is a hard
 * ERROR, not a softer logout. Hydra validates the redirect against the client
 * the id_token names, so with no hint there is no client to validate against
 * and it refuses the whole request —
 *
 *     Logout failed because query parameter post_logout_redirect_uri is set
 *     but id_token_hint is missing.
 *
 * — on Hydra's own error page, which is where pressing Logout used to land.
 * Without a hint we send neither and let Hydra ask and land on its own default;
 * that is a worse sign-out, but it is a sign-out.
 */
export function beginSignOut(): void {
    signingOut = true;
    const hint = idToken;
    endSession();

    const params = new URLSearchParams();
    if (hint) {
        params.set("id_token_hint", hint);
        params.set(
            "post_logout_redirect_uri",
            OIDC_CONFIG.postLogoutRedirectUri,
        );
    }

    const query = params.toString();
    window.location.assign(
        `${OIDC_CONFIG.issuer}/oauth2/sessions/logout${query ? `?${query}` : ""}`,
    );
}
