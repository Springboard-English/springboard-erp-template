export declare function formatDate(value?: string): string;
export declare function formatUserTimestamp(value?: string): string;
export declare function toBackendTimestamp(value?: string | null): string | undefined;
export declare function toBackendBoundary(dateValue: string | null | undefined, boundary: "start" | "end"): string | undefined;
export declare function toDateTimeLocalValue(value?: string | null): string;
export declare function toBackendTimeValue(value?: string | null): string | undefined;
export declare function getTextareaRows(value?: string | null, minRows?: number, maxRows?: number): number;
