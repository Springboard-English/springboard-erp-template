import { describe, expect, it } from "vitest";
import {
    isAppleMobile,
    pushSupport,
    urlBase64ToUint8Array,
    type PushEnvironment,
} from "../pushNotifications";

const DESKTOP_CHROME: PushEnvironment = {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/141.0",
    platform: "Win32",
    maxTouchPoints: 0,
    standalone: false,
    hasServiceWorker: true,
    hasPushManager: true,
    hasNotification: true,
};

const NO_PUSH = { hasPushManager: false, hasNotification: false };

describe("pushSupport", () => {
    it("is supported where the three APIs exist", () => {
        expect(pushSupport(DESKTOP_CHROME)).toBe("supported");
    });

    it("asks an iPhone in Safari to install first — the API only exists from the Home Screen", () => {
        expect(
            pushSupport({
                ...DESKTOP_CHROME,
                ...NO_PUSH,
                userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
                platform: "iPhone",
                maxTouchPoints: 5,
            }),
        ).toBe("needs-install");
    });

    it("reads an iPad in desktop mode as an iPad", () => {
        expect(
            pushSupport({
                ...DESKTOP_CHROME,
                ...NO_PUSH,
                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
                platform: "MacIntel",
                maxTouchPoints: 5,
            }),
        ).toBe("needs-install");
    });

    it("is supported in an installed Home Screen app on iOS", () => {
        expect(
            pushSupport({
                ...DESKTOP_CHROME,
                userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
                platform: "iPhone",
                standalone: true,
            }),
        ).toBe("supported");
    });

    it("offers nothing in a webview with no Push API that installing would not fix", () => {
        expect(pushSupport({ ...DESKTOP_CHROME, ...NO_PUSH })).toBe("unsupported");
        // Already standalone on iOS and still no API: an install will not help.
        expect(
            pushSupport({
                ...DESKTOP_CHROME,
                ...NO_PUSH,
                userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
                standalone: true,
            }),
        ).toBe("unsupported");
    });

    it("does not mistake a Mac for an iPad", () => {
        expect(
            isAppleMobile({ userAgent: "Macintosh", platform: "MacIntel", maxTouchPoints: 0 }),
        ).toBe(false);
    });
});

describe("urlBase64ToUint8Array", () => {
    it("decodes base64url without padding", () => {
        // "hello?" is aGVsbG8_ in base64url: one '_' and no '='.
        expect(Array.from(urlBase64ToUint8Array("aGVsbG8_"))).toEqual(
            Array.from(new TextEncoder().encode("hello?")),
        );
    });

    it("decodes a 65-byte VAPID public key", () => {
        const key =
            "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";
        const bytes = urlBase64ToUint8Array(key);
        expect(bytes.length).toBe(65);
        expect(bytes[0]).toBe(0x04);
    });
});
