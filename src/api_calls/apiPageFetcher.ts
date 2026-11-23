import { fetchWithRefresh } from "./fetchWithRefresh";
import { throwIfNotOk } from "./apiErrors";
import { parseCursorPage } from "../utils/apiEnvelope";
import type { CursorPaginatedResult, PageSize } from "../utils/cursorPagination";

export interface ApiPageFetcherOptions {
  /** Where a not-yet-migrated listing keeps its rows instead of `objects`. */
  legacyKey?: string;
  /** The query parameter the search goes in; `q` by default. */
  searchParam?: string;
  /** The failed request's wording, e.g. "Failed to fetch groups". */
  errorContext?: string;
}

/** One page of a listing for a search, in the shape `toLoadOptions` and `fetchEveryPage` take. */
export type ApiPageFetcher<T> = (
  query: string,
) => (size: PageSize, cursor: string | null, signal?: AbortSignal) => Promise<CursorPaginatedResult<T>>;

/**
 * A cursor-paged GET over `url` as a `FetchCursorPage` per search. Each call
 * sets `page_size`, `cursor` (after the first page) and the trimmed search,
 * goes through the authed transport, throws an `ApiError` on a non-2xx, and
 * maps each row through `read`, dropping rows it returns null for. Give it to
 * `toLoadOptions` for a combobox, or call it with `""` for `fetchEveryPage`.
 */
export function createApiPageFetcher<T>(
  url: string | (() => string),
  read: (raw: unknown) => T | null,
  { legacyKey, searchParam = "q", errorContext = "Failed to fetch options" }: ApiPageFetcherOptions = {},
): ApiPageFetcher<T> {
  return (query) => async (size, cursor, signal) => {
    const target = new URL(typeof url === "function" ? url() : url);
    target.searchParams.set("page_size", String(size));
    if (cursor?.trim()) {
      target.searchParams.set("cursor", cursor.trim());
    }
    if (query.trim()) {
      target.searchParams.set(searchParam, query.trim());
    }

    const response = await fetchWithRefresh(target.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    });
    await throwIfNotOk(response, errorContext);

    const page = parseCursorPage<unknown>(await response.json(), legacyKey);
    return {
      ...page,
      items: page.items.map((raw) => read(raw)).filter((item): item is T => item !== null),
    };
  };
}
