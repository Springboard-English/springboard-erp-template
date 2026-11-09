import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import PageActionBar, { fitPageActions } from "../PageActionBar";
import PageHeader from "../PageHeader";

describe("fitPageActions", () => {
    it("shows every button, and no menu, when they all fit", () => {
        expect(fitPageActions([100, 100], [false, false], 36, false, 208)).toEqual([true, true]);
    });

    it("moves buttons into the menu from the end, keeping room for the menu", () => {
        // 100 + 8 + 100 + 8 + 36 = 252 does not fit in 250; 100 + 8 + 36 does
        expect(fitPageActions([100, 100, 100], [false, false, false], 36, false, 250)).toEqual([true, false, false]);
    });

    it("keeps the main action until every other button has moved", () => {
        expect(fitPageActions([100, 100, 100], [true, false, false], 36, false, 150)).toEqual([true, false, false]);
        expect(fitPageActions([100, 100, 100], [false, false, true], 36, false, 150)).toEqual([false, false, true]);
    });

    it("keeps the menu's room when an action always lives there", () => {
        expect(fitPageActions([100, 100], [false, false], 36, true, 208)).toEqual([true, false]);
    });
});

describe("PageActionBar", () => {
    it("draws its buttons, with the destructive and overflow ones behind the menu", () => {
        const { container } = render(
            <MemoryRouter>
                <PageHeader
                    title="Results"
                    actions={
                        <PageActionBar
                            actions={[
                                { id: "runs", label: "All Runs", to: "/runs" },
                                { id: "export", label: "Export", onSelect: () => undefined },
                                { id: "regrade", label: "Regrade", overflow: true, onSelect: () => undefined },
                                { id: "delete", label: "Delete", destructive: true, onSelect: () => undefined },
                            ]}
                        />
                    }
                />
            </MemoryRouter>,
        );
        expect(screen.getByRole("link", { name: "All Runs" }).getAttribute("href")).toBe("/runs");
        expect(screen.getByRole("button", { name: "Export" })).toBeTruthy();
        expect(screen.getByRole("button", { name: "More actions" })).toBeTruthy();
        expect(screen.queryByRole("button", { name: "Delete" })).toBeNull();
        expect(container.querySelector("[data-page-header] [data-page-action-bar]")).not.toBeNull();
    });
});
