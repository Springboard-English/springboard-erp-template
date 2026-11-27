import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { DetailBreadcrumbs, DetailHeader, DetailView } from "../DetailLayout";

/** A record page, floatable or not, opened at `url`. */
function Page({ floatable, url = "/record" }: { floatable?: boolean; url?: string }) {
    return (
        <MemoryRouter initialEntries={[url]}>
            <DetailView floatable={floatable}>
                <DetailHeader breadcrumbs={<DetailBreadcrumbs items={[]} current="Pack" />} />
            </DetailView>
        </MemoryRouter>
    );
}

describe("DetailView floatable", () => {
    it("offers Floating View by default", () => {
        render(<Page />);
        expect(screen.getByRole("button", { name: "Floating View" })).toBeInTheDocument();
    });

    it("offers no Floating View when it cannot float", () => {
        render(<Page floatable={false} />);
        expect(screen.queryByRole("button", { name: "Floating View" })).not.toBeInTheDocument();
    });
});
