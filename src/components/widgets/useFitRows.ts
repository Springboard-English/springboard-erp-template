import { createContext, useContext, useLayoutEffect, useRef, useState } from "react";

/** The frame's content area and the height its minimum rows leave for content. */
export interface WidgetBody {
    node: HTMLElement;
    budget: number;
}

/** The frame's content area; null outside a frame (the gallery's previews). */
export const WidgetBodyContext = createContext<WidgetBody | null>(null);

export interface FitRowsOptions {
    /** Fit only when true; a size whose card grows with its content (M, XL) passes false. */
    enabled?: boolean;
    /** The page size before the first measurement and whenever fitting is off. Keep it small enough to fit. */
    fallback: number;
    /** The most items a page may hold, whatever fits. */
    max?: number;
}

export interface FitRows {
    /** Attach to the list whose children are the rows (a flex column or a grid). */
    ref: (element: HTMLElement | null) => void;
    /** Items per page: the rows that fit times the list's grid columns. */
    count: number;
}

// Sub-pixel rounding must not let a fitted list overflow and grow the card a row.
const FIT_SAFETY_PX = 2;

/**
 * How many items of a widget's list fit the card's minimum box: whole rows
 * from the list's first row down to where that box's content area ends, times
 * the list's grid columns. Re-measured when the list, the content area or the
 * board resizes.
 */
export function useFitRows({ enabled = true, fallback, max }: FitRowsOptions): FitRows {
    const body = useContext(WidgetBodyContext);
    const [list, setList] = useState<HTMLElement | null>(null);
    const [fit, setFit] = useState<number | null>(null);
    const pitchRef = useRef<number | null>(null);

    useLayoutEffect(() => {
        // jsdom and very old browsers have no ResizeObserver; the fallback stands.
        if (!enabled || !body || !list || typeof ResizeObserver === "undefined") {
            setFit(null);
            return;
        }
        const measure = () => {
            const items = list.children;
            const first = items[0];
            if (!first) return;
            const style = getComputedStyle(list);
            const columns = style.display.includes("grid")
                ? Math.max(1, style.gridTemplateColumns.split(" ").filter(Boolean).length)
                : 1;
            const firstBox = first.getBoundingClientRect();
            if (firstBox.height <= 0) return;
            // Row pitch from the next row, so borders and gaps count. A one-row page (often the
            // last) reuses the pitch last seen: estimating it there would change the page size,
            // re-slice the pages and flip back, over and over.
            const nextRow = items[columns];
            if (nextRow) pitchRef.current = nextRow.getBoundingClientRect().top - firstBox.top;
            const pitch = pitchRef.current ?? firstBox.height + (parseFloat(style.rowGap) || 0);
            if (pitch <= 0) return;
            // Fit to the minimum box, never the card's current height: a card that grew because
            // the list overflowed would otherwise make room for more rows, and so on.
            const room = body.node.getBoundingClientRect().top + body.budget - firstBox.bottom - FIT_SAFETY_PX;
            setFit((1 + Math.max(0, Math.floor(room / pitch))) * columns);
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(body.node);
        observer.observe(list);
        return () => observer.disconnect();
    }, [body, enabled, list]);

    const count = enabled && fit !== null ? fit : fallback;
    return { ref: setList, count: max ? Math.min(count, max) : count };
}
