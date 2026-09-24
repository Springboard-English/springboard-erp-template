import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";

import { lazyWithPreload } from "../lazyWithPreload";

function View({ name }: { name: string }) {
    return <p>view {name}</p>;
}

describe("lazyWithPreload", () => {
    it("renders a preloaded component without suspending", async () => {
        const factory = vi.fn(async () => ({ default: View }));
        const Preloadable = lazyWithPreload(factory);
        await Preloadable.preload();

        render(
            <Suspense fallback={<p>fallback</p>}>
                <Preloadable name="a" />
            </Suspense>,
        );

        // Synchronous: no fallback frame, no await needed.
        expect(screen.getByText("view a")).toBeTruthy();
        expect(screen.queryByText("fallback")).toBeNull();
        expect(factory).toHaveBeenCalledTimes(1);
    });

    it("suspends and resolves when not yet preloaded", async () => {
        const Preloadable = lazyWithPreload(async () => ({ default: View }));

        render(
            <Suspense fallback={<p>fallback</p>}>
                <Preloadable name="b" />
            </Suspense>,
        );

        expect(screen.getByText("fallback")).toBeTruthy();
        expect(await screen.findByText("view b")).toBeTruthy();
    });

    it("retries the import after a failed preload", async () => {
        const factory = vi
            .fn<() => Promise<{ default: typeof View }>>()
            .mockRejectedValueOnce(new Error("chunk 404"))
            .mockResolvedValueOnce({ default: View });
        const Preloadable = lazyWithPreload(factory);

        await expect(Preloadable.preload()).rejects.toThrow("chunk 404");
        await Preloadable.preload();

        expect(factory).toHaveBeenCalledTimes(2);
    });
});
