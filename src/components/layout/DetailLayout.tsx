import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    type ReactNode,
} from "react";
import { animated, useSpring } from "@react-spring/web";

import { ChevronRight, Expand, MoreHorizontal, PanelRight } from "lucide-react";
import {
    PageHeaderActions,
    PageHeaderBack,
    PageHeaderRoot,
    PageHeaderSummary,
    PageHeaderTitle,
    useInPageHeaderGrid,
} from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { touchHitArea, touchTargetHeight } from "@/lib/touchTarget";
import { useI18n } from "@/context/I18nContext";
import useIsMobile from "@/hooks/useIsMobile";
import {
    DETAIL_HIDDEN_COLLAPSED_VALUE,
    useDetailViewMode,
    type DetailViewCollapsedState,
} from "@/utils/detailViewMode";

export const DETAIL_LAYOUT_MOTION_DEFAULTS = {
    tabPillSpring: {
        tension: 300,
        friction: 26,
    },
    tabContentFadeOutMs: 100,
    tabContentFadeInMs: 200,
} as const;

export type DetailLayoutMotionConfig = {
    tabPillSpring: {
        tension: number;
        friction: number;
    };
    tabContentFadeOutMs: number;
    tabContentFadeInMs: number;
};

export type DetailLayoutMotionConfigInput = Partial<{
    tabPillSpring: Partial<DetailLayoutMotionConfig["tabPillSpring"]>;
    tabContentFadeOutMs: number;
    tabContentFadeInMs: number;
}>;

let detailLayoutMotionConfig: DetailLayoutMotionConfig = {
    tabPillSpring: { ...DETAIL_LAYOUT_MOTION_DEFAULTS.tabPillSpring },
    tabContentFadeOutMs: DETAIL_LAYOUT_MOTION_DEFAULTS.tabContentFadeOutMs,
    tabContentFadeInMs: DETAIL_LAYOUT_MOTION_DEFAULTS.tabContentFadeInMs,
};
let detailTabsDebugInstanceCounter = 0;

function shouldDebugDetailTabs(): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    const debugFlag =
        (window as typeof window & { __DETAIL_TABS_DEBUG__?: unknown })
            .__DETAIL_TABS_DEBUG__;
    if (debugFlag) {
        return true;
    }

    return new URLSearchParams(window.location.search).get("detailTabsDebug") === "1";
}

function logDetailTabsDebug(
    instanceId: number,
    event: string,
    payload?: Record<string, unknown>,
) {
    if (!shouldDebugDetailTabs()) {
        return;
    }

    console.debug(`[DetailTabs:${instanceId}] ${event}`, {
        path:
            typeof window === "undefined"
                ? undefined
                : `${window.location.pathname}${window.location.search}`,
        ...payload,
    });
}

export function getDetailLayoutMotionConfig(): DetailLayoutMotionConfig {
    return {
        tabPillSpring: { ...detailLayoutMotionConfig.tabPillSpring },
        tabContentFadeOutMs: detailLayoutMotionConfig.tabContentFadeOutMs,
        tabContentFadeInMs: detailLayoutMotionConfig.tabContentFadeInMs,
    };
}

export function setDetailLayoutMotionConfig(
    nextConfig: DetailLayoutMotionConfigInput,
): DetailLayoutMotionConfig {
    detailLayoutMotionConfig = {
        tabPillSpring: {
            tension:
                nextConfig.tabPillSpring?.tension ??
                detailLayoutMotionConfig.tabPillSpring.tension,
            friction:
                nextConfig.tabPillSpring?.friction ??
                detailLayoutMotionConfig.tabPillSpring.friction,
        },
        tabContentFadeOutMs:
            nextConfig.tabContentFadeOutMs ??
            detailLayoutMotionConfig.tabContentFadeOutMs,
        tabContentFadeInMs:
            nextConfig.tabContentFadeInMs ??
            detailLayoutMotionConfig.tabContentFadeInMs,
    };

    return getDetailLayoutMotionConfig();
}

export function resetDetailLayoutMotionConfig(): DetailLayoutMotionConfig {
    detailLayoutMotionConfig = {
        tabPillSpring: { ...DETAIL_LAYOUT_MOTION_DEFAULTS.tabPillSpring },
        tabContentFadeOutMs: DETAIL_LAYOUT_MOTION_DEFAULTS.tabContentFadeOutMs,
        tabContentFadeInMs: DETAIL_LAYOUT_MOTION_DEFAULTS.tabContentFadeInMs,
    };

    return getDetailLayoutMotionConfig();
}

type BreadcrumbItem = {
    label: string;
    onClick?: () => void;
};

type DetailStat = {
    label: string;
    value: ReactNode;
};

const DetailViewContext = createContext<{
    floating: boolean;
    collapsed: boolean;
    hiddenCollapsed: boolean;
    isBackground?: boolean;
    contentScrollable?: boolean;
    expandToNormalView: () => void;
    switchToFloatingView: () => void;
} | null>(null);

export const BackgroundDetailViewContext = createContext<boolean>(false);

export function DetailView({
    children,
    className = "w-full max-w-[1700px] space-y-4",
    isBackground: isBackgroundProp,
    contentScrollable = false,
    onCloseFloating,
}: {
    children: ReactNode;
    className?: string;
    isBackground?: boolean;
    contentScrollable?: boolean;
    onCloseFloating?: () => void;
}) {
    const { t } = useI18n();
    const isBackgroundFromContext = useContext(BackgroundDetailViewContext);
    const isBackground = isBackgroundProp ?? isBackgroundFromContext;
    const detailViewMode = useDetailViewMode({ enabled: !isBackground });
    // The floating panel has a 544px floor and locks body scroll, so on a phone
    // it overflows the viewport with no way to scroll to the rest. The mode is
    // carried in the URL, so a link shared from a desktop would otherwise land a
    // phone straight in it. Suppress the mode rather than clear it — the stored
    // preference survives, and a rotate or a resize brings the panel back.
    const isMobile = useIsMobile();
    const floating = isBackground || isMobile ? false : detailViewMode.floating;
    const collapsed = isBackground ? false : detailViewMode.isCollapsed;
    const hiddenCollapsed = isBackground
        ? false
        : detailViewMode.hiddenCollapsed;
    const applyMode = (
        nextFloating: boolean,
        nextCollapsed: boolean,
        nextHiddenCollapsed = false,
    ) => {
        if (isBackground) {
            return;
        }

        const nextCollapsedState: DetailViewCollapsedState = nextCollapsed
            ? nextHiddenCollapsed
                ? DETAIL_HIDDEN_COLLAPSED_VALUE
                : "1"
            : "0";

        detailViewMode.setMode({
            floating: nextFloating,
            collapsed: nextCollapsedState,
        });
    };

    const handleCloseFloating = () => {
        if (isBackground || !onCloseFloating) {
            return;
        }
        onCloseFloating();
    };

    const expandToNormalView = () => {
        applyMode(false, false, false);
    };

    const switchToFloatingView = () => {
        applyMode(true, false, false);
    };

    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }

        if (!floating) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [floating]);

    return (
        <DetailViewContext.Provider
            value={{
                floating,
                collapsed,
                hiddenCollapsed,
                isBackground,
                contentScrollable,
                expandToNormalView,
                switchToFloatingView,
            }}
        >
            <section
                className={cn(
                    // 50 on the layer scale: above app chrome, below
                    // PendingChangesBar (55) and modals/popovers (60).
                    floating ? "fixed inset-0 z-50" : "w-full",
                    floating && hiddenCollapsed ? "pointer-events-none" : "",
                    floating && collapsed && !hiddenCollapsed
                        ? "pointer-events-none"
                        : "",
                )}
            >
                {floating && !collapsed ? (
                    <button
                        type="button"
                        aria-label={t("detail.close")}
                        onClick={handleCloseFloating}
                        className="absolute inset-0 bg-background/45 backdrop-blur-md"
                    />
                ) : null}
                {floating && hiddenCollapsed ? (
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-label={t("detail.restorePanel")}
                        onClick={() => applyMode(true, true, false)}
                        className="pointer-events-auto absolute right-0 top-1/2 z-20 h-28 w-7 -translate-y-1/2 rounded-l-md rounded-r-none border-r-0 bg-background text-[10px] font-semibold shadow-md [writing-mode:vertical-rl]"
                    >
                        {t("detail.details")}
                    </Button>
                ) : null}
                <div
                    data-floating-collapsed={
                        floating && collapsed ? "true" : "false"
                    }
                    className={cn(
                        className,
                        contentScrollable && "overflow-y-auto overflow-x-hidden pr-1",
                        floating
                            ? collapsed
                                ? hiddenCollapsed
                                    ? "floating-detail pointer-events-none absolute right-0 top-1/2 z-10 w-[44dvw] md:min-w-[34rem] max-w-[70rem] -translate-y-1/2 translate-x-[calc(100%-20px)] !h-[76dvh] overflow-hidden rounded-2xl border border-border/70 bg-background p-4 shadow-2xl"
                                    : "floating-detail pointer-events-auto absolute right-3 top-1/2 z-10 w-[44dvw] md:min-w-[34rem] max-w-[70rem] -translate-y-1/2 !h-[76dvh] overflow-visible rounded-2xl border border-border/70 bg-background p-4 shadow-2xl"
                                : "floating-detail absolute left-1/2 top-1/2 z-10 w-[85dvw] -translate-x-1/2 -translate-y-1/2 !h-[76dvh] overflow-hidden rounded-2xl border border-border/70 bg-background p-4 shadow-2xl"
                            : "",
                    )}
                >
                    {floating && collapsed ? (
                        !hiddenCollapsed ? (
                            <>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    aria-label={t("detail.expandPanel")}
                                    onClick={() => applyMode(true, false)}
                                    className="absolute left-3 top-1/2 z-20 h-8 w-8 -translate-y-[calc(100%+0.375rem)] rounded-full border border-border/70 bg-background/95 text-foreground opacity-100 shadow-md backdrop-blur"
                                >
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    aria-label={t("detail.fullyCollapse")}
                                    onClick={() => applyMode(true, true, true)}
                                    className="absolute left-3 top-1/2 z-20 h-8 w-8 translate-y-[0.375rem] rounded-full border border-border/70 bg-background/95 text-foreground opacity-100 shadow-md backdrop-blur"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </>
                        ) : null
                    ) : null}
                    {floating && !collapsed ? (
                        <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            aria-label={t("detail.collapse")}
                            onClick={() => applyMode(true, true, false)}
                            className="absolute right-3 top-1/2 z-20 h-10 w-10 -translate-y-1/2 rounded-full border border-border/70 bg-background/95 text-foreground opacity-100 shadow-md backdrop-blur"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    ) : null}
                    {children}
                </div>
            </section>
        </DetailViewContext.Provider>
    );
}

/**
 * Detail page title with its parent pages shown above it as a small
 * "← Parent / Child" back link, drawn into `DetailHeader`'s grid (the one
 * `PageHeader` uses), so a record page lines up with a list page. On a phone
 * it becomes a navigation bar: only the nearest parent over a large title.
 */
export function DetailBreadcrumbs({
    items,
    current,
    status,
    summary,
}: {
    items: BreadcrumbItem[];
    current: ReactNode;
    /** Sits beside the title, typically one `DetailChip`. */
    status?: ReactNode;
    /** A row of `DetailMetaItem`s under the title giving the record's gist. */
    summary?: ReactNode;
}) {
    const inGrid = useInPageHeaderGrid();
    const slots = (
        <>
            <PageHeaderBack items={items} />
            <PageHeaderTitle status={status} hasBack={items.length > 0}>
                {current}
            </PageHeaderTitle>
            <PageHeaderSummary>{summary}</PageHeaderSummary>
        </>
    );
    // Drawn on its own, outside a DetailHeader, it brings the grid but leaves spacing to the caller.
    return inGrid ? slots : <PageHeaderRoot className="mb-0">{slots}</PageHeaderRoot>;
}

export type DetailChipTone = "neutral" | "lav" | "mint" | "peach" | "sky" | "butter";

const DETAIL_CHIP_TONES: Record<DetailChipTone, string> = {
    // Neutral is the tag style the list views already use.
    neutral: "border-border bg-muted/40 text-foreground",
    lav: "border-lav-300/60 bg-lav-bg text-lav-700",
    mint: "border-mint-300/60 bg-mint-bg text-mint-700",
    peach: "border-peach-300/60 bg-peach-bg text-peach-700",
    sky: "border-sky-300/60 bg-sky-bg text-sky-700",
    butter: "border-butter-300/60 bg-butter-bg text-butter-700",
};

/** A tag shaped like the list views' tags, optionally tinted for a status. Tones need the app's `lav`/`mint`/`peach`/`sky`/`butter` colour tokens. */
export function DetailChip({
    tone = "neutral",
    icon,
    children,
    className,
}: {
    tone?: DetailChipTone;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "inline-flex max-w-full items-center gap-1.5 rounded border px-2 py-1 text-xs font-medium [&_svg]:size-3.5 [&_svg]:shrink-0",
                DETAIL_CHIP_TONES[tone],
                className,
            )}
        >
            {icon}
            <span className="truncate">{children}</span>
        </span>
    );
}

/** One fact in a detail header's summary row: a small icon and plain text. `warning` marks something missing. */
export function DetailMetaItem({
    icon,
    children,
    warning,
}: {
    icon?: ReactNode;
    children: ReactNode;
    warning?: boolean;
}) {
    return (
        <span
            className={cn(
                "inline-flex min-w-0 items-center gap-1.5 [&_svg]:size-4 [&_svg]:shrink-0",
                warning && "text-butter-700",
            )}
        >
            {icon}
            <span className="truncate">{children}</span>
        </span>
    );
}

export interface DetailMenuAction {
    label: ReactNode;
    icon?: ReactNode;
    onSelect: () => void;
    disabled?: boolean;
    /** Destructive actions sit last, under a divider, in red. */
    destructive?: boolean;
}

/** A "⋯" button opening a menu of the page's less common actions, so a destructive one is never a single click away. `side` picks where the menu opens; a bottom-fixed bar passes `"top"`. */
export function DetailActionsMenu({
    actions,
    side = "bottom",
}: {
    actions: DetailMenuAction[];
    side?: "top" | "bottom";
}) {
    const { t } = useI18n();
    if (actions.length === 0) {
        return null;
    }
    const regular = actions.filter((action) => !action.destructive);
    const destructive = actions.filter((action) => action.destructive);
    const renderItem = (action: DetailMenuAction, index: number) => (
        <DropdownMenuItem
            key={index}
            variant={action.destructive ? "destructive" : "default"}
            disabled={action.disabled}
            onSelect={action.onSelect}
        >
            {action.icon}
            {action.label}
        </DropdownMenuItem>
    );
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" size="icon-sm" aria-label={t("detail.moreActions")}>
                    <MoreHorizontal aria-hidden />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side={side} align="end" className="min-w-44">
                {regular.map(renderItem)}
                {regular.length > 0 && destructive.length > 0 ? <DropdownMenuSeparator /> : null}
                {destructive.map(renderItem)}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * The head of a record page: `breadcrumbs` (a `DetailBreadcrumbs`) and the
 * page's actions in the same grid as `PageHeader`, with the floating-view
 * toggle ahead of the actions on desktop.
 */
export function DetailHeader({
    breadcrumbs,
    actions,
    className,
}: {
    breadcrumbs: ReactNode;
    actions?: ReactNode;
    className?: string;
}) {
    const { t } = useI18n();
    const detailViewContext = useContext(DetailViewContext);
    // Floating view is suppressed on a phone (see DetailLayout), so offering the
    // toggle would be a button that silently does nothing.
    const isMobile = useIsMobile();
    const showExpandAction =
        !isMobile && detailViewContext?.floating && !detailViewContext.collapsed;
    const showFloatingAction =
        !isMobile && detailViewContext && !detailViewContext.floating;
    const hasActions = Boolean(actions) || showExpandAction || showFloatingAction;

    return (
        <PageHeaderRoot data-detail-header className={className}>
            {breadcrumbs}
            {hasActions ? (
                // A record page always has a way back, so its phone actions share the back link's row.
                <PageHeaderActions hasBack>
                    {showExpandAction ? (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                detailViewContext.expandToNormalView()
                            }
                        >
                            <Expand className="mr-2 h-4 w-4" />
                            {t("detail.expandView")}
                        </Button>
                    ) : null}
                    {showFloatingAction ? (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                detailViewContext.switchToFloatingView()
                            }
                        >
                            <PanelRight className="mr-2 h-4 w-4" />
                            {t("detail.floatingView")}
                        </Button>
                    ) : null}
                    {actions}
                </PageHeaderActions>
            ) : null}
        </PageHeaderRoot>
    );
}

export function DetailSummaryGrid({
    children,
    className = "grid gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-md md:grid-cols-4",
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={className}>{children}</div>;
}

export function DetailSummaryItem({ label, value }: DetailStat) {
    return (
        <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">
                {label}
            </div>
            <div className="text-sm font-medium">{value}</div>
        </div>
    );
}

export function DetailCard({
    children,
    className = "rounded-3xl border border-border/70 bg-card p-5 shadow-md",
}: {
    children: ReactNode;
    className?: string;
}) {
    return <section className={className}>{children}</section>;
}

export function DetailTextBlock({
    label,
    value,
}: {
    label: string;
    value?: string | null;
}) {
    return (
        <DetailCard>
            <div className="text-sm font-medium text-muted-foreground">
                {label}
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                {value?.trim() || "-"}
            </p>
        </DetailCard>
    );
}

type DetailFieldsTableFieldRow = {
    type?: "field";
    label: ReactNode;
    value: ReactNode;
    key?: string;
    rowClassName?: string;
    labelClassName?: string;
    valueClassName?: string;
};

type DetailFieldsTableSectionRow = {
    type: "section";
    section: ReactNode;
    key?: string;
    rowClassName?: string;
    sectionClassName?: string;
};

export type DetailFieldsTableRow =
    | DetailFieldsTableFieldRow
    | DetailFieldsTableSectionRow;

export function DetailFieldsTable({
    rows,
    className,
    tableClassName,
    labelColumnClassName,
    scrollable = false,
    scrollContainerClassName,
}: {
    rows: DetailFieldsTableRow[];
    className?: string;
    tableClassName?: string;
    labelColumnClassName?: string;
    scrollable?: boolean;
    scrollContainerClassName?: string;
}) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-2xl border border-border/70 bg-card shadow-md",
                scrollable && "min-h-0",
                className,
            )}
        >
            <Table
                className={cn(
                    "w-full table-fixed",
                    tableClassName,
                )}
                containerClassName={cn(
                    "overflow-x-auto",
                    scrollable && "h-full max-h-full overflow-y-auto",
                    scrollContainerClassName,
                )}
            >
                <TableBody>
                    {rows.map((row, index) => {
                        const key = row.key ?? `detail-row-${index}`;

                        if (row.type === "section") {
                            return (
                                <TableRow
                                    key={key}
                                    className={cn(
                                        "border-b border-border/60 bg-muted/20 hover:bg-muted/20",
                                        row.rowClassName,
                                    )}
                                >
                                    <TableCell
                                        colSpan={2}
                                        className={cn(
                                            "px-4 py-3 text-sm font-semibold text-foreground",
                                            row.sectionClassName,
                                        )}
                                    >
                                        {row.section}
                                    </TableCell>
                                </TableRow>
                            );
                        }

                        return (
                            <TableRow
                                key={key}
                                className={cn(
                                    "block border-b border-border/60 hover:bg-transparent md:table-row",
                                    row.rowClassName,
                                )}
                            >
                                <TableCell
                                    className={cn(
                                        "block w-full border-border/60 px-4 pt-4 pb-2 align-top text-sm font-medium text-muted-foreground md:table-cell md:border-r md:px-4 md:py-3 md:align-middle",
                                        labelColumnClassName ??
                                            "md:w-[220px]",
                                        row.labelClassName,
                                    )}
                                >
                                    {row.label}
                                </TableCell>
                                <TableCell
                                    className={cn(
                                        "block w-full px-4 pt-0 pb-4 text-sm md:table-cell md:px-4 md:py-3 md:align-middle",
                                        row.valueClassName,
                                    )}
                                >
                                    {row.value}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}

export function DetailClassLinkValue({
    className,
    classKey,
    onOpenClass,
    buttonLabel,
}: {
    className?: string | null;
    classKey?: string | null;
    onOpenClass: () => void;
    buttonLabel?: string;
}) {
    const { t } = useI18n();
    const normalizedClassKey = classKey?.trim() || "";
    const resolvedButtonLabel = buttonLabel ?? t("detail.openClass");
    return (
        <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="break-words">
                {className?.trim() || "-"}
            </span>
            <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onOpenClass}
                disabled={!normalizedClassKey}
            >
                {resolvedButtonLabel}
            </Button>
        </div>
    );
}

export function DetailClassHeaderLabel({
    label,
    classKey,
    onOpenClass,
}: {
    label?: string;
    classKey?: string | null;
    onOpenClass: () => void;
}) {
    const { t } = useI18n();
    const normalizedClassKey = classKey?.trim() || "";
    const resolvedLabel = label ?? t("detail.class");
    return (
        <span className="inline-flex items-center gap-1">
            <span>{resolvedLabel}</span>
            <Button
                type="button"
                size="icon"
                variant="ghost"
                // An inline icon inside a label: it keeps its size, opts out of
                // the button floor and takes an invisible tap area on touch.
                className={cn(touchHitArea, "relative h-5 min-h-0 w-5 min-w-0 p-0 text-muted-foreground hover:text-foreground")}
                onClick={onOpenClass}
                disabled={!normalizedClassKey}
            >
                <ChevronRight className="h-3.5 w-3.5" />
            </Button>
        </span>
    );
}

export function DetailActionPanel({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <aside className="rounded-3xl border border-border/70 bg-card p-5 shadow-md">
            <div className="text-sm font-medium text-muted-foreground">
                {title}
            </div>
            <div className="mt-3 flex flex-col gap-2">
                {children}
            </div>
        </aside>
    );
}

export interface DetailTabItem<T extends string> {
    value: T;
    label: ReactNode;
    hasPendingChanges?: boolean;
    /** Shown as a small pill after the label; omitted while unknown. */
    count?: number;
}

export interface DetailTabsClassNames {
    root?: string;
    list?: string;
    pill?: string;
    tab?: string;
    tabActive?: string;
}

/** Underlined tab bar for a detail view: a full-width track, a spring underline under the active tab, and a hover underline on the rest. */
export function DetailTabs<T extends string>({
    tabs,
    activeTab,
    onChange,
    className,
    classNames,
}: {
    tabs: Array<DetailTabItem<T>>;
    activeTab: T;
    onChange: (tab: T) => void;
    className?: string;
    classNames?: DetailTabsClassNames;
}) {
    const buttonRefs = useRef(new Map<T, HTMLButtonElement>());
    const tabListRef = useRef<HTMLDivElement | null>(null);
    const debugInstanceRef = useRef(++detailTabsDebugInstanceCounter);
    const initializedRef = useRef(false);
    const resolvedActiveTab =
        tabs.find((tab) => tab.value === activeTab)?.value ?? tabs[0]?.value;

    const [pillSpring, pillApi] = useSpring(() => ({
        left: 0,
        width: 0,
    }));

    const updatePill = useCallback(
        (animate: boolean) => {
            if (!resolvedActiveTab) {
                logDetailTabsDebug(debugInstanceRef.current, "updatePill:no-active-tab", {
                    activeTab,
                    resolvedActiveTab,
                    animate,
                    tabs: tabs.map((tab) => tab.value),
                });
                return false;
            }
            const btn = buttonRefs.current.get(resolvedActiveTab);
            if (!btn) {
                logDetailTabsDebug(debugInstanceRef.current, "updatePill:no-button", {
                    activeTab,
                    resolvedActiveTab,
                    animate,
                    availableButtons: Array.from(buttonRefs.current.keys()),
                });
                return false;
            }
            const width = btn.offsetWidth;
            if (width <= 0) {
                logDetailTabsDebug(debugInstanceRef.current, "updatePill:zero-width", {
                    activeTab,
                    resolvedActiveTab,
                    animate,
                    offsetLeft: btn.offsetLeft,
                    offsetWidth: width,
                    rect: btn.getBoundingClientRect().toJSON(),
                });
                return false;
            }
            const motionConfig = getDetailLayoutMotionConfig();
            logDetailTabsDebug(debugInstanceRef.current, "updatePill:start", {
                activeTab,
                resolvedActiveTab,
                animate,
                offsetLeft: btn.offsetLeft,
                offsetWidth: width,
                buttonRect: btn.getBoundingClientRect().toJSON(),
                tabListRect: tabListRef.current?.getBoundingClientRect().toJSON(),
            });
            pillApi.start({
                left: btn.offsetLeft,
                width,
                immediate: !animate,
                config: {
                    tension: motionConfig.tabPillSpring.tension,
                    friction: motionConfig.tabPillSpring.friction,
                    clamp: true,
                },
            });
            return true;
        },
        [activeTab, pillApi, resolvedActiveTab, tabs],
    );

    useLayoutEffect(() => {
        let frameId = 0;
        let attempts = 0;
        const maxAttempts = 8;
        const measureWithRetry = () => {
            const measured = updatePill(initializedRef.current);
            logDetailTabsDebug(debugInstanceRef.current, "layout-effect:measure", {
                attempts,
                measured,
                initialized: initializedRef.current,
            });
            if (!measured && attempts < maxAttempts) {
                attempts += 1;
                frameId = requestAnimationFrame(measureWithRetry);
            }
        };
        measureWithRetry();
        initializedRef.current = true;
        return () => {
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [updatePill]);

    useEffect(() => {
        logDetailTabsDebug(debugInstanceRef.current, "render-state", {
            activeTab,
            resolvedActiveTab,
            tabs: tabs.map((tab) => tab.value),
        });
    }, [activeTab, resolvedActiveTab, tabs]);

    useEffect(() => {
        const handleResize = () => {
            logDetailTabsDebug(debugInstanceRef.current, "window:resize");
            updatePill(true);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [updatePill]);

    useEffect(() => {
        if (typeof ResizeObserver === "undefined") {
            return;
        }

        const tabList = tabListRef.current;
        const activeButton = resolvedActiveTab
            ? buttonRefs.current.get(resolvedActiveTab)
            : null;
        if (!tabList && !activeButton) {
            return;
        }

        const observer = new ResizeObserver(() => {
            logDetailTabsDebug(debugInstanceRef.current, "resize-observer");
            updatePill(true);
        });

        if (tabList) {
            observer.observe(tabList);
        }
        if (activeButton) {
            observer.observe(activeButton);
        }

        return () => {
            observer.disconnect();
        };
    }, [resolvedActiveTab, updatePill]);

    useEffect(() => {
        if (typeof document === "undefined" || !("fonts" in document)) {
            return;
        }

        let cancelled = false;
        void document.fonts.ready.then(() => {
            if (!cancelled) {
                logDetailTabsDebug(debugInstanceRef.current, "fonts:ready", {
                    status: document.fonts.status,
                });
                updatePill(true);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [updatePill]);

    return (
        // The fade tells a phone there are more tabs past the edge.
        // mb-4 is the one gap between any tab bar and what it controls.
        <div className={cn("mb-4 w-full overflow-x-auto mask-r-from-90% md:mask-none", className, classNames?.root)}>
            {/* The bottom border is the track; it spans the full width even when the tabs don't */}
            <div ref={tabListRef} className={cn("relative flex min-w-max border-b border-border", classNames?.list)}>
                {/* Spring-animated active underline, sitting over the track */}
                <animated.div
                    aria-hidden="true"
                    className={cn("pointer-events-none absolute -bottom-px left-0 h-0.5 rounded-full bg-primary", classNames?.pill)}
                    style={{
                        left: pillSpring.left,
                        width: pillSpring.width,
                        opacity: pillSpring.width.to((width) =>
                            width > 0 ? 1 : 0,
                        ),
                    }}
                />
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        ref={(el) => {
                            if (el) buttonRefs.current.set(tab.value, el);
                            else buttonRefs.current.delete(tab.value);
                            logDetailTabsDebug(debugInstanceRef.current, "button:ref", {
                                tabValue: tab.value,
                                mounted: Boolean(el),
                                activeTab,
                                resolvedActiveTab,
                                offsetLeft: el?.offsetLeft,
                                offsetWidth: el?.offsetWidth,
                            });
                            if (el && tab.value === activeTab) {
                                updatePill(initializedRef.current);
                            }
                        }}
                        type="button"
                        onClick={() => {
                            logDetailTabsDebug(debugInstanceRef.current, "button:click", {
                                tabValue: tab.value,
                                activeTab,
                                resolvedActiveTab,
                            });
                            if (tab.value === resolvedActiveTab) {
                                return;
                            }
                            onChange(tab.value);
                        }}
                        className={cn(
                            touchTargetHeight,
                            "group relative z-10 shrink-0 cursor-pointer whitespace-nowrap px-4 pb-2.5 pt-1 text-sm font-medium transition-colors duration-200",
                            resolvedActiveTab === tab.value
                                ? "text-foreground"
                                : tab.hasPendingChanges
                                  ? "font-semibold text-primary"
                                  : "text-muted-foreground hover:text-foreground",
                            classNames?.tab,
                            resolvedActiveTab === tab.value && classNames?.tabActive,
                        )}
                    >
                        {tab.label}
                        {tab.count !== undefined ? (
                            <span className="ml-1.5 inline-flex min-w-5 justify-center rounded-full bg-lav-bg px-1.5 py-px text-[11px] font-semibold tabular-nums text-lav-700">
                                {tab.count}
                            </span>
                        ) : null}
                        {/* Hover underline grows from the centre; the active tab has the spring underline instead */}
                        {resolvedActiveTab !== tab.value && (
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-2 -bottom-px h-0.5 origin-center scale-x-0 rounded-full bg-primary/40 transition-transform duration-200 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                            />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

export function DetailTabbedSection<T extends string>({
    tabs,
    activeTab,
    onChange,
    children,
    className,
    contentClassName,
    contentScrollable,
    scrollResetKey,
}: {
    tabs: Array<DetailTabItem<T>>;
    activeTab: T;
    onChange: (tab: T) => void;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
    contentScrollable?: boolean;
    scrollResetKey?: string | number;
}) {
    const detailViewContext = useContext(DetailViewContext);
    const resolvedContentScrollable =
        contentScrollable ?? detailViewContext?.contentScrollable ?? false;
    const contentRef = useRef<HTMLDivElement | null>(null);
    const previousScrollResetKeyRef = useRef<string | number | undefined>(
        scrollResetKey,
    );
    const previousFloatingRef = useRef<boolean | undefined>(
        detailViewContext?.floating,
    );

    useLayoutEffect(() => {
        if (scrollResetKey === undefined) {
            return;
        }

        if (previousScrollResetKeyRef.current === scrollResetKey) {
            return;
        }

        previousScrollResetKeyRef.current = scrollResetKey;
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [scrollResetKey]);

    useLayoutEffect(() => {
        const isFloating = detailViewContext?.floating;
        if (previousFloatingRef.current === isFloating) {
            return;
        }

        previousFloatingRef.current = isFloating;
        if (isFloating && contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [detailViewContext?.floating]);

    return (
        <section className={cn("flex min-h-0 flex-col", className)}>
            <div
                data-detail-tabs-wrap
                className="shrink-0 overflow-visible"
            >
                <DetailTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={onChange}
                />
            </div>
            <div
                ref={contentRef}
                data-detail-tab-content
                className={cn(
                    "min-h-0 flex-1",
                    resolvedContentScrollable &&
                        "overflow-y-auto overflow-x-hidden pr-1",
                    contentClassName,
                )}
            >
                {children}
            </div>
        </section>
    );
}

/** Pulse placeholder the size of a line of text; the unit a pending view is drawn in. */
export function DetailPulse({ className }: { className?: string }) {
    return (
        <span
            aria-hidden
            className={cn(
                "inline-block h-4 w-40 animate-pulse rounded bg-muted/60 align-middle",
                className,
            )}
        />
    );
}

function DetailPendingFields() {
    return (
        <div className="grid gap-4 rounded-3xl border border-border/70 p-6 md:grid-cols-2">
            {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="space-y-2">
                    <DetailPulse className="block h-3 w-24 bg-muted/40" />
                    <DetailPulse className="block h-10 w-full rounded-2xl" />
                </div>
            ))}
        </div>
    );
}

/**
 * A detail view's real shell — breadcrumbs, header, tabs — drawn while its
 * record loads, so navigation lands on the view instead of a spinner. Pass
 * `message` for the error / not-found states so they keep the shell too.
 */
export function DetailPendingView<T extends string>({
    breadcrumbs,
    title,
    actions,
    tabs,
    activeTab,
    onTabChange,
    message,
    className,
    onCloseFloating,
}: {
    breadcrumbs: BreadcrumbItem[];
    /** Omitted while the record's name is unknown: a pulse bar stands in. */
    title?: ReactNode;
    actions?: ReactNode;
    tabs?: Array<{ value: T; label: ReactNode }>;
    activeTab?: T;
    onTabChange?: (tab: T) => void;
    message?: ReactNode;
    className?: string;
    onCloseFloating?: () => void;
}) {
    const body = message ? (
        <div
            role="status"
            className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground"
        >
            {message}
        </div>
    ) : (
        <DetailPendingFields />
    );

    return (
        <DetailView className={className} onCloseFloating={onCloseFloating}>
            <DetailHeader
                breadcrumbs={
                    <DetailBreadcrumbs
                        items={breadcrumbs}
                        current={title ?? <DetailPulse className="h-6 w-48" />}
                    />
                }
                actions={actions}
            />
            <div aria-busy={message ? undefined : true} className="contents">
                {tabs && tabs.length > 0 ? (
                    <DetailTabbedSection
                        tabs={tabs}
                        activeTab={activeTab ?? tabs[0].value}
                        onChange={onTabChange ?? (() => undefined)}
                    >
                        {body}
                    </DetailTabbedSection>
                ) : (
                    body
                )}
            </div>
        </DetailView>
    );
}
