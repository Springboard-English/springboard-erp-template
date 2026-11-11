import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { touchTargetHeight } from "@/lib/touchTarget";

// Polaris Card surface: white, 12px radius (border-radius-300), a 1px hairline
// and shadow-100's bottom bevel. Exported so a table can wear the same surface
// instead of being wrapped in a second box.
export const RESOURCE_CARD_SURFACE =
    "rounded-xl border border-border bg-card shadow-[0_1px_0_0_rgba(26,26,26,0.07)]";

// On a phone Polaris cards run edge to edge (`roundedAbove="sm"`); the shell's
// 16px gutter is undone so a stack of cards reads as one sheet, not boxes.
const PHONE_FLUSH = "max-md:-mx-4 max-md:rounded-none max-md:border-x-0";

/**
 * Polaris Layout for a record's Details: a primary column of cards (two thirds)
 * beside a secondary column of summary cards (one third). The split is a
 * container query, so the floating panel and a phone both stack the secondary
 * column under the primary one.
 */
export function ResourceLayout({
    primary,
    secondary,
    className,
}: {
    primary: ReactNode;
    secondary?: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("@container", className)}>
            <div className="grid items-start gap-4 @3xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="flex min-w-0 flex-col gap-4">{primary}</div>
                {secondary ? <div className="flex min-w-0 flex-col gap-4">{secondary}</div> : null}
            </div>
        </div>
    );
}

/**
 * Polaris Card: one heading (headingSm, 14px semibold) naming the group, an
 * optional action in the top-right corner, and the body at space-400 padding.
 * Cards never nest; group fields inside with `FormLayout`.
 */
export function ResourceCard({
    title,
    action,
    children,
    className,
    flushOnPhone = true,
}: {
    title?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    flushOnPhone?: boolean;
}) {
    return (
        <section className={cn(RESOURCE_CARD_SURFACE, flushOnPhone && PHONE_FLUSH, "p-4", className)}>
            {title || action ? (
                <header className="mb-3 flex min-h-6 items-center justify-between gap-3">
                    {title ? <h3 className="text-sm font-semibold text-foreground">{title}</h3> : <span />}
                    {action}
                </header>
            ) : null}
            {children}
        </section>
    );
}

/** Polaris FormLayout: fields stacked at the standard 16px gap. */
export function FormLayout({ children }: { children: ReactNode }) {
    return <div className="flex flex-col gap-4">{children}</div>;
}

/**
 * Polaris FormLayout.Group: short fields side by side. Each item keeps
 * Polaris's 220px minimum, so the row wraps to a stack when a card is narrow.
 */
export function FormLayoutGroup({ children }: { children: ReactNode }) {
    return <div className="flex flex-wrap gap-4 *:min-w-[13.75rem] *:flex-1">{children}</div>;
}

/**
 * One labelled field: the label above the control (Polaris Labelled) and an
 * optional help line under it. `htmlFor` ties a plain label to its input; a
 * label that is itself a link (a record chevron) is drawn as text instead.
 */
export function FormField({
    label,
    htmlFor,
    helpText,
    children,
}: {
    label: ReactNode;
    htmlFor?: string;
    helpText?: ReactNode;
    children: ReactNode;
}) {
    // One fixed label height, so a label carrying a record chevron lines up with a plain one beside it.
    // Regular weight: only the card heading is semibold, as in Polaris (headingSm over a bodyMd label).
    const labelClass = "mb-1 flex h-6 items-center text-sm text-foreground";
    return (
        <div className="min-w-0">
            {htmlFor ? (
                <label htmlFor={htmlFor} className={labelClass}>
                    {label}
                </label>
            ) : (
                <div className={labelClass}>{label}</div>
            )}
            {children}
            {helpText ? <p className="mt-1 text-xs text-muted-foreground">{helpText}</p> : null}
        </div>
    );
}

/**
 * A read-only fact in a summary card: label left, value right, an optional
 * line under it (a progress bar). With `onOpen` the whole row is a button with
 * a chevron, like a Polaris ResourceItem, leading to the section behind it.
 */
export function SummaryRow({
    label,
    value,
    onOpen,
    children,
}: {
    label: ReactNode;
    value: ReactNode;
    onOpen?: () => void;
    children?: ReactNode;
}) {
    const body = (
        <>
            <span className="flex w-full items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="flex items-center gap-1 font-medium tabular-nums text-foreground">
                    {value}
                    {onOpen ? <ChevronRight aria-hidden className="size-4 text-muted-foreground" /> : null}
                </span>
            </span>
            {children}
        </>
    );
    // Rows share hairlines rather than boxes; the -mx/px pair lets the hover fill reach the card edge.
    const rowClass = "-mx-4 flex flex-col gap-2 border-b border-border px-4 py-2.5 first:-mt-1 last:-mb-1 last:border-b-0";
    return onOpen ? (
        <button
            type="button"
            onClick={onOpen}
            // A button shrinks to its content, so it is stretched across the -mx-4 bleed explicitly.
            className={cn(rowClass, touchTargetHeight, "w-[calc(100%+2rem)] cursor-pointer text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}
        >
            {body}
        </button>
    ) : (
        <div className={rowClass}>{body}</div>
    );
}

/**
 * Polaris ProgressBar in its primary (near-black) tone: brand colour stays for
 * the page's main action. Past 100% it turns destructive.
 */
export function ProgressBar({ percent, label }: { percent: number; label: string }) {
    const safe = Number.isFinite(percent) ? Math.max(0, percent) : 0;
    return (
        <span
            role="progressbar"
            aria-label={label}
            aria-valuenow={Math.round(safe)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="block h-1.5 w-full overflow-hidden rounded-full bg-muted"
        >
            <span
                className={cn("block h-full rounded-full", safe > 100 ? "bg-destructive" : "bg-foreground/75")}
                style={{ width: `${Math.min(100, safe)}%` }}
            />
        </span>
    );
}
