import { AlertTriangle, X } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useI18n } from "@/context/I18nContext";
import { touchHitArea } from "@/lib/touchTarget";
import NotificationLink from "./NotificationLink";

export default function UrgentNotificationBanner() {
    const { t } = useI18n();
    const { urgent, dismiss } = useNotifications();

    if (urgent.length === 0) return null;

    return (
        <div className="space-y-2">
            {urgent.map((n) => (
                <div
                    key={n.appsheet_key}
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-bg px-4 py-3 text-warning"
                >
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug">{n.title}</p>
                        {n.description && (
                            <p className="mt-0.5 text-sm opacity-80">{n.description}</p>
                        )}
                        <NotificationLink link={n.link} className="text-current" />
                    </div>
                    <button
                        type="button"
                        onClick={() => dismiss(n.appsheet_key)}
                        className={`${touchHitArea} relative mt-0.5 shrink-0 opacity-60 transition-opacity hover:opacity-100`}
                        aria-label={t("notification.dismiss")}
                    >
                        <X className="size-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
