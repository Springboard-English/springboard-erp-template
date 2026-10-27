import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useI18n } from "../../context/I18nContext";
import type { WidgetSize } from "./types";
import { WidgetFooter } from "./WidgetFooter";
import { useFitRows } from "./useFitRows";

/**
 * Generic insides for a widget, so an app's widget is its query plus a few
 * lines of mapping. Nothing here knows a domain.
 */

const LIST_ROWS: Record<WidgetSize, number> = { S: 1, M: 3, L: 7, XL: 12 };

export function WidgetEmpty({ message, className }: { message?: ReactNode; className?: string }) {
    const { t } = useI18n();
    return (
        <div className={cn("flex h-full min-h-16 items-center justify-center px-2 text-center text-sm text-muted-foreground", className)}>
            {message ?? t("widgets.empty")}
        </div>
    );
}

export function WidgetError({ error, onRetry }: { error?: unknown; onRetry?: () => void }) {
    const { t } = useI18n();
    const detail = error instanceof Error ? error.message : undefined;
    return (
        <div role="alert" className="flex h-full min-h-16 flex-col items-center justify-center gap-2 px-2 text-center text-sm text-muted-foreground">
            <AlertCircle aria-hidden className="size-5 text-destructive" />
            <p>{t("widgets.error")}</p>
            {detail ? <p className="line-clamp-2 text-xs">{detail}</p> : null}
            {onRetry ? (
                <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                    <RotateCw aria-hidden className="size-4" />
                    {t("widgets.retry")}
                </Button>
            ) : null}
        </div>
    );
}

export function WidgetSkeleton({ size = "M" }: { size?: WidgetSize }) {
    const rows = size === "S" ? 1 : size === "M" ? 2 : 4;
    return (
        <div aria-busy className="flex flex-col gap-2">
            {Array.from({ length: rows }, (_, index) => (
                <div key={index} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${90 - index * 12}%` }} />
            ))}
        </div>
    );
}

/** The subset of a TanStack Query result `WidgetQueryState` needs. */
export interface WidgetQueryLike<T> {
    data: T | undefined;
    isPending: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => unknown;
}

/** Loading, error-with-retry and empty states for one query, so every widget handles them alike. */
export function WidgetQueryState<T>({
    query,
    size,
    isEmpty,
    emptyMessage,
    children,
}: {
    query: WidgetQueryLike<T>;
    size: WidgetSize;
    isEmpty?: (data: T) => boolean;
    emptyMessage?: ReactNode;
    children: (data: T) => ReactNode;
}) {
    if (query.isPending) return <WidgetSkeleton size={size} />;
    if (query.isError || query.data === undefined) {
        return <WidgetError error={query.error} onRetry={() => void query.refetch()} />;
    }
    if (isEmpty?.(query.data)) return <WidgetEmpty message={emptyMessage} />;
    return <>{children(query.data)}</>;
}

/** One headline number, scaled to the widget's size. */
export function WidgetStat({
    value,
    label,
    hint,
    size,
}: {
    value: ReactNode;
    label?: ReactNode;
    hint?: ReactNode;
    size: WidgetSize;
}) {
    return (
        <div className="flex h-full flex-col justify-center">
            {label ? <p className="truncate text-sm font-medium text-muted-foreground">{label}</p> : null}
            <p className={cn("font-semibold leading-none text-foreground", size === "S" ? "mt-1 text-3xl" : "mt-2 text-4xl")}>
                {value}
            </p>
            {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
    );
}

export interface WidgetListRow {
    key: string;
    title: ReactNode;
    subtitle?: ReactNode;
    trailing?: ReactNode;
    href?: string;
    onClick?: () => void;
}

/**
 * Rows a page at a time (1 / 3 at S / M, as many as fit the card at L, 12 at
 * XL), with back and next on the card's bottom edge. `moreHref` is accepted for older callers and ignored:
 * the frame's Open arrow already links to the full page.
 */
export function WidgetList({
    rows,
    size,
    emptyMessage,
}: {
    rows: WidgetListRow[];
    size: WidgetSize;
    moreHref?: string;
    emptyMessage?: ReactNode;
}) {
    const { t } = useI18n();
    const [requested, setPage] = useState(0);
    // L has a fixed height to fill; the other sizes grow with their rows.
    const fitted = useFitRows({ enabled: size === "L", fallback: LIST_ROWS[size] });
    const perPage = fitted.count;
    if (rows.length === 0) return <WidgetEmpty message={emptyMessage} />;

    const pageCount = Math.ceil(rows.length / perPage);
    // A refresh that shrinks the list keeps a valid page.
    const page = Math.min(requested, pageCount - 1);
    const shown = rows.slice(page * perPage, (page + 1) * perPage);
    const rowClass = "flex min-h-11 w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/50";

    return (
        <div className="flex flex-col">
            <ul ref={fitted.ref} className="flex flex-col divide-y divide-border/60">
                {shown.map((row) => {
                    const body = (
                        <>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-foreground">{row.title}</span>
                                {row.subtitle ? (
                                    <span className="block truncate text-xs text-muted-foreground">{row.subtitle}</span>
                                ) : null}
                            </span>
                            {row.trailing ? <span className="shrink-0 text-sm text-muted-foreground">{row.trailing}</span> : null}
                        </>
                    );
                    return (
                        <li key={row.key}>
                            {row.href ? (
                                <Link to={row.href} className={rowClass}>{body}</Link>
                            ) : row.onClick ? (
                                <button type="button" onClick={row.onClick} className={rowClass}>{body}</button>
                            ) : (
                                <div className={cn(rowClass, "hover:bg-transparent")}>{body}</div>
                            )}
                        </li>
                    );
                })}
            </ul>
            {pageCount > 1 ? (
                <WidgetFooter>
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            type="button"
                            size="icon-sm"
                            variant="outline"
                            aria-label={t("widgets.previous")}
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft aria-hidden />
                        </Button>
                        <span className="min-w-16 text-center text-sm text-muted-foreground">
                            {t("widgets.pageOf", undefined, { page: page + 1, total: pageCount })}
                        </span>
                        <Button
                            type="button"
                            size="icon-sm"
                            variant="outline"
                            aria-label={t("widgets.next")}
                            disabled={page >= pageCount - 1}
                            onClick={() => setPage(page + 1)}
                        >
                            <ChevronRight aria-hidden />
                        </Button>
                    </div>
                </WidgetFooter>
            ) : null}
        </div>
    );
}
