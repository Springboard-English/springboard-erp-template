import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PageFrame, pageFrameClassName } from "../PageFrame";

describe("pageFrameClassName", () => {
    it("sizes a list to the window less both shell pads, from the shell's variables", () => {
        const classes = pageFrameClassName().split(" ");
        expect(classes).toContain("md:h-[calc(100dvh-var(--page-pad-top,3rem)-var(--page-pad-bottom,1.25rem))]");
        expect(classes).toContain("md:overflow-hidden");
        expect(classes).not.toContain("md:-mb-[var(--page-pad-bottom,1.25rem)]");
    });

    it("runs a detail page to the window's foot by pulling the bottom pad back in", () => {
        const classes = pageFrameClassName({ variant: "detail" }).split(" ");
        expect(classes).toContain("md:h-[calc(100dvh-var(--page-pad-top,3rem))]");
        expect(classes).toContain("md:-mb-[var(--page-pad-bottom,1.25rem)]");
    });

    it("scrolls inside the frame, never the window, for scroll content", () => {
        const classes = pageFrameClassName({ variant: "detail", scroll: "content" }).split(" ");
        expect(classes).toContain("md:overflow-y-auto");
        expect(classes).not.toContain("md:overflow-hidden");
    });

    it("never writes a fixed rem pad", () => {
        for (const variant of ["list", "detail"] as const) {
            expect(pageFrameClassName({ variant })).not.toMatch(/100dvh-\d/);
        }
    });
});

describe("PageFrame", () => {
    it("renders a section with the frame and the caller's classes", () => {
        const { container } = render(
            <PageFrame variant="detail" className="gap-2" aria-label="Classes">
                <p>Body</p>
            </PageFrame>,
        );
        const frame = container.firstElementChild as HTMLElement;
        expect(frame.tagName).toBe("SECTION");
        expect(frame.dataset.pageFrame).toBe("detail");
        expect(frame.className).toContain("md:-mb-[var(--page-pad-bottom,1.25rem)]");
        expect(frame.className).toContain("gap-2");
        expect(frame.getAttribute("aria-label")).toBe("Classes");
    });

    it("lets a caller's height win over the frame's", () => {
        const { container } = render(
            <PageFrame as="div" className="md:h-auto">
                <p>Body</p>
            </PageFrame>,
        );
        const frame = container.firstElementChild as HTMLElement;
        expect(frame.tagName).toBe("DIV");
        expect(frame.className).toContain("md:h-auto");
        expect(frame.className).not.toContain("100dvh");
    });
});
