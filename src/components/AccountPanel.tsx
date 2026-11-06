import { useState } from "react";
import { LogOut, UserCog } from "lucide-react";
import BuildTag, { type BuildTagProps } from "./BuildTag";
import PushNotificationsToggle, {
  type PushNotificationsToggleProps,
} from "./notifications/PushNotificationsToggle";
import {
  SidebarButton,
  SidebarIconCell,
  SidebarText,
  sidebarRowGrid,
  type SidebarAction,
} from "./layout/SidebarRow";
import { Separator } from "@/components/ui/separator";
import { ACCOUNTS_PROFILE_URL } from "@/config/accounts";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";

export interface AccountConfig {
  /** This build's tag; `hidden` is the panel's to set. */
  buildTag?: Omit<BuildTagProps, "hidden" | "className">;
  /** Shown after the name in place of the account type. */
  roleLabel?: string;
  /** Omit where the app offers no push. */
  push?: Pick<PushNotificationsToggleProps, "app" | "serviceWorkerUrl">;
  /** False on the accounts site, where the link would point at the page itself. */
  manageAccount?: boolean;
  /** An app's own rows above Manage account; the panel draws them like nav tabs. */
  actions?: SidebarAction[];
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
      {buildTag ? <BuildTag {...buildTag} hidden={collapsed} /> : null}
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
  roleLabel,
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
  const accountTypeLabel =
    roleLabel ?? t(`account.type.${accountType}`, accountType.charAt(0).toUpperCase() + accountType.slice(1));
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

  const rowClassName = "text-muted-foreground hover:text-foreground";
  const showManageAccount = manageAccount && user && user.account_type !== "guest";

  // Bottom-up, in the sidebar's two columns: the rows that only show expanded
  // sit on top, so a rail that collapses or pops out moves no icon.
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className={cn("overflow-hidden", collapsed ? "h-0" : "pb-2")}>
        {/* Fixed to the expanded width, so the rail's width animation clips it instead of rewrapping it. */}
        <div className="w-60 space-y-3 px-3">
          <AccountExtras buildTag={buildTag} push={push} collapsed={collapsed} />
        </div>
      </div>

      {actions?.map((action) => (
        <SidebarButton
          key={action.id}
          icon={action.icon}
          label={action.label}
          collapsed={collapsed}
          dataAttributes={action.dataAttributes}
          disabled={action.disabled}
          onClick={action.onClick}
          className={rowClassName}
        />
      ))}

      {showManageAccount ? (
        <SidebarButton
          icon={UserCog}
          label={t("account.manage", "Manage account")}
          collapsed={collapsed}
          href={ACCOUNTS_PROFILE_URL}
          className={rowClassName}
        />
      ) : null}

      <SidebarButton
        icon={LogOut}
        label={isLoggingOut ? t("account.loggingOut") : logoutLabel}
        collapsed={collapsed}
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={rowClassName}
      />

      <Separator className="my-1" />

      <div className={cn(sidebarRowGrid, "min-h-12")} title={identity}>
        <SidebarIconCell>
          <span
            aria-hidden="true"
            // An app tints this from CSS with the two variables.
            className="flex size-9 items-center justify-center rounded-full bg-[var(--account-avatar-bg,var(--muted))] text-xs font-semibold tracking-tight text-[var(--account-avatar-fg,inherit)]"
          >
            {initialsOf(user?.name)}
          </span>
        </SidebarIconCell>
        <SidebarText collapsed={collapsed} className="pl-1">
          {/* Name and role on their own lines, so a long role isn't cut off after the name. */}
          <span className="block truncate text-sm font-semibold tracking-tight">{user ? name : loggingIn}</span>
          {user ? <span className="block truncate text-xs text-muted-foreground">{accountTypeLabel}</span> : null}
        </SidebarText>
      </div>
    </div>
  );
}
