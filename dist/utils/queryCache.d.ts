export declare function getCachedValue<T>(scope: string, userSub?: string, params?: Record<string, unknown>, ttl?: number): T | null;
export declare function setCachedValue<T>(scope: string, value: T, userSub?: string, params?: Record<string, unknown>): void;
export declare function invalidateCachedScope(scope: string, userSub?: string): void;
export declare function invalidateAllCachedValues(): void;
