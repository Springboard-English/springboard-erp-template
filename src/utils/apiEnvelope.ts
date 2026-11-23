// Reading the API's response envelope.
//
// Every v2 endpoint answers `{ attributes, objects: [...] }`; a listing adds
// `attributes.page_size` and `attributes.next_cursor`, and a single record is
// `objects[0]`. A few older listings still carry their rows under a legacy key
// (`sessions`, `groups`), and a few helpers are handed a bare array, so each
// reader accepts those too. Nothing here throws: a shape it cannot read is
// empty, and the caller decides whether that is an error.

import type { CursorPaginatedResult } from "./cursorPagination";

/** A JSON object, as the readers below hand it back. */
export type ApiObject = Record<string, unknown>;

function isApiObject(value: unknown): value is ApiObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * A response body as an object, or null for an array, a primitive or null.
 * The body is not unwrapped: a record whose own field is named `data` stays as it is.
 */
export function getObjectPayload(data: unknown): ApiObject | null {
  return isApiObject(data) ? data : null;
}

/**
 * A listing's rows: a bare array as it is, else the envelope's `objects`,
 * else the array under `legacyKey`, else `[]`.
 */
export function getArrayPayload<T = unknown>(data: unknown, legacyKey?: string): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (!isApiObject(data)) {
    return [];
  }
  if (Array.isArray(data.objects)) {
    return data.objects as T[];
  }
  if (legacyKey && Array.isArray(data[legacyKey])) {
    return data[legacyKey] as T[];
  }
  return [];
}

/**
 * A single-record response's record: `objects[0]`, or the body itself when
 * it is a bare record with no `objects`. Null for an empty `objects`, so a
 * read that found nothing is not mistaken for the envelope.
 */
export function getSingleObjectPayload<T = ApiObject>(data: unknown): T | null {
  const items = getArrayPayload<T>(data);
  if (items.length > 0) {
    return items[0] ?? null;
  }
  if (isApiObject(data) && !("objects" in data)) {
    return data as T;
  }
  return null;
}

/** A finite number from a number or a numeric string; null otherwise, including for "". */
export function getNumericValue(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value ? value : null;
}

/**
 * One cursor page out of a listing's body: its rows (as `getArrayPayload`
 * reads them), `page_size`, `cursor` and `next_cursor`, and `total` on the
 * few endpoints that count. A bare array is one complete page.
 */
export function parseCursorPage<T = unknown>(data: unknown, legacyKey?: string): CursorPaginatedResult<T> {
  const items = getArrayPayload<T>(data, legacyKey);
  const attributes = isApiObject(data) ? getObjectPayload(data.attributes) : null;
  const total = getNumericValue(attributes?.total);
  return {
    items,
    pageSize: getNumericValue(attributes?.page_size) ?? items.length,
    cursor: optionalString(attributes?.cursor),
    nextCursor: optionalString(attributes?.next_cursor),
    ...(total === null ? {} : { total }),
  };
}

/** An `/inline` row: the API's `{ name, value }` option shape. */
export interface InlineOption {
  name: string;
  value: string;
}

/** An `/inline` row read off the wire, or null when it lacks a string `name` or `value`. */
export function readInlineOption(raw: unknown): InlineOption | null {
  if (!isApiObject(raw) || typeof raw.name !== "string" || typeof raw.value !== "string") {
    return null;
  }
  return { name: raw.name, value: raw.value };
}
