import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Two sign-ins for one app in one browser collide, and the loser must recover.
 *
 * Hydra names its login CSRF cookie per CLIENT — `ory_hydra_login_csrf_<hash>`,
 * one cookie for every flow of the same `client_id` — so a second
 * `/oauth2/auth` overwrites the first's value and the first can never be
 * verified. Reproduced against the dev issuer on 2026-09-20: accepting flow A's
 * login challenge while the browser held flow B's cookie answered
 *
 *     303 → /oauth/callback?error=request_forbidden&error_description=The
 *     request is not allowed. The CSRF value from the token does not match the
 *     CSRF value from the data store.
 *
 * — delivered to the APP, which is why it surfaced as that sentence on the
 * callback screen. A browser restoring several tabs of the same app does
 * exactly this: every tab boots with an empty in-memory token and calls
 * `beginSignIn`, and all but the last lose.
 */
describe("an authorization that lost the CSRF race", () => {
    let assigned: string[];

    beforeEach(() => {
        vi.resetModules();
        vi.useRealTimers();
        assigned = [];
        sessionStorage.clear();
        Object.defineProperty(window, "location", {
            configurable: true,
            value: {
                assign: (url: string) => assigned.push(url),
                origin: "https://app.test",
                pathname: "/oauth/callback",
                search: "",
            },
        });
    });

    const load = async () => {
        const config = await import("../config");
        config.configureOidc({ issuer: "https://auth.test", clientId: "app" });
        return import("../client");
    };

    it("is reported with Hydra's code, not its prose", async () => {
        const { completeSignIn, OidcAuthError } = await load();

        const caught = await completeSignIn(
            "?error=request_forbidden&error_description=The+request+is+not+allowed.",
        ).catch((error: unknown) => error);

        expect(caught).toBeInstanceOf(OidcAuthError);
        expect((caught as InstanceType<typeof OidcAuthError>).code).toBe(
            "request_forbidden",
        );
        expect((caught as InstanceType<typeof OidcAuthError>).retryable).toBe(
            true,
        );
    });

    /**
     * The one that would be a redirect loop. A scope the Hydra client is not
     * registered with fails the whole authorize request before the login page
     * renders, so it takes sign-in down for everyone — retrying would hide that
     * behind an infinite bounce off the authorization server.
     */
    it.each(["invalid_scope", "invalid_client", "access_denied"])(
        "is not retried for %s",
        async (code) => {
            const { completeSignIn, OidcAuthError } = await load();

            const caught = (await completeSignIn(`?error=${code}`).catch(
                (error: unknown) => error,
            )) as InstanceType<typeof OidcAuthError>;

            expect(caught).toBeInstanceOf(OidcAuthError);
            expect(caught.retryable).toBe(false);
        },
    );

    it("starts a fresh flow, keeping where the first one was headed", async () => {
        const { beginSignIn, retryAuthorization } = await load();

        await beginSignIn("/classes/42");
        expect(assigned).toHaveLength(1);
        const first = new URL(assigned[0]);

        expect(await retryAuthorization()).toBe(true);

        expect(assigned).toHaveLength(2);
        const second = new URL(assigned[1]);
        expect(second.pathname).toBe("/oauth2/auth");
        // A new flow, not a replay: its own state and its own PKCE challenge.
        expect(second.searchParams.get("state")).not.toBe(
            first.searchParams.get("state"),
        );
        expect(second.searchParams.get("code_challenge")).not.toBe(
            first.searchParams.get("code_challenge"),
        );
        // And it still lands where the user was going, not on the callback route.
        expect(sessionStorage.getItem("oidc.return_to")).toBe("/classes/42");
    });

    it("gives up rather than looping, and a sign-in resets the budget", async () => {
        const { retryAuthorization, clearAuthRetries } = await load();

        expect(await retryAuthorization()).toBe(true);
        expect(await retryAuthorization()).toBe(true);
        expect(await retryAuthorization()).toBe(true);
        expect(await retryAuthorization()).toBe(false);

        clearAuthRetries();
        expect(await retryAuthorization()).toBe(true);
    });
});

/**
 * `OidcBoot` calls `beginSignIn` during RENDER, deliberately — an effect would
 * run after the children it exists to keep unmounted have mounted. A render can
 * happen more than once before `location.assign` commits, and a second call
 * would overwrite the verifier and state the first stored, leaving a code that
 * cannot be exchanged.
 */
describe("beginSignIn", () => {
    let assigned: string[];

    beforeEach(() => {
        vi.resetModules();
        assigned = [];
        sessionStorage.clear();
        Object.defineProperty(window, "location", {
            configurable: true,
            value: {
                assign: (url: string) => assigned.push(url),
                origin: "https://app.test",
            },
        });
    });

    /**
     * The guard must not latch on a flow that never left. `crypto.subtle` is
     * undefined outside a secure context and `http://` still answers on these
     * hosts, so this is reachable — and a latched guard would leave the tab
     * unable to sign in for the life of the page.
     */
    it("can be retried after a failure that never reached the redirect", async () => {
        const config = await import("../config");
        config.configureOidc({ issuer: "https://auth.test", clientId: "app" });
        const { beginSignIn } = await import("../client");

        const subtle = crypto.subtle;
        Object.defineProperty(crypto, "subtle", {
            configurable: true,
            value: undefined,
        });
        await expect(beginSignIn("/a")).rejects.toThrow();
        expect(assigned).toHaveLength(0);

        Object.defineProperty(crypto, "subtle", {
            configurable: true,
            value: subtle,
        });
        await beginSignIn("/a");
        expect(assigned).toHaveLength(1);
    });

    it("starts one flow per page load however often it is called", async () => {
        const config = await import("../config");
        config.configureOidc({ issuer: "https://auth.test", clientId: "app" });
        const { beginSignIn } = await import("../client");

        await Promise.all([
            beginSignIn("/a"),
            beginSignIn("/a"),
            beginSignIn("/a"),
        ]);

        expect(assigned).toHaveLength(1);
    });
});
