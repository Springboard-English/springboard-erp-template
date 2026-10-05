import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * An app served under a path — CRM at `/crm`, HRM at `/hrm` — must land back
 * where the sign-in started, not at its dashboard.
 *
 * `OidcBoot` runs outside the router, so the place it remembers is the whole
 * `window.location.pathname`, base path included. `navigate()` treats an
 * absolute path as relative to the router's `basename` and prepends it again:
 * `/crm/students/42` became `/crm/crm/students/42`, matched nothing, and the
 * catch-all sent every deep link — the LMS's "open in CRM" chevron included —
 * to the bare app.
 */

const completeSignIn = vi.fn<(search: string) => Promise<string>>();

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
        json: async () => ({ objects: [{ username: "someone" }] }),
    })),
}));
vi.mock("../../../context/AuthContext", () => ({
    useAuth: () => ({ setAuthenticatedUser: vi.fn() }),
}));

const { default: OidcCallback } = await import("../OidcCallback");

function Where() {
    return <p data-testid="where">{useLocation().pathname}</p>;
}

function landAfterSignIn(basename: string | undefined, returnTo: string) {
    completeSignIn.mockResolvedValue(returnTo);
    const { getByTestId } = render(
        <MemoryRouter
            basename={basename}
            initialEntries={[`${basename ?? ""}/oauth/callback?code=c&state=s`]}
        >
            <Routes>
                <Route path="/oauth/callback" element={<OidcCallback />} />
                <Route path="*" element={<Where />} />
            </Routes>
        </MemoryRouter>,
    );
    return getByTestId;
}

describe("the callback returns to the page the sign-in started on", () => {
    beforeEach(() => completeSignIn.mockReset());

    it("under a base path, from the full browser path OidcBoot stores", async () => {
        const getByTestId = landAfterSignIn("/crm", "/crm/students/42?tab=notes");
        await waitFor(() =>
            expect(getByTestId("where").textContent).toBe("/students/42"),
        );
    });

    it("under a base path, from a router path a guard stores", async () => {
        const getByTestId = landAfterSignIn("/crm", "/students/42");
        await waitFor(() =>
            expect(getByTestId("where").textContent).toBe("/students/42"),
        );
    });

    it("at the root, unchanged", async () => {
        const getByTestId = landAfterSignIn(undefined, "/management/classes/7");
        await waitFor(() =>
            expect(getByTestId("where").textContent).toBe(
                "/management/classes/7",
            ),
        );
    });
});
