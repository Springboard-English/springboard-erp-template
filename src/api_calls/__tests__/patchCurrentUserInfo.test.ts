import { beforeEach, describe, expect, it, vi } from "vitest";

const fetchWithRefresh = vi.fn();
vi.mock("../fetchWithRefresh", () => ({ fetchWithRefresh: (...args: unknown[]) => fetchWithRefresh(...args) }));

const { patchCurrentUserInfo } = await import("../UserData");

const user = (editedAt: string, info: Record<string, unknown> = {}) => ({
    name: "N",
    username: "n",
    sub: "s1",
    account_type: "employee",
    edited_at: editedAt,
    info,
});

const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body });
const conflict = () => ({
    ok: false,
    status: 409,
    statusText: "Conflict",
    url: "/v2/users/me",
    json: async () => ({
        detail: "edited_at is older than the current value. refresh data and retry with a newer edited_at",
    }),
    text: async () =>
        JSON.stringify({
            detail: "edited_at is older than the current value. refresh data and retry with a newer edited_at",
        }),
    clone() {
        return this;
    },
    headers: new Headers(),
});

function sentBody(call: number) {
    return JSON.parse(fetchWithRefresh.mock.calls[call][1].body as string);
}

describe("patchCurrentUserInfo", () => {
    beforeEach(() => fetchWithRefresh.mockReset());

    it("reads a fresh edited_at, then sends only the patched keys", async () => {
        fetchWithRefresh
            .mockResolvedValueOnce(ok({ objects: [user("t1")] }))
            .mockResolvedValueOnce(ok({ objects: [user("t2", { dashboard: { v: 1, items: [] } })] }));

        const result = await patchCurrentUserInfo({ dashboard: { v: 1, items: [] } });

        expect(fetchWithRefresh.mock.calls[1][1].method).toBe("PATCH");
        expect(sentBody(1)).toEqual({ edited_at: "t1", info: { dashboard: { v: 1, items: [] } } });
        expect(result.info).toEqual({ dashboard: { v: 1, items: [] } });
    });

    it("retries once with a re-read edited_at when another write got there first", async () => {
        fetchWithRefresh
            .mockResolvedValueOnce(ok({ objects: [user("t1")] }))
            .mockResolvedValueOnce(conflict())
            .mockResolvedValueOnce(ok({ objects: [user("t2")] }))
            .mockResolvedValueOnce(ok({ objects: [user("t3")] }));

        await patchCurrentUserInfo({ dashboard: null });

        expect(sentBody(3)).toEqual({ edited_at: "t2", info: { dashboard: null } });
    });

    it("gives up after the second conflict", async () => {
        fetchWithRefresh
            .mockResolvedValueOnce(ok({ objects: [user("t1")] }))
            .mockResolvedValueOnce(conflict())
            .mockResolvedValueOnce(ok({ objects: [user("t2")] }))
            .mockResolvedValueOnce(conflict());

        await expect(patchCurrentUserInfo({ dashboard: null })).rejects.toThrow(/edited_at is older/);
        expect(fetchWithRefresh).toHaveBeenCalledTimes(4);
    });
});
