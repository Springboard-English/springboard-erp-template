import { type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { useI18n } from "@/context/I18nContext";

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
  infiniteScroll = false,
  hasMore = false,
  onLoadMore,
  onInfiniteScrollReset,
  resetKey,
  className,
}: MobileCardListProps<T>) {
  const { t } = useI18n();
  const resolvedEmptyMessage = emptyMessage ?? t("mobileCardList.empty");
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
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
  );
  const wasMobileViewportRef = useRef(isMobileViewport);

  useEffect(() => {
    if (!infiniteScroll || onLoadMore) {
      return;
    }
    setVisibleCount(pageSize);
  }, [resetKey, pageSize, infiniteScroll, onLoadMore]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
    };

    setIsMobileViewport(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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

  const sentinelRef = useRef<HTMLDivElement>(null);
  const canLoadRef = useRef(false);
  const onLoadMoreRef = useRef(onLoadMore);
  const isIntersectingRef = useRef(false);
  const pageRef = useRef(page);
  const loadingRef = useRef(loading);
  const lastRequestedPageRef = useRef<number | null>(null);
  onLoadMoreRef.current = onLoadMore;
  pageRef.current = page;
  loadingRef.current = loading;

  if (infiniteScroll) {
    canLoadRef.current = onLoadMore
      ? hasMore
      : !loading && visibleCount < rows.length;
  }

  const maybeLoadMore = () => {
    if (!onLoadMoreRef.current) {
      return;
    }
    if (!isIntersectingRef.current || !canLoadRef.current || loadingRef.current) {
      return;
    }
    if (lastRequestedPageRef.current === pageRef.current) {
      return;
    }

    lastRequestedPageRef.current = pageRef.current;
    onLoadMoreRef.current();
  };

  useEffect(() => {
    if (!infiniteScroll) {
      return;
    }
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (!entry.isIntersecting || !canLoadRef.current) {
          return;
        }
        if (onLoadMoreRef.current) {
          maybeLoadMore();
          return;
        }
        setVisibleCount((previousCount) => previousCount + pageSize);
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [infiniteScroll, pageSize]);

  useEffect(() => {
    if (!infiniteScroll || !onLoadMoreRef.current) {
      return;
    }
    maybeLoadMore();
  }, [hasMore, infiniteScroll, loading, page]);

  useEffect(() => {
    if (!infiniteScroll || !onLoadMore) {
      return;
    }

    const handleScroll = () => {
      const sentinel = sentinelRef.current;
      if (!sentinel) {
        return;
      }
      const { top } = sentinel.getBoundingClientRect();
      if (top - window.innerHeight <= 300) {
        isIntersectingRef.current = true;
        maybeLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [infiniteScroll, onLoadMore, page, hasMore, loading]);

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
    <div className={cn("space-y-3 md:hidden", className)}>
      {activeRows.map((row) => (
        <div key={rowKey(row)}>{renderCard(row)}</div>
      ))}

      {infiniteScroll ? (
        <>
          <div ref={sentinelRef} aria-hidden="true" />
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
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
