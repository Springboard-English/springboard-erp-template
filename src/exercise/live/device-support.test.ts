import { describe, expect, it } from "vitest";

import { examBlockReason, isAppleTouchDevice, type DeviceFacts } from "./device-support";

const desktopChrome: DeviceFacts = {
  fullscreenEnabled: true,
  canRequestFullscreen: true,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  platform: "Win32",
  maxTouchPoints: 0,
};

describe("examBlockReason", () => {
  it("lets a desktop browser with fullscreen sit a challenge", () => {
    expect(examBlockReason(desktopChrome)).toBeNull();
  });

  it("lets a real Mac through — it reports MacIntel with no touch points", () => {
    expect(
      examBlockReason({
        ...desktopChrome,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
        platform: "MacIntel",
        maxTouchPoints: 0,
      }),
    ).toBeNull();
  });

  it("lets Android Chrome through, where fullscreen keeps the keyboard", () => {
    expect(
      examBlockReason({
        ...desktopChrome,
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36",
        platform: "Linux armv81",
        maxTouchPoints: 5,
      }),
    ).toBeNull();
  });

  it("refuses a browser with no Fullscreen API — iPhone Safari, in-app webviews", () => {
    expect(
      examBlockReason({
        ...desktopChrome,
        fullscreenEnabled: false,
        canRequestFullscreen: false,
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
        platform: "iPhone",
        maxTouchPoints: 5,
      }),
    ).toBe("no-fullscreen");
  });

  it("refuses fullscreen that exists but is switched off", () => {
    expect(examBlockReason({ ...desktopChrome, fullscreenEnabled: false })).toBe(
      "no-fullscreen",
    );
  });

  it("refuses an iPad in desktop-website mode, where fullscreen drops typed keys", () => {
    expect(
      examBlockReason({
        ...desktopChrome,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
        platform: "MacIntel",
        maxTouchPoints: 5,
      }),
    ).toBe("fullscreen-blocks-typing");
  });

  it("refuses an iPad that says so in its user agent", () => {
    expect(
      examBlockReason({
        ...desktopChrome,
        userAgent:
          "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0 Mobile/15E148 Safari/604.1",
        platform: "iPad",
        maxTouchPoints: 5,
      }),
    ).toBe("fullscreen-blocks-typing");
  });
});

describe("isAppleTouchDevice", () => {
  it("does not mistake a touchscreen Windows laptop for an iPad", () => {
    expect(isAppleTouchDevice({ ...desktopChrome, maxTouchPoints: 10 })).toBe(false);
  });
});
