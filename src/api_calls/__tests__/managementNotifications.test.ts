import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchWithRefreshMock } = vi.hoisted(() => ({ fetchWithRefreshMock: vi.fn() }));

vi.mock("../fetchWithRefresh", () => ({ fetchWithRefresh: fetchWithRefreshMock }));

import { configureApi } from "../../config/api";
import { ApiError } from "../apiErrors";
import { getClientTimezoneOffset, toISOWithOffset } from "../../utils/formatters";
import {
    buildNotificationPatch,
    changedNotificationFields,
    createNotification,
    deleteNotification,
    deriveManagementNotification,
    fetchAllManagementNotifications,
    managementNotificationsPage,
    notificationReadersPage,
    patchNotification,
    readManagementNotification,
    readNotificationReader,
    toNotificationRow,
    type ManagementNotification,
    type NotificationReader,
} from "../managementNotifications";

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function requestedUrl(call: number): URL {
    return new URL(String(fetchWithRefreshMock.mock.calls[call]?.[0]));
}

function requestInit(call: number): RequestInit {
    return fetchWithRefreshMock.mock.calls[call]?.[1] as RequestInit;
}

function notification(overrides: Partial<ManagementNotification> = {}): ManagementNotification {
    return {
        appsheet_key: "n-1",
        title: "Holiday",
        description: "Closed Monday",
        priority: "URGENT",
        affected_area: "centre",
        start_time: "2026-11-01T08:00:00",
        end_time: "2026-11-02T08:00:00",
        created_at: "2026-10-30T08:00:00Z",
        edited_at: "2026-10-30T08:00:00Z",
        sender_key: null,
        sender_name: null,
        recipient_key: null,
        recipient_name: null,
        target_account_type: "employee",
        kind: "in_app",
        channel: "in_app",
        recipients: null,
        queued: null,
        skipped: null,
        ...overrides,
    };
}

function reader(overrides: Partial<NotificationReader> = {}): NotificationReader {
    return {
        users_notification_key: "un-1",
        user_key: "u-1",
        user_name: "An",
        read_status: true,
        read_at: "2026-11-01T09:00:00Z",
        title: "Holiday",
        description: null,
        priority: "URGENT",
        affected_area: "single",
        start_time: "2026-11-01T08:00:00",
        end_time: "2026-11-02T08:00:00",
        created_at: "2026-10-30T08:00:00Z",
        sender_key: "s-1",
        sender_name: "Sender",
        recipient_key: "u-1",
        recipient_name: "An",
        target_account_type: null,
        kind: "in_app",
        channel: "in_app",
        recipients: null,
        ...overrides,
    };
}

beforeEach(() => {
    fetchWithRefreshMock.mockReset();
    configureApi({ baseUrl: "https://api.test" });
});

describe("readManagementNotification", () => {
    it("needs a string appsheet_key and title", () => {
        expect(readManagementNotification(null)).toBeNull();
        expect(readManagementNotification({ appsheet_key: "n-1" })).toBeNull();
        expect(readManagementNotification({ title: "x" })).toBeNull();
    });

    it("keeps typed fields, nulls the rest, and keeps a null channel null", () => {
        const read = readManagementNotification({
            appsheet_key: "n-1",
            title: "T",
            priority: 3,
            queued: 4,
            skipped: "1",
            channel: null,
            sender_name: "Sender",
        });
        expect(read).toMatchObject({
            appsheet_key: "n-1",
            title: "T",
            priority: null,
            affected_area: "",
            queued: 4,
            skipped: null,
            channel: null,
            sender_name: "Sender",
            edited_at: null,
        });
    });
});

describe("readNotificationReader", () => {
    it("reads the reader and the parent notice's dispatch fields", () => {
        expect(readNotificationReader("x")).toBeNull();
        expect(readNotificationReader({ user_key: "u-1", read_status: "yes", kind: "in_app" })).toMatchObject({
            user_key: "u-1",
            read_status: null,
            kind: "in_app",
            users_notification_key: null,
        });
    });
});

describe("managementNotificationsPage", () => {
    it("sends the page size, trimmed filters and cursor, and drops unreadable rows", async () => {
        fetchWithRefreshMock.mockResolvedValueOnce(
            json({ attributes: { next_cursor: "c2" }, objects: [{ appsheet_key: "n-1", title: "A" }, { title: "no key" }] }),
        );
        const page = await managementNotificationsPage(" centre ", "URGENT", false)(25, " c1 ");

        const url = requestedUrl(0);
        expect(url.origin + url.pathname).toBe("https://api.test/v2/notifications");
        expect(url.searchParams.get("page_size")).toBe("25");
        expect(url.searchParams.get("affected_area")).toBe("centre");
        expect(url.searchParams.get("priority")).toBe("URGENT");
        expect(url.searchParams.get("active_only")).toBe("false");
        expect(url.searchParams.get("cursor")).toBe("c1");
        expect(page.items.map((item) => item.appsheet_key)).toEqual(["n-1"]);
        expect(page.nextCursor).toBe("c2");
    });

    it("leaves out unset filters and the first page's cursor", async () => {
        fetchWithRefreshMock.mockResolvedValueOnce(json({ objects: [] }));
        await managementNotificationsPage()(10, null);
        expect(requestedUrl(0).search).toBe("?page_size=10");
    });

    it("throws an ApiError on a non-2xx", async () => {
        fetchWithRefreshMock.mockResolvedValueOnce(json({ detail: "no" }, 403));
        await expect(managementNotificationsPage()(10, null)).rejects.toBeInstanceOf(ApiError);
    });
});

describe("fetchAllManagementNotifications", () => {
    it("walks every page at full size", async () => {
        fetchWithRefreshMock.mockImplementation(async (url: string) => {
            const cursor = new URL(url).searchParams.get("cursor");
            return json({
                attributes: { next_cursor: cursor ? null : "c2" },
                objects: [{ appsheet_key: cursor ?? "first", title: "T" }],
            });
        });
        const { items, truncated } = await fetchAllManagementNotifications();
        expect(items.map((item) => item.appsheet_key)).toEqual(["first", "c2"]);
        expect(truncated).toBe(false);
        expect(requestedUrl(0).searchParams.get("page_size")).toBe("200");
    });
});

describe("writes", () => {
    it("posts the request and reads the created row out of the envelope", async () => {
        fetchWithRefreshMock.mockResolvedValueOnce(json({ objects: [{ appsheet_key: "n-9", title: "T", queued: 3, skipped: 0 }] }));
        const created = await createNotification({
            title: "T",
            audience: { type: "centre" },
            channel: "in_app",
            config: { kind: "in_app", start_time: "a", end_time: "b" },
        });
        expect(requestedUrl(0).toString()).toBe("https://api.test/v2/notifications");
        expect(requestInit(0).method).toBe("POST");
        expect(JSON.parse(String(requestInit(0).body)).audience).toEqual({ type: "centre" });
        expect(created).toMatchObject({ appsheet_key: "n-9", queued: 3, skipped: 0 });
    });

    it("sends through the transport it is given", async () => {
        const transport = vi.fn(async () => json({ objects: [{ appsheet_key: "n-2", title: "T" }] }));
        await createNotification(
            { title: "T", audience: { type: "single", user_key: "u-1" }, channel: "in_app", config: { kind: "in_app" } },
            transport,
        );
        expect(transport).toHaveBeenCalledTimes(1);
        expect(fetchWithRefreshMock).not.toHaveBeenCalled();
    });

    it("throws when the create response holds no notice", async () => {
        fetchWithRefreshMock.mockResolvedValueOnce(json({ objects: [] }));
        await expect(
            createNotification({ title: "T", audience: { type: "centre" }, channel: "in_app", config: { kind: "in_app" } }),
        ).rejects.toThrow("Invalid notification create response");
    });

    it("patches and deletes the encoded notice URL", async () => {
        fetchWithRefreshMock
            .mockResolvedValueOnce(json({ objects: [{ appsheet_key: "a/b", title: "New" }] }))
            .mockResolvedValueOnce(new Response(null, { status: 204 }));
        const patched = await patchNotification("a/b", { edited_at: "e", title: "New" });
        await deleteNotification("a/b");

        expect(requestedUrl(0).pathname).toBe("/v2/notifications/a%2Fb");
        expect(requestInit(0).method).toBe("PATCH");
        expect(patched.title).toBe("New");
        expect(requestedUrl(1).pathname).toBe("/v2/notifications/a%2Fb");
        expect(requestInit(1).method).toBe("DELETE");
    });
});

describe("notificationReadersPage", () => {
    it("reads one page of readers, with the read filter when given", async () => {
        fetchWithRefreshMock.mockResolvedValueOnce(json({ objects: [{ user_key: "u-1" }, "junk"] }));
        const page = await notificationReadersPage("n-1", true)(50, "c1");
        const url = requestedUrl(0);
        expect(url.pathname).toBe("/v2/notifications/n-1/readers");
        expect(url.searchParams.get("read_status")).toBe("true");
        expect(url.searchParams.get("cursor")).toBe("c1");
        expect(page.items).toHaveLength(1);
    });
});

describe("toNotificationRow", () => {
    it("keys on appsheet_key, else the index", () => {
        expect(toNotificationRow(notification(), 3).id).toBe("n-1");
        expect(toNotificationRow(notification({ appsheet_key: "" }), 3).id).toBe("3");
    });
});

describe("deriveManagementNotification", () => {
    it("prefers the notice from router state", () => {
        const fromState = notification();
        expect(deriveManagementNotification(fromState, [reader()], "n-1")).toBe(fromState);
    });

    it("rebuilds the notice from the first reader, without edited_at or counts", () => {
        const derived = deriveManagementNotification(null, [reader()], "n-7");
        expect(derived).toMatchObject({
            appsheet_key: "n-7",
            title: "Holiday",
            affected_area: "single",
            sender_name: "Sender",
            channel: "in_app",
            edited_at: null,
            queued: null,
            skipped: null,
        });
    });

    it("is null with neither", () => {
        expect(deriveManagementNotification(null, [], "n-1")).toBeNull();
    });
});

describe("buildNotificationPatch", () => {
    it("lists the changed editable fields in display order", () => {
        const saved = notification();
        const draft = notification({ end_time: null, title: "New", kind: "other" });
        expect(changedNotificationFields(saved, draft)).toEqual(["title", "end_time"]);
    });

    it("sends only the changed fields, blanks as null, times with the browser offset", () => {
        const saved = notification();
        const draft = notification({
            title: "",
            description: "",
            start_time: "2026-11-05T09:30:00",
            end_time: null,
        });
        expect(buildNotificationPatch(saved, draft, "lock")).toEqual({
            edited_at: "lock",
            title: "",
            description: null,
            start_time: `2026-11-05T09:30:00${getClientTimezoneOffset()}`,
            end_time: null,
        });
    });

    it("is the lock alone when nothing changed", () => {
        expect(buildNotificationPatch(notification(), notification(), "lock")).toEqual({ edited_at: "lock" });
    });
});

describe("toISOWithOffset", () => {
    it("keeps minutes, zeroes seconds and appends the offset", () => {
        expect(toISOWithOffset("2026-11-05T09:30:45")).toBe(`2026-11-05T09:30:00${getClientTimezoneOffset()}`);
    });
});
