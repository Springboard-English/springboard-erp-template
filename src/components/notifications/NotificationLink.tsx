import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { safeNotificationLink } from "@/api_calls/notifications";
import { useI18n } from "@/context/I18nContext";

export interface NotificationLinkProps {
  /** The notice's `link`; anything but an absolute http(s) URL renders nothing. */
  link: string | null | undefined;
  /** Overrides the "Open" label. */
  label?: string;
  className?: string;
}

/** A notice's link as an external "Open" link in a new tab, or nothing when it has none. */
export default function NotificationLink({ link, label, className }: NotificationLinkProps) {
  const { t } = useI18n();
  const href = safeNotificationLink(link);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline md:pointer-fine:min-h-0",
        className,
      )}
    >
      {label ?? t("notification.openLink")}
      <ExternalLink className="size-3.5" aria-hidden="true" />
    </a>
  );
}
