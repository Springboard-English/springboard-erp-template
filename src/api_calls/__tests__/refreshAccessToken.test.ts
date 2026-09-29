import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Renewal is OIDC, or whatever the app registered — never the API's `/refresh`.
 *
 * A failed OIDC renewal used to fall back to the first-party refresh cookie,
 * and a stale cookie from an old sign-in minted a token from a different issuer
 * carrying every role the person holds. So nothing here may reach the API.
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
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("fails without an OIDC session and sends nothing", async () => {
        vi.doMock("../../auth/oidc/client", () => ({
            hasOidcSession: () => false,
            refreshSession: vi.fn(),
        }));
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        const { refreshAccessToken } = await import("../fetchWithRefresh");

        expect(await refreshAccessToken()).toBe(false);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("asks the app's renewer, and only when there is no OIDC session", async () => {
        const refreshSession = vi.fn().mockResolvedValue(true);
        let oidc = false;
        vi.doMock("../../auth/oidc/client", () => ({
            hasOidcSession: () => oidc,
            refreshSession,
        }));
        const renew = vi.fn().mockResolvedValue(true);

        const { configureSessionRenewal, refreshAccessToken } = await import(
            "../fetchWithRefresh"
        );
        configureSessionRenewal(renew);

        expect(await refreshAccessToken()).toBe(true);
        expect(renew).toHaveBeenCalledOnce();

        oidc = true;
        await refreshAccessToken();
        expect(renew).toHaveBeenCalledOnce();
        expect(refreshSession).toHaveBeenCalledOnce();
    });
});
