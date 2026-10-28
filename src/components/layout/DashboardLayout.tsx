import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { animated, easings, useSpring } from "@react-spring/web";
import { ChevronsLeft, ChevronsRight, RefreshCw } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import AppTheme from "@/theme/AppTheme";
import LazyViewFallback from "@/components/LazyViewFallback";
import MobileBottomBar, {
  type MobileBottomBarItem,
} from "@/components/MobileBottomBar";
import MobileMenuSheet from "@/components/layout/MobileMenuSheet";
import OccasionBackdrop from "@/components/layout/OccasionBackdrop";
import { useGlobalStatusOptional } from "@/context/GlobalStatusContext";
import { PullToRefreshProvider, usePageRefresh } from "@/context/PullToRefreshContext";
import { dismissBootScreen, isBootScreenShowing } from "@/boot/bootScreen";
import {
  ReportProblemButton,
  ReportProblemProvider,
  useReportProblem,
  type ReportProblemConfig,
} from "../report/ReportProblem";

/** Tabs the phone bottom bar shows before the rest move into the Menu sheet. */
const MAX_BOTTOM_BAR_ITEMS = 4;

export interface DashboardNavItem {
  /** Stable id passed back to onTabSelect and compared against activeTab. */
  id: string;
  label: string;
  icon?: ReactNode;
  /** Hide from the mobile bottom bar (still shown in the side nav). */
  hideOnMobile?: boolean;
}

export interface DashboardLayoutClassNames {
  root?: string;
  sidebar?: string;
  sidebarInner?: string;
  sidebarHeader?: string;
  nav?: string;
  navItem?: string;
  navItemActive?: string;
  navIndicator?: string;
  header?: string;
  main?: string;
  content?: string;
}

export interface DashboardLayoutProps {
  navItems: DashboardNavItem[];
  activeTab: string;
  onTabSelect: (id: string) => void;
  /** Brand mark shown when the sidebar is expanded. */
  brand?: ReactNode;
  /** Compact brand mark shown when the sidebar is collapsed. */
  brandCollapsed?: ReactNode;
  /** Right-aligned content of the floating desktop header (account menu, color mode, …). */
  headerContent?: ReactNode;
  /** Footer pinned to the bottom of the side nav (e.g. an account card). */
  sidebarFooter?: (collapsed: boolean) => ReactNode;
  /** Replace the built-in nav list entirely (e.g. a guides tree). */
  sidebarContent?: (collapsed: boolean) => ReactNode;
  /**
   * Extra content for the mobile menu sheet, below the account block.
   *
   * Omit it and the sheet surfaces `headerContent` (an app's notifications and
   * such, which are otherwise `md:`-only). Pass `null` for deliberately
   * nothing — the sheet already draws identity, Appearance and sign-out.
   */
  mobileMenu?: ReactNode;
  /** Rendered into the main area; falls back to the router <Outlet />. */
  children?: ReactNode;
  /** Suspense fallback for lazily-loaded children. */
  loadingFallback?: ReactNode;
  collapsedStorageKey?: string;
  defaultCollapsed?: boolean;
  disableCustomTheme?: boolean;
  classNames?: DashboardLayoutClassNames;
  /** Max width of the centered content column. Defaults to 1700px. */
  maxContentClassName?: string;
  /**
   * Pull down from the top of any page to refetch its active queries, on a
   * touch screen. On by default; `false` hands the gesture back to the browser.
   */
  pullToRefresh?: boolean;
  /**
   * "Report a problem": an icon button in the desktop header and a button in
   * the phone menu sheet, which the sheet draws itself so a `mobileMenu`
   * override keeps it. The app gates who sees it with `enabled`.
   */
  reportProblem?: ReportProblemConfig;
}


/**
 * The desktop header's Refresh: runs the same page refresh as a pull on a
 * touch screen, so no page wires its own. Spins until the refetch settles.
 */
function LayoutRefreshButton({ refresh }: { refresh: () => Promise<void> }) {
  const { t } = useI18n();
  const [running, setRunning] = useState(false);
  const label = t("common.refresh");
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="rounded-full border-border/70 bg-background/80 shadow-sm backdrop-blur"
      aria-label={label}
      title={label}
      disabled={running}
      onClick={() => {
        setRunning(true);
        void refresh()
          .catch(() => undefined)
          .finally(() => setRunning(false));
      }}
    >
      <RefreshCw className={cn("size-4", running && "animate-spin")} />
    </Button>
  );
}

function GlobalStatusMobileBar() {
  // Optional: Leap and any other app without the provider render no bar at all.
  const globalStatus = useGlobalStatusOptional();
  const status = globalStatus?.status;

  if (!status) {
    return null;
  }

  return (
    <div
      className={cn(
        "sticky top-0 z-30 border-b px-4 py-2 text-sm md:hidden",
        status.tone === "error"
          ? "border-destructive/35 bg-destructive/10 text-destructive"
          : "border-border/70 bg-card/95 text-muted-foreground backdrop-blur",
      )}
      aria-live="polite"
    >
      <p className="truncate">{status.message}</p>
    </div>
  );
}

function SideNavList({
  navItems,
  activeTab,
  collapsed,
  onTabSelect,
  classNames,
}: {
  navItems: DashboardNavItem[];
  activeTab: string;
  collapsed: boolean;
  onTabSelect: (id: string) => void;
  classNames?: DashboardLayoutClassNames;
}) {
  const navRef = useRef<HTMLElement>(null);
  const [box, setBox] = useState<{ y: number; height: number } | null>(null);

  // Measured, not computed: the button is 44px on touch and 36px on a mouse desktop.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
      setBox(active ? { y: active.offsetTop, height: active.offsetHeight } : null);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [activeTab, navItems, collapsed]);

  const indicatorSpring = useSpring({
    y: box?.y ?? -60,
    height: box?.height ?? 44,
    opacity: box ? 1 : 0,
    config: { tension: 300, friction: 26 },
  });

  return (
    <nav
      ref={navRef}
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-2 relative flex flex-col gap-1 p-2 duration-200",
        classNames?.nav,
      )}
    >
      <animated.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-2 rounded-xl bg-secondary",
          classNames?.navIndicator,
        )}
        style={{
          transform: indicatorSpring.y.to((y) => `translateY(${y}px)`),
          height: indicatorSpring.height,
          opacity: indicatorSpring.opacity,
          top: 0,
        }}
      />
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <Button
            key={item.id}
            type="button"
            variant="ghost"
            title={collapsed ? item.label : undefined}
            aria-label={collapsed ? item.label : undefined}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative z-10 h-11 w-full rounded-xl text-sm font-medium transition-colors duration-150 hover:bg-transparent",
              collapsed ? "justify-center px-0" : "justify-start gap-3 px-3",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
              classNames?.navItem,
              isActive && classNames?.navItemActive,
            )}
            onClick={() => onTabSelect(item.id)}
          >
            {item.icon}
            <span className={collapsed ? "sr-only" : undefined}>{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}

function DashboardLayoutInner({
  navItems,
  activeTab,
  onTabSelect,
  brand,
  brandCollapsed,
  headerContent,
  sidebarFooter,
  sidebarContent,
  mobileMenu,
  children,
  loadingFallback,
  collapsedStorageKey = "dashboard-sidebar-collapsed",
  defaultCollapsed = true,
  classNames,
  maxContentClassName = "max-w-[1700px]",
}: Omit<DashboardLayoutProps, "disableCustomTheme" | "pullToRefresh" | "reportProblem">) {
  const { t } = useI18n();
  const location = useLocation();
  const mainScrollRef = useRef<HTMLElement | null>(null);

  // Mounting over the boot screen (springboardBoot() in the app's vite config):
  // play the entrance once while the boot card lifts away. Read once, so a
  // remount later in the session does not animate.
  const [entering] = useState(isBootScreenShowing);
  useLayoutEffect(() => {
    if (entering) dismissBootScreen();
  }, [entering]);

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return defaultCollapsed;
    }
    const stored = localStorage.getItem(collapsedStorageKey);
    return stored === null ? defaultCollapsed : stored === "true";
  });

  useEffect(() => {
    localStorage.setItem(collapsedStorageKey, String(collapsed));
  }, [collapsed, collapsedStorageKey]);

  const [pageSpring, pageApi] = useSpring(() => ({
    opacity: 1,
    config: { duration: 380, easing: easings.easeOutCubic },
  }));

  useEffect(() => {
    void pageApi.start({ from: { opacity: 0 }, to: { opacity: 1 } });
    mainScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, pageApi]);

  const [menuOpen, setMenuOpen] = useState(false);

  const shownItems = navItems.filter((item) => !item.hideOnMobile);
  // Past this many tabs the row outgrows a phone and pushes Menu off-screen.
  const barItems = shownItems.slice(0, MAX_BOTTOM_BAR_ITEMS);
  const mobileItems: MobileBottomBarItem[] = barItems.map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
  }));
  // Anything the bar drops would otherwise have no entry point on a phone.
  const overflowItems = [
    ...shownItems.slice(MAX_BOTTOM_BAR_ITEMS),
    ...navItems.filter((item) => item.hideOnMobile),
  ];

  // `headerContent` is `md:flex`-only, so whatever an app puts there — its
  // notifications, its own controls — has no home on a phone. Surface it.
  //
  // `sidebarFooter` is deliberately NOT surfaced. It is where apps put their
  // account panel, and the sheet already draws identity and sign-out itself, so
  // passing it through would show the name, the email and a Logout button
  // twice. An app that wants something else in the sheet passes `mobileMenu`.
  const pageRefresh = usePageRefresh();
  const report = useReportProblem();

  const defaultMenuBody = headerContent ? (
    <div className="space-y-3">{headerContent}</div>
  ) : null;

  return (
    <>
      {headerContent || pageRefresh.available || report ? (
        <div
          className={cn(
            "pointer-events-none fixed inset-x-0 top-0 z-50 hidden h-12 items-center md:flex",
            entering && "sb-enter-fade",
          )}
        >
          <div className="pointer-events-none flex h-full w-full items-center justify-end gap-2 px-6">
            {pageRefresh.available ? (
              <div className="pointer-events-auto">
                <LayoutRefreshButton refresh={pageRefresh.refresh} />
              </div>
            ) : null}
            {report ? (
              <div className="pointer-events-auto">
                <ReportProblemButton />
              </div>
            ) : null}
            {headerContent ? (
              <div className={cn("pointer-events-auto", classNames?.header)}>
                {headerContent}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className={cn("flex min-h-screen bg-background", classNames?.root)}>
        <aside
          className={cn(
            "sticky top-0 z-20 hidden h-screen shrink-0 border-r border-border/70 bg-card/95 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:block",
            collapsed ? "w-20" : "w-72",
            entering && "sb-enter-sidebar",
            classNames?.sidebar,
          )}
        >
          <div
            className={cn(
              "relative flex h-full flex-col overflow-visible backdrop-blur",
              classNames?.sidebarInner,
            )}
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute -right-4 top-6 z-10 hidden size-9 rounded-full border-border/70 bg-background shadow-sm md:flex"
              onClick={() => setCollapsed((current) => !current)}
              aria-label={
                collapsed
                  ? t("app.sidebar.expand", "Expand sidebar")
                  : t("app.sidebar.collapse", "Collapse sidebar")
              }
              title={
                collapsed
                  ? t("app.sidebar.expand", "Expand sidebar")
                  : t("app.sidebar.collapse", "Collapse sidebar")
              }
            >
              {collapsed ? (
                <ChevronsRight className="size-4" />
              ) : (
                <ChevronsLeft className="size-4" />
              )}
            </Button>

            {(brand || brandCollapsed) && (
              <div
                className={cn(
                  "flex items-center border-b border-border/60 py-5",
                  collapsed ? "justify-center px-3" : "justify-start px-5",
                  classNames?.sidebarHeader,
                )}
              >
                {collapsed ? (brandCollapsed ?? brand) : brand}
              </div>
            )}

            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col overflow-y-auto py-4",
                collapsed ? "px-2" : "px-3",
              )}
            >
              {sidebarContent ? (
                sidebarContent(collapsed)
              ) : (
                <SideNavList
                  navItems={navItems}
                  activeTab={activeTab}
                  collapsed={collapsed}
                  onTabSelect={onTabSelect}
                  classNames={classNames}
                />
              )}
            </div>

            {sidebarFooter ? (
              <div
                className={cn(
                  "border-t border-border/60 py-3",
                  collapsed ? "px-2" : "px-3",
                )}
              >
                {sidebarFooter(collapsed)}
              </div>
            ) : null}
          </div>
        </aside>

        <div className={cn("relative isolate flex min-w-0 flex-1 flex-col", entering && "sb-enter-content")}>
          <OccasionBackdrop />
          {/* Apps publish status into the desktop header, which is `md:flex` —
              so below `md` every message, errors included, would have nowhere
              to render. This is that surface. Desktop keeps the header. */}
          <GlobalStatusMobileBar />
          <main
            ref={mainScrollRef}
            className={cn(
              "min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
              classNames?.main,
            )}
          >
            <div
              className={cn(
                // pb clears the fixed bottom bar and its safe-area padding.
                "mx-auto flex w-full flex-col items-center gap-2 px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-4 md:px-6 md:pb-5 md:pt-12",
                maxContentClassName,
                classNames?.content,
              )}
            >
              <animated.div style={{ opacity: pageSpring.opacity }} className="w-full">
                <Suspense fallback={loadingFallback ?? <LazyViewFallback />}>
                  {children ?? <Outlet />}
                </Suspense>
              </animated.div>
            </div>
          </main>
        </div>
      </div>

      {mobileItems.length > 0 ? (
        <>
          <MobileBottomBar
            activeTab={activeTab}
            items={mobileItems}
            onTabSelect={onTabSelect}
            onMenuOpen={() => setMenuOpen(true)}
          />
          <MobileMenuSheet
            open={menuOpen}
            onOpenChange={setMenuOpen}
            overflowItems={overflowItems}
            activeTab={activeTab}
            onTabSelect={onTabSelect}
          >
            {/* `undefined` means "not specified, use the default"; `null` means
                "deliberately nothing" — which an app whose headerContent is
                only a colour-mode control wants, since the sheet already draws
                Appearance and the passed-through icon reads as orphaned. */}
            {mobileMenu === undefined ? defaultMenuBody : mobileMenu}
          </MobileMenuSheet>
        </>
      ) : null}
    </>
  );
}

/** The app shell: side nav and floating header on desktop, bottom bar and menu sheet on a phone. */
export default function DashboardLayout({
  disableCustomTheme,
  pullToRefresh = true,
  reportProblem,
  ...props
}: DashboardLayoutProps) {
  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <PullToRefreshProvider enabled={pullToRefresh}>
        {/* Always mounted, so the page below keeps its state when an app turns reporting on after sign-in. */}
        <ReportProblemProvider
          app={reportProblem?.app ?? ""}
          defaultCategory={reportProblem?.defaultCategory}
          enabled={Boolean(reportProblem) && reportProblem?.enabled !== false}
        >
          <DashboardLayoutInner {...props} />
        </ReportProblemProvider>
      </PullToRefreshProvider>
    </AppTheme>
  );
}
