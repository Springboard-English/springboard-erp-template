import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useI18n } from "@/context/I18nContext";
import useIsMobile from "@/hooks/useIsMobile";

/** How close the list's bottom edge must get to the viewport before the next
 *  page is fetched. Roughly one thumb-flick of runway, so the rows are usually
 *  there by the time the reader arrives. */
const END_THRESHOLD_PX = 300;

/** Starting guess for a card's height, including the gap below it. Every card
 *  is measured for real once it mounts, so this only has to be close enough
 *  that the initial scrollbar is not wildly wrong. */
const ESTIMATED_CARD_PX = 180;

export function CardField({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 space-y-0.5", className)}>
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{value ?? "-"}</dd>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border/70 bg-card p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="h-5 w-1/2 rounded-md bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-1">
            <div className="h-2 w-12 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

export interface MobileCardListProps<T> {
  rows: T[];
  rowKey: (row: T) => string | number;
  renderCard: (row: T) => ReactNode;
  loading?: boolean;
  emptyMessage?: string;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  paginationMode?: "client" | "server";
  totalRowCount?: number;
  infiniteScroll?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onInfiniteScrollReset?: () => void;
  resetKey?: string | number;
  className?: string;
}

export default function MobileCardList<T>({
  rows,
  rowKey,
  renderCard,
  loading = false,
  emptyMessage,
  page = 0,
  pageSize = 25,
  onPageChange,
  paginationMode = "client",
  totalRowCount,
  infiniteScroll: infiniteScrollProp,
  hasMore = false,
  onLoadMore,
  onInfiniteScrollReset,
  resetKey,
  className,
}: MobileCardListProps<T>) {
  // This component only ever renders on a phone, and prev/next buttons are the
  // wrong shape there — so infinite scroll is the default and paging is the
  // opt-in, rather than the other way round. A caller that wired
  // `onPageChange` has explicitly asked for pager buttons, so it keeps them.
  const infiniteScroll = infiniteScrollProp ?? !onPageChange;

  const { t } = useI18n();
  const resolvedEmptyMessage = emptyMessage ?? t("mobileCardList.empty");
  const resolvedEndOfContentMessage = t("mobileCardList.endOfContent");
  const [accumulatedRows, setAccumulatedRows] = useState<T[]>([]);
  const accumulatedMapRef = useRef<Map<string | number, T>>(new Map());
  const rowKeyRef = useRef(rowKey);
  rowKeyRef.current = rowKey;
  const prevResetKeyRef = useRef<string | number | undefined>(resetKey);

  useEffect(() => {
    if (!infiniteScroll || !onLoadMore) {
      return;
    }

    if (resetKey !== prevResetKeyRef.current) {
      prevResetKeyRef.current = resetKey;
      const freshMap = new Map<string | number, T>();
      for (const row of rows) {
        freshMap.set(rowKeyRef.current(row), row);
      }
      accumulatedMapRef.current = freshMap;
      setAccumulatedRows([...freshMap.values()]);
      return;
    }

    let changed = false;
    for (const row of rows) {
      const key = rowKeyRef.current(row);
      if (!accumulatedMapRef.current.has(key)) {
        accumulatedMapRef.current.set(key, row);
        changed = true;
      }
    }
    if (changed) {
      setAccumulatedRows([...accumulatedMapRef.current.values()]);
    }
  }, [rows, resetKey, infiniteScroll, onLoadMore]);

  const [visibleCount, setVisibleCount] = useState(pageSize);
  const isMobileViewport = useIsMobile();
  const wasMobileViewportRef = useRef(isMobileViewport);

  useEffect(() => {
    if (!infiniteScroll || onLoadMore) {
      return;
    }
    setVisibleCount(pageSize);
  }, [resetKey, pageSize, infiniteScroll, onLoadMore]);

  useEffect(() => {
    if (!infiniteScroll || !onLoadMore || !onInfiniteScrollReset) {
      return;
    }
    const becameMobile = !wasMobileViewportRef.current && isMobileViewport;
    wasMobileViewportRef.current = isMobileViewport;
    if (!becameMobile || page <= 0) {
      return;
    }

    accumulatedMapRef.current = new Map();
    setAccumulatedRows([]);
    onInfiniteScrollReset();
  }, [
    infiniteScroll,
    isMobileViewport,
    onInfiniteScrollReset,
    onLoadMore,
    page,
  ]);

  const listRef = useRef<HTMLDivElement>(null);
  const canLoadRef = useRef(false);
  const onLoadMoreRef = useRef(onLoadMore);
  const pageRef = useRef(page);
  const loadingRef = useRef(loading);
  const lastRequestedKeyRef = useRef<string | null>(null);
  onLoadMoreRef.current = onLoadMore;
  pageRef.current = page;
  loadingRef.current = loading;

  // What "we already asked for this" is keyed on. It used to be `page` alone,
  // which quietly broke every caller that does not pass one: `page` defaults to
  // 0, so after the first load the guard compared 0 to 0 and refused every
  // request from then on — one extra page, then silence.
  //
  // Callers are free not to pass `page`; several track it themselves and just
  // hand back the next slice of `rows`. The accumulated row count is the honest
  // signal because it is what changes when a load actually lands, and `page`
  // stays in the key for the callers that do pass it.
  const loadKeyRef = useRef("");
  loadKeyRef.current = `${page}:${accumulatedRows.length}`;

  if (infiniteScroll) {
    canLoadRef.current = onLoadMore
      ? hasMore
      : !loading && visibleCount < rows.length;
  }

  const maybeLoadMore = () => {
    if (!onLoadMoreRef.current) {
      return;
    }
    if (!canLoadRef.current || loadingRef.current) {
      return;
    }
    if (lastRequestedKeyRef.current === loadKeyRef.current) {
      return;
    }

    lastRequestedKeyRef.current = loadKeyRef.current;
    onLoadMoreRef.current();
  };

  // One scroll-driven trigger, where there used to be an IntersectionObserver
  // *and* a scroll listener both watching a sentinel element. The list's own
  // bottom edge is what actually matters, so it is measured directly and no
  // marker node is rendered at all.
  const requestLoadIfAtEnd = () => {
    const list = listRef.current;
    if (!list || !canLoadRef.current || loadingRef.current) {
      return;
    }
    if (
      list.getBoundingClientRect().bottom - window.innerHeight >
      END_THRESHOLD_PX
    ) {
      return;
    }
    if (onLoadMoreRef.current) {
      maybeLoadMore();
      return;
    }
    setVisibleCount((previousCount) => previousCount + pageSize);
  };

  const requestLoadIfAtEndRef = useRef(requestLoadIfAtEnd);
  requestLoadIfAtEndRef.current = requestLoadIfAtEnd;

  // Coalesced to one measurement per frame. Scroll fires far more often than
  // that and every call here reads layout, which is the part worth rationing.
  // The "already queued" flag is deliberately separate from the frame id: the
  // id is only assigned once requestAnimationFrame returns, which is after the
  // callback has run if the frame resolves synchronously, and a flag written in
  // that order would latch on and wedge the list forever.
  const scheduledRef = useRef(false);
  const frameRef = useRef(0);
  const scheduleCheck = useCallback(() => {
    if (scheduledRef.current) {
      return;
    }
    scheduledRef.current = true;
    frameRef.current = requestAnimationFrame(() => {
      scheduledRef.current = false;
      requestLoadIfAtEndRef.current();
    });
  }, []);

  useEffect(() => {
    if (!infiniteScroll) {
      return;
    }

    // `capture: true` because scroll events do not bubble, and on several
    // screens the list scrolls inside a <main> rather than the document.
    // Capture sees those without having to hunt for the scroll container.
    window.addEventListener("scroll", scheduleCheck, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", scheduleCheck, { passive: true });
    scheduleCheck();

    return () => {
      window.removeEventListener("scroll", scheduleCheck, { capture: true });
      window.removeEventListener("resize", scheduleCheck);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      scheduledRef.current = false;
    };
  }, [infiniteScroll, scheduleCheck]);

  // Re-check whenever what is on screen changes: a page that does not fill the
  // viewport has to pull the next one without the user scrolling at all.
  useEffect(() => {
    if (!infiniteScroll) {
      return;
    }
    scheduleCheck();
  }, [
    infiniteScroll,
    scheduleCheck,
    rows,
    accumulatedRows.length,
    visibleCount,
    loading,
    hasMore,
    page,
  ]);

  const displayRowsForInfinite = onLoadMore
    ? accumulatedRows
    : rows.slice(0, visibleCount);
  const total =
    paginationMode === "server" ? (totalRowCount ?? rows.length) : rows.length;
  const hasPrev = page > 0;
  const hasNext = (page + 1) * pageSize < total;
  const showPagination = !infiniteScroll && (hasPrev || hasNext);
  const standardDisplayRows =
    paginationMode === "client"
      ? rows.slice(page * pageSize, (page + 1) * pageSize)
      : rows;
  const activeRows = infiniteScroll ? displayRowsForInfinite : standardDisplayRows;
  const showEndOfContent =
    infiniteScroll &&
    !loading &&
    activeRows.length > 0 &&
    (onLoadMore ? !hasMore : visibleCount >= rows.length);

  // Virtualised, so a long list costs a bounded number of DOM nodes instead of
  // one card per row — accumulating 500 rows used to mean 500 mounted cards.
  //
  // The window variant is the right one here: these views scroll the document,
  // not an inner pane. That was checked rather than assumed — the list screens
  // have no scrollable ancestor once the desktop-only height clamp is gated to
  // `md`, which it now is.
  const [scrollMargin, setScrollMargin] = useState(0);
  const hasRows = activeRows.length > 0;

  useLayoutEffect(() => {
    const node = listRef.current;
    if (!node) {
      return;
    }
    // Where the list starts in the document — the virtualizer works in page
    // coordinates, so it needs the offset of the list itself.
    const measure = () =>
      setScrollMargin(node.getBoundingClientRect().top + window.scrollY);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [hasRows, isMobileViewport]);

  const virtualizer = useWindowVirtualizer({
    count: activeRows.length,
    estimateSize: () => ESTIMATED_CARD_PX,
    overscan: 6,
    scrollMargin,
    getItemKey: (index) => rowKey(activeRows[index]),
  });

  // `md:hidden` alone only *hides* the list on desktop — it still mounts, and
  // with it the scroll listener and the accumulated-row state. Gate the render
  // too. This is the LMS's local wrapper, adopted upstream; it must stay below
  // every hook so the hook order is stable across the breakpoint.
  if (!isMobileViewport) {
    return null;
  }

  if (loading && activeRows.length === 0) {
    return (
      <div className={cn("space-y-3 md:hidden", className)}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!loading && activeRows.length === 0) {
    return (
      <div className={cn("md:hidden", className)}>
        <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            {resolvedEmptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div ref={listRef} className={cn("md:hidden", className)}>
      {/* The spacer carries the full height of every row, measured or
          estimated, so the scrollbar and the load-more trigger both see the
          real end of the list even though only a window of cards is mounted. */}
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            // `pb-3` replaces the old `space-y-3`: absolutely positioned items
            // have no margin collapsing to space them, and keeping the gap
            // inside the measured element keeps the maths honest.
            className="absolute left-0 top-0 w-full pb-3"
            style={{ transform: `translateY(${item.start - scrollMargin}px)` }}
          >
            {renderCard(activeRows[item.index])}
          </div>
        ))}
      </div>

      {infiniteScroll ? (
        <>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : null}
          {showEndOfContent ? (
            <div className="py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {resolvedEndOfContentMessage}
            </div>
          ) : null}
        </>
      ) : null}

      {showPagination ? (
        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={() => onPageChange?.(page - 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
            Previous
          </button>
          <span className="text-sm text-muted-foreground">Page {page + 1}</span>
          <button
            type="button"
            disabled={!hasNext}
            onClick={() => onPageChange?.(page + 1)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
