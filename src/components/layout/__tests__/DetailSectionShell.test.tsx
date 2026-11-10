import { fireEvent, render, screen, within } from "@testing-library/react";
import { Info, List, Users } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { MemoryRouter } from "react-router-dom";

import { DetailPendingView } from "../DetailLayout";
import { DetailSectionShell } from "../DetailSectionShell";

const items = [
    { value: "overview", label: "Overview", icon: List },
    { value: "people", label: "People", icon: Users, group: "people", pendingCount: 2 },
    { value: "details", label: "Details", icon: Info, pinnedEnd: true },
] as const;

/** Renders the shell over the three sample sections with Overview open. */
function renderShell(onChange = vi.fn()) {
    render(
        <DetailSectionShell
            items={[...items]}
            groups={[{ id: "people", label: "Students" }]}
            activeSection="overview"
            onChange={onChange}
            label="Record sections"
        >
            <p>Body</p>
        </DetailSectionShell>,
    );
    return onChange;
}

describe("DetailSectionShell", () => {
    it("puts the pinned section last in the sidebar, after the grouped ones", () => {
        renderShell();
        const nav = screen.getByRole("navigation", { name: "Record sections" });
        const labels = within(nav).getAllByRole("button").map((button) => button.textContent);
        expect(labels).toEqual(["Overview", "People, 2", "Details"]);
        expect(within(nav).getByRole("heading", { name: "Students" })).toBeInTheDocument();
    });

    it("keeps the pinned section at the narrow bar's fixed end", () => {
        renderShell();
        const bar = screen.getByRole("group", { name: "Record sections" });
        const buttons = within(bar).getAllByRole("button");
        const last = buttons[buttons.length - 1];
        expect(last.textContent).toBe("Details");
        expect(last.parentElement).not.toBe(buttons[0].parentElement);
    });

    it("marks the open section and reports a change, not a re-select", () => {
        const onChange = renderShell();
        const nav = screen.getByRole("navigation", { name: "Record sections" });
        expect(within(nav).getByRole("button", { name: "Overview" })).toHaveAttribute("aria-current", "page");
        fireEvent.click(within(nav).getByRole("button", { name: "Overview" }));
        expect(onChange).not.toHaveBeenCalled();
        fireEvent.click(within(nav).getByRole("button", { name: "Details" }));
        expect(onChange).toHaveBeenCalledWith("details");
    });

    it("draws the same navigation while the record loads", () => {
        render(
            <MemoryRouter>
                <DetailPendingView
                    breadcrumbs={[{ label: "Students", onClick: () => undefined }]}
                    sections={{ items: [...items], label: "Record sections" }}
                />
            </MemoryRouter>,
        );
        const nav = screen.getByRole("navigation", { name: "Record sections" });
        expect(within(nav).getByRole("button", { name: "Overview" })).toHaveAttribute("aria-current", "page");
    });

    it("names the unsaved-edit count instead of relying on colour", () => {
        renderShell();
        expect(screen.getAllByRole("img", { name: "2 unsaved changes" })).toHaveLength(2);
    });
});
