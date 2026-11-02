import { useState, type ReactNode } from "react";
import { LogOut } from "lucide-react";
import BuildTag, { type BuildTagProps } from "./BuildTag";
import ManageAccountLink from "@/components/ManageAccountLink";
import PushNotificationsToggle, {
  type PushNotificationsToggleProps,
} from "./notifications/PushNotificationsToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

export interface AccountConfig {
  /** This build's tag; `hidden` is the panel's to set. */
  buildTag: Omit<BuildTagProps, "hidden" | "className">;
  /** Omit where the app offers no push. */
  push?: Pick<PushNotificationsToggleProps, "app" | "serviceWorkerUrl">;
  /** False on the accounts site, where the link would point at the page itself. */
  manageAccount?: boolean;
  /** An app's own rows above Manage account, given the panel's collapsed state. */
  actions?: (collapsed: boolean) => ReactNode;
}

export interface AccountPanelProps extends AccountConfig {
  className?: string;
  collapsed?: boolean;
}

/** Up to two initials from a display name. */
function initialsOf(name: string | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** The build tag and push toggle: what the phone sheet can't draw for itself. */
export function AccountExtras({
  buildTag,
  push,
  collapsed = false,
  pushClassName,
}: Pick<AccountConfig, "buildTag" | "push"> & { collapsed?: boolean; pushClassName?: string }) {
  return (
    <>
      <BuildTag {...buildTag} hidden={collapsed} />
      {/* Renders nothing where push cannot be offered. */}
      {push && !collapsed ? <PushNotificationsToggle {...push} className={pushClassName} /> : null}
    </>
  );
}

/** The sidebar footer every app shows: who is signed in, the build tag and Logout. */
export default function AccountPanel({
  className,
  collapsed = false,
  buildTag,
  push,
  manageAccount = true,
  actions,
}: AccountPanelProps) {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const loggingIn = t("account.loggingIn");
  const logoutLabel = t("account.logout");
  const name = user?.name?.trim() || user?.username?.trim() || loggingIn;
  const accountType = user?.account_type ?? "";
  const accountTypeLabel = t(
    `account.type.${accountType}`,
    accountType.charAt(0).toUpperCase() + accountType.slice(1),
  );
  const identity = user ? `${name} · ${accountTypeLabel}` : loggingIn;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Card
      className={cn(
        "rounded-2xl border-border/70 bg-card/85 py-0 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.45)] backdrop-blur",
        collapsed && "rounded-xl",
        className,
      )}
    >
      <CardContent className={cn("space-y-4 px-4 py-4", collapsed && "px-3 py-3")}>
        {collapsed ? (
          <div className="flex justify-center">
            <div
              className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold tracking-tight"
              title={identity}
              aria-label={identity}
            >
              {initialsOf(user?.name)}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold tracking-tight">{identity}</p>
            {user?.name?.trim() && user.username?.trim() ? (
              <p className="truncate text-xs text-muted-foreground">{user.username}</p>
            ) : null}
          </div>
        )}

        <AccountExtras buildTag={buildTag} push={push} collapsed={collapsed} />

        <Separator />

        {actions?.(collapsed)}

        {manageAccount ? <ManageAccountLink collapsed={collapsed} /> : null}

        <Button
          variant="outline"
          size={collapsed ? "icon" : "sm"}
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={collapsed ? logoutLabel : undefined}
          aria-label={collapsed ? logoutLabel : undefined}
          className={cn(collapsed ? "mx-auto flex size-9 justify-center" : "w-full justify-start gap-2")}
        >
          <LogOut className="size-4" />
          <span className={collapsed ? "sr-only" : undefined}>
            {isLoggingOut ? t("account.loggingOut") : logoutLabel}
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}
