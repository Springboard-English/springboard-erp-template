import { afterEach, describe, expect, it } from "vitest";

import { accountsProfileUrl } from "../accounts";
import { appUrl, configureAppUrls, DEV_APP_URLS, PRODUCTION_APP_URLS, resolveAppUrls } from "../apps";

describe("resolveAppUrls", () => {
  it("uses each VITE_<APP>_APP_URL, trimmed and without a trailing slash", () => {
    const urls = resolveAppUrls({ VITE_LEAP_APP_URL: " http://localhost:5174/ ", DEV: false });
    expect(urls.leap).toBe("http://localhost:5174");
    expect(urls.lms).toBe(PRODUCTION_APP_URLS.lms);
  });

  it("falls back to localhost:3000 under a dev server, accounts excepted", () => {
    const urls = resolveAppUrls({ DEV: true, VITE_LMS_APP_URL: "" });
    expect(urls).toEqual(DEV_APP_URLS);
    expect(urls.leap).toBe("http://localhost:3000");
    expect(urls.hrm).toBe("http://localhost:3000/hrm");
    expect(urls.accounts).toBe("https://accounts.springboard.vn");
  });

  it("falls back to production in a build", () => {
    expect(resolveAppUrls({})).toEqual(PRODUCTION_APP_URLS);
    expect(resolveAppUrls({ DEV: false }).crm).toBe("https://erp.springboard.vn/crm");
  });
});

describe("appUrl", () => {
  afterEach(() => configureAppUrls(PRODUCTION_APP_URLS));

  it("joins the configured base URL and the path", () => {
    configureAppUrls({ leap: "https://leap.example/" });
    expect(appUrl("leap", "/play/ABC")).toBe("https://leap.example/play/ABC");
    expect(appUrl("leap")).toBe("https://leap.example");
  });

  it("leaves an app it is not given, or given empty, as it was", () => {
    configureAppUrls(PRODUCTION_APP_URLS);
    configureAppUrls({ lms: "" });
    expect(appUrl("lms", "/x")).toBe("https://lms.springboard.vn/x");
  });

  it("points the account links at the configured accounts site", () => {
    configureAppUrls({ accounts: "http://localhost:3000" });
    expect(accountsProfileUrl()).toBe("http://localhost:3000/profile");
  });
});
