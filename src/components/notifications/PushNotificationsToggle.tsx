import { useId } from "react";
import { BellRing, Share, SquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import {
    usePushNotifications,
    type UsePushNotificationsOptions,
} from "../../hooks/usePushNotifications";

export interface PushNotificationsToggleProps extends UsePushNotificationsOptions {
    className?: string;
}

/**
 * "Push notifications" on this device: a switch, a Send test link, and on an
 * iPhone or iPad in Safari the two steps that make push possible there at all.
 *
 * Renders nothing where push cannot be offered — a server without VAPID keys,
 * or a browser with no Push API that an install would not fix (an in-app
 * webview) — so an app can mount it unconditionally in its account panel.
 */
export default function PushNotificationsToggle({
    className,
    ...options
}: PushNotificationsToggleProps) {
    const { t } = useI18n();
    const push = usePushNotifications(options);
    const switchId = useId();

    if (push.support === "unsupported") return null;

    if (push.support === "needs-install") {
        return (
            <div className={cn("flex flex-col gap-1.5 text-sm", className)}>
                <div className="flex items-center gap-2 font-medium">
                    <BellRing className="size-4 shrink-0" aria-hidden />
                    {t("push.title")}
                </div>
                <p className="text-muted-foreground text-xs">{t("push.install.intro")}</p>
                <ol className="text-muted-foreground flex flex-col gap-1 text-xs">
                    <li className="flex items-center gap-1.5">
                        <Share className="size-3.5 shrink-0" aria-hidden />
                        {t("push.install.share")}
                    </li>
                    <li className="flex items-center gap-1.5">
                        <SquarePlus className="size-3.5 shrink-0" aria-hidden />
                        {t("push.install.add")}
                    </li>
                </ol>
            </div>
        );
    }

    if (!push.ready || !push.available) return null;

    const denied = push.permission === "denied";
    return (
        <div className={cn("flex flex-col gap-1.5 text-sm", className)}>
            <div className="flex items-center justify-between gap-3">
                <label htmlFor={switchId} className="flex items-center gap-2 font-medium">
                    <BellRing className="size-4 shrink-0" aria-hidden />
                    {t("push.title")}
                </label>
                <Switch
                    id={switchId}
                    size="sm"
                    checked={push.enabled}
                    disabled={push.busy || (denied && !push.enabled)}
                    onCheckedChange={(on) => void (on ? push.enable() : push.disable())}
                />
            </div>
            {denied && !push.enabled ? (
                <p className="text-muted-foreground text-xs">{t("push.denied")}</p>
            ) : push.enabled ? (
                <div className="flex items-center justify-between gap-2">
                    <p className="text-muted-foreground text-xs">{t("push.on")}</p>
                    <Button
                        type="button"
                        variant="link"
                        size="xs"
                        className="h-auto p-0"
                        disabled={push.busy}
                        onClick={() => void push.sendTest()}
                    >
                        {t("push.test")}
                    </Button>
                </div>
            ) : (
                <p className="text-muted-foreground text-xs">{t("push.off")}</p>
            )}
            {push.error ? (
                <p role="alert" className="text-destructive text-xs">
                    {push.error}
                </p>
            ) : null}
        </div>
    );
}
