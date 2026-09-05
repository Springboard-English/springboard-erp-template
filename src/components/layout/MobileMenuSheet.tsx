import { useState, type ReactNode } from "react";
import { LogOut, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/context/I18nContext";
import { useColorMode } from "@/theme/AppTheme";
import type { DashboardNavItem } from "./DashboardLayout";

// The mobile counterpart of the side nav. Below `md` the sidebar is
// `display:none` and the desktop header is `md:flex`, so everything an app puts
// in `sidebarFooter` or `headerContent` — account, theme, sign-out — is
// unreachable on a phone unless it lives here too.

function AppearanceToggle() {
  const { t } = useI18n();
  const { mode, setMode } = useColorMode();
  const options: Array<{
    value: "system" | "light" | "dark";
    label: string;
    icon: LucideIcon;
  }> = [
    { value: "system", label: t("app.appearance.system", "System"), icon: Monitor },
    { value: "light", label: t("app.appearance.light", "Light"), icon: Sun },
    { value: "dark", label: t("app.appearance.dark", "Dark"), icon: Moon },
  ];

  return (
    <div
      className="relative inline-grid h-11 w-full grid-cols-3 rounded-xl border border-border/70 bg-muted/45 p-1"
      role="group"
      aria-label={t("app.appearance.label", "Appearance")}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const selected = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 rounded-[8px] px-2 text-xs font-medium transition-all duration-150",
              selected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={selected}
            onClick={() => setMode(option.value)}
          >
            <Icon className="size-3.5" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export interface MobileMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Nav entries the bottom bar does not show (those flagged `hideOnMobile`).
   * Without these they have no reachable entry point on a phone.
   */
  overflowItems?: DashboardNavItem[];
  activeTab?: string;
  onTabSelect?: (id: string) => void;
  /** App-specific content, rendered above the account block. */
  children?: ReactNode;
}

export default function MobileMenuSheet({
  open,
  onOpenChange,
  overflowItems = [],
  activeTab,
  onTabSelect,
  children,
}: MobileMenuSheetProps) {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const colorMode = useColorMode();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const name = user?.name;
  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "?";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleTabSelect = (id: string) => {
    onTabSelect?.(id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        // pb clears the iOS home indicator; without it the sign-out row sits
        // inside the gesture strip.
        className="max-h-[85dvh] overflow-y-auto rounded-t-3xl border-border/70 bg-card px-0 pt-0 pb-[calc(2rem+env(safe-area-inset-bottom))]"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <SheetHeader className="sr-only">
          <SheetTitle>{t("mobileBottomBar.menu", "Menu")}</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 px-5">
          {overflowItems.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-1">
                {overflowItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={cn(
                        "flex min-h-11 flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-xs font-medium transition-colors",
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                      onClick={() => handleTabSelect(item.id)}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <Separator />
            </>
          ) : null}

          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-base font-semibold tracking-tight">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {name ?? t("app.loading", "Loading...")}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.username}
              </p>
            </div>
          </div>

          {children ? (
            <>
              <Separator />
              {children}
            </>
          ) : null}

          {/* Only offered when an AppTheme is above: without one the context
              default carries a no-op `setMode`, so the control would render and
              do nothing. Leap is light-only and mounts no AppTheme. */}
          {colorMode.isConfigured ? (
            <>
              <Separator />

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {t("app.appearance.label", "Appearance")}
                </p>
                <AppearanceToggle />
              </div>
            </>
          ) : null}

          <Separator />

          <button
            type="button"
            disabled={isLoggingOut}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            {isLoggingOut
              ? t("app.loggingOut", "Logging out...")
              : t("app.logout", "Log out")}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
