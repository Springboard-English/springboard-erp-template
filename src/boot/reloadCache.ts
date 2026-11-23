import { invalidateAllCachedValues } from "../utils/queryCache";

/** Whether this page load is the user reloading the page (F5, the reload button). */
export function isReloadNavigation(): boolean {
    if (typeof performance === "undefined") {
        return false;
    }
    const entry = performance.getEntriesByType?.("navigation")[0];
    if (entry && "type" in entry) {
        return (entry as PerformanceNavigationTiming).type === "reload";
    }
    // Older Safari has no navigation timing entry, only the deprecated API.
    const legacy = (performance as Performance & { navigation?: { type: number; TYPE_RELOAD: number } }).navigation;
    return legacy ? legacy.type === legacy.TYPE_RELOAD : false;
}

/**
 * On a reload, drops what the app has cached so the user's reload really
 * fetches afresh: the template's `tab_cache` entries, the query client's
 * cache when one is given, and the browser's Cache Storage. Does nothing on
 * any other load. Call it once at boot, before rendering.
 */
export async function clearCachesOnReload(queryClient?: { clear: () => void }): Promise<void> {
    if (!isReloadNavigation()) {
        return;
    }

    invalidateAllCachedValues();
    queryClient?.clear();

    if (typeof window === "undefined" || !("caches" in window)) {
        return;
    }

    try {
        const keys = await window.caches.keys();
        await Promise.all(keys.map((key) => window.caches.delete(key)));
    } catch (error) {
        // A storage error must not stop the app booting.
        console.error("Failed to clear browser caches on reload:", error);
    }
}
