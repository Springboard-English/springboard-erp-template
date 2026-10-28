import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { UserNotification } from "@/api_calls/notifications";

const { fetchWithRefreshMock, notificationsState } = vi.hoisted(() => ({
  fetchWithRefreshMock: vi.fn(),
  notificationsState: { informative: [] as unknown[] },
}));

vi.mock("@/api_calls/fetchWithRefresh", () => ({ fetchWithRefresh: fetchWithRefreshMock }));
vi.mock("@/context/NotificationContext", () => ({
  useNotifications: () => ({
    immediate: [],
    urgent: [],
    informative: notificationsState.informative,
    unreadCount: notificationsState.informative.length,
    isLoading: false,
    dismiss: vi.fn(),
    markSeen: vi.fn(),
    refetch: vi.fn(),
  }),
}));

import { API_CONFIG, configureApi } from "@/config/api";
import { fetchUserNotifications, safeNotificationLink } from "@/api_calls/notifications";
import { I18nProvider } from "@/context/I18nContext";
import NotificationBell from "../NotificationBell";

/** A notice with the given key, title and link. */
function notice(key: string, link: string | null): UserNotification {
  return {
    appsheet_key: key,
    users_notification_key: null,
    title: `Notice ${key}`,
    description: null,
    priority: "INFORMATIVE",
    affected_area: null,
    start_time: null,
    end_time: null,
    created_at: null,
    sender_key: null,
    read_status: null,
    read_at: null,
    link,
  };
}

const originalBase = API_CONFIG.baseURL;
beforeAll(() => configureApi({ baseUrl: "https://api.test" }));
afterAll(() => configureApi({ baseUrl: originalBase }));
beforeEach(() => fetchWithRefreshMock.mockReset());

describe("fetchUserNotifications", () => {
  it("keeps an http(s) link and drops anything else", async () => {
    fetchWithRefreshMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          objects: [
            { appsheet_key: "a", title: "We received your report", link: "https://ops.springboard.vn/support/t1" },
            { appsheet_key: "b", title: "Script", link: "javascript:alert(1)" },
            { appsheet_key: "c", title: "None" },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const rows = await fetchUserNotifications(false);

    expect(String(fetchWithRefreshMock.mock.calls[0]?.[0])).toContain("https://api.test/v2/users/me/notifications");
    expect(rows.map((row) => row.link)).toEqual(["https://ops.springboard.vn/support/t1", null, null]);
  });
});

describe("safeNotificationLink", () => {
  it("accepts only absolute http(s) URLs", () => {
    expect(safeNotificationLink("https://ops.springboard.vn/support/t1")).toBe("https://ops.springboard.vn/support/t1");
    expect(safeNotificationLink("http://localhost:5174/support/t1")).toBe("http://localhost:5174/support/t1");
    expect(safeNotificationLink("javascript:alert(1)")).toBeNull();
    expect(safeNotificationLink("/support/t1")).toBeNull();
    expect(safeNotificationLink("")).toBeNull();
    expect(safeNotificationLink(null)).toBeNull();
  });
});

describe("NotificationBell", () => {
  it("shows an Open link that opens in a new tab only on a notice that has one", async () => {
    const user = userEvent.setup();
    notificationsState.informative = [
      notice("a", "https://ops.springboard.vn/support/t1"),
      notice("b", null),
      notice("c", "javascript:alert(1)"),
    ];
    render(
      <I18nProvider locale="en">
        <NotificationBell />
      </I18nProvider>,
    );

    await user.click(screen.getByRole("button", { name: /Notifications/ }));

    const links = screen.getAllByRole("link", { name: "Open" });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://ops.springboard.vn/support/t1");
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0].getAttribute("rel")).toContain("noopener");
  });
});
