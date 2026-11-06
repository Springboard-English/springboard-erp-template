import { useMemo, useRef, useState, useEffect } from "react";
import { Bell, Check, ExternalLink, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { headerIconButtonPlain } from "@/lib/headerControl";
import { touchHitArea } from "@/lib/touchTarget";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/context/NotificationContext";
import { useI18n } from "@/context/I18nContext";
import NotificationLink from "./NotificationLink";
import {
    getNotificationPriorityKind,
    shouldMarkNotificationReadOnView,
} from "@/api_calls/notifications";

/** How many notices the centre lists; the rest are on the view-all page. */
const MAX_SHOWN = 5;

function formatPriority(priority: string | null) {
    return getNotificationPriorityKind(priority);
}

function priorityBadgeClass(priority: string | null) {
    const normalized = (priority ?? "").trim().toUpperCase();
    if (normalized === "IMMEDIATE") return "border-destructive/40 bg-destructive/10 text-destructive";
    if (normalized === "URGENT")
        return "border-warning/35 bg-warning-bg text-warning";
    return "border-info/30 bg-info-bg text-info";
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

/**
 * The notification centre: the five newest active notices, read ones kept and
 * unread ones in bold. On desktop it is a header icon with a dropdown; in the
 * phone menu it is a full-width row whose list opens inline.
 */
export default function NotificationBell({ viewAllPath }: NotificationBellProps) {
    const { t } = useI18n();
    const { recent, unreadCount, isLoading, markSeen, refetch } = useNotifications();
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    const shown = useMemo(() => recent.slice(0, MAX_SHOWN), [recent]);
    const unread = useMemo(() => recent.filter((n) => n.read_status !== true), [recent]);

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

    // Informative notices shown while open are marked read when the centre
    // closes, so they stay bold for as long as the reader is looking at them.
    const seenWhileOpen = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!open) return;
        shown
            .filter((n) => n.read_status !== true && shouldMarkNotificationReadOnView(n))
            .forEach((n) => seenWhileOpen.current.add(n.appsheet_key));
    }, [shown, open]);

    useEffect(() => {
        if (open) return;
        const keys = [...seenWhileOpen.current];
        seenWhileOpen.current.clear();
        keys.forEach((key) => markSeen(key));
    }, [markSeen, open]);

    const label = t("notificationBell.ariaLabel", undefined, {
        suffix:
            unreadCount > 0
                ? t("notificationBell.unreadSuffix", undefined, { count: unreadCount })
                : "",
    });
    const countText = unreadCount > 99 ? "99+" : String(unreadCount);

    return (
        <div ref={rootRef} className="relative max-md:w-full">
            {/* Phone menu: a labelled row like the sheet's other controls. */}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen((current) => !current)}
                className="w-full justify-start gap-2 md:hidden"
                aria-label={label}
                aria-expanded={open}
            >
                <Bell className="size-4" />
                {t("notificationBell.title")}
                {unreadCount > 0 && (
                    <span className="ml-auto inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold leading-none text-primary-foreground">
                        {countText}
                    </span>
                )}
            </Button>
            {/* Desktop header: the toolbar's ghost circle. */}
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className={cn(headerIconButtonPlain, "relative max-md:hidden")}
                aria-label={label}
                aria-expanded={open}
            >
                <Bell className="size-4" />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                        {countText}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className={cn(
                        // Inline under the row in the phone menu; a dropdown under the icon on desktop.
                        "animate-in fade-in-0 slide-in-from-top-2 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground duration-150",
                        "md:absolute md:right-0 md:top-full md:z-[60] md:w-[min(92vw,30rem)] md:shadow-xl",
                    )}
                >
                    <div className="flex items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
                        {/* The phone row right above already names the list. */}
                        <p className="text-sm font-semibold text-foreground max-md:sr-only">
                            {t("notificationBell.title")}
                        </p>
                        <div className="ml-auto flex items-center gap-3">
                            {unread.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => unread.forEach((n) => markSeen(n.appsheet_key))}
                                    className={cn(touchHitArea, "relative text-xs text-muted-foreground transition-colors hover:text-foreground")}
                                >
                                    {t("notificationBell.markAllRead")}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={refetch}
                                disabled={isLoading}
                                className={cn(touchHitArea, "relative text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40")}
                                aria-label={t("notificationBell.refresh")}
                            >
                                <RefreshCw
                                    className={cn("size-3.5", isLoading && "animate-spin")}
                                />
                            </button>
                        </div>
                    </div>

                    {shown.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            {t("notificationBell.empty")}
                        </div>
                    ) : (
                        <ul className="divide-y divide-border/50 md:max-h-80 md:overflow-y-auto">
                            {shown.map((n) => {
                                const isUnread = n.read_status !== true;
                                return (
                                    <li key={n.appsheet_key} className="flex items-start gap-3 px-4 py-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                <p
                                                    className={cn(
                                                        "min-w-0 text-sm leading-snug break-words",
                                                        isUnread ? "font-semibold text-foreground" : "font-normal text-muted-foreground",
                                                    )}
                                                >
                                                    {isUnread ? (
                                                        <span className="sr-only">{t("notificationBell.unread")}: </span>
                                                    ) : null}
                                                    {n.title}
                                                </p>
                                                <span
                                                    className={cn(
                                                        "shrink-0 rounded border px-1.5 py-0.5 text-xs font-semibold",
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
                                                <p
                                                    className={cn(
                                                        "text-xs whitespace-pre-line break-words text-muted-foreground",
                                                        isUnread && "font-medium",
                                                    )}
                                                >
                                                    {n.description}
                                                </p>
                                            )}
                                            <NotificationLink link={n.link} />
                                            {n.created_at && (
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {formatTimestamp(n.created_at)}
                                                </p>
                                            )}
                                        </div>
                                        {isUnread && (
                                            <button
                                                type="button"
                                                onClick={() => markSeen(n.appsheet_key)}
                                                className={cn(touchHitArea, "relative mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground")}
                                                aria-label={t("notificationBell.markRead")}
                                                title={t("notificationBell.markRead")}
                                            >
                                                <Check className="size-3.5" />
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {viewAllPath && (
                        <div className="border-t border-border/60 px-4 py-2.5">
                            <Link
                                to={viewAllPath}
                                onClick={() => setOpen(false)}
                                className={cn(touchHitArea, "relative flex w-full items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground")}
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
