import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { animated, easings, useSpring } from "@react-spring/web";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import AppTheme from "@/theme/AppTheme";
import LazyViewFallback from "@/components/LazyViewFallback";
import MobileBottomBar, {
  type MobileBottomBarItem,
} from "@/components/MobileBottomBar";

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
  /** Extra content rendered inside the mobile menu sheet trigger area. */
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
}

const ITEM_STRIDE = 44 + 4; // h-11 button + gap-1
const NAV_PADDING_TOP = 8; // p-2 container

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
  const activeIndex = navItems.findIndex((item) => item.id === activeTab);
  const indicatorSpring = useSpring({
    y: activeIndex >= 0 ? NAV_PADDING_TOP + activeIndex * ITEM_STRIDE : -60,
    opacity: activeIndex >= 0 ? 1 : 0,
    config: { tension: 300, friction: 26 },
  });

  return (
    <nav
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-2 relative flex flex-col gap-1 p-2 duration-200",
        classNames?.nav,
      )}
    >
      <animated.div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-2 h-11 rounded-xl bg-secondary",
          classNames?.navIndicator,
        )}
        style={{
          transform: indicatorSpring.y.to((y) => `translateY(${y}px)`),
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
  children,
  loadingFallback,
  collapsedStorageKey = "dashboard-sidebar-collapsed",
  defaultCollapsed = true,
  classNames,
  maxContentClassName = "max-w-[1700px]",
}: Omit<DashboardLayoutProps, "disableCustomTheme" | "mobileMenu">) {
  const { t } = useI18n();
  const location = useLocation();
  const mainScrollRef = useRef<HTMLElement | null>(null);

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

  const mobileItems: MobileBottomBarItem[] = navItems
    .filter((item) => !item.hideOnMobile)
    .map((item) => ({ id: item.id, label: item.label, icon: item.icon }));

  return (
    <>
      {headerContent ? (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden h-12 items-center md:flex">
          <div className="pointer-events-none flex h-full w-full items-center justify-end px-6">
            <div className={cn("pointer-events-auto", classNames?.header)}>
              {headerContent}
            </div>
          </div>
        </div>
      ) : null}

      <div className={cn("flex min-h-screen bg-background", classNames?.root)}>
        <aside
          className={cn(
            "sticky top-0 z-20 hidden h-screen shrink-0 border-r border-border/70 bg-card/95 transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:block",
            collapsed ? "w-20" : "w-72",
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
              className="absolute -right-4 top-6 z-10 hidden size-8 rounded-full border-border/70 bg-background shadow-sm md:flex"
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

        <div className="flex min-w-0 flex-1 flex-col">
          <main
            ref={mainScrollRef}
            className={cn(
              "min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
              classNames?.main,
            )}
          >
            <div
              className={cn(
                "mx-auto flex w-full flex-col items-center gap-2 px-4 pb-20 pt-4 md:px-6 md:pb-5 md:pt-12",
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
        <MobileBottomBar
          activeTab={activeTab}
          items={mobileItems}
          onTabSelect={onTabSelect}
          onMenuOpen={() => setCollapsed((current) => !current)}
        />
      ) : null}
    </>
  );
}

export default function DashboardLayout({
  disableCustomTheme,
  ...props
}: DashboardLayoutProps) {
  return (
    <AppTheme disableCustomTheme={disableCustomTheme}>
      <DashboardLayoutInner {...props} />
    </AppTheme>
  );
}
