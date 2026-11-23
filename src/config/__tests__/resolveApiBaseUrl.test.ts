import { describe, expect, it } from "vitest";

import { DEV_API_BASE_URL, PRODUCTION_API_BASE_URL, resolveApiBaseUrl } from "../api";

describe("resolveApiBaseUrl", () => {
  it("uses VITE_BASE_URL, trimmed and without a trailing slash", () => {
    expect(resolveApiBaseUrl({ VITE_BASE_URL: " https://api.springboard.vn/dev/ ", DEV: false })).toBe(
      "https://api.springboard.vn/dev",
    );
    expect(resolveApiBaseUrl({ VITE_BASE_URL: "http://localhost:8000", DEV: true })).toBe("http://localhost:8000");
  });

  it("falls back to the dev API under a dev server, never to localhost", () => {
    expect(resolveApiBaseUrl({ DEV: true })).toBe(DEV_API_BASE_URL);
    expect(resolveApiBaseUrl({ VITE_BASE_URL: "", DEV: true })).toBe("https://api.springboard.vn/dev");
  });

  it("falls back to the production API in a build", () => {
    expect(resolveApiBaseUrl({ DEV: false })).toBe(PRODUCTION_API_BASE_URL);
    expect(resolveApiBaseUrl({})).toBe("https://api.springboard.vn");
  });
});
