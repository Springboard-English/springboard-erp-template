const CACHE_PREFIX = "tab_cache";

export function invalidateCachedScope(scope: string, userSub?: string): void {
  const prefix = `${CACHE_PREFIX}:${scope}:${userSub || "anonymous"}:`;

  try {
    const keysToRemove: string[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error(`Error invalidating cache for ${scope}:`, error);
  }
}

export function invalidateAllCachedValues(): void {
  try {
    const keysToRemove: string[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(`${CACHE_PREFIX}:`)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error invalidating all cached values:", error);
  }
}
