import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchWithRefreshMock } = vi.hoisted(() => ({ fetchWithRefreshMock: vi.fn() }));

vi.mock("../fetchWithRefresh", () => ({ fetchWithRefresh: fetchWithRefreshMock }));

import { createApiPageFetcher } from "../apiPageFetcher";
import { ApiError } from "../apiErrors";
import { readInlineOption } from "../../utils/apiEnvelope";
import { fetchEveryPage, pageSize } from "../../utils/cursorPagination";
import { inlineSelectOption, toLoadOptions } from "../../components/ui/searchable-select";

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function requestedUrl(call: number): URL {
  return new URL(String(fetchWithRefreshMock.mock.calls[call]?.[0]));
}

beforeEach(() => fetchWithRefreshMock.mockReset());

describe("createApiPageFetcher", () => {
  it("sends page_size, cursor and the trimmed search, and maps the rows", async () => {
    fetchWithRefreshMock.mockResolvedValueOnce(
      json({ attributes: { next_cursor: "n2" }, objects: [{ name: "A", value: "a" }, { name: 1 }] }),
    );
    const pages = createApiPageFetcher("https://api.test/v2/groups/inline", readInlineOption);

    const page = await pages("  ca27 ")(pageSize(25), "c1");

    const url = requestedUrl(0);
    expect(url.searchParams.get("page_size")).toBe("25");
    expect(url.searchParams.get("cursor")).toBe("c1");
    expect(url.searchParams.get("q")).toBe("ca27");
    expect(page.items).toEqual([{ name: "A", value: "a" }]);
    expect(page.nextCursor).toBe("n2");
  });

  it("leaves out an empty search and the first page's cursor, and reads the URL per call", async () => {
    fetchWithRefreshMock.mockImplementation(async () => json({ objects: [] }));
    let base = "https://api.test/v2/a";
    const pages = createApiPageFetcher(() => base, readInlineOption, { searchParam: "name" });

    await pages(" ")(pageSize(10), null);
    base = "https://api.test/v2/b";
    await pages("x")(pageSize(10), null);

    expect(requestedUrl(0).search).toBe("?page_size=10");
    expect(requestedUrl(1).pathname).toBe("/v2/b");
    expect(requestedUrl(1).searchParams.get("name")).toBe("x");
  });

  it("reads a legacy key", async () => {
    fetchWithRefreshMock.mockResolvedValueOnce(json({ groups: [{ name: "G", value: "g" }] }));
    const pages = createApiPageFetcher("https://api.test/v2/groups", readInlineOption, { legacyKey: "groups" });
    expect((await pages("")(pageSize(5), null)).items).toEqual([{ name: "G", value: "g" }]);
  });

  it("throws an ApiError on a non-2xx", async () => {
    fetchWithRefreshMock.mockResolvedValueOnce(json({ detail: "nope" }, 403));
    const pages = createApiPageFetcher("https://api.test/v2/x", readInlineOption, { errorContext: "Failed to fetch x" });
    await expect(pages("")(pageSize(5), null)).rejects.toBeInstanceOf(ApiError);
  });

  it("feeds toLoadOptions, with the sentinel only on the unfiltered first page", async () => {
    fetchWithRefreshMock.mockImplementation(async () =>
      json({ attributes: { next_cursor: null }, objects: [{ name: "A", value: "a" }] }),
    );
    const load = toLoadOptions(
      createApiPageFetcher("https://api.test/v2/groups/inline", readInlineOption),
      inlineSelectOption,
      [{ value: "", label: "All groups" }],
    );
    const signal = new AbortController().signal;

    const first = await load({ query: "", cursor: null, pageSize: 25, signal });
    const searched = await load({ query: "a", cursor: null, pageSize: 25, signal });

    expect(first.options).toEqual([{ value: "", label: "All groups" }, { value: "a", label: "A" }]);
    expect(searched.options).toEqual([{ value: "a", label: "A" }]);
    expect(fetchWithRefreshMock.mock.calls[0]?.[1]).toMatchObject({ signal });
  });

  it("drains every page through fetchEveryPage", async () => {
    fetchWithRefreshMock
      .mockResolvedValueOnce(json({ attributes: { next_cursor: "p2" }, objects: [{ name: "A", value: "a" }] }))
      .mockResolvedValueOnce(json({ attributes: {}, objects: [{ name: "B", value: "b" }] }));
    const pages = createApiPageFetcher("https://api.test/v2/groups/inline", readInlineOption);

    const { items } = await fetchEveryPage(pages(""));

    expect(items.map((item) => item.value)).toEqual(["a", "b"]);
    expect(requestedUrl(1).searchParams.get("cursor")).toBe("p2");
  });
});
