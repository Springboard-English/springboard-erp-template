import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DetailTabs } from "../DetailLayout";

describe("DetailTabs", () => {
    // The tab bar logs each button's box, and jsdom's rects lack `toJSON`.
    beforeEach(() => {
        vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
            x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON: () => ({}),
        } as DOMRect);
    });

    it("puts the trailing tabs after a gap at the end of the same bar", () => {
        const onChange = vi.fn();
        render(
            <DetailTabs
                tabs={[
                    { value: "timeline", label: "Timeline" },
                    { value: "people", label: "People" },
                ]}
                trailingTabs={[{ value: "details", label: "Details" }]}
                activeTab="timeline"
                onChange={onChange}
            />,
        );
        const buttons = screen.getAllByRole("button");
        expect(buttons.map((button) => button.textContent)).toEqual(["Timeline", "People", "Details"]);
        // The gap sits between the two groups, not before the first.
        const details = screen.getByRole("button", { name: "Details" });
        expect(details.previousElementSibling?.getAttribute("aria-hidden")).toBe("true");
        fireEvent.click(details);
        expect(onChange).toHaveBeenCalledWith("details");
    });

    it("lets a trailing tab be the active one", () => {
        render(
            <DetailTabs
                tabs={[{ value: "timeline", label: "Timeline" }]}
                trailingTabs={[{ value: "details", label: "Details" }]}
                activeTab="details"
                onChange={() => undefined}
            />,
        );
        expect(screen.getByRole("button", { name: "Details" })).toHaveClass("text-foreground");
        expect(screen.getByRole("button", { name: "Timeline" })).toHaveClass("text-muted-foreground");
    });
});
