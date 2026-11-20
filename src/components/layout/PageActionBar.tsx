import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import useIsMobile from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import {
    ActionsMenuRoleProvider,
    DetailActionsMenu,
    useActionsMenuLifted,
    type DetailMenuAction,
} from "./DetailLayout";

/** One button of a page header's action bar; the bar moves it into "⋯" when it does not fit. */
export interface PageAction extends Omit<DetailMenuAction, "onSelect"> {
    /** Stable key; the label may change with the language. */
    id: string;
    /** What a click does; leave it out for a `to` link. */
    onSelect?: () => void;
    /** The button's look while it is inline. `default` marks the page's main action, the last to move into "⋯". */
    variant?: "default" | "outline" | "secondary" | "ghost" | "ai";
    /** A route to open instead of `onSelect`, drawn as a link while inline. */
    to?: string;
    /** Router state sent with `to`. */
    state?: unknown;
    /** `data-*` attributes for the inline button, such as a guided tour's anchor. */
    data?: Record<`data-${string}`, string>;
    /** Always in "⋯", whatever the room; destructive actions are there regardless. */
    overflow?: boolean;
    /** Left out on a phone, where `useMobileFAB` draws it as the floating button. */
    desktopOnly?: boolean;
}

// The gap between buttons, `gap-2`, in pixels.
const GAP = 8;

/**
 * How many of the inline candidates fit in `available` pixels. Candidates move
 * into "⋯" from the end, except a `default` one, which goes only after every
 * other; the "⋯" button's room is kept whenever anything is in the menu.
 */
export function fitPageActions(
    widths: number[],
    primary: boolean[],
    menuWidth: number,
    alwaysMenu: boolean,
    available: number,
): boolean[] {
    const shown = widths.map(() => true);
    const order = [
        ...widths.map((_, i) => i).filter((i) => !primary[i]).reverse(),
        ...widths.map((_, i) => i).filter((i) => primary[i]).reverse(),
    ];
    const total = () => {
        const visible = widths.filter((_, i) => shown[i]);
        const menu = alwaysMenu || visible.length < widths.length;
        const parts = menu ? [...visible, menuWidth] : visible;
        return parts.reduce((sum, w) => sum + w, 0) + Math.max(parts.length - 1, 0) * GAP;
    };
    for (const index of order) {
        if (total() <= available) {
            break;
        }
        shown[index] = false;
    }
    return shown;
}

/** The flex row a header bar sits in and that row's items, looking through `display: contents` wrappers. */
interface HeaderRow {
    container: HTMLElement;
    items: HTMLElement[];
}

/** Finds the flex row holding `root` and every item laid out in it. */
function headerRow(root: HTMLElement): HeaderRow | null {
    const isContents = (el: Element) => getComputedStyle(el).display === "contents";
    let container = root.parentElement;
    while (container && isContents(container)) {
        container = container.parentElement;
    }
    if (!container) {
        return null;
    }
    const items: HTMLElement[] = [];
    const collect = (parent: Element) => {
        for (const child of Array.from(parent.children)) {
            if (isContents(child)) {
                collect(child);
            } else if (getComputedStyle(child).position !== "absolute") {
                items.push(child as HTMLElement);
            }
        }
    };
    collect(container);
    return { container, items };
}

/**
 * Unused width in the header row that `root` may grow into. It goes to the
 * rightmost bar that still has buttons folded, so two bars never claim it at
 * once and the page's own actions unfold before a section's.
 */
function headerRowSpare(root: HTMLElement): number {
    const row = headerRow(root);
    if (!row) {
        return 0;
    }
    const after = row.items.slice(row.items.indexOf(root) + 1);
    if (after.some((item) => item.hasAttribute("data-page-action-bar") && item.hasAttribute("data-folded"))) {
        return 0;
    }
    const style = getComputedStyle(row.container);
    const gap = Number.parseFloat(style.columnGap) || 0;
    const inner =
        row.container.clientWidth - (Number.parseFloat(style.paddingLeft) || 0) - (Number.parseFloat(style.paddingRight) || 0);
    const used = row.items.reduce((sum, item) => sum + item.getBoundingClientRect().width, 0);
    return Math.max(0, Math.floor(inner - used - Math.max(row.items.length - 1, 0) * gap));
}

/**
 * A page header's buttons in one row: as many as fit beside the title, the
 * rest in a "⋯" menu at the end. It measures every button in a hidden copy of
 * the row and watches its own width, so a long title, a narrow window or a
 * translated label moves buttons in and out. Pass it as `PageHeader` or
 * `DetailHeader` `actions`. `leading` holds a list's search and filters, which
 * never fold: on a phone they take the row and every button goes into "⋯".
 * Lifted into a record header, its "⋯" items join the header's one "⋯".
 */
export default function PageActionBar({
    actions: allActions,
    leading,
    size = "default",
    className,
}: {
    actions: PageAction[];
    leading?: ReactNode;
    size?: "default" | "sm";
    className?: string;
}) {
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const rootRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const leadingRef = useRef<HTMLDivElement>(null);
    const hasLeading = Boolean(leading);
    // Lifted into a record header, folded buttons join the header's "⋯", so the bar keeps no room for its own.
    const menuLifted = useActionsMenuLifted();
    const actions = isMobile ? allActions.filter((action) => !action.desktopOnly) : allActions;
    const candidates = actions.filter((action) => !action.overflow && !action.destructive);
    const alwaysMenu = candidates.length < actions.length;
    const [shown, setShown] = useState<boolean[] | null>(null);
    // The bar's width bounds in pixels: it grows only to what its contents need and never below its `leading`.
    const [bounds, setBounds] = useState<{ min: number; max: number } | null>(null);
    // Re-fit when the set of buttons or their weight changes; width changes reach the observer.
    const signature = candidates.map((action) => `${action.id}:${action.variant ?? "outline"}`).join("|");

    useLayoutEffect(() => {
        const root = rootRef.current;
        const measure = measureRef.current;
        if (!root || !measure) {
            return;
        }
        const fit = () => {
            // Not laid out (a hidden tab, a test DOM): leave every button showing.
            if (root.getBoundingClientRect().width === 0) {
                setShown(null);
                setBounds(null);
                return;
            }
            const items = Array.from(measure.children) as HTMLElement[];
            const widths = items.slice(0, -1).map((item) => item.getBoundingClientRect().width);
            const menuWidth = menuLifted ? 0 : (items[items.length - 1]?.getBoundingClientRect().width ?? 0);
            const primary = signature.split("|").map((part) => part.endsWith(":default"));
            const leadingWidth = leadingRef.current ? leadingRef.current.getBoundingClientRect().width + GAP : 0;
            // In a page header the bar is only as wide as what it shows, so the row packs every control on
            // the right; the row's spare width is room it may grow into.
            const inHeader = !isMobile && root.closest("[data-page-header]") !== null;
            const spare = inHeader ? headerRowSpare(root) : 0;
            // A phone's search row has no room for buttons.
            const available = hasLeading && isMobile ? 0 : root.getBoundingClientRect().width + spare - leadingWidth;
            const next = fitPageActions(widths, primary, menuWidth, alwaysMenu, available);
            setShown((previous) =>
                previous && previous.length === next.length && previous.every((value, i) => value === next[i])
                    ? previous
                    : next,
            );
            const folded = next.some((value) => !value);
            root.toggleAttribute("data-folded", folded);
            const parts = [
                ...widths.filter((_, i) => next[i]),
                ...((alwaysMenu || folded) && menuWidth > 0 ? [menuWidth] : []),
            ];
            const buttonsWidth = parts.reduce((sum, w) => sum + w, 0) + Math.max(parts.length - 1, 0) * GAP;
            const leadingOnly = leadingRef.current?.getBoundingClientRect().width ?? 0;
            // `leadingWidth` carries the gap before the buttons, so it counts only when there are some.
            const needed = parts.length > 0 ? leadingWidth + buttonsWidth : leadingOnly;
            const nextBounds = inHeader ? { min: Math.ceil(leadingOnly), max: Math.ceil(needed) } : null;
            setBounds((previous) =>
                previous && nextBounds && previous.min === nextBounds.min && previous.max === nextBounds.max
                    ? previous
                    : nextBounds,
            );
        };
        fit();
        if (typeof ResizeObserver === "undefined") {
            return;
        }
        // The root follows the room beside the title; the copy follows labels, icons and fonts.
        const observer = new ResizeObserver(fit);
        observer.observe(root);
        observer.observe(measure);
        if (leadingRef.current) {
            observer.observe(leadingRef.current);
        }
        // The row's other controls change the spare room this bar may grow into.
        const row = headerRow(root);
        if (row && !isMobile && root.closest("[data-page-header]")) {
            observer.observe(row.container);
            row.items.filter((item) => item !== root).forEach((item) => observer.observe(item));
        }
        return () => observer.disconnect();
    }, [signature, alwaysMenu, hasLeading, isMobile, menuLifted]);

    // Before the first measurement every button shows, as it would without the bar.
    const visible = candidates.filter((_, i) => shown?.[i] ?? true);
    const menu: DetailMenuAction[] = [
        ...candidates.filter((_, i) => shown !== null && shown[i] === false),
        ...actions.filter((action) => action.overflow || action.destructive),
    ].map((action) => ({
        label: action.label,
        icon: action.icon,
        disabled: action.disabled,
        destructive: action.destructive,
        onSelect: action.to
            ? () => navigate(action.to as string, { state: action.state })
            : (action.onSelect ?? (() => undefined)),
    }));

    const renderButton = (action: PageAction, inert: boolean) => {
        const content = (
            <>
                {action.icon}
                {action.label}
            </>
        );
        const variant = action.variant ?? "outline";
        // `group` lets an icon animate on the button's hover; the measuring copy carries no anchors.
        const shared = { variant, size, className: "group", ...(inert ? {} : action.data) };
        if (action.to && !inert && !action.disabled) {
            return (
                <Button key={action.id} asChild {...shared}>
                    <Link to={action.to} state={action.state}>
                        {content}
                    </Link>
                </Button>
            );
        }
        return (
            <Button
                key={action.id}
                type="button"
                {...shared}
                disabled={action.disabled}
                tabIndex={inert ? -1 : undefined}
                onClick={inert ? undefined : action.onSelect}
            >
                {content}
            </Button>
        );
    };

    return (
        <div
            ref={rootRef}
            data-page-action-bar
            // `contain` stops the buttons sizing the bar, or a header with no room would grow to fit them.
            className={cn("relative flex min-w-0 flex-1 items-center justify-end gap-2 [contain:inline-size]", className)}
            style={bounds ? { minWidth: bounds.min, maxWidth: bounds.max } : undefined}
        >
            {/* A copy of every button, never seen, to measure; clipped so it can't widen the page. */}
            <div aria-hidden="true" className="pointer-events-none invisible absolute inset-0 overflow-hidden">
                <div ref={measureRef} inert className="flex w-max gap-2">
                    {candidates.map((action) => renderButton(action, true))}
                    {/* Plain, so the measuring copy never hands a dummy item to the header's "⋯". */}
                    <ActionsMenuRoleProvider value="plain">
                        <DetailActionsMenu actions={[{ label: "", onSelect: () => undefined }]} />
                    </ActionsMenuRoleProvider>
                </div>
            </div>
            {hasLeading ? (
                // Its own width on a desktop, so the buttons get the rest; the whole row on a phone.
                <div ref={leadingRef} className="flex min-w-0 items-center gap-2 max-md:flex-1 md:shrink-0">
                    {leading}
                </div>
            ) : null}
            {visible.map((action) => renderButton(action, false))}
            <DetailActionsMenu actions={menu} />
        </div>
    );
}
