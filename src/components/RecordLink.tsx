import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { useI18n } from "@/context/I18nContext";
import { cn } from "@/lib/utils";
import { touchHitArea } from "@/lib/touchTarget";

/** Where a record chevron goes: an in-app route, another app's URL, or a handler. */
export interface RecordLinkTarget {
    /** An in-app route, opened with the router. */
    to?: string | null;
    /** An absolute URL in another app, opened in a new tab. */
    href?: string | null;
    /** A handler, for targets that need more than a URL (router state, a filter preset). */
    onOpen?: (() => void) | null;
}

export interface RecordChevronProps extends RecordLinkTarget {
    /** Names the record for screen readers, as "Open <name>". */
    name: string;
    className?: string;
}

// The one look for every record chevron, in table cells and in details-form
// labels alike: a 24px ghost square that tints on hover, with a 44px tap area
// on touch that does not move the layout.
const chevronClassName =
    "relative inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring dark:hover:bg-accent/50";

// Rows and cards are often clickable themselves; the chevron opens its own
// record, so the click must not also open the row.
function stopRowClick(event: MouseEvent) {
    event.stopPropagation();
}

/** True when a target has somewhere to go. */
export function hasRecordLinkTarget(target: RecordLinkTarget): boolean {
    return Boolean(target.to?.trim() || target.href?.trim() || target.onOpen);
}

/**
 * The chevron that opens a related record (a class, a student, a mentor's
 * sessions). An in-app `to` renders a router link, an `href` a new-tab link to
 * another app, and `onOpen` a button. Renders nothing without a target.
 */
export function RecordChevron({ name, to, href, onOpen, className }: RecordChevronProps) {
    const { t } = useI18n();
    const label = t("recordLink.open", "Open {name}", { name });
    const classes = cn(chevronClassName, touchHitArea, className);
    const icon = <ChevronRight className="size-4" aria-hidden="true" />;

    if (to?.trim()) {
        return (
            <Link to={to} aria-label={label} title={label} className={classes} onClick={stopRowClick}>
                {icon}
            </Link>
        );
    }
    if (href?.trim()) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className={classes}
                onClick={stopRowClick}
            >
                {icon}
            </a>
        );
    }
    if (onOpen) {
        return (
            <button
                type="button"
                aria-label={label}
                title={label}
                className={classes}
                onClick={(event) => {
                    stopRowClick(event);
                    onOpen();
                }}
            >
                {icon}
            </button>
        );
    }
    return null;
}

export interface RecordLinkProps extends RecordLinkTarget {
    /** The text shown: a record's name in a cell, or a field's label in a details form. */
    label: ReactNode;
    /** The record's name for the chevron's accessible label; defaults to `label` when it is a string. */
    name?: string;
    /** Shown instead of an empty label. */
    fallback?: ReactNode;
    className?: string;
}

/**
 * A name or field label followed by the chevron that opens the related record.
 * The same component serves data-table cells and details-form labels, so the
 * chevron always sits right after the text and looks the same everywhere. The
 * text truncates; without a target only the text renders.
 */
export function RecordLink({ label, name, fallback = "-", to, href, onOpen, className }: RecordLinkProps) {
    const isEmpty = label === null || label === undefined || label === "";
    const text = isEmpty ? fallback : label;
    const accessibleName = name ?? (typeof label === "string" ? label : "");
    const target = { to, href, onOpen };
    const showChevron = !isEmpty && hasRecordLinkTarget(target);

    return (
        <span className={cn("inline-flex max-w-full min-w-0 items-center gap-1 align-middle", className)}>
            <span className="min-w-0 truncate">{text}</span>
            {showChevron ? <RecordChevron name={accessibleName} {...target} /> : null}
        </span>
    );
}
