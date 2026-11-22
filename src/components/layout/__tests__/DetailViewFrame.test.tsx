import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { DetailPendingView, DetailView } from "../DetailLayout";
import { pageFrameClassName } from "../PageFrame";

/** The element DetailView puts its className on. */
function frameOf(container: HTMLElement): HTMLElement {
    return container.querySelector("[data-floating-collapsed]") as HTMLElement;
}

const LEGACY_DETAIL_CLASS =
    "w-full max-w-[1700px] md:flex md:h-[calc(100dvh-3rem)] md:-mb-5 md:min-h-0 md:flex-col md:overflow-hidden";

describe("DetailView frame", () => {
    it("renders in the detail frame by default", () => {
        const { container } = render(
            <MemoryRouter>
                <DetailView>body</DetailView>
            </MemoryRouter>,
        );
        expect(frameOf(container).className).toBe(pageFrameClassName({ variant: "detail" }));
    });

    it("adds className to the frame", () => {
        const { container } = render(
            <MemoryRouter>
                <DetailView className="gap-2">body</DetailView>
            </MemoryRouter>,
        );
        const classes = frameOf(container).className.split(" ");
        expect(classes).toContain("gap-2");
        expect(classes).toContain("md:-mb-[var(--page-pad-bottom,1.25rem)]");
    });

    it("lets a view still passing the old pasted frame keep exactly that height", () => {
        const { container } = render(
            <MemoryRouter>
                <DetailView className={LEGACY_DETAIL_CLASS}>body</DetailView>
            </MemoryRouter>,
        );
        const classes = frameOf(container).className.split(" ");
        expect(classes).toContain("md:h-[calc(100dvh-3rem)]");
        expect(classes).toContain("md:-mb-5");
        expect(classes.filter((name) => name.startsWith("md:h-"))).toHaveLength(1);
        expect(classes.filter((name) => name.startsWith("md:-mb-"))).toHaveLength(1);
    });

    it("draws the list frame for frame=list", () => {
        const { container } = render(
            <MemoryRouter>
                <DetailView isBackground frame="list">body</DetailView>
            </MemoryRouter>,
        );
        expect(frameOf(container).className).toBe(pageFrameClassName({ variant: "list" }));
    });

    it("scrolls inside the frame when contentScrollable", () => {
        const { container } = render(
            <MemoryRouter>
                <DetailView contentScrollable>body</DetailView>
            </MemoryRouter>,
        );
        const classes = frameOf(container).className.split(" ");
        expect(classes).toContain("md:overflow-y-auto");
        expect(classes).not.toContain("md:overflow-hidden");
    });

    it("draws no frame for frame=false, and className replaces the plain default", () => {
        const { container, rerender } = render(
            <MemoryRouter>
                <DetailView frame={false}>body</DetailView>
            </MemoryRouter>,
        );
        expect(frameOf(container).className).toBe("w-full max-w-[1700px] space-y-4");

        rerender(
            <MemoryRouter>
                <DetailView frame={false} className="flex min-h-0 flex-1 flex-col">
                    body
                </DetailView>
            </MemoryRouter>,
        );
        expect(frameOf(container).className).toBe("flex min-h-0 flex-1 flex-col");
    });

    it("gives the loading shell the same frame", () => {
        const { container } = render(
            <MemoryRouter>
                <DetailPendingView breadcrumbs={[]} />
            </MemoryRouter>,
        );
        expect(frameOf(container).className).toBe(pageFrameClassName({ variant: "detail" }));
    });
});
