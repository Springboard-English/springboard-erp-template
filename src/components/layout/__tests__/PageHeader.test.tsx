import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DetailBreadcrumbs } from "../DetailLayout";
import { configureUIPreset } from "@/config/uiPreset";
import PageHeader, { PageHeaderRoot } from "../PageHeader";

describe("PageHeader", () => {
    it("keeps the back and summary rows on a list page that has neither", () => {
        const { container } = render(<PageHeader title="Classes" actions={<button type="button">Create</button>} />);
        const header = container.querySelector("[data-page-header]");
        expect(header).not.toBeNull();
        // back placeholder, title, actions, summary: the same four slots a record page has
        expect(header?.children).toHaveLength(4);
        expect(screen.getByRole("heading", { level: 2, name: "Classes" })).toBeTruthy();
        expect(screen.queryByRole("navigation")).toBeNull();
    });

    it("draws the back trail, status and summary of a record page", () => {
        render(
            <PageHeader
                title="CA27-52"
                back={[{ label: "Classes", onClick: () => undefined }]}
                status={<span>Recruiting</span>}
                summary={<span>0 / 15 students</span>}
            />,
        );
        expect(screen.getByRole("navigation").textContent).toContain("Classes");
        expect(screen.getByText("Recruiting")).toBeTruthy();
        expect(screen.getByText("0 / 15 students")).toBeTruthy();
    });

    it("draws an eyebrow in the back row of a list page, and drops it when there is a back link", () => {
        const { container, rerender } = render(<PageHeader title="Tests" eyebrow="Reusable tests" />);
        const header = container.querySelector("[data-page-header]");
        expect(header?.children).toHaveLength(3);
        expect(screen.getByText("Reusable tests")).toBeTruthy();

        rerender(<PageHeader title="Tests" eyebrow="Reusable tests" back={[{ label: "Home", onClick: () => undefined }]} />);
        expect(screen.queryByText("Reusable tests")).toBeNull();
        expect(screen.getByRole("navigation").textContent).toContain("Home");
    });

    it("lets an app's preset restyle the title", () => {
        configureUIPreset({ pageTitle: "font-bold md:text-2xl" });
        try {
            render(<PageHeader title="Tests" />);
            const heading = screen.getByRole("heading", { level: 2, name: "Tests" });
            expect(heading.className).toContain("font-bold");
            expect(heading.className).not.toContain("font-semibold");
        } finally {
            configureUIPreset({});
        }
    });

    it("gives DetailBreadcrumbs its own grid when drawn outside a header", () => {
        const { container } = render(<DetailBreadcrumbs items={[]} current="Users" />);
        const headers = container.querySelectorAll("[data-page-header]");
        expect(headers).toHaveLength(1);
        expect(headers[0].querySelector("h2")?.textContent).toBe("Users");
    });

    it("draws DetailBreadcrumbs into an enclosing header without a second grid", () => {
        const { container } = render(
            <PageHeaderRoot>
                <DetailBreadcrumbs items={[{ label: "Classes" }]} current="CA27-52" />
            </PageHeaderRoot>,
        );
        expect(container.querySelectorAll("[data-page-header]")).toHaveLength(1);
    });
});
