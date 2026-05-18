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
import { ChevronRight, Expand, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
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
    expandToNormalView: () => void;
    switchToFloatingView: () => void;
} | null>(null);

export const BackgroundDetailViewContext = createContext<boolean>(false);

export function DetailView({
    children,
    className = "w-full max-w-[1700px] space-y-4",
    isBackground: isBackgroundProp,
    onCloseFloating,
}: {
    children: ReactNode;
    className?: string;
    isBackground?: boolean;
    onCloseFloating?: () => void;
}) {
    const isBackgroundFromContext = useContext(BackgroundDetailViewContext);
    const isBackground = isBackgroundProp ?? isBackgroundFromContext;
    const detailViewMode = useDetailViewMode({ enabled: !isBackground });
    const floating = isBackground ? false : detailViewMode.floating;
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
                expandToNormalView,
                switchToFloatingView,
            }}
        >
            <section
                className={cn(
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
                        aria-label="Close details"
                        onClick={handleCloseFloating}
                        className="absolute inset-0 bg-background/45 backdrop-blur-md"
                    />
                ) : null}
                {floating && hiddenCollapsed ? (
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-label="Restore details panel"
                        onClick={() => applyMode(true, true, false)}
                        className="pointer-events-auto absolute right-0 top-1/2 z-20 h-28 w-7 -translate-y-1/2 rounded-l-md rounded-r-none border-r-0 bg-background text-[10px] font-semibold uppercase tracking-[0.14em] shadow-md [writing-mode:vertical-rl]"
                    >
                        Details
                    </Button>
                ) : null}
                <div
                    data-floating-collapsed={
                        floating && collapsed ? "true" : "false"
                    }
                    className={cn(
                        className,
                        floating
                            ? collapsed
                                ? hiddenCollapsed
                                    ? "floating-detail pointer-events-none absolute right-0 top-1/2 z-10 w-[44dvw] min-w-[34rem] max-w-[70rem] -translate-y-1/2 translate-x-[calc(100%-20px)] !h-[76dvh] overflow-hidden rounded-2xl border border-border/70 bg-background p-4 shadow-2xl"
                                    : "floating-detail pointer-events-auto absolute right-3 top-1/2 z-10 w-[44dvw] min-w-[34rem] max-w-[70rem] -translate-y-1/2 !h-[76dvh] overflow-visible rounded-2xl border border-border/70 bg-background p-4 shadow-2xl"
                                : "floating-detail absolute left-1/2 top-1/2 z-10 w-[85dvw] -translate-x-1/2 -translate-y-1/2 !h-[76dvh] overflow-visible rounded-2xl border border-border/70 bg-background p-4 shadow-2xl"
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
                                    aria-label="Expand details panel"
                                    onClick={() => applyMode(true, false)}
                                    className="absolute -left-4 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background opacity-100 shadow-md"
                                >
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    aria-label="Fully collapse details"
                                    onClick={() => applyMode(true, true, true)}
                                    className="absolute -left-4 top-[calc(50%+2.5rem)] z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background opacity-100 shadow-md"
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
                            aria-label="Collapse details"
                            onClick={() => applyMode(true, true, false)}
                            className="absolute -right-4 top-1/2 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-background opacity-100 shadow-md"
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

export function DetailBreadcrumbs({
    items,
    current,
}: {
    items: BreadcrumbItem[];
    current: ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2 text-base">
            {items.map((item, index) => (
                <div key={`${item.label}-${index}`} className="contents">
                    {item.onClick ? (
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="h-auto px-0 text-base no-underline hover:no-underline"
                            onClick={item.onClick}
                        >
                            {item.label}
                        </Button>
                    ) : (
                        <span className="text-base">
                            {item.label}
                        </span>
                    )}
                    <span className="text-muted-foreground">
                        {">"}
                    </span>
                </div>
            ))}
            <h2 className="min-w-0 break-words text-xl font-semibold tracking-tight">
                {current}
            </h2>
        </div>
    );
}

export function DetailHeader({
    breadcrumbs,
    actions,
    className,
}: {
    breadcrumbs: ReactNode;
    actions?: ReactNode;
    className?: string;
}) {
    const detailViewContext = useContext(DetailViewContext);
    const showExpandAction =
        detailViewContext?.floating && !detailViewContext.collapsed;
    const showFloatingAction = detailViewContext && !detailViewContext.floating;

    return (
        <div
            data-detail-header
            className={cn(
                "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
                className,
            )}
        >
            <div className="min-w-0 flex-1">
                {breadcrumbs}
            </div>
            {actions ? (
                <div className="flex shrink-0 items-center gap-2 self-start">
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
                            Expand View
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
                            Floating View
                        </Button>
                    ) : null}
                    {actions}
                </div>
            ) : showExpandAction || showFloatingAction ? (
                <div className="flex shrink-0 items-center gap-2 self-start">
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
                            Expand View
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
                            Floating View
                        </Button>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

export function DetailSummaryGrid({
    children,
    className = "grid gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.45)] md:grid-cols-4",
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={className}>{children}</div>;
}

export function DetailSummaryItem({ label, value }: DetailStat) {
    return (
        <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
            </div>
            <div className="text-sm font-medium">{value}</div>
        </div>
    );
}

export function DetailCard({
    children,
    className = "rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]",
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
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                {value?.trim() || "-"}
            </p>
        </DetailCard>
    );
}

export function DetailFieldsTable({
    rows,
    className,
    tableClassName,
    labelColumnClassName,
}: {
    rows: Array<{
        label: ReactNode;
        value: ReactNode;
        key?: string;
        rowClassName?: string;
        labelClassName?: string;
        valueClassName?: string;
    }>;
    className?: string;
    tableClassName?: string;
    labelColumnClassName?: string;
}) {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]",
                className,
            )}
        >
            <Table
                className={cn(
                    "min-w-[40rem] table-fixed",
                    tableClassName,
                )}
            >
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                            key={row.key ?? `detail-row-${index}`}
                            className={cn(
                                "hover:bg-transparent",
                                row.rowClassName,
                            )}
                        >
                            <TableCell
                                className={cn(
                                    "border-r border-border/60 px-4 py-3 align-middle text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
                                    labelColumnClassName ??
                                        "w-[220px]",
                                    row.labelClassName,
                                )}
                            >
                                {row.label}
                            </TableCell>
                            <TableCell
                                className={cn(
                                    "px-4 py-3 align-middle text-sm",
                                    row.valueClassName,
                                )}
                            >
                                {row.value}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function DetailClassLinkValue({
    className,
    classKey,
    onOpenClass,
    buttonLabel = "Open class",
}: {
    className?: string | null;
    classKey?: string | null;
    onOpenClass: () => void;
    buttonLabel?: string;
}) {
    const normalizedClassKey = classKey?.trim() || "";
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
                {buttonLabel}
            </Button>
        </div>
    );
}

export function DetailClassHeaderLabel({
    label = "Class",
    classKey,
    onOpenClass,
}: {
    label?: string;
    classKey?: string | null;
    onOpenClass: () => void;
}) {
    const normalizedClassKey = classKey?.trim() || "";
    return (
        <span className="inline-flex items-center gap-1">
            <span>{label}</span>
            <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
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
        <aside className="rounded-3xl border border-border/70 bg-card p-5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {title}
            </div>
            <div className="mt-3 flex flex-col gap-2">
                {children}
            </div>
        </aside>
    );
}

export function DetailTabs<T extends string>({
    tabs,
    activeTab,
    onChange,
}: {
    tabs: Array<{ value: T; label: ReactNode; hasPendingChanges?: boolean }>;
    activeTab: T;
    onChange: (tab: T) => void;
}) {
    const buttonRefs = useRef(new Map<T, HTMLButtonElement>());
    const initializedRef = useRef(false);

    const [pillSpring, pillApi] = useSpring(() => ({
        x: 0,
        width: 0,
        opacity: 0,
    }));

    const updatePill = useCallback(
        (animate: boolean) => {
            const btn = buttonRefs.current.get(activeTab);
            if (!btn) return;
            const motionConfig = getDetailLayoutMotionConfig();
            pillApi.start({
                x: btn.offsetLeft,
                width: btn.offsetWidth,
                opacity: 1,
                immediate: !animate,
                config: {
                    tension: motionConfig.tabPillSpring.tension,
                    friction: motionConfig.tabPillSpring.friction,
                },
            });
        },
        [activeTab, pillApi],
    );

    useLayoutEffect(() => {
        updatePill(initializedRef.current);
        initializedRef.current = true;
    }, [updatePill]);

    return (
        <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card/70 p-1 drop-shadow-md">
            <div className="relative flex min-w-max gap-2">
                {/* Spring-animated active pill — inside the flex div so offsetLeft is accurate */}
                <animated.div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 h-full rounded-xl bg-primary shadow-sm"
                    style={{
                        transform: pillSpring.x.to((x) => `translateX(${x}px)`),
                        width: pillSpring.width,
                        opacity: pillSpring.opacity,
                    }}
                />
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        ref={(el) => {
                            if (el) buttonRefs.current.set(tab.value, el);
                            else buttonRefs.current.delete(tab.value);
                        }}
                        type="button"
                        onClick={() => onChange(tab.value)}
                        className={cn(
                            "relative z-10 shrink-0 cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-150",
                            activeTab === tab.value
                                ? "text-primary-foreground"
                                : tab.hasPendingChanges
                                  ? "font-bold text-primary hover:bg-primary/10"
                                  : "text-muted-foreground hover:text-accent-foreground",
                        )}
                    >
                        {tab.label}
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
}: {
    tabs: Array<{ value: T; label: ReactNode; hasPendingChanges?: boolean }>;
    activeTab: T;
    onChange: (tab: T) => void;
    children: ReactNode;
    className?: string;
    contentClassName?: string;
}) {
    const prevTabRef = useRef(activeTab);
    const pendingTabRef = useRef<T | null>(null);
    const [contentSpring, contentApi] = useSpring(() => ({ opacity: 1 }));

    // Fade out first, then navigate — so content is already at 0 when new children arrive
    const handleTabChange = useCallback(
        (nextTab: T) => {
            if (nextTab === activeTab) return;
            const motionConfig = getDetailLayoutMotionConfig();
            pendingTabRef.current = nextTab;
            void contentApi.start({
                opacity: 0,
                config: {
                    duration: motionConfig.tabContentFadeOutMs,
                },
                onRest: ({ cancelled }) => {
                    if (!cancelled && pendingTabRef.current === nextTab) {
                        onChange(nextTab);
                    }
                },
            });
        },
        [activeTab, contentApi, onChange],
    );

    // useLayoutEffect runs before paint — content starts invisible, no flash
    useLayoutEffect(() => {
        if (prevTabRef.current === activeTab) return;
        const motionConfig = getDetailLayoutMotionConfig();
        prevTabRef.current = activeTab;
        void contentApi.start({
            opacity: 1,
            config: {
                duration: motionConfig.tabContentFadeInMs,
            },
        });
    }, [activeTab, contentApi]);

    return (
        <section className={cn("flex min-h-0 flex-col", className)}>
            <div
                data-detail-tabs-wrap
                className="shrink-0 overflow-visible pb-2"
            >
                <DetailTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={handleTabChange}
                />
            </div>
            <animated.div
                data-detail-tab-content
                style={{ opacity: contentSpring.opacity }}
                className={cn(
                    "mt-4 flex min-h-0 flex-1 flex-col",
                    contentClassName,
                )}
            >
                {children}
            </animated.div>
        </section>
    );
}
