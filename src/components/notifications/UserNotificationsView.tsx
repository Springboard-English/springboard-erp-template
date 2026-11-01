import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUserNotifications,
  getNotificationPriorityKind,
  markNotificationRead,
  shouldMarkNotificationReadOnView,
  type UserNotification,
} from "@/api_calls/notifications";
import PageHeader from "@/components/layout/PageHeader";
import MobileCardList, { CardField } from "@/components/MobileCardList";
import SimpleDataTable, { type SimpleDataTableColumn } from "@/components/SimpleDataTable";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import { useNotifications } from "@/context/NotificationContext";
import { cn } from "@/lib/utils";
import { formatUserTimestamp } from "@/utils/formatters";
import NotificationLink from "./NotificationLink";

/** The badge colours for a notification's priority. */
function priorityBadgeClass(priority: string | null) {
  const kind = getNotificationPriorityKind(priority);
  if (kind === "immediate") return "border-destructive/40 bg-destructive/10 text-destructive";
  if (kind === "urgent") return "border-warning/35 bg-warning-bg text-warning";
  return "border-info/30 bg-info-bg text-info";
}

/** The signed-in person's own notifications page: read state, links and paging. */
export default function UserNotificationsView() {
  const { t } = useI18n();
  const { refetch: refetchBell } = useNotifications();
  const [readKeys, setReadKeys] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const query = useQuery({
    queryKey: ["userNotifications"],
    queryFn: () => fetchUserNotifications(false),
  });

  const notifications = useMemo(() => query.data ?? [], [query.data]);

  const isRead = useCallback(
    (notification: UserNotification) =>
      notification.read_status === true || readKeys.has(notification.appsheet_key),
    [readKeys],
  );

  const markRead = useCallback(
    (notification: UserNotification) => {
      if (!notification.users_notification_key || isRead(notification)) return;
      setReadKeys((prev) => new Set([...prev, notification.appsheet_key]));
      void markNotificationRead(notification.users_notification_key);
      refetchBell();
    },
    [isRead, refetchBell],
  );

  const priorityLabel = useCallback(
    (priority: string | null) => {
      const kind = getNotificationPriorityKind(priority);
      if (kind === "immediate") return t("notifications.immediate");
      if (kind === "urgent") return t("notifications.urgent");
      if (kind === "informative") return t("notifications.informative");
      return priority ?? t("notifications.notice");
    },
    [t],
  );

  useEffect(() => {
    const informativeUnread = notifications.filter(
      (notification) =>
        shouldMarkNotificationReadOnView(notification) &&
        notification.users_notification_key &&
        notification.read_status !== true &&
        !readKeys.has(notification.appsheet_key),
    );
    if (informativeUnread.length === 0) return;

    setReadKeys((prev) => {
      const next = new Set(prev);
      informativeUnread.forEach((notification) => next.add(notification.appsheet_key));
      return next;
    });
    informativeUnread.forEach((notification) => {
      void markNotificationRead(notification.users_notification_key!);
    });
    refetchBell();
  }, [notifications, readKeys, refetchBell]);

  const unreadCount = notifications.filter((n) => !isRead(n)).length;

  const columns = useMemo<SimpleDataTableColumn<UserNotification>[]>(
    () => [
      {
        id: "notification",
        header: t("notifications.notification"),
        className: "min-w-[260px]",
        cellClassName: "min-w-0",
        render: (n) => {
          const read = isRead(n);
          return (
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("font-medium leading-snug", read ? "text-muted-foreground" : "text-foreground")}>
                  {n.title}
                </span>
                <span className={cn("shrink-0 rounded border px-1.5 py-0.5 text-xs font-semibold", priorityBadgeClass(n.priority))}>
                  {priorityLabel(n.priority)}
                </span>
              </div>
              {n.description && <p className="text-xs whitespace-pre-line text-muted-foreground">{n.description}</p>}
              <NotificationLink link={n.link} />
            </div>
          );
        },
      },
      {
        id: "sent",
        header: t("notifications.sent"),
        className: "w-[180px]",
        render: (n) => (
          <div className="space-y-0.5 text-xs text-muted-foreground">
            <div>{formatUserTimestamp(n.created_at)}</div>
            {n.sender_key === null && <div className="italic">{t("notifications.anonymous")}</div>}
          </div>
        ),
      },
      {
        id: "active",
        header: t("notifications.active"),
        className: "w-[200px]",
        render: (n) => (
          <div className="space-y-0.5 text-xs text-muted-foreground">
            {n.start_time && <div>{t("notifications.from")}: {formatUserTimestamp(n.start_time)}</div>}
            {n.end_time && <div>{t("notifications.until")}: {formatUserTimestamp(n.end_time)}</div>}
          </div>
        ),
      },
      {
        id: "status",
        header: t("notifications.status"),
        className: "w-[160px]",
        render: (n) => {
          if (isRead(n)) {
            return (
              <span className="text-xs text-muted-foreground/70">
                {n.read_at ? `${t("notifications.read")} ${formatUserTimestamp(n.read_at)}` : t("notifications.read")}
              </span>
            );
          }
          return !shouldMarkNotificationReadOnView(n) && n.users_notification_key ? (
            <button
              type="button"
              onClick={() => markRead(n)}
              className="inline-flex min-h-11 items-center rounded-md border border-border/60 px-2 py-1 text-[11px] md:pointer-fine:min-h-9 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              {t("notifications.markRead")}
            </button>
          ) : null;
        },
      },
    ],
    [isRead, markRead, priorityLabel, t],
  );

  return (
    <section className="w-full max-w-[1700px] space-y-4 md:flex md:h-[calc(100dvh-7rem)] md:min-h-0 md:flex-col md:overflow-hidden">
      <PageHeader
        title={t("notifications.title")}
        status={
          unreadCount > 0 ? (
            <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
              {unreadCount}
            </span>
          ) : null
        }
        actions={
          unreadCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => notifications.filter((n) => !isRead(n)).forEach(markRead)}
            >
              <CheckCheck className="size-4" />
              {t("notifications.markAllRead")}
            </Button>
          ) : null
        }
      />

      <MobileCardList
        rows={notifications}
        rowKey={(n) => n.appsheet_key}
        loading={query.isLoading}
        emptyMessage={t("notifications.empty")}
        renderCard={(n) => {
          const read = isRead(n);
          return (
            <div
              className={cn(
                "w-full rounded-2xl border border-border/70 bg-card p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]",
                read && "opacity-60",
              )}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className={cn("font-semibold", read ? "text-muted-foreground" : "text-foreground")}>{n.title}</p>
                <span className={cn("shrink-0 rounded border px-1.5 py-0.5 text-xs font-semibold", priorityBadgeClass(n.priority))}>
                  {priorityLabel(n.priority)}
                </span>
              </div>
              {n.description && <p className="mb-2 text-xs text-muted-foreground">{n.description}</p>}
              <NotificationLink link={n.link} className="mb-2" />
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <CardField label={t("notifications.sent")} value={formatUserTimestamp(n.created_at)} />
                {n.sender_key === null && (
                  <CardField label={t("notifications.sender")} value={t("notifications.anonymous")} />
                )}
                {n.start_time && <CardField label={t("notifications.from")} value={formatUserTimestamp(n.start_time)} />}
                {n.end_time && <CardField label={t("notifications.until")} value={formatUserTimestamp(n.end_time)} />}
                {read && (
                  <CardField
                    label={t("notifications.read")}
                    value={n.read_at ? formatUserTimestamp(n.read_at) : t("common.yes")}
                  />
                )}
              </dl>
              {!read && !shouldMarkNotificationReadOnView(n) && n.users_notification_key && (
                <button
                  type="button"
                  onClick={() => markRead(n)}
                  className="mt-3 inline-flex min-h-11 items-center rounded-md border border-border/60 px-3 py-1.5 text-xs md:pointer-fine:min-h-9 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                >
                  {t("notifications.markRead")}
                </button>
              )}
            </div>
          );
        }}
      />

      <div data-table-viewport className="hidden min-h-0 flex-1 overflow-hidden md:block">
        <SimpleDataTable
          desktopOnly
          columns={columns}
          rows={notifications}
          rowKey={(n) => n.appsheet_key}
          loading={query.isLoading}
          loadingMessage={t("notifications.loading")}
          emptyMessage={t("notifications.empty")}
          page={page}
          pageSize={pageSize}
          pageSizeOptions={[25, 50, 100]}
          onPageChange={setPage}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setPage(0);
          }}
        />
      </div>
    </section>
  );
}
