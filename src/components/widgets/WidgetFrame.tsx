import {
    Component,
    Suspense,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
    type RefObject,
} from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, GripVertical, MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useI18n } from "../../context/I18nContext";
import type { UserInfo } from "../../api_calls/UserData";
import { WIDGET_MIN_ROWS, findWidget, stackSizes, widgetRowSpan } from "./layout";
import { WidgetError, WidgetSkeleton } from "./WidgetBodies";
import { WidgetFooterContext } from "./WidgetFooter";
import { WidgetBodyContext } from "./useFitRows";
import {
    isWidgetStack,
    type AnyWidgetDefinition,
    type WidgetLayoutEntry,
    type WidgetRegistry,
    type WidgetSize,
} from "./types";

/**
 * Column spans per size; rows come from `useWidgetRowSpan`. A consumer's Tailwind must `@source` this package's whole
 * `dist/` directory: `dist/index.js` is only a re-export stub, and the classes
 * live in the chunks beside it.
 */
export const WIDGET_SIZE_CLASS: Record<WidgetSize, string> = {
    S: "col-span-1",
    M: "col-span-2",
    L: "col-span-2",
    XL: "col-span-2 md:col-span-4",
};

/** Numbers from computed style ("136px" → 136); 0 for "normal" or anything unparsable. */
function px(value: string): number {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

export interface WidgetRowSpan {
    span: number;
    /** The content height that fits the frame's minimum rows. */
    bodyBudget: number;
    itemRef: RefObject<HTMLDivElement | null>;
    cardRef: RefObject<HTMLDivElement | null>;
    headerRef: RefObject<HTMLDivElement | null>;
    contentRef: RefObject<HTMLDivElement | null>;
    footerRef: RefObject<HTMLDivElement | null>;
}

/**
 * The rows a frame spans on the board's fixed row grid: its header, content
 * and footer at their natural height, rounded up to whole rows, never below
 * `minRows`. Re-measured whenever any of them or the board resizes.
 */
function useWidgetRowSpan(minRows: number, widgetId: string | null): WidgetRowSpan {
    const itemRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const footerRef = useRef<HTMLDivElement | null>(null);
    const [span, setSpan] = useState(minRows);
    const [bodyBudget, setBodyBudget] = useState(0);

    useLayoutEffect(() => {
        const item = itemRef.current;
        const card = cardRef.current;
        const header = headerRef.current;
        const content = contentRef.current;
        const footer = footerRef.current;
        const grid = item?.parentElement;
        // jsdom and very old browsers have no ResizeObserver; the minimum stands.
        if (!item || !card || !header || !content || !grid || typeof ResizeObserver === "undefined") {
            setSpan(minRows);
            return;
        }
        const measure = () => {
            const gridStyle = getComputedStyle(grid);
            const cardStyle = getComputedStyle(card);
            const chrome =
                px(cardStyle.paddingTop) +
                px(cardStyle.paddingBottom) +
                px(cardStyle.borderTopWidth) +
                px(cardStyle.borderBottomWidth) +
                px(cardStyle.rowGap);
            // An empty footer is display:none (0 high) and takes no gap.
            const footerHeight = footer?.offsetHeight ?? 0;
            const footerSpace = footerHeight > 0 ? footerHeight + px(cardStyle.rowGap) : 0;
            const fixed = header.offsetHeight + footerSpace + chrome;
            const rowPx = px(gridStyle.gridAutoRows);
            const gapPx = px(gridStyle.rowGap);
            setSpan(widgetRowSpan(fixed + content.offsetHeight, rowPx, gapPx, minRows));
            // The content height the minimum box holds. Fitting to this, not to the card's current
            // height, keeps a fitted list from chasing a card that grew because the list did.
            setBodyBudget(Math.max(0, minRows * rowPx + (minRows - 1) * gapPx - fixed));
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(header);
        observer.observe(content);
        if (footer) observer.observe(footer);
        // The board changes its gap at `md`, which no content resize reports.
        observer.observe(grid);
        return () => observer.disconnect();
    }, [minRows, widgetId]);

    return { span, bodyBudget, itemRef, cardRef, headerRef, contentRef, footerRef };
}

/** What the drag layer hands each frame. Structural, so this module needs no dnd-kit import. */
export interface WidgetSortableBinding {
    setNodeRef: (element: HTMLElement | null) => void;
    style?: CSSProperties;
    handleProps: HTMLAttributes<HTMLElement>;
    isDragging: boolean;
}

export interface WidgetFrameActions {
    remove: (id: string) => void;
    resize: (id: string, size: WidgetSize) => void;
    move: (id: string, delta: -1 | 1) => void;
    configure: (id: string, def: AnyWidgetDefinition, config: unknown) => void;
    addToStack: (id: string, size: WidgetSize) => void;
    unstack: (id: string) => void;
    moveTab: (stackId: string, childId: string, delta: -1 | 1) => void;
}

export class WidgetErrorBoundary extends Component<{ children: ReactNode; resetKey: string }, { error: unknown }> {
    state = { error: null as unknown };

    static getDerivedStateFromError(error: unknown) {
        return { error };
    }

    componentDidUpdate(previous: { resetKey: string }) {
        if (previous.resetKey !== this.props.resetKey && this.state.error) {
            this.setState({ error: null });
        }
    }

    render() {
        if (this.state.error) {
            return <WidgetError error={this.state.error} onRetry={() => this.setState({ error: null })} />;
        }
        return this.props.children;
    }
}

function readActiveTab(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeActiveTab(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Private mode: the tab just won't be remembered.
    }
}

export interface WidgetFrameProps {
    entry: WidgetLayoutEntry;
    registry: WidgetRegistry;
    user: UserInfo;
    storageKey: string;
    editing: boolean;
    isFirst: boolean;
    isLast: boolean;
    actions: WidgetFrameActions;
    sortable?: WidgetSortableBinding;
    frameAttributes?: (widgetId: string) => Record<string, string> | undefined;
}

/** One slot on the board: a card with a title, an "Open" link, and its own error boundary. */
export default function WidgetFrame({
    entry,
    registry,
    user,
    storageKey,
    editing,
    isFirst,
    isLast,
    actions,
    sortable,
    frameAttributes,
}: WidgetFrameProps) {
    const { t } = useI18n();
    const stack = isWidgetStack(entry) ? entry : null;
    const tabKey = `widgets:${storageKey}:${entry.id}`;
    const [storedTab, setStoredTab] = useState(() => (stack ? readActiveTab(tabKey) : null));
    const [footerNode, setFooterNode] = useState<HTMLDivElement | null>(null);
    const [bodyNode, setBodyNode] = useState<HTMLDivElement | null>(null);

    const children = isWidgetStack(entry) ? entry.stack : [{ id: entry.id, widget: entry.widget, config: entry.config }];
    const active = children.find((child) => child.id === storedTab) ?? children[0];
    const def = findWidget(registry, active.widget);
    const rows = useWidgetRowSpan(WIDGET_MIN_ROWS[entry.size], def?.id ?? null);
    const bodyContext = useMemo(
        () => (bodyNode ? { node: bodyNode, budget: rows.bodyBudget } : null),
        [bodyNode, rows.bodyBudget],
    );
    if (!def) return null;

    const titleOf = (d: AnyWidgetDefinition) => t(d.titleKey ?? d.title, d.title);
    const title = titleOf(def);
    const href = def.href?.(active.config);
    const sizes = stack ? stackSizes(stack, registry) : def.sizes;
    const Render = def.render;
    const Icon = def.icon;

    const selectTab = (id: string) => {
        setStoredTab(id);
        writeActiveTab(tabKey, id);
    };

    return (
        <div
            ref={(node) => {
                rows.itemRef.current = node;
                sortable?.setNodeRef(node);
            }}
            style={{ ...sortable?.style, gridRow: `span ${rows.span} / span ${rows.span}` }}
            className={cn(WIDGET_SIZE_CLASS[entry.size], "min-w-0", sortable?.isDragging && "z-10 opacity-60")}
            data-widget={def.id}
            {...frameAttributes?.(def.id)}
        >
            <Card ref={rows.cardRef} className={cn("h-full gap-3 py-3", editing && "border-dashed border-primary/50")}>
                <div ref={rows.headerRef} className="flex min-h-11 items-center gap-1 px-3">
                    {editing && sortable ? (
                        <button
                            type="button"
                            className="flex size-11 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground hover:bg-muted md:pointer-fine:size-9"
                            aria-label={t("widgets.drag", undefined, { title })}
                            {...sortable.handleProps}
                        >
                            <GripVertical aria-hidden className="size-4" />
                        </button>
                    ) : Icon ? (
                        <Icon aria-hidden className="mx-1 size-4 shrink-0 text-muted-foreground" />
                    ) : null}

                    {stack ? (
                        <Tabs value={active.id} onValueChange={selectTab} className="min-w-0 flex-1">
                            <TabsList variant="line" className="max-w-full justify-start overflow-x-auto">
                                {stack.stack.map((child) => {
                                    const childDef = findWidget(registry, child.widget);
                                    return childDef ? (
                                        <TabsTrigger key={child.id} value={child.id} className="flex-none px-3">
                                            {titleOf(childDef)}
                                        </TabsTrigger>
                                    ) : null;
                                })}
                            </TabsList>
                        </Tabs>
                    ) : (
                        <h3 className="min-w-0 flex-1 truncate px-1 text-sm font-semibold">{title}</h3>
                    )}

                    {!editing && href ? (
                        <Button asChild variant="ghost" size="icon-sm" className="shrink-0 text-muted-foreground">
                            <Link to={href} aria-label={t("widgets.open", undefined, { title })}>
                                <ArrowUpRight aria-hidden />
                            </Link>
                        </Button>
                    ) : null}

                    {editing ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button type="button" variant="ghost" size="icon-sm" aria-label={t("widgets.menu", undefined, { title })}>
                                        <MoreHorizontal aria-hidden />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="min-w-52">
                                    {sizes.length > 1 ? (
                                        <>
                                            <DropdownMenuLabel>{t("widgets.size")}</DropdownMenuLabel>
                                            <DropdownMenuRadioGroup
                                                value={entry.size}
                                                onValueChange={(value) => actions.resize(entry.id, value as WidgetSize)}
                                            >
                                                {sizes.map((size) => (
                                                    <DropdownMenuRadioItem key={size} value={size}>
                                                        {t(`widgets.size.${size}`)}
                                                    </DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                            <DropdownMenuSeparator />
                                        </>
                                    ) : null}
                                    {def.ConfigForm ? (
                                        <DropdownMenuItem onSelect={() => actions.configure(active.id, def, active.config)}>
                                            {t("widgets.configure")}
                                        </DropdownMenuItem>
                                    ) : null}
                                    <DropdownMenuItem disabled={isFirst} onSelect={() => actions.move(entry.id, -1)}>
                                        {t("widgets.moveEarlier")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled={isLast} onSelect={() => actions.move(entry.id, 1)}>
                                        {t("widgets.moveLater")}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onSelect={() => actions.addToStack(entry.id, entry.size)}>
                                        {t("widgets.addToStack")}
                                    </DropdownMenuItem>
                                    {stack ? (
                                        <>
                                            <DropdownMenuItem
                                                disabled={stack.stack[0].id === active.id}
                                                onSelect={() => actions.moveTab(stack.id, active.id, -1)}
                                            >
                                                {t("widgets.moveTabLeft", undefined, { title })}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                disabled={stack.stack[stack.stack.length - 1].id === active.id}
                                                onSelect={() => actions.moveTab(stack.id, active.id, 1)}
                                            >
                                                {t("widgets.moveTabRight", undefined, { title })}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => actions.remove(active.id)}>
                                                {t("widgets.removeFromStack", undefined, { title })}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => actions.unstack(stack.id)}>
                                                {t("widgets.unstack")}
                                            </DropdownMenuItem>
                                        </>
                                    ) : null}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground hover:text-destructive"
                                aria-label={t("widgets.remove", undefined, { title })}
                                onClick={() => actions.remove(entry.id)}
                            >
                                <X aria-hidden />
                            </Button>
                        </>
                    ) : null}
                </div>

                {/* The space the card leaves for content; `useFitRows` fits a list to it. */}
                <div ref={setBodyNode} className={cn("min-h-0 flex-1 px-4", editing && "pointer-events-none select-none")}>
                    {/* Measured at its natural height, so the frame can take the rows it needs. */}
                    <div ref={rows.contentRef}>
                        <WidgetBodyContext.Provider value={bodyContext}>
                            <WidgetFooterContext.Provider value={footerNode}>
                                <WidgetErrorBoundary resetKey={`${active.id}:${entry.size}`}>
                                    <Suspense fallback={<WidgetSkeleton size={entry.size} />}>
                                        <Render size={entry.size} config={active.config} user={user} preview={false} />
                                    </Suspense>
                                </WidgetErrorBoundary>
                            </WidgetFooterContext.Provider>
                        </WidgetBodyContext.Provider>
                    </div>
                </div>

                {/* Where `WidgetFooter` puts a widget's pager and links: the card's bottom edge. */}
                <div
                    ref={(node) => {
                        rows.footerRef.current = node;
                        setFooterNode(node);
                    }}
                    className={cn("px-4 empty:hidden", editing && "pointer-events-none select-none")}
                />
            </Card>
        </div>
    );
}
