import { render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import LazyViewFallback from "../LazyViewFallback";

/** Paints the `#sb-boot` element springboardBoot() writes into index.html. */
function paintBootScreen(): HTMLElement {
    const boot = document.createElement("div");
    boot.id = "sb-boot";
    document.body.prepend(boot);
    return boot;
}

afterEach(() => {
    document.getElementById("sb-boot")?.remove();
});

describe("LazyViewFallback", () => {
    it("holds the boot screen while mounted and lets go on unmount", () => {
        const boot = paintBootScreen();
        const view = render(<LazyViewFallback />);
        expect(boot.dataset.holds).toBe("1");
        view.unmount();
        expect(boot.dataset.holds).toBe("0");
    });

    it("leaves a boot screen that is already leaving alone", () => {
        const boot = paintBootScreen();
        boot.classList.add("sbb-leaving");
        render(<LazyViewFallback />);
        expect(boot.dataset.holds).toBeUndefined();
    });

    it("announces its label", () => {
        const view = render(<LazyViewFallback fullScreen label="Signing you in…" />);
        expect(view.getByRole("status").getAttribute("aria-label")).toBe("Signing you in…");
    });
});
