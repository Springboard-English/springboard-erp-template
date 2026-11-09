import { createContext, useContext, type ReactNode } from "react";
import { ArrowLeft, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { touchHitArea } from "@/lib/touchTarget";
import { uiPresetClass } from "@/config/uiPreset";

/** One step of a page's back trail; items with an `onClick` are links. */
export interface PageHeaderBackItem {
    label: string;
    onClick?: () => void;
}

// Every page head is the same grid, so a list page and a detail page put the
// back link, title, actions, summary and the tab bar under them in one place.
// Desktop rows: back link or eyebrow (always 20px, empty when there is
// neither), title with the actions on its right, summary (always 16px). Phone:
// the back link and the actions share a nav-bar row above a large title; an
// eyebrow takes that row alone and the actions drop under the title.
// With a `PageActionBar` the title (or a phone's back link) keeps its full
// width and the bar takes the rest, at least room for its "⋯".
const ROOT_CLASS = cn(
    "mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 md:grid-cols-[minmax(min-content,1fr)_minmax(0,auto)] md:gap-x-4",
    // `:has` outranks the `md:` columns, so this holds at every width.
    "has-[[data-page-action-bar]]:grid-cols-[minmax(0,max-content)_minmax(2.75rem,1fr)]",
);

// True inside a page-header grid, so a slot drawn on its own can bring one.
const PageHeaderGridContext = createContext(false);

/** Whether the caller is already inside a `PageHeaderRoot` grid. */
export function useInPageHeaderGrid(): boolean {
    return useContext(PageHeaderGridContext);
}

/** The grid every page head is drawn in; `DetailHeader` and `PageHeader` both use it. */
export function PageHeaderRoot({
    children,
    className,
    ...rest
}: {
    children: ReactNode;
    className?: string;
    "data-detail-header"?: boolean;
}) {
    return (
        <header data-page-header className={cn(ROOT_CLASS, className)} {...rest}>
            <PageHeaderGridContext.Provider value>{children}</PageHeaderGridContext.Provider>
        </header>
    );
}

/**
 * The row above the title: the back trail "← Parent / Child", or on a page
 * with no way back an eyebrow, a short line naming the section. On a phone
 * only the nearest parent shows, as a full-height "‹ Parent" tap target. With
 * neither the row stays on desktop as empty space, so the title never moves.
 */
export function PageHeaderBack({ items, eyebrow }: { items: PageHeaderBackItem[]; eyebrow?: ReactNode }) {
    const lastIndex = items.length - 1;
    if (items.length === 0 && eyebrow) {
        return (
            // The back link's size, so the row keeps its height; bold in the app's primary colour
            // so it reads as the section's name rather than a link.
            <p className="col-span-2 row-start-1 flex min-w-0 items-center truncate text-xs font-extrabold text-primary md:h-5">
                {eyebrow}
            </p>
        );
    }
    if (items.length === 0) {
        return <div aria-hidden="true" className="hidden md:col-span-2 md:row-start-1 md:block md:h-5" />;
    }
    return (
        <nav className="col-start-1 row-start-1 flex min-w-0 flex-wrap items-center gap-1 text-xs text-muted-foreground max-md:min-h-11 max-md:text-base max-md:text-primary md:col-span-2 md:h-5">
            <ArrowLeft className="size-3 max-md:hidden" aria-hidden="true" />
            {items.map((item, index) => (
                // Native apps name only the screen you came from, so a phone hides the rest of the trail.
                <div
                    key={`${item.label}-${index}`}
                    className={cn("contents", index < lastIndex && "max-md:hidden")}
                >
                    {index > 0 ? <span aria-hidden="true" className="max-md:hidden">/</span> : null}
                    {item.onClick ? (
                        <button
                            type="button"
                            className={cn(
                                // a tablet keeps the small text link, with a 44px tap area around it
                                touchHitArea,
                                "relative underline-offset-4 md:hover:text-foreground md:hover:underline max-md:-ml-1.5 max-md:inline-flex max-md:min-h-11 max-md:min-w-0 max-md:items-center",
                                // and a mouse desktop a 24px-tall one (WCAG 2.5.8), without moving the 20px row
                                "md:pointer-fine:after:absolute md:pointer-fine:after:inset-x-0 md:pointer-fine:after:top-1/2 md:pointer-fine:after:h-6 md:pointer-fine:after:-translate-y-1/2",
                            )}
                            onClick={item.onClick}
                        >
                            <ChevronLeft className="size-6 shrink-0 md:hidden" aria-hidden="true" />
                            <span className="truncate">{item.label}</span>
                        </button>
                    ) : (
                        <span className="truncate">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}

/**
 * The page's `h2` with its status chip beside it, on the second desktop row;
 * 36px tall so it lines up with the actions. `hasBack` is true whenever the
 * row above is drawn on a phone, a back link or an eyebrow.
 */
export function PageHeaderTitle({
    children,
    status,
    hasBack,
}: {
    children: ReactNode;
    status?: ReactNode;
    hasBack: boolean;
}) {
    return (
        <div
            className={cn(
                "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 md:col-span-1 md:col-start-1 md:row-start-2 md:min-h-9",
                // A phone puts the title under the nav-bar row, or first when there is no way back.
                hasBack ? "col-span-2 row-start-2" : "col-start-1 row-start-1",
            )}
        >
            <h2
                className={cn(
                    "min-w-0 break-words text-xl font-semibold tracking-tight max-md:text-2xl max-md:font-bold",
                    uiPresetClass("pageTitle"),
                )}
            >
                {children}
            </h2>
            {status}
        </div>
    );
}

/**
 * The page's controls, right of the title on desktop; on a phone beside the
 * back link, or on their own row under the title (one row lower when an
 * eyebrow sits above it).
 */
export function PageHeaderActions({
    children,
    hasBack,
    hasEyebrow = false,
    align = "end",
}: {
    children: ReactNode;
    hasBack: boolean;
    hasEyebrow?: boolean;
    align?: "start" | "end";
}) {
    return (
        <div
            className={cn(
                "flex min-w-0 flex-wrap items-center gap-2 md:col-start-2 md:row-start-2",
                align === "end" ? "justify-end" : "justify-start",
                hasBack
                    ? "col-start-2 row-start-1"
                    : cn(
                          "col-span-2 max-md:flex-col max-md:items-stretch md:col-span-1",
                          hasEyebrow ? "row-start-3" : "row-start-2",
                      ),
            )}
        >
            {children}
        </div>
    );
}

/**
 * The sub-heading row under the title: a few facts about the record or the
 * list. On desktop it is always 16px tall, empty or not, so the tab bar under
 * the header sits at the same height on every page.
 */
export function PageHeaderSummary({ children, belowActions = false }: { children?: ReactNode; belowActions?: boolean }) {
    return (
        <div
            className={cn(
                // A phone that stacks eyebrow, title and actions puts the summary on a fourth row.
                belowActions ? "row-start-4 md:row-start-3" : "row-start-3",
                // Small print, so the 16px row a page leaves empty reads as spacing rather than a gap.
                "col-span-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground md:min-h-4",
                !children && "max-md:hidden",
            )}
        >
            {children}
        </div>
    );
}

export interface PageHeaderProps {
    /** The page's name, drawn as its `h2`. */
    title: ReactNode;
    /** Parent pages shown as a back link above the title. A top-level list leaves it out. */
    back?: PageHeaderBackItem[];
    /**
     * A short line above the title naming the section, in the back link's
     * place and type. Shown only when there is no back link.
     */
    eyebrow?: ReactNode;
    /** Sits beside the title, typically one `DetailChip`. */
    status?: ReactNode;
    /** A row of `DetailMetaItem`s, or a short line of text, under the title. */
    summary?: ReactNode;
    /** Search, filters and buttons, right of the title. */
    actions?: ReactNode;
    /**
     * `start` puts the actions straight after the title instead of at the
     * right edge, for when a collapsed floating panel covers that edge.
     */
    actionsAlign?: "start" | "end";
    className?: string;
}

/**
 * The head of a page: back link, title, actions and a summary row, in the same
 * grid `DetailHeader` uses, so a list page and a record page put each of them,
 * and the tab bar that follows, in the same place. It ends with the same 16px
 * gap a detail view leaves before its tabs.
 */
export default function PageHeader({
    title,
    back = [],
    eyebrow,
    status,
    summary,
    actions,
    actionsAlign = "end",
    className,
}: PageHeaderProps) {
    const hasBack = back.length > 0;
    const hasEyebrow = !hasBack && Boolean(eyebrow);
    return (
        <PageHeaderRoot
            // The title column stops growing, so the actions start right after it.
            className={cn(actionsAlign === "start" && "md:grid-cols-[auto_minmax(0,1fr)]", className)}
        >
            <PageHeaderBack items={back} eyebrow={eyebrow} />
            <PageHeaderTitle status={status} hasBack={hasBack || hasEyebrow}>
                {title}
            </PageHeaderTitle>
            {actions ? (
                <PageHeaderActions hasBack={hasBack} hasEyebrow={hasEyebrow} align={actionsAlign}>
                    {actions}
                </PageHeaderActions>
            ) : null}
            <PageHeaderSummary belowActions={hasEyebrow && Boolean(actions)}>{summary}</PageHeaderSummary>
        </PageHeaderRoot>
    );
}
