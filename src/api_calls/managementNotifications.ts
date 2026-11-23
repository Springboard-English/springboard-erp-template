// Staff-side notification management: listing, sending (`POST /v2/notifications`),
// editing and deleting notices, and who each one reached. Types, calls and pure
// helpers only; each app keeps its own table, detail view and send dialog.

import { API_CONFIG } from "../config/api";
import { fetchWithRefresh } from "./fetchWithRefresh";
import { throwIfNotOk } from "./apiErrors";
import { getSingleObjectPayload, parseCursorPage } from "../utils/apiEnvelope";
import { fetchEveryPage, type CursorPaginatedResult, type EveryPageResult } from "../utils/cursorPagination";
import { toISOWithOffset } from "../utils/formatters";

export type NotificationAffectedArea = "centre" | "single" | "class";

/** A notice as `GET /v2/notifications` lists it (`NotificationResponse`). */
export interface ManagementNotification {
    appsheet_key: string;
    title: string;
    description: string | null;
    priority: string | null;
    affected_area: string;
    start_time: string | null;
    end_time: string | null;
    created_at: string | null;
    edited_at: string | null;
    // Null on an anonymous notice and on every notice the system sent.
    sender_key: string | null;
    sender_name: string | null;
    // `affected_area` says which key this is: the user for "single", the
    // class for "class", neither for "centre".
    recipient_key: string | null;
    recipient_name: string | null;
    target_account_type: string | null;
    // Null is "not recorded" (older rows), never "sent nowhere".
    kind: string | null;
    channel: string | null;
    recipients: string | null;
    // Counted by the dispatch itself: set on a POST response, null on reads.
    queued: number | null;
    skipped: number | null;
}

export type NotificationRecipientGroup = "students" | "parents" | "mentors" | "all";

export type NotificationChannel = "in_app" | "zns" | "email" | "db_email";

/** Who a dispatch reaches: one field discriminated on `type`, so an illegal combination cannot be written. */
export type NotificationAudience =
    | { type: "centre"; account_type?: "employee" | null }
    | { type: "class"; class_key: string }
    | { type: "single"; user_key: string };

/**
 * The dispatch's one channel's settings. Which fields a channel takes is its
 * own `config_fields`; stating one it does not take is a 400. In-app requires
 * the `start_time`/`end_time` window, since a missing bound shows for ever.
 */
export interface NotificationConfig {
    kind: string;
    recipients?: NotificationRecipientGroup | null;
    addresses?: Array<{ address: string; name?: string | null }> | null;
    start_time?: string | null;
    end_time?: string | null;
}

/** The body of `POST /v2/notifications`: one channel per dispatch. */
export interface NotificationPostRequest {
    title: string;
    description?: string | null;
    priority?: string | null;
    sender_key?: string | null;
    audience: NotificationAudience;
    channel: NotificationChannel;
    config: NotificationConfig;
    payload?: Record<string, unknown>;
    source_type?: string;
    source_key?: string;
    once_per_recipient?: boolean;
    force?: boolean;
}

/** The body of `PATCH /v2/notifications/{key}`; `edited_at` is the optimistic lock. */
export interface NotificationPatchRequest {
    edited_at: string;
    title?: string;
    description?: string | null;
    priority?: string | null;
    start_time?: string | null;
    end_time?: string | null;
}

/**
 * One recipient and their read state, from `GET /v2/notifications/{key}/readers`.
 * Each row also carries the parent notice's fields, so a detail page opened
 * directly can rebuild the notice from it.
 */
export interface NotificationReader {
    users_notification_key: string | null;
    user_key: string | null;
    user_name: string | null;
    read_status: boolean | null;
    read_at: string | null;
    title: string | null;
    description: string | null;
    priority: string | null;
    affected_area: string | null;
    start_time: string | null;
    end_time: string | null;
    created_at: string | null;
    sender_key: string | null;
    sender_name: string | null;
    recipient_key: string | null;
    recipient_name: string | null;
    target_account_type: string | null;
    kind: string | null;
    channel: string | null;
    recipients: string | null;
}

/** A notice row with the `id` a table keys on. */
export type ManagementNotificationRow = ManagementNotification & { id: string };

/** The fields a notice's detail view may edit, in display order. */
export const EDITABLE_NOTIFICATION_FIELDS = [
    "title",
    "description",
    "priority",
    "start_time",
    "end_time",
] as const;

export type EditableNotificationField = (typeof EDITABLE_NOTIFICATION_FIELDS)[number];

function str(value: unknown): string | null {
    return typeof value === "string" ? value : null;
}

function managementNotificationsUrl(): string {
    return `${API_CONFIG.baseURL}/v2/notifications`;
}

/** The URL of one notice, `/v2/notifications/{key}`. */
function getNotificationEndpoint(notificationKey: string): string {
    return `${managementNotificationsUrl()}/${encodeURIComponent(notificationKey)}`;
}

/** A raw notice as a `ManagementNotification`, or null without a string `appsheet_key` and `title`. */
export function readManagementNotification(raw: unknown): ManagementNotification | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }
    const item = raw as Record<string, unknown>;
    if (typeof item.appsheet_key !== "string" || typeof item.title !== "string") {
        return null;
    }
    return {
        appsheet_key: item.appsheet_key,
        title: item.title,
        description: str(item.description),
        priority: str(item.priority),
        affected_area: typeof item.affected_area === "string" ? item.affected_area : "",
        start_time: str(item.start_time),
        end_time: str(item.end_time),
        created_at: str(item.created_at),
        edited_at: str(item.edited_at),
        sender_key: str(item.sender_key),
        sender_name: str(item.sender_name),
        recipient_key: str(item.recipient_key),
        recipient_name: str(item.recipient_name),
        target_account_type: str(item.target_account_type),
        kind: str(item.kind),
        channel: str(item.channel),
        recipients: str(item.recipients),
        queued: typeof item.queued === "number" ? item.queued : null,
        skipped: typeof item.skipped === "number" ? item.skipped : null,
    };
}

/** A raw readers row as a `NotificationReader`; null for anything not an object. */
export function readNotificationReader(raw: unknown): NotificationReader | null {
    if (!raw || typeof raw !== "object") {
        return null;
    }
    const item = raw as Record<string, unknown>;
    return {
        users_notification_key: str(item.users_notification_key),
        user_key: str(item.user_key),
        user_name: str(item.user_name),
        read_status: typeof item.read_status === "boolean" ? item.read_status : null,
        read_at: str(item.read_at),
        title: str(item.title),
        description: str(item.description),
        priority: str(item.priority),
        affected_area: str(item.affected_area),
        start_time: str(item.start_time),
        end_time: str(item.end_time),
        created_at: str(item.created_at),
        sender_key: str(item.sender_key),
        sender_name: str(item.sender_name),
        recipient_key: str(item.recipient_key),
        recipient_name: str(item.recipient_name),
        target_account_type: str(item.target_account_type),
        kind: str(item.kind),
        channel: str(item.channel),
        recipients: str(item.recipients),
    };
}

/**
 * One page of `GET /v2/notifications` under the given filters, as a
 * `(pageSize, cursor)` fetcher for `useServerList` and `fetchEveryPage`.
 * Rows that do not parse are dropped.
 */
export function managementNotificationsPage(
    affectedArea?: string,
    priority?: string,
    activeOnly?: boolean,
) {
    return async (
        pageSize: number,
        cursor: string | null,
    ): Promise<CursorPaginatedResult<ManagementNotification>> => {
        const url = new URL(managementNotificationsUrl());
        url.searchParams.append("page_size", String(pageSize));
        if (affectedArea?.trim()) {
            url.searchParams.append("affected_area", affectedArea.trim());
        }
        if (priority?.trim()) {
            url.searchParams.append("priority", priority.trim());
        }
        if (activeOnly !== undefined) {
            url.searchParams.append("active_only", String(activeOnly));
        }
        if (cursor?.trim()) {
            url.searchParams.append("cursor", cursor.trim());
        }

        const response = await fetchWithRefresh(url.toString(), {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        await throwIfNotOk(response, "Failed to fetch notifications");

        const parsed = parseCursorPage(await response.json());
        return {
            ...parsed,
            items: parsed.items
                .map(readManagementNotification)
                .filter((item): item is ManagementNotification => item !== null),
        };
    };
}

/** Every notice under the filters, uncapped, for a CSV export. */
export async function fetchAllManagementNotifications(
    affectedArea?: string,
    priority?: string,
    activeOnly?: boolean,
): Promise<EveryPageResult<ManagementNotification>> {
    return fetchEveryPage(
        managementNotificationsPage(affectedArea, priority, activeOnly),
        Number.MAX_SAFE_INTEGER,
    );
}

async function readNotificationResponse(response: Response, failure: string, invalid: string) {
    await throwIfNotOk(response, failure);
    const notification = readManagementNotification(getSingleObjectPayload(await response.json()));
    if (!notification) {
        throw new Error(invalid);
    }
    return notification;
}

/** The authed fetch a send goes through; an app passes its own wrapper of `fetchWithRefresh`. */
export type NotificationTransport = typeof fetchWithRefresh;

/**
 * Sends a notice (`POST /v2/notifications`) and returns the created row with
 * its `queued`/`skipped` counts. `transport` lets an app route the send
 * through its own wrapper (the LMS tour sample answers sends that name it).
 */
export async function createNotification(
    payload: NotificationPostRequest,
    transport: NotificationTransport = fetchWithRefresh,
): Promise<ManagementNotification> {
    const response = await transport(managementNotificationsUrl(), {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return readNotificationResponse(response, "Failed to create notification", "Invalid notification create response");
}

/** Edits a notice (`PATCH /v2/notifications/{key}`) and returns the saved row. */
export async function patchNotification(
    notificationKey: string,
    payload: NotificationPatchRequest,
): Promise<ManagementNotification> {
    const response = await fetchWithRefresh(getNotificationEndpoint(notificationKey), {
        method: "PATCH",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return readNotificationResponse(response, "Failed to patch notification", "Invalid notification patch response");
}

/** Deletes a notice and every recipient's copy of it. */
export async function deleteNotification(notificationKey: string): Promise<void> {
    const response = await fetchWithRefresh(getNotificationEndpoint(notificationKey), {
        method: "DELETE",
        headers: { Accept: "application/json" },
    });
    await throwIfNotOk(response, "Failed to delete notification");
}

/** One page of who a notice reached, optionally only the read or unread ones. */
export function notificationReadersPage(notificationKey: string, readStatus?: boolean) {
    return async (
        pageSize: number,
        cursor: string | null,
    ): Promise<CursorPaginatedResult<NotificationReader>> => {
        const url = new URL(`${getNotificationEndpoint(notificationKey)}/readers`);
        url.searchParams.append("page_size", String(pageSize));
        if (cursor?.trim()) {
            url.searchParams.append("cursor", cursor.trim());
        }
        if (readStatus !== undefined) {
            url.searchParams.append("read_status", String(readStatus));
        }

        const response = await fetchWithRefresh(url.toString(), {
            method: "GET",
            headers: { Accept: "application/json" },
        });
        await throwIfNotOk(response, "Failed to fetch notification readers");

        const parsed = parseCursorPage(await response.json());
        return {
            ...parsed,
            items: parsed.items
                .map(readNotificationReader)
                .filter((item): item is NotificationReader => item !== null),
        };
    };
}

/** A notice as a table row, keyed by `appsheet_key`, or by its index when it has none. */
export function toNotificationRow(item: ManagementNotification, index: number): ManagementNotificationRow {
    return { ...item, id: item.appsheet_key || `${index}` };
}

/**
 * The notice a detail view shows: the one handed over in router state, else
 * one rebuilt from the first readers row (a direct visit or a refresh), else
 * null. A rebuilt notice has no `edited_at`, so it cannot be patched.
 */
export function deriveManagementNotification(
    fromState: ManagementNotification | null,
    readers: readonly NotificationReader[],
    notificationKey: string,
): ManagementNotification | null {
    if (fromState) {
        return fromState;
    }
    const source = readers[0];
    if (!source) {
        return null;
    }
    return {
        appsheet_key: notificationKey,
        title: source.title ?? "",
        description: source.description,
        priority: source.priority,
        affected_area: source.affected_area ?? "",
        start_time: source.start_time,
        end_time: source.end_time,
        created_at: source.created_at,
        edited_at: null,
        sender_key: source.sender_key,
        sender_name: source.sender_name,
        recipient_key: source.recipient_key,
        recipient_name: source.recipient_name,
        target_account_type: source.target_account_type,
        kind: source.kind,
        channel: source.channel,
        recipients: source.recipients,
        // Counted by the dispatch call, so no read can answer them.
        queued: null,
        skipped: null,
    };
}

/** The editable fields whose draft value differs from the saved one, in display order. */
export function changedNotificationFields(
    saved: ManagementNotification,
    draft: ManagementNotification,
): EditableNotificationField[] {
    return EDITABLE_NOTIFICATION_FIELDS.filter((field) => draft[field] !== saved[field]);
}

/**
 * The PATCH body for a detail view's edits: `edited_at` plus each changed
 * field. Blank optional text becomes null; a changed `datetime-local` time is
 * sent as ISO with the browser's offset.
 */
export function buildNotificationPatch(
    saved: ManagementNotification,
    draft: ManagementNotification,
    editedAt: string,
): NotificationPatchRequest {
    const payload: NotificationPatchRequest = { edited_at: editedAt };
    for (const field of changedNotificationFields(saved, draft)) {
        if (field === "title") {
            payload.title = draft.title;
        } else if (field === "start_time" || field === "end_time") {
            const value = draft[field];
            payload[field] = value ? toISOWithOffset(value) : null;
        } else {
            payload[field] = draft[field] || null;
        }
    }
    return payload;
}
