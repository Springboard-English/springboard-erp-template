import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "@/context/I18nContext";
import type { UserInfo } from "../../../api_calls/UserData";
import type { WidgetDefaults, WidgetDefinition, WidgetRegistry } from "../types";
import { WidgetFooter } from "../WidgetFooter";
import { WidgetList } from "../WidgetBodies";

const patchCurrentUserInfo = vi.fn();
const setAuthenticatedUser = vi.fn();
let currentUser: UserInfo;

vi.mock("../../../api_calls/UserData", () => ({
    patchCurrentUserInfo: (patch: Record<string, unknown>) => patchCurrentUserInfo(patch),
}));
vi.mock("../../../context/AuthContext", () => ({
    useAuth: () => ({ user: currentUser, setAuthenticatedUser }),
}));

const { default: WidgetBoard } = await import("../WidgetBoard");

beforeAll(() => {
    Element.prototype.hasPointerCapture ??= () => false;
    Element.prototype.setPointerCapture ??= () => undefined;
    Element.prototype.releasePointerCapture ??= () => undefined;
    Element.prototype.scrollIntoView ??= () => undefined;
});

function widget(id: string, extra: Partial<WidgetDefinition> = {}): WidgetDefinition {
    return {
        id,
        title: `Widget ${id}`,
        sizes: ["S", "M"],
        defaultSize: "M",
        render: ({ size }) => <p>{`body ${id} at ${size}`}</p>,
        ...extra,
    };
}

const REGISTRY: WidgetRegistry = [
    widget("a"),
    widget("b"),
    widget("c"),
    widget("secret", { scopes: ["payrolls_get"] }),
    widget("broken", {
        render: () => {
            throw new Error("boom");
        },
    }),
    widget("list", {
        render: ({ size }) => (
            <WidgetList
                size={size}
                moreHref="/all"
                rows={[1, 2, 3, 4].map((n) => ({ key: String(n), title: `row ${n}` }))}
            />
        ),
    }),
    widget("footer", {
        render: () => (
            <div>
                <p>footer body</p>
                <WidgetFooter>
                    <p>footer pager</p>
                </WidgetFooter>
            </div>
        ),
    }),
];

const DEFAULTS: WidgetDefaults = () => [
    { id: "a", widget: "a", size: "M" },
    { id: "b", widget: "b", size: "M" },
    { id: "secret", widget: "secret", size: "M" },
];

function renderBoard(info: Record<string, unknown> = {}) {
    currentUser = { name: "N", username: "n", sub: "s1", account_type: "employee", scope: "tasks_get", info };
    return render(
        <I18nProvider>
            <MemoryRouter>
                <WidgetBoard storageKey="dashboard_test" registry={REGISTRY} defaults={DEFAULTS} />
            </MemoryRouter>
        </I18nProvider>,
    );
}

describe("WidgetBoard", () => {
    beforeEach(() => {
        patchCurrentUserInfo.mockReset().mockImplementation(async (patch) => ({ ...currentUser, info: patch }));
        setAuthenticatedUser.mockReset();
        localStorage.clear();
    });

    it("shows the defaults the user may see, and none they may not", () => {
        renderBoard();
        expect(screen.getByText("body a at M")).toBeInTheDocument();
        expect(screen.getByText("body b at M")).toBeInTheDocument();
        expect(screen.queryByText(/body secret/)).not.toBeInTheDocument();
    });

    it("saves nothing when Done follows no change", async () => {
        const user = userEvent.setup();
        renderBoard();
        await user.click(screen.getByRole("button", { name: "Edit home" }));
        await screen.findByRole("button", { name: "Done" });
        await user.click(screen.getByRole("button", { name: "Done" }));
        expect(patchCurrentUserInfo).not.toHaveBeenCalled();
    });

    it("removes a widget and saves the layout to info in one write", async () => {
        const user = userEvent.setup();
        renderBoard();
        await user.click(screen.getByRole("button", { name: "Edit home" }));
        await screen.findByRole("button", { name: "Done" });
        await user.click(screen.getByRole("button", { name: "Remove Widget a" }));
        expect(patchCurrentUserInfo).not.toHaveBeenCalled();
        await user.click(screen.getByRole("button", { name: "Done" }));

        await waitFor(() => expect(patchCurrentUserInfo).toHaveBeenCalledTimes(1));
        expect(patchCurrentUserInfo).toHaveBeenCalledWith({
            dashboard_test: { v: 1, items: [{ id: "b", widget: "b", size: "M", config: undefined }] },
        });
        expect(setAuthenticatedUser).toHaveBeenCalled();
    });

    it("stores null when a customised user resets to the defaults", async () => {
        const user = userEvent.setup();
        renderBoard({ dashboard_test: { v: 1, items: [{ id: "c", widget: "c", size: "S" }] } });
        expect(screen.getByText("body c at S")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: "Edit home" }));
        await screen.findByRole("button", { name: "Done" });
        await user.click(screen.getByRole("button", { name: "Reset to default" }));
        await user.click(screen.getByRole("button", { name: "Done" }));

        await waitFor(() => expect(patchCurrentUserInfo).toHaveBeenCalledWith({ dashboard_test: null }));
    });

    it("keeps one failing widget from taking the others down", () => {
        renderBoard({
            dashboard_test: {
                v: 1,
                items: [
                    { id: "x", widget: "broken", size: "M" },
                    { id: "a", widget: "a", size: "M" },
                ],
            },
        });
        expect(screen.getByRole("alert")).toHaveTextContent("This widget couldn't load.");
        expect(screen.getByText("body a at M")).toBeInTheDocument();
    });

    it("puts a widget's footer at the bottom of its card, after the content", () => {
        renderBoard({ dashboard_test: { v: 1, items: [{ id: "f", widget: "footer", size: "M" }] } });
        const body = screen.getByText("footer body");
        const pager = screen.getByText("footer pager");
        // Portalled out of the content into the card's last child.
        expect(body.contains(pager)).toBe(false);
        expect(pager.closest("[data-slot='card']")?.lastElementChild).toBe(pager.parentElement);
        expect(body.compareDocumentPosition(pager) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it("pages a long list with back and next instead of a +N more link", async () => {
        const user = userEvent.setup();
        renderBoard({ dashboard_test: { v: 1, items: [{ id: "l", widget: "list", size: "M" }] } });
        expect(screen.getByText("row 1")).toBeInTheDocument();
        expect(screen.queryByText("row 4")).not.toBeInTheDocument();
        expect(screen.queryByText(/more/)).not.toBeInTheDocument();
        expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Next" }));
        expect(screen.getByText("row 4")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    });

    it("adds from the gallery, which offers only widgets the user may use", async () => {
        const user = userEvent.setup();
        renderBoard();
        await user.click(screen.getByRole("button", { name: "Edit home" }));
        await screen.findByRole("button", { name: "Done" });
        await user.click(screen.getByRole("button", { name: "Add widget" }));

        const sheet = await screen.findByRole("dialog");
        expect(within(sheet).queryByText("Widget secret")).not.toBeInTheDocument();
        await user.click(within(sheet).getByText("Widget c"));
        await user.click(within(sheet).getByRole("radio", { name: "Small" }));
        await user.click(within(sheet).getByRole("button", { name: "Add" }));

        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        expect(screen.getByText("body c at S")).toBeInTheDocument();
    });

    it("switches between the widgets of a stack with its tabs", async () => {
        const user = userEvent.setup();
        renderBoard({
            dashboard_test: {
                v: 1,
                items: [{ id: "s", size: "M", stack: [{ id: "s1", widget: "a" }, { id: "s2", widget: "b" }] }],
            },
        });
        expect(screen.getByText("body a at M")).toBeInTheDocument();
        await user.click(screen.getByRole("tab", { name: "Widget b" }));
        expect(screen.getByText("body b at M")).toBeInTheDocument();
        expect(screen.queryByText("body a at M")).not.toBeInTheDocument();
    });

    it("moves a widget later from its menu, without dragging", async () => {
        const user = userEvent.setup();
        renderBoard();
        await user.click(screen.getByRole("button", { name: "Edit home" }));
        await screen.findByRole("button", { name: "Done" });
        await user.click(await screen.findByRole("button", { name: "Options for Widget a" }));
        await user.click(await screen.findByRole("menuitem", { name: "Move later" }));
        await user.click(screen.getByRole("button", { name: "Done" }));

        await waitFor(() => expect(patchCurrentUserInfo).toHaveBeenCalledTimes(1));
        const saved = patchCurrentUserInfo.mock.calls[0][0].dashboard_test.items.map((e: { id: string }) => e.id);
        expect(saved).toEqual(["b", "a"]);
    });
});
