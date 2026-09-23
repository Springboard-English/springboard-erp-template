import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ReactNode } from "react";

import { GlobalStatusProvider, useGlobalStatus } from "../GlobalStatusContext";

/**
 * GlobalStatusQueryBridge re-registers a failed query on every query-cache
 * event, and a render emits one. If re-registering what is already shown
 * re-rendered, the two fed each other without end — erp-hrm's whole shell
 * stopped committing route changes.
 */

function renderStatus() {
    let renders = 0;
    const wrapper = ({ children }: { children: ReactNode }) => (
        <GlobalStatusProvider>{children}</GlobalStatusProvider>
    );
    const view = renderHook(
        () => {
            renders += 1;
            return useGlobalStatus();
        },
        { wrapper },
    );
    return { ...view, renders: () => renders };
}

describe("GlobalStatusProvider", () => {
    it("does not re-render for an error it is already showing", () => {
        const { result, renders } = renderStatus();

        act(() => result.current.registerErrorStatus("query:a", "Forbidden"));
        expect(result.current.status).toEqual({ message: "Forbidden", tone: "error" });
        const settled = renders();

        act(() => result.current.registerErrorStatus("query:a", "Forbidden"));
        expect(renders()).toBe(settled);
    });

    it("still re-renders when the message for a key changes", () => {
        const { result } = renderStatus();

        act(() => result.current.registerErrorStatus("query:a", "Forbidden"));
        act(() => result.current.registerErrorStatus("query:a", "Not found"));
        expect(result.current.status?.message).toBe("Not found");
    });

    it("does not re-render for a loading status it is already showing", () => {
        const { result, renders } = renderStatus();

        act(() => result.current.registerLoadingStatus("query:a", "Loading"));
        const settled = renders();

        act(() => result.current.registerLoadingStatus("query:a", "Loading"));
        expect(renders()).toBe(settled);
    });
});
