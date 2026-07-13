import { API_CONFIG } from "../config/api";
import { fetchWithRefresh } from "./fetchWithRefresh";

export type NotificationPriority = "IMMEDIATE" | "URGENT" | "INFORMATIVE";
export type NotificationPriorityKind = "immediate" | "urgent" | "informative" | "notice";

export interface UserNotification {
    appsheet_key: string;
    users_notification_key: string | null;
    title: string;
    description: string | null;
    priority: NotificationPriority | string | null;
    affected_area: string | null;
    start_time: string | null;
    end_time: string | null;
    created_at: string | null;
    sender_key: string | null;
    read_status: boolean | null;
    read_at: string | null;
}

export function getNotificationPriorityKind(
    priority: NotificationPriority | string | null | undefined,
): NotificationPriorityKind {
    const normalized = (priority ?? "").trim().toUpperCase();
    if (normalized === "IMMEDIATE") return "immediate";
    if (normalized === "URGENT") return "urgent";
    if (normalized === "INFORMATIVE") return "informative";
    return "notice";
}

export function isImmediateNotification(
    notificationOrPriority:
        | Pick<UserNotification, "priority">
        | NotificationPriority
        | string
        | null
        | undefined,
): boolean {
    const priority =
        typeof notificationOrPriority === "object" && notificationOrPriority !== null
            ? notificationOrPriority.priority
            : notificationOrPriority;
    return getNotificationPriorityKind(priority) === "immediate";
}

export function isUrgentNotification(
    notificationOrPriority:
        | Pick<UserNotification, "priority">
        | NotificationPriority
        | string
        | null
        | undefined,
): boolean {
    const priority =
        typeof notificationOrPriority === "object" && notificationOrPriority !== null
            ? notificationOrPriority.priority
            : notificationOrPriority;
    return getNotificationPriorityKind(priority) === "urgent";
}

export function isInformativeNotification(
    notificationOrPriority:
        | Pick<UserNotification, "priority">
        | NotificationPriority
        | string
        | null
        | undefined,
): boolean {
    const priority =
        typeof notificationOrPriority === "object" && notificationOrPriority !== null
            ? notificationOrPriority.priority
            : notificationOrPriority;
    return getNotificationPriorityKind(priority) === "informative";
}

export function shouldMarkNotificationReadOnView(
    notification: Pick<UserNotification, "priority">,
): boolean {
    return isInformativeNotification(notification);
}

function toUserNotification(raw: unknown): UserNotification | null {
    if (!raw || typeof raw !== "object") return null;
    const item = raw as Record<string, unknown>;
    if (typeof item.appsheet_key !== "string" || typeof item.title !== "string") return null;
    return {
        appsheet_key: item.appsheet_key,
        users_notification_key:
            typeof item.users_notification_key === "string" ? item.users_notification_key : null,
        title: item.title,
        description: typeof item.description === "string" ? item.description : null,
        priority: typeof item.priority === "string" ? item.priority : null,
        affected_area: typeof item.affected_area === "string" ? item.affected_area : null,
        start_time: typeof item.start_time === "string" ? item.start_time : null,
        end_time: typeof item.end_time === "string" ? item.end_time : null,
        created_at: typeof item.created_at === "string" ? item.created_at : null,
        sender_key: typeof item.sender_key === "string" ? item.sender_key : null,
        read_status: typeof item.read_status === "boolean" ? item.read_status : null,
        read_at: typeof item.read_at === "string" ? item.read_at : null,
    };
}

export async function fetchUserNotifications(activeOnly = true): Promise<UserNotification[]> {
    const url = new URL(`${API_CONFIG.baseURL}/v2/users/me/notifications`);
    if (!activeOnly) url.searchParams.set("active_only", "false");
    url.searchParams.set("page_size", "100");
    const response = await fetchWithRefresh(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const items: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray((data as Record<string, unknown>)?.objects)
          ? (data as Record<string, unknown[]>).objects
          : Array.isArray((data as Record<string, unknown>)?.notifications)
            ? (data as Record<string, unknown[]>).notifications
            : [];
    return items.map(toUserNotification).filter((n): n is UserNotification => n !== null);
}

export async function markNotificationRead(usersNotificationKey: string): Promise<void> {
    try {
        await fetchWithRefresh(
            `${API_CONFIG.baseURL}/v2/users/me/notifications/${encodeURIComponent(usersNotificationKey)}`,
            {
                method: "PATCH",
                headers: { Accept: "application/json", "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ read_status: true }),
            },
        );
    } catch {
        // fire-and-forget — UI already updated optimistically
    }
}
