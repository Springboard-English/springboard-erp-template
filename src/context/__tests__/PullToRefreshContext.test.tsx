import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/context/I18nContext";
import RefreshButton from "@/components/management/RefreshButton";
import { PullToRefreshProvider } from "../PullToRefreshContext";

/** Drags one finger from `fromY` to `toY` on the page and lifts it. */
function pull(fromY: number, toY: number) {
    fireEvent.touchStart(document.body, { touches: [{ clientY: fromY }] });
    fireEvent.touchMove(document.body, { touches: [{ clientY: toY }] });
    fireEvent.touchEnd(document.body, { touches: [] });
}

function renderPage(onRefresh: () => unknown) {
    return render(
        <I18nProvider>
            <PullToRefreshProvider>
                <RefreshButton onRefresh={onRefresh} />
            </PullToRefreshProvider>
        </I18nProvider>,
    );
}

describe("PullToRefreshProvider", () => {
    it("runs the page's refresh on a long enough pull from the top", async () => {
        const onRefresh = vi.fn();
        renderPage(onRefresh);

        await act(async () => pull(0, 200));
        expect(onRefresh).toHaveBeenCalledTimes(1);
    });

    it("ignores a short pull", async () => {
        const onRefresh = vi.fn();
        renderPage(onRefresh);

        await act(async () => pull(0, 60));
        expect(onRefresh).not.toHaveBeenCalled();
    });

    it("stops listening once the page unmounts", async () => {
        const onRefresh = vi.fn();
        const view = renderPage(onRefresh);
        view.unmount();

        await act(async () => pull(0, 200));
        expect(onRefresh).not.toHaveBeenCalled();
        expect(document.documentElement.style.overscrollBehaviorY).toBe("");
    });
});
