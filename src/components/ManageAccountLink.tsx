import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACCOUNTS_PROFILE_URL } from "@/config/accounts";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

export interface ManageAccountLinkProps {
  /** Icon only, for a collapsed sidebar; the label stays as its accessible name. */
  collapsed?: boolean;
  variant?: "ghost" | "outline";
  className?: string;
}

/**
 * Opens the accounts site's profile page in a new tab, for an app's account
 * panel. The phone menu sheet draws its own. Renders nothing for a guest, whose
 * account is disposable and has nothing to manage there.
 */
export default function ManageAccountLink({
  collapsed = false,
  variant = "ghost",
  className,
}: ManageAccountLinkProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  if (!user || user.account_type === "guest") return null;
  const label = t("account.manage", "Manage account");

  return (
    <Button
      asChild
      variant={variant}
      size={collapsed ? "icon" : "sm"}
      className={cn(
        collapsed ? "mx-auto flex size-9 justify-center" : "w-full justify-start gap-2",
        className,
      )}
    >
      <a
        href={ACCOUNTS_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={collapsed ? label : undefined}
        aria-label={collapsed ? label : undefined}
      >
        <UserCog className="size-4" />
        <span className={collapsed ? "sr-only" : undefined}>{label}</span>
      </a>
    </Button>
  );
}
