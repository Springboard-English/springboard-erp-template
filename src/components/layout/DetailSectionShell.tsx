import { useLayoutEffect, useRef, type ComponentType, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { buttonTarget } from "@/lib/touchTarget";
import { useI18n } from "@/context/I18nContext";

// A record page's section navigation, after Apple's HIG: a grouped sidebar with
// a symbol per row and a fixed foot group when the page is wide, a segmented bar
// with a fixed right end when it is narrow. The accent marks only the open
// section and unsaved edits, so the page's one filled button keeps standing out.

export type DetailSectionIcon = ComponentType<{ className?: string }>;

export interface DetailSectionGroup {
    id: string;
    /** Sidebar heading, Title Case in English. */
    label: string;
}

export interface DetailSectionItem<T extends string> {
    value: T;
    label: ReactNode;
    icon: DetailSectionIcon;
    /** `id` of the sidebar group this section sits under; none puts it in an unheaded group at the top. */
    group?: string;
    /** A secondary figure after the label; omitted while unknown. */
    count?: number;
    /** Unsaved edits in this section, shown as a number so colour is never the only signal. */
    pendingCount?: number;
    /**
     * Kept in the always-visible end group: the sidebar's foot on wide screens,
     * the bar's right end on narrow ones, while the other sections scroll past.
     * A record's Details goes here.
     */
    pinnedEnd?: boolean;
}

// Visible keyboard focus on every custom control; the template's Button has its own.
const FOCUS_RING =
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** The unsaved-edit mark: an accent pill holding the count, named for screen readers. */
function PendingBadge({ count }: { count: number }) {
    const { t } = useI18n();
    const label = t("detail.unsavedCount", "{count} unsaved changes").replace("{count}", String(count));
    return (
        <span
            role="img"
            aria-label={label}
            title={label}
            className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold tabular-nums text-primary-foreground"
        >
            {count}
        </span>
    );
}

/**
 * A record page's sections beside or above its content. Width is read from the
 * page's own container, so the floating panel gets the narrow form too. The
 * content pane scrolls on its own on desktop and returns to the top when
 * `scrollResetKey` changes; a phone scrolls the page. `label` names the
 * navigation for screen readers, such as "Class sections".
 */
export function DetailSectionShell<T extends string>({
    items,
    groups = [],
    activeSection,
    onChange,
    label,
    scrollResetKey,
    children,
    className,
}: {
    items: Array<DetailSectionItem<T>>;
    groups?: DetailSectionGroup[];
    activeSection: T;
    onChange: (section: T) => void;
    label: string;
    scrollResetKey?: string | number;
    children: ReactNode;
    className?: string;
}) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const previousKeyRef = useRef(scrollResetKey);
    useLayoutEffect(() => {
        if (previousKeyRef.current === scrollResetKey) return;
        previousKeyRef.current = scrollResetKey;
        if (contentRef.current) contentRef.current.scrollTop = 0;
    }, [scrollResetKey]);

    const select = (value: T) => {
        if (value !== activeSection) onChange(value);
    };
    const startItems = items.filter((item) => !item.pinnedEnd);
    const endItems = items.filter((item) => item.pinnedEnd);
    const knownGroups = new Set(groups.map((group) => group.id));
    // Sections with no known group lead, unheaded; the named groups follow in the order given.
    const sidebarGroups: Array<{ id: string; label?: string; items: Array<DetailSectionItem<T>> }> = [
        { id: "", items: startItems.filter((item) => !item.group || !knownGroups.has(item.group)) },
        ...groups.map((group) => ({
            id: group.id,
            label: group.label,
            items: startItems.filter((item) => item.group === group.id),
        })),
    ].filter((group) => group.items.length > 0);
    // Narrow screens keep the sidebar's order.
    const orderedStart = sidebarGroups.flatMap((group) => group.items);

    return (
        // `@container` lets the floating panel, not just the window, pick the layout.
        <section className={cn("@container flex min-h-0 flex-col", className)}>
            <div className="flex min-h-0 flex-1 flex-col @4xl:flex-row @4xl:gap-8">
                <nav aria-label={label} className="hidden min-h-0 w-52 shrink-0 flex-col @4xl:flex">
                    {/* The grouped sections scroll; the end group below stays put and they pass under its edge. */}
                    <div className="min-h-0 flex-1 overflow-y-auto pb-4">
                        {sidebarGroups.map((group) => {
                            const headingId = group.label ? `detail-section-group-${group.id}` : undefined;
                            return (
                                <div key={group.id || "_"} className="mb-5 last:mb-0">
                                    {group.label ? (
                                        <h2 id={headingId} className="px-3 pb-1 text-xs font-semibold text-muted-foreground">
                                            {group.label}
                                        </h2>
                                    ) : null}
                                    <ul aria-labelledby={headingId} className="space-y-0.5">
                                        {group.items.map((item) => (
                                            <li key={item.value}>
                                                <SidebarRow item={item} active={item.value === activeSection} onSelect={select} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                    {endItems.length > 0 ? (
                        // While the pending-changes bar floats over the page's foot, the pinned rows rise above it.
                        <ul className="shrink-0 space-y-0.5 border-t border-border/70 bg-background pt-2 pb-4 [body:has([data-pending-bar=open])_&]:pb-24">
                            {endItems.map((item) => (
                                <li key={item.value}>
                                    <SidebarRow item={item} active={item.value === activeSection} onSelect={select} />
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </nav>

                <div className="mb-4 shrink-0 @4xl:hidden">
                    <SegmentedSections
                        label={label}
                        startItems={orderedStart}
                        endItems={endItems}
                        activeSection={activeSection}
                        onSelect={select}
                    />
                </div>

                <div
                    ref={contentRef}
                    data-detail-tab-content
                    className="min-h-0 min-w-0 flex-1 pb-6 md:overflow-y-auto md:overflow-x-hidden md:pr-1 [body:has([data-pending-bar=open])_&]:pb-24"
                >
                    {children}
                </div>
            </div>
        </section>
    );
}

/** One sidebar row: symbol, label, unsaved-edit badge and a trailing count. */
function SidebarRow<T extends string>({
    item,
    active,
    onSelect,
}: {
    item: DetailSectionItem<T>;
    active: boolean;
    onSelect: (section: T) => void;
}) {
    const Icon = item.icon;
    return (
        <button
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => onSelect(item.value)}
            className={cn(
                buttonTarget,
                FOCUS_RING,
                "flex w-full items-center gap-2.5 rounded-md px-3 text-left text-sm transition-colors motion-reduce:transition-none",
                // The open row's text stays foreground: an app's primary on its own tint can miss 4.5:1.
                active ? "bg-primary/10 font-semibold text-foreground" : "text-foreground hover:bg-muted",
            )}
        >
            <span aria-hidden className="contents">
                <Icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
            </span>
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {/* Keeps the label and the badge apart when the row's name is read out. */}
            {item.pendingCount ? <span className="sr-only">, </span> : null}
            {item.pendingCount ? <PendingBadge count={item.pendingCount} /> : null}
            {item.count !== undefined ? (
                <span className="text-xs tabular-nums text-muted-foreground">{item.count}</span>
            ) : null}
        </button>
    );
}

/**
 * The narrow-screen navigation, one segmented bar in two parts: the end
 * sections sit fixed at the right, and the rest scroll sideways on the left,
 * sliding under the fixed part's edge. Labels never truncate, and the open
 * section is scrolled into view.
 */
function SegmentedSections<T extends string>({
    label,
    startItems,
    endItems,
    activeSection,
    onSelect,
}: {
    label: string;
    startItems: Array<DetailSectionItem<T>>;
    endItems: Array<DetailSectionItem<T>>;
    activeSection: T;
    onSelect: (section: T) => void;
}) {
    const trackRef = useRef<HTMLDivElement | null>(null);
    // Keep the selected segment in view, also after a text-size change resizes the track.
    useLayoutEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        const reveal = () => {
            const selected = track.querySelector<HTMLElement>('[aria-current="page"]');
            if (!selected || track.scrollWidth <= track.clientWidth) return;
            track.scrollLeft = selected.offsetLeft - (track.clientWidth - selected.offsetWidth) / 2;
        };
        reveal();
        if (typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(reveal);
        observer.observe(track);
        return () => observer.disconnect();
    }, [activeSection]);
    const segmentClass = (active: boolean) =>
        cn(
            buttonTarget,
            FOCUS_RING,
            // Widths follow the labels (UIKit's content-proportional mode), because HIG
            // never truncates a segment's label.
            "flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors motion-reduce:transition-none",
            active
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground",
        );
    const renderSegment = (item: DetailSectionItem<T>) => {
        const active = item.value === activeSection;
        return (
            <button
                key={item.value}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => onSelect(item.value)}
                className={segmentClass(active)}
            >
                <span>{item.label}</span>
                {item.pendingCount ? <span className="sr-only">, </span> : null}
                {item.pendingCount ? <PendingBadge count={item.pendingCount} /> : null}
            </button>
        );
    };

    return (
        <div role="group" aria-label={label} className="flex w-full rounded-lg bg-muted p-0.5">
            <div
                ref={trackRef}
                // The fade at the right edge shows the sections slide on under the fixed end.
                className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto [mask-image:linear-gradient(to_right,black_calc(100%-1.5rem),transparent)] [scrollbar-width:none]"
            >
                {startItems.map(renderSegment)}
                {/* Room to scroll the last segment clear of the fade. */}
                <span aria-hidden className="w-6 shrink-0" />
            </div>
            {endItems.length > 0 ? (
                <div className="flex shrink-0 gap-0.5 border-l border-border/70 pl-0.5">{endItems.map(renderSegment)}</div>
            ) : null}
        </div>
    );
}
