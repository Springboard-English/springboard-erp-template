import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * `onSignedIn` sees the loaded user before the callback navigates, and can take
 * the browser elsewhere itself — the LMS uses it to hand a user to the build
 * their account is flagged into.
 */

const completeSignIn = vi.fn<(search: string) => Promise<string>>();
const setAuthenticatedUser = vi.fn();
const me = { username: "someone", info: { lms_variant: "b" } };

vi.mock("../client", () => ({
    completeSignIn: (search: string) => completeSignIn(search),
    clearAuthRetries: vi.fn(),
    endSession: vi.fn(),
    retryAuthorization: vi.fn(),
    OidcAuthError: class extends Error {},
}));
vi.mock("../../../api_calls/fetchWithRefresh", () => ({
    fetchWithRefresh: vi.fn(async () => ({
        ok: true,
        json: async () => ({ objects: [me] }),
    })),
}));
vi.mock("../../../context/AuthContext", () => ({
    useAuth: () => ({ setAuthenticatedUser }),
}));

const { default: OidcCallback } = await import("../OidcCallback");

function Where() {
    return <p data-testid="where">{useLocation().pathname}</p>;
}

function landAfterSignIn(
    onSignedIn?: (user: unknown, returnTo: string) => boolean,
) {
    completeSignIn.mockResolvedValue("/classes/7?tab=a");
    return render(
        <MemoryRouter initialEntries={["/oauth/callback?code=c&state=s"]}>
            <Routes>
                <Route
                    path="/oauth/callback"
                    element={<OidcCallback onSignedIn={onSignedIn} />}
                />
                <Route path="*" element={<Where />} />
            </Routes>
        </MemoryRouter>,
    );
}

describe("onSignedIn", () => {
    beforeEach(() => {
        completeSignIn.mockReset();
        setAuthenticatedUser.mockReset();
    });

    it("receives the stored user and the raw returnTo", async () => {
        const onSignedIn = vi.fn(() => false);
        landAfterSignIn(onSignedIn);
        await waitFor(() => expect(onSignedIn).toHaveBeenCalledTimes(1));
        expect(onSignedIn).toHaveBeenCalledWith(me, "/classes/7?tab=a");
        // The user is stored first, so whatever the hook does next reads it.
        expect(setAuthenticatedUser.mock.invocationCallOrder[0]).toBeLessThan(
            onSignedIn.mock.invocationCallOrder[0],
        );
    });

    it("returning false navigates as usual", async () => {
        const { getByTestId } = landAfterSignIn(() => false);
        await waitFor(() =>
            expect(getByTestId("where").textContent).toBe("/classes/7"),
        );
    });

    it("returning true suppresses the navigation", async () => {
        const onSignedIn = vi.fn(() => true);
        const { queryByTestId, getByText } = landAfterSignIn(onSignedIn);
        await waitFor(() => expect(onSignedIn).toHaveBeenCalled());
        expect(queryByTestId("where")).toBeNull();
        getByText("Signing you in…");
    });

    it("absent, navigates as usual", async () => {
        const { getByTestId } = landAfterSignIn();
        await waitFor(() =>
            expect(getByTestId("where").textContent).toBe("/classes/7"),
        );
    });
});
