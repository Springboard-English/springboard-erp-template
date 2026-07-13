import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchUserNotifications, markNotificationRead } from "@/api_calls/notifications";
import type { UserNotification } from "@/api_calls/notifications";
import { useAuth } from "@/context/AuthContext";

function priorityBadgeClass(priority: string | null) {
    const normalized = (priority ?? "").trim().toUpperCase();
    if (normalized === "IMMEDIATE") return "border-destructive/40 bg-destructive/10 text-destructive";
    if (normalized === "URGENT")
        return "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    return "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";
}

function formatPriorityLabel(priority: string | null): string {
    const normalized = (priority ?? "").trim().toUpperCase();
    if (normalized === "IMMEDIATE") return "Immediate";
    if (normalized === "URGENT") return "Urgent";
    if (normalized === "INFORMATIVE") return "Informative";
    return priority ?? "Notice";
}

function formatTimestamp(value: string | null | undefined): string {
    if (!value) return "-";
    try {
        return new Date(value).toLocaleString(undefined, {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            dateStyle: "medium",
            timeStyle: "short",
        });
    } catch {
        return "-";
    }
}

export default function NotificationCenter() {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<UserNotification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [readKeys, setReadKeys] = useState<Set<string>>(new Set());
    const fetchingRef = useRef(false);

    const load = useCallback(async () => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchUserNotifications(false);
            setNotifications(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load notifications");
        } finally {
            fetchingRef.current = false;
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        void load();
    }, [isAuthenticated, load]);

    const markRead = (n: UserNotification) => {
        if (!n.users_notification_key || readKeys.has(n.appsheet_key) || n.read_status === true)
            return;
        setReadKeys((prev) => new Set([...prev, n.appsheet_key]));
        void markNotificationRead(n.users_notification_key);
    };

    const markAllRead = () => {
        notifications.forEach((n) => markRead(n));
    };

    const isRead = (n: UserNotification) =>
        n.read_status === true || readKeys.has(n.appsheet_key);

    const unreadCount = notifications.filter((n) => !isRead(n)).length;

    return (
        <div className="mx-auto w-full max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="size-5 text-foreground" />
                    <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
                    {unreadCount > 0 && (
                        <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllRead}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <CheckCheck className="size-3.5" />
                            Mark all as read
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => void load()}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                    >
                        <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </p>
            )}

            {isLoading && notifications.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                    Loading notifications…
                </div>
            ) : notifications.length === 0 ? (
                <div className="py-16 text-center text-sm text-muted-foreground">
                    No notifications found.
                </div>
            ) : (
                <ul className="divide-y divide-border/60 rounded-xl border border-border bg-card">
                    {notifications.map((n) => {
                        const read = isRead(n);
                        return (
                            <li
                                key={n.appsheet_key}
                                className={cn(
                                    "flex items-start gap-4 px-5 py-4 transition-colors",
                                    read ? "opacity-60" : "bg-muted/20",
                                )}
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                        <p
                                            className={cn(
                                                "text-sm font-medium leading-snug",
                                                read
                                                    ? "text-muted-foreground"
                                                    : "text-foreground",
                                            )}
                                        >
                                            {n.title}
                                        </p>
                                        <span
                                            className={cn(
                                                "rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                                                priorityBadgeClass(n.priority),
                                            )}
                                        >
                                            {formatPriorityLabel(n.priority)}
                                        </span>
                                    </div>
                                    {n.description && (
                                        <p className="mb-2 text-xs whitespace-pre-line break-words text-muted-foreground">
                                            {n.description}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground/70">
                                        {n.created_at && (
                                            <span>Sent: {formatTimestamp(n.created_at)}</span>
                                        )}
                                        {n.start_time && (
                                            <span>From: {formatTimestamp(n.start_time)}</span>
                                        )}
                                        {n.end_time && (
                                            <span>Until: {formatTimestamp(n.end_time)}</span>
                                        )}
                                        {read && n.read_at && (
                                            <span>Read: {formatTimestamp(n.read_at)}</span>
                                        )}
                                    </div>
                                </div>
                                {!read && n.users_notification_key && (
                                    <button
                                        type="button"
                                        onClick={() => markRead(n)}
                                        className="mt-0.5 shrink-0 rounded-md border border-border/60 px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                                        title="Mark as read"
                                    >
                                        Mark read
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
