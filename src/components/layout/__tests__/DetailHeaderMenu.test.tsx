import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { DetailActionsMenu, DetailBreadcrumbs, DetailHeader, DetailHeaderActions, DetailView } from "../DetailLayout";
import PageActionBar from "../PageActionBar";

/** A record page whose header may carry its own "⋯" and whose section lifts a bar with a "⋯" item. */
function Page({ pageMenu, onTopics }: { pageMenu: boolean; onTopics: () => void }): ReactNode {
    return (
        <MemoryRouter>
            <DetailView>
                <DetailHeader
                    breadcrumbs={<DetailBreadcrumbs items={[]} current="CA27-34" />}
                    actions={
                        pageMenu ? (
                            <DetailActionsMenu
                                actions={[{ label: "Delete class", destructive: true, onSelect: () => undefined }]}
                            />
                        ) : null
                    }
                />
                <DetailHeaderActions>
                    <PageActionBar
                        actions={[
                            { id: "topics", label: "Topics", overflow: true, onSelect: onTopics },
                            { id: "create", label: "New Coursework", variant: "default", onSelect: () => undefined },
                        ]}
                    />
                </DetailHeaderActions>
            </DetailView>
        </MemoryRouter>
    );
}

describe("record header menu", () => {
    it("merges a lifted section's ⋯ into the page's ⋯", async () => {
        const onTopics = vi.fn();
        render(<Page pageMenu onTopics={onTopics} />);
        const menus = screen.getAllByRole("button", { name: "More actions" });
        expect(menus).toHaveLength(1);
        await userEvent.click(menus[0]);
        const items = screen.getAllByRole("menuitem").map((item) => item.textContent);
        expect(items).toEqual(["Topics", "Delete class"]);
        await userEvent.click(screen.getByRole("menuitem", { name: "Topics" }));
        expect(onTopics).toHaveBeenCalledOnce();
    });

    it("draws one ⋯ for the section when the page has none", async () => {
        render(<Page pageMenu={false} onTopics={() => undefined} />);
        const menus = screen.getAllByRole("button", { name: "More actions" });
        expect(menus).toHaveLength(1);
        await userEvent.click(menus[0]);
        expect(screen.getAllByRole("menuitem").map((item) => item.textContent)).toEqual(["Topics"]);
    });
});
