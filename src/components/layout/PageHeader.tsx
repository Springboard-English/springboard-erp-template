import { createContext, useContext, type ReactNode } from "react";
import { ArrowLeft, ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { touchHitArea } from "@/lib/touchTarget";

/** One step of a page's back trail; items with an `onClick` are links. */
export interface PageHeaderBackItem {
    label: string;
    onClick?: () => void;
}

// Every page head is the same grid, so a list page and a detail page put the
// back link, title, actions, summary and the tab bar under them in one place.
// Desktop rows: back link (always 20px, empty on a list), title with the
// actions on its right, summary (always 20px). Phone: the back link and the
// actions share a nav-bar row above a large title.
const ROOT_CLASS =
    "mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 md:grid-cols-[minmax(min-content,1fr)_minmax(0,auto)] md:gap-x-4";

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
 * The back trail above the title, "← Parent / Child". On a phone only the
 * nearest parent shows, as a full-height "‹ Parent" tap target. With no items
 * the row stays on desktop as empty space, so the title never moves.
 */
export function PageHeaderBack({ items }: { items: PageHeaderBackItem[] }) {
    const lastIndex = items.length - 1;
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

/** The page's `h2` with its status chip beside it, on the second desktop row; 36px tall so it lines up with the actions. */
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
            <h2 className="min-w-0 break-words text-xl font-semibold tracking-tight max-md:text-2xl max-md:font-bold">
                {children}
            </h2>
            {status}
        </div>
    );
}

/** The page's controls, right of the title on desktop; on a phone beside the back link, or on their own row under the title. */
export function PageHeaderActions({
    children,
    hasBack,
    align = "end",
}: {
    children: ReactNode;
    hasBack: boolean;
    align?: "start" | "end";
}) {
    return (
        <div
            className={cn(
                "flex min-w-0 flex-wrap items-center gap-2 md:col-start-2 md:row-start-2",
                align === "end" ? "justify-end" : "justify-start",
                hasBack ? "col-start-2 row-start-1" : "col-span-2 row-start-2 max-md:flex-col max-md:items-stretch md:col-span-1",
            )}
        >
            {children}
        </div>
    );
}

/**
 * The sub-heading row under the title: a few facts about the record or the
 * list. On desktop it is always 20px tall, empty or not, so the tab bar under
 * the header sits at the same height on every page.
 */
export function PageHeaderSummary({ children }: { children?: ReactNode }) {
    return (
        <div
            className={cn(
                "col-span-2 row-start-3 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground md:min-h-5",
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
    status,
    summary,
    actions,
    actionsAlign = "end",
    className,
}: PageHeaderProps) {
    const hasBack = back.length > 0;
    return (
        <PageHeaderRoot
            // The title column stops growing, so the actions start right after it.
            className={cn(actionsAlign === "start" && "md:grid-cols-[auto_minmax(0,1fr)]", className)}
        >
            <PageHeaderBack items={back} />
            <PageHeaderTitle status={status} hasBack={hasBack}>
                {title}
            </PageHeaderTitle>
            {actions ? (
                <PageHeaderActions hasBack={hasBack} align={actionsAlign}>
                    {actions}
                </PageHeaderActions>
            ) : null}
            <PageHeaderSummary>{summary}</PageHeaderSummary>
        </PageHeaderRoot>
    );
}
