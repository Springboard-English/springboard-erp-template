import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Renewal follows the SESSION, not the app.
 *
 * An OIDC session renews with its refresh_token grant. A guest sitting a public
 * self-paced test on Leap has no OIDC session at all — `POST /authenticate/guest`
 * hands back a first-party refresh COOKIE and a 15-minute access token — so if
 * this only ever asked Hydra, that guest is signed out mid-exam. `/refresh` is
 * still answering 200 in production for exactly those sessions.
 */
describe("refreshAccessToken", () => {
    beforeEach(() => {
        vi.resetModules();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("uses the OIDC grant when there is an OIDC session", async () => {
        const refreshSession = vi.fn().mockResolvedValue(true);
        vi.doMock("../../auth/oidc/client", () => ({
            hasOidcSession: () => true,
            refreshSession,
        }));
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        const { refreshAccessToken } = await import("../fetchWithRefresh");

        expect(await refreshAccessToken()).toBe(true);
        expect(refreshSession).toHaveBeenCalledOnce();
        // Nothing was asked of the API: no cookie exchange went out.
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("falls back to the refresh cookie for a guest, who has no OIDC session", async () => {
        const refreshSession = vi.fn().mockResolvedValue(false);
        vi.doMock("../../auth/oidc/client", () => ({
            hasOidcSession: () => false,
            refreshSession,
        }));
        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
            new Response(JSON.stringify({ access_token: "fresh", expires_at: 1 }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }),
        );

        const { refreshAccessToken } = await import("../fetchWithRefresh");

        expect(await refreshAccessToken()).toBe(true);
        expect(refreshSession).not.toHaveBeenCalled();

        const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
        expect(String(url)).toContain("/refresh");
        // The cookie IS the credential here, so this one request must send it.
        expect(init.credentials).toBe("include");
    });
});
