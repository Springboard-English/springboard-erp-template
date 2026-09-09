/// <reference types="vite/client" />

/**
 * OIDC client configuration for signing in through Ory Hydra.
 *
 * **Unset means off.** Without an issuer and a client id an app behaves exactly
 * as it always has — `/login/password` and the Google button, tokens minted by
 * our own API. That is deliberate and matches how every other piece of this
 * pipeline shipped: inert until configured, one env var to enable, one to
 * revert.
 *
 * Shaped like `API_CONFIG`: env defaults, getters, and one `configure*` call
 * for an app that needs to override them at boot. The getters are not
 * decoration — `redirectUri` reads `window.location.origin`, and this package
 * must be importable from plain Node (`scripts/check-node-safe.mjs`), so
 * nothing here may touch the DOM at module scope.
 */

const env = (key: string): string =>
    (typeof import.meta !== "undefined" && import.meta.env
        ? (import.meta.env[key] as string | undefined)
        : undefined) || "";

interface OidcOverrides {
    issuer: string;
    clientId: string;
    /**
     * The scopes this app asks for. **Per app, deliberately** — the whole point
     * of moving each SPA onto its own client is that they stop sharing one
     * ceiling, and the measured overlap between them is 27%.
     *
     * The default is the protocol minimum and nothing else, so an app that
     * forgets to state its scopes gets a token that reads no data rather than
     * one that reads everything.
     */
    scope: string;
    audience: string;
    /** Must match a `redirect_uris` entry on the client registration exactly. */
    callbackRoute: string;
    /** Where `OidcCallback` sends someone whose sign-in failed. */
    signInRoute: string;
    postLogoutRedirectUri: string;
}

const overrides: Partial<OidcOverrides> = {};

const DEFAULT_CALLBACK_ROUTE = "/oauth/callback";
const DEFAULT_SIGN_IN_ROUTE = "/sign-in";
const PROTOCOL_SCOPES = "openid offline_access";

/**
 * Override any of the defaults at boot, before anything reads them.
 *
 * An app that ships its own client registration calls this from its entry
 * point; one that is configured entirely by `VITE_OIDC_*` never needs it.
 */
export function configureOidc(options: Partial<OidcOverrides>): void {
    Object.assign(overrides, options);
}

export const OIDC_CONFIG = {
    get issuer(): string {
        return (overrides.issuer ?? env("VITE_OIDC_ISSUER")).replace(/\/$/, "");
    },
    get clientId(): string {
        return overrides.clientId ?? env("VITE_OIDC_CLIENT_ID");
    },
    /**
     * `openid` gets an id_token, `offline_access` gets a REFRESH token —
     * without which the access token is all we ever hold and the session dies
     * after fifteen minutes. Both are always requested; an app's own scopes are
     * added to them, so no app can drop them by accident.
     */
    get scope(): string {
        const app = overrides.scope ?? env("VITE_OIDC_SCOPE");
        return app ? `${PROTOCOL_SCOPES} ${app}` : PROTOCOL_SCOPES;
    },
    /**
     * RFC 8707. Registering the client for this audience is NOT enough — Hydra
     * only puts `aud` on the token when the authorization request asks for it,
     * and our API refuses a token with an empty audience.
     */
    get audience(): string {
        return (
            overrides.audience ||
            env("VITE_OIDC_AUDIENCE") ||
            "https://api.springboard.vn"
        );
    },
    get callbackRoute(): string {
        return overrides.callbackRoute ?? DEFAULT_CALLBACK_ROUTE;
    },
    get signInRoute(): string {
        return overrides.signInRoute ?? DEFAULT_SIGN_IN_ROUTE;
    },
    /**
     * Where Hydra sends the browser back. Hydra matches this EXACTLY against
     * the client's registered `redirect_uris`, so it must be a literal the
     * client was registered with — not a computed origin that happens to look
     * right in production and not in a dev server.
     */
    get redirectUri(): string {
        return `${window.location.origin}${OIDC_CONFIG.callbackRoute}`;
    },
    get postLogoutRedirectUri(): string {
        return (
            overrides.postLogoutRedirectUri ??
            `${window.location.origin}${OIDC_CONFIG.signInRoute}`
        );
    },
};

/**
 * A function rather than a const, because `configureOidc` may run after this
 * module is imported — a const evaluated at import would answer for the state
 * before the app had configured anything.
 */
export function isOidcEnabled(): boolean {
    return Boolean(OIDC_CONFIG.issuer && OIDC_CONFIG.clientId);
}
