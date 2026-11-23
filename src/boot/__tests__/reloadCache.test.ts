import { afterEach, describe, expect, it, vi } from "vitest";

import { clearCachesOnReload, isReloadNavigation } from "../reloadCache";

function navigationType(type: string) {
  vi.spyOn(performance, "getEntriesByType").mockReturnValue([{ type } as unknown as PerformanceEntry]);
}

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  Reflect.deleteProperty(window, "caches");
});

describe("isReloadNavigation", () => {
  it("reads the navigation timing entry", () => {
    navigationType("reload");
    expect(isReloadNavigation()).toBe(true);
    navigationType("navigate");
    expect(isReloadNavigation()).toBe(false);
  });
});

describe("clearCachesOnReload", () => {
  it("clears the tab cache, the query client and Cache Storage on a reload", async () => {
    navigationType("reload");
    localStorage.setItem("tab_cache:classes:u:1", "x");
    localStorage.setItem("springboard_locale", "vi");
    const remove = vi.fn(async (_key: string) => true);
    Object.defineProperty(window, "caches", {
      configurable: true,
      value: { keys: async () => ["a", "b"], delete: remove },
    });
    const queryClient = { clear: vi.fn() };

    await clearCachesOnReload(queryClient);

    expect(localStorage.getItem("tab_cache:classes:u:1")).toBeNull();
    expect(localStorage.getItem("springboard_locale")).toBe("vi");
    expect(queryClient.clear).toHaveBeenCalledOnce();
    expect(remove.mock.calls.map(([key]) => key)).toEqual(["a", "b"]);
  });

  it("does nothing on an ordinary load", async () => {
    navigationType("navigate");
    localStorage.setItem("tab_cache:classes:u:1", "x");
    const queryClient = { clear: vi.fn() };

    await clearCachesOnReload(queryClient);

    expect(localStorage.getItem("tab_cache:classes:u:1")).toBe("x");
    expect(queryClient.clear).not.toHaveBeenCalled();
  });

  it("survives a Cache Storage error", async () => {
    navigationType("reload");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    Object.defineProperty(window, "caches", {
      configurable: true,
      value: { keys: async () => Promise.reject(new Error("denied")), delete: vi.fn() },
    });
    await expect(clearCachesOnReload()).resolves.toBeUndefined();
  });
});
