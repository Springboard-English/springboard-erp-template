const DEFAULT_CACHE_TTL = 5 * 60 * 1000;
const CACHE_PREFIX = "tab_cache";

interface CacheEnvelope<T> {
  timestamp: number;
  value: T;
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(
      ([left], [right]) => left.localeCompare(right),
    );
    return `{${entries
      .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableSerialize(entryValue)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function buildCacheKey(
  scope: string,
  userSub?: string,
  params?: Record<string, unknown>,
): string {
  const serializedParams = params ? stableSerialize(params) : "";
  return `${CACHE_PREFIX}:${scope}:${userSub || "anonymous"}:${serializedParams}`;
}

export function getCachedValue<T>(
  scope: string,
  userSub?: string,
  params?: Record<string, unknown>,
  ttl = DEFAULT_CACHE_TTL,
): T | null {
  const storageKey = buildCacheKey(scope, userSub, params);

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (Date.now() - parsed.timestamp < ttl) {
      return parsed.value;
    }

    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error(`Error reading cache for ${scope}:`, error);
    localStorage.removeItem(storageKey);
  }

  return null;
}

export function setCachedValue<T>(
  scope: string,
  value: T,
  userSub?: string,
  params?: Record<string, unknown>,
): void {
  const storageKey = buildCacheKey(scope, userSub, params);

  try {
    const payload: CacheEnvelope<T> = {
      timestamp: Date.now(),
      value,
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch (error) {
    console.error(`Error writing cache for ${scope}:`, error);
  }
}

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
