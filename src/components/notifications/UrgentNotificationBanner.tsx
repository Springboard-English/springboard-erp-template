import { AlertTriangle, X } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

export default function UrgentNotificationBanner() {
    const { urgent, dismiss } = useNotifications();

    if (urgent.length === 0) return null;

    return (
        <div className="space-y-2">
            {urgent.map((n) => (
                <div
                    key={n.appsheet_key}
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-800 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300"
                >
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500 dark:text-amber-400" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug">{n.title}</p>
                        {n.description && (
                            <p className="mt-0.5 text-sm opacity-80">{n.description}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => dismiss(n.appsheet_key)}
                        className="mt-0.5 shrink-0 opacity-60 transition-opacity hover:opacity-100"
                        aria-label="Dismiss notification"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
