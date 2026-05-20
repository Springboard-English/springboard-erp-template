export declare function getQueryParam(params: URLSearchParams, key: string, fallback?: string): string;
export declare function getQueryNumber(params: URLSearchParams, key: string, fallback: number, min?: number): number;
export declare function getQueryBoolean(params: URLSearchParams, key: string, fallback: boolean): boolean;
export declare function updateSearchParams(params: URLSearchParams, updates: Record<string, string | number | boolean | null | undefined>): URLSearchParams;
