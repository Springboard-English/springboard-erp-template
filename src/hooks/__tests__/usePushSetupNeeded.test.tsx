import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { usePushSetupNeeded } from "../usePushNotifications";

const OPTIONS = { serviceWorkerUrl: "/sw.js" };

/** A browser with the three push APIs, a permission state and maybe a subscription. */
function stubBrowser(permission: NotificationPermission, subscribed: boolean) {
    vi.stubGlobal("PushManager", function PushManager() {});
    vi.stubGlobal("Notification", { permission });
    const getRegistration = vi.fn(async () => ({
        pushManager: { getSubscription: async () => (subscribed ? {} : null) },
    }));
    Object.defineProperty(navigator, "serviceWorker", {
        configurable: true,
        value: { getRegistration },
    });
    return getRegistration;
}

afterEach(() => {
    vi.unstubAllGlobals();
    delete (navigator as { serviceWorker?: unknown }).serviceWorker;
});

describe("usePushSetupNeeded", () => {
    it("asks a browser that has never been asked", async () => {
        stubBrowser("default", false);
        const { result } = renderHook(() => usePushSetupNeeded(OPTIONS));
        await waitFor(() => expect(result.current.ready).toBe(true));
        expect(result.current.needed).toBe(true);
    });

    it("leaves a device that already has a subscription alone", async () => {
        const getRegistration = stubBrowser("granted", true);
        const { result } = renderHook(() => usePushSetupNeeded(OPTIONS));
        await waitFor(() => expect(result.current.ready).toBe(true));
        expect(result.current.needed).toBe(false);
        expect(getRegistration).toHaveBeenCalledWith("/sw.js");
    });

    it("asks again when permission stands but the subscription is gone", async () => {
        stubBrowser("granted", false);
        const { result } = renderHook(() => usePushSetupNeeded(OPTIONS));
        await waitFor(() => expect(result.current.ready).toBe(true));
        expect(result.current.needed).toBe(true);
    });

    it("never asks a browser that refused — it would not show the prompt", async () => {
        stubBrowser("denied", false);
        const { result } = renderHook(() => usePushSetupNeeded(OPTIONS));
        await waitFor(() => expect(result.current.ready).toBe(true));
        expect(result.current.needed).toBe(false);
    });

    it("skips a browser with no Push API", async () => {
        const { result } = renderHook(() => usePushSetupNeeded(OPTIONS));
        await waitFor(() => expect(result.current.ready).toBe(true));
        expect(result.current.needed).toBe(false);
    });
});
