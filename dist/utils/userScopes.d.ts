export declare function getUserScopes(value: unknown): string[];
export declare function hasUserScope(value: unknown, permission: string): boolean;
export declare function hasAnyUserScope(value: unknown, permissions: string[]): boolean;
export declare function canAccessManagement(value: unknown): boolean;
