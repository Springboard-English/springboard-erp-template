import { useState, type ReactNode } from "react";
import { LogOut, Monitor, Moon, Sun, UserCog, type LucideIcon } from "lucide-react";
import { ACCOUNTS_PROFILE_URL } from "@/config/accounts";
import { cn } from "@/lib/utils";
import { touchHitArea } from "@/lib/touchTarget";
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
import { ReportProblemMenuButton } from "@/components/report/ReportProblem";
import type { DashboardNavItem } from "./DashboardLayout";

// The mobile counterpart of the side nav. Below `md` the sidebar is
// `display:none` and the desktop header is `md:flex`, so everything an app puts
// in `sidebarFooter` or `headerContent` — account, theme, sign-out — is
// unreachable on a phone unless it lives here too.

interface SegmentedOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

/** The sheet's segmented track: one equal-width pressed button per option. */
function SegmentedToggle({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      className="relative grid h-11 w-full auto-cols-fr grid-flow-col rounded-xl border border-border/70 bg-muted/45 p-1"
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const Icon = option.icon;
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={cn(
              // The track's 4px padding sits inside the 44px row; the hit area
              // covers it so the whole row height is tappable.
              touchHitArea,
              "relative z-10 flex items-center justify-center gap-1.5 rounded-[8px] px-2 text-xs font-medium transition-all duration-150",
              selected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
          >
            {Icon ? <Icon className="size-3.5" /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** System, Light or Dark for the shell. */
function AppearanceToggle() {
  const { t } = useI18n();
  const { mode, setMode } = useColorMode();
  return (
    <SegmentedToggle
      label={t("app.appearance.label", "Appearance")}
      value={mode}
      onChange={(value) => setMode(value as "system" | "light" | "dark")}
      options={[
        { value: "system", label: t("app.appearance.system", "System"), icon: Monitor },
        { value: "light", label: t("app.appearance.light", "Light"), icon: Sun },
        { value: "dark", label: t("app.appearance.dark", "Dark"), icon: Moon },
      ]}
    />
  );
}

// Each language in its own name, so a reader who can't read the current one can still find theirs.
const LOCALE_NAMES: Record<string, string> = { en: "English", vi: "Tiếng Việt" };

/** The app's languages, the phone counterpart of the header's `LocaleSelect`. */
function LanguageToggle() {
  const { t, locale, setLocale, availableLocales } = useI18n();
  return (
    <SegmentedToggle
      label={t("locale.selector", "Language")}
      value={locale}
      onChange={setLocale}
      options={availableLocales.map((code) => ({
        value: code,
        label: LOCALE_NAMES[code] ?? code.toUpperCase(),
      }))}
    />
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
  const { t, availableLocales } = useI18n();
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
        className="max-h-[85dvh] overflow-y-auto rounded-t-3xl border-border/70 bg-card px-0 pt-0 pb-0"
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        <SheetHeader className="sr-only">
          <SheetTitle>{t("mobileBottomBar.menu", "Menu")}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 px-5 pb-4">
          {/* pr clears the sheet's close button. */}
          <div className="flex items-center gap-3 pr-8">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-base font-semibold tracking-tight">
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

          <Separator />

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

          {/* Drawn by the sheet, not the app's `mobileMenu`, so an override keeps
              the report button. It renders nothing unless an enabled
              ReportProblemProvider is above. */}
          <div className="space-y-2 empty:hidden">
            {children}
            <ReportProblemMenuButton
              className="justify-start gap-2"
              size="sm"
              onBeforeOpen={() => onOpenChange(false)}
            />
          </div>

          {/* Only offered when an AppTheme is above: without one the context
              default carries a no-op `setMode`, so the control would render and
              do nothing. Leap is light-only and mounts no AppTheme. */}
          {colorMode.isConfigured ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                {t("app.appearance.label", "Appearance")}
              </p>
              <AppearanceToggle />
            </div>
          ) : null}

          {/* Drawn here like Appearance, so no app has to fit `LocaleSelect` into its `mobileMenu`. */}
          {availableLocales.length > 1 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                {t("locale.selector", "Language")}
              </p>
              <LanguageToggle />
            </div>
          ) : null}
        </div>

        {/* Pinned, so a long menu never scrolls sign-out out of reach. pb clears
            the iOS home indicator. */}
        <div className="sticky bottom-0 z-10 flex gap-2 border-t border-border/70 bg-card px-5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {user && user.account_type !== "guest" ? (
            <a
              href={ACCOUNTS_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <UserCog className="size-4 shrink-0" />
              <span className="truncate">{t("account.manage", "Manage account")}</span>
            </a>
          ) : null}

          <button
            type="button"
            disabled={isLoggingOut}
            className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
            onClick={handleLogout}
          >
            <LogOut className="size-4 shrink-0" />
            <span className="truncate">
              {isLoggingOut
                ? t("app.loggingOut", "Logging out...")
                : t("app.logout", "Log out")}
            </span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
