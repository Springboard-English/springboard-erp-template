import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';

// The side column's limits in pixels; it never takes more than half the row.
const MIN_ASIDE = 240;
const DEFAULT_ASIDE = 320;
const KEY_STEP = 16;

/** The stored side width, or the default when nothing valid is stored. */
function readStoredWidth(storageKey?: string): number {
    if (!storageKey) return DEFAULT_ASIDE;
    try {
        const stored = Number(localStorage.getItem(storageKey));
        return Number.isFinite(stored) && stored >= MIN_ASIDE ? stored : DEFAULT_ASIDE;
    } catch {
        return DEFAULT_ASIDE;
    }
}

/**
 * A main column and a side column on desktop, split by a handle that drags or
 * takes the arrow keys to resize the side. `storageKey` remembers the width per
 * browser. On a phone the two stack, main first, and the handle is gone.
 */
export default function ResizableColumns({
    children,
    aside,
    storageKey,
    className,
}: {
    children: ReactNode;
    aside: ReactNode;
    storageKey?: string;
    className?: string;
}) {
    const { t } = useI18n();
    const rootRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(() => readStoredWidth(storageKey));
    const [dragging, setDragging] = useState(false);

    // The row's half, read live so a narrower window can't leave the main column squeezed.
    const maxWidth = () => Math.max(MIN_ASIDE, (rootRef.current?.getBoundingClientRect().width ?? 2 * MIN_ASIDE) / 2);
    const clamp = (next: number) => Math.round(Math.min(maxWidth(), Math.max(MIN_ASIDE, next)));

    useEffect(() => {
        if (!storageKey || dragging) return;
        try {
            localStorage.setItem(storageKey, String(width));
        } catch {
            // Storage blocked: the width lasts until the dialog closes.
        }
    }, [storageKey, width, dragging]);

    const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        setDragging(true);
    };
    const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const root = rootRef.current;
        if (!dragging || !root) return;
        // The side column is on the right, so its width is the distance from the pointer to the row's right edge.
        setWidth(clamp(root.getBoundingClientRect().right - event.clientX));
    };
    const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
        event.currentTarget.releasePointerCapture(event.pointerId);
        setDragging(false);
    };
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const delta = event.key === 'ArrowLeft' ? KEY_STEP : event.key === 'ArrowRight' ? -KEY_STEP : 0;
        if (event.key === 'Home') setWidth(clamp(maxWidth()));
        else if (event.key === 'End') setWidth(MIN_ASIDE);
        else if (delta !== 0) setWidth((current) => clamp(current + delta));
        else return;
        event.preventDefault();
    };

    return (
        <div
            ref={rootRef}
            className={cn('flex min-h-0 flex-col gap-4 md:flex-row md:gap-0', dragging && 'select-none', className)}
            style={{ '--aside-width': `${width}px` } as CSSProperties}
        >
            <div className="min-w-0 md:min-h-0 md:flex-1 md:overflow-y-auto md:pr-4">{children}</div>
            <div
                role="separator"
                aria-orientation="vertical"
                aria-label={t('layout.resizeColumns', 'Resize columns')}
                aria-valuemin={MIN_ASIDE}
                aria-valuenow={width}
                tabIndex={0}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onKeyDown={onKeyDown}
                // A 1px line with an 11px grab area either side; hidden where the columns stack.
                className={cn(
                    'group relative hidden w-px shrink-0 cursor-col-resize bg-border outline-none md:block',
                    'before:absolute before:inset-y-0 before:-left-[5px] before:w-[11px] before:content-[""]',
                    'focus-visible:bg-ring hover:bg-ring/60',
                    dragging && 'bg-ring',
                )}
            />
            <aside className="min-w-0 md:min-h-0 md:w-[var(--aside-width)] md:shrink-0 md:overflow-y-auto md:pl-4">
                {aside}
            </aside>
        </div>
    );
}
