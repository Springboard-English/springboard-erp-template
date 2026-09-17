import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `post_logout_redirect_uri` and `id_token_hint` travel together or not at all.
 *
 * Hydra validates the redirect against the client the id_token names, so the
 * redirect alone is a hard error — "Logout failed because query parameter
 * post_logout_redirect_uri is set but id_token_hint is missing" — shown on
 * Hydra's own error page. That is what pressing Logout did.
 */
describe("beginSignOut", () => {
    let assigned: string;

    beforeEach(() => {
        vi.resetModules();
        assigned = "";
        Object.defineProperty(window, "location", {
            configurable: true,
            value: {
                assign: (url: string) => (assigned = url),
                origin: "https://app.test",
            },
        });
    });

    // `vi.resetModules()` gives each test its own module graph — which is the
    // point, since the client keeps the id_token in module state — so the config
    // has to be set on the SAME instance the client will import.
    const load = async () => {
        const config = await import("../config");
        config.configureOidc({ issuer: "https://auth.test", clientId: "app" });
        return import("../client");
    };

    it("sends neither parameter when there is no id_token to hint with", async () => {
        const { beginSignOut } = await load();

        beginSignOut();

        const url = new URL(assigned);
        expect(url.pathname).toBe("/oauth2/sessions/logout");
        expect(url.searchParams.get("post_logout_redirect_uri")).toBeNull();
        expect(url.searchParams.get("id_token_hint")).toBeNull();
        // No trailing "?" left behind by an empty parameter set.
        expect(assigned.endsWith("/oauth2/sessions/logout")).toBe(true);
    });

    it("sends both once a session has been armed", async () => {
        const client = await load();
        // `arm` is internal; completing a sign-in is how an id_token arrives.
        // Stand in for it by driving the exchange the same way the callback does.
        const tokens = {
            access_token: "a",
            refresh_token: "r",
            id_token: "an-id-token",
            expires_in: 900,
        };
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify(tokens), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }),
        );
        sessionStorage.setItem("oidc.state", "s");
        sessionStorage.setItem("oidc.verifier", "v");
        await client.completeSignIn("?code=c&state=s");

        client.beginSignOut();

        const url = new URL(assigned);
        expect(url.searchParams.get("id_token_hint")).toBe("an-id-token");
        expect(url.searchParams.get("post_logout_redirect_uri")).toBeTruthy();
    });
});
