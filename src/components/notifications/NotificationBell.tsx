import { useMemo, useRef, useState, useEffect } from "react";
import { Bell, ExternalLink, RefreshCw, X } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/context/NotificationContext";
import { useI18n } from "@/context/I18nContext";
import {
    getNotificationPriorityKind,
    shouldMarkNotificationReadOnView,
} from "@/api_calls/notifications";

function formatPriority(priority: string | null) {
    return getNotificationPriorityKind(priority);
}

function priorityBadgeClass(priority: string | null) {
    const normalized = (priority ?? "").trim().toUpperCase();
    if (normalized === "IMMEDIATE") return "border-destructive/40 bg-destructive/10 text-destructive";
    if (normalized === "URGENT")
        return "border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    return "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";
}

function formatTimestamp(value: string | null | undefined): string | null {
    if (!value) return null;
    try {
        return new Date(value).toLocaleString(undefined, {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            dateStyle: "short",
            timeStyle: "short",
        });
    } catch {
        return null;
    }
}

interface NotificationBellProps {
    viewAllPath?: string;
}

export default function NotificationBell({ viewAllPath }: NotificationBellProps) {
    const { t } = useI18n();
    const { immediate, urgent, informative, unreadCount, isLoading, dismiss, markSeen, refetch } =
        useNotifications();
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const allNotifications = useMemo(
        () => [...immediate, ...urgent, ...informative],
        [immediate, urgent, informative],
    );

    useEffect(() => {
        if (!open) return;
        function handlePointerDown(event: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        informative
            .filter((notification) => shouldMarkNotificationReadOnView(notification))
            .forEach((notification) => markSeen(notification.appsheet_key));
    }, [informative, markSeen, open]);

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border/70 bg-muted/45 text-foreground transition-colors hover:bg-muted"
                aria-label={t("notificationBell.ariaLabel", undefined, {
                    suffix:
                        unreadCount > 0
                            ? t("notificationBell.unreadSuffix", undefined, { count: unreadCount })
                            : "",
                })}
                aria-expanded={open}
            >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className={cn(
                        "animate-in fade-in-0 slide-in-from-top-2 absolute right-0 top-10 z-50 w-[min(92vw,30rem)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl duration-150",
                    )}
                >
                    <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                        <p className="text-sm font-semibold text-foreground">
                            {t("notificationBell.title")}
                        </p>
                        <div className="flex items-center gap-2">
                            {allNotifications.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        allNotifications.forEach((n) => dismiss(n.appsheet_key));
                                        setOpen(false);
                                    }}
                                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {t("common.clearAll")}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={refetch}
                                disabled={isLoading}
                                className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                                aria-label={t("notificationBell.refresh")}
                            >
                                <RefreshCw
                                    className={cn("size-3.5", isLoading && "animate-spin")}
                                />
                            </button>
                        </div>
                    </div>

                    {allNotifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            {t("notificationBell.empty")}
                        </div>
                    ) : (
                        <ul className="max-h-80 divide-y divide-border/50 overflow-y-auto">
                            {allNotifications.map((n) => (
                                <li key={n.appsheet_key} className="flex items-start gap-3 px-4 py-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <p className="text-sm font-medium leading-snug text-foreground">
                                                {n.title}
                                            </p>
                                            <span
                                                className={cn(
                                                    "shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                                                    priorityBadgeClass(n.priority),
                                                )}
                                            >
                                                {t(
                                                    `app.notification.${formatPriority(n.priority)}`,
                                                    formatPriority(n.priority),
                                                )}
                                            </span>
                                        </div>
                                        {n.description && (
                                            <p className="text-xs whitespace-pre-line break-words text-muted-foreground">
                                                {n.description}
                                            </p>
                                        )}
                                        {n.created_at && (
                                            <p className="mt-1 text-[11px] text-muted-foreground/70">
                                                {formatTimestamp(n.created_at)}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => dismiss(n.appsheet_key)}
                                        className="mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                                        aria-label={t("notificationBell.dismiss")}
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {viewAllPath && (
                        <div className="border-t border-border/60 px-4 py-2.5">
                            <Link
                                to={viewAllPath}
                                onClick={() => setOpen(false)}
                                className="flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {t("common.viewAll", "View all notifications")}
                                <ExternalLink className="size-3" />
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
