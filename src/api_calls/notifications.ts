import { API_CONFIG, getNotificationEndpoint } from "../config/api";
import { fetchWithRefresh } from "./fetchWithRefresh";

export type NotificationPriority = "IMMEDIATE" | "URGENT" | "INFORMATIVE";

export interface UserNotification {
    appsheet_key: string;
    title: string;
    description: string | null;
    priority: NotificationPriority | string | null;
    start_time: string | null;
    end_time: string | null;
    created_at: string | null;
}

function toUserNotification(raw: unknown): UserNotification | null {
    if (!raw || typeof raw !== "object") return null;
    const item = raw as Record<string, unknown>;
    if (typeof item.appsheet_key !== "string" || typeof item.title !== "string") return null;
    return {
        appsheet_key: item.appsheet_key,
        title: item.title,
        description: typeof item.description === "string" ? item.description : null,
        priority: typeof item.priority === "string" ? item.priority : null,
        start_time: typeof item.start_time === "string" ? item.start_time : null,
        end_time: typeof item.end_time === "string" ? item.end_time : null,
        created_at: typeof item.created_at === "string" ? item.created_at : null,
    };
}

export async function fetchUserNotifications(): Promise<UserNotification[]> {
    const response = await fetchWithRefresh(
        `${API_CONFIG.baseURL}/users/me/notifications`,
        { method: "GET", headers: { Accept: "application/json" }, credentials: "include" },
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const items: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray((data as Record<string, unknown>)?.notifications)
          ? (data as Record<string, unknown[]>).notifications
          : [];
    return items.map(toUserNotification).filter((n): n is UserNotification => n !== null);
}

export async function dismissNotification(key: string): Promise<void> {
    try {
        await fetchWithRefresh(getNotificationEndpoint(key), {
            method: "PATCH",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ dismissed: true }),
        });
    } catch {
        // fire-and-forget — UI already updated optimistically
    }
}
