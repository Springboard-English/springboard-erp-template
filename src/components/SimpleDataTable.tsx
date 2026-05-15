import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface SimpleDataTableColumn<T> {
  id: string;
  header: ReactNode;
  className?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
}

export type SimpleDataTableSortOrder = 'asc' | 'desc';

export interface SimpleDataTableProps<T> {
  columns: Array<SimpleDataTableColumn<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRowClick?: (row: T) => void;
  paginationMode?: 'client' | 'server';
  totalRowCount?: number;
  sortBy?: string | null;
  sortOrder?: SimpleDataTableSortOrder;
  onSortChange?: (columnId: string, nextOrder: SimpleDataTableSortOrder) => void;
  alignPaginationToLeft?: boolean;
  onLoadingChange?: (key: string, loading: boolean, message?: string) => void;
}

export default function SimpleDataTable<T>({
  columns,
  rows,
  rowKey,
  loading = false,
  loadingMessage = 'Loading...',
  emptyMessage = 'No records found.',
  page,
  pageSize,
  pageSizeOptions = [10, 25, 50],
  onPageChange,
  onPageSizeChange,
  onRowClick,
  paginationMode = 'client',
  totalRowCount,
  sortBy = null,
  sortOrder = 'asc',
  onSortChange,
  alignPaginationToLeft = false,
  onLoadingChange,
}: SimpleDataTableProps<T>) {
  const loadingKey = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState<number | null>(null);

  const usesServerPagination = paginationMode === 'server';
  const totalRows = usesServerPagination ? totalRowCount ?? rows.length : rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const startIndex = safePage * pageSize;
  const paginatedRows = usesServerPagination
    ? rows
    : rows.slice(startIndex, startIndex + pageSize);
  const endIndex = totalRows === 0 || paginatedRows.length === 0
    ? 0
    : Math.min(startIndex + paginatedRows.length, totalRows);
  const canGoPrevious = safePage > 0;
  const canGoNext = endIndex < totalRows;
  const showingResultsLabel = endIndex === 0
    ? 'No results'
    : usesServerPagination && canGoNext
      ? `Showing ${startIndex + 1}-${endIndex}`
      : `Showing ${startIndex + 1}-${endIndex} of ${totalRows}`;
  const pageLabel = usesServerPagination && canGoNext
    ? `Page ${safePage + 1}`
    : `Page ${safePage + 1} of ${totalPages}`;
  const skeletonRowCount = Math.max(3, Math.min(pageSize || 5, 8));

  useEffect(() => {
    if (!onLoadingChange) {
      return;
    }
    onLoadingChange(loadingKey, loading, loadingMessage);
    return () => {
      onLoadingChange(loadingKey, false);
    };
  }, [loading, loadingMessage, loadingKey, onLoadingChange]);

  const handleSortClick = (columnId: string) => {
    if (!onSortChange) {
      return;
    }
    const nextOrder = sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(columnId, nextOrder);
  };

  useEffect(() => {
    const updateHeights = () => {
      if (!rootRef.current) {
        return;
      }

      const viewportRoot = rootRef.current.closest('[data-detail-tab-content], [data-table-viewport]') as HTMLElement | null;
      // Only clamp height inside known fixed-height content containers.
      if (!viewportRoot) {
        setTableBodyMaxHeight(null);
        return;
      }

      const container = viewportRoot;
      if (!container) {
        return;
      }

      const rootRect = rootRef.current.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const rootTopWithinContainer = Math.max(0, rootRect.top - containerRect.top);
      const containerVisibleHeight = container.clientHeight;
      const footerHeight = footerRef.current?.offsetHeight ?? 80;
      const bottomGap = 16;

      if (containerVisibleHeight <= 0) {
        setTableBodyMaxHeight(null);
        return;
      }

      const availableHeight = containerVisibleHeight - rootTopWithinContainer - bottomGap;

      // Always allocate space for the header, footer, and at least some rows.
      // Minimum is header (60px) + footer (80px) + one row (40px) = 180px
      const minRequiredSpace = 180;
      if (availableHeight < minRequiredSpace) {
        // If there's truly no space, still clamp to avoid overflow pushing footer out of view
        const nextBodyHeight = Math.max(40, availableHeight - footerHeight - 8);
        setTableBodyMaxHeight(Math.max(0, nextBodyHeight));
        return;
      }

      const nextBodyHeight = Math.max(100, Math.floor(availableHeight - footerHeight - 8));
      setTableBodyMaxHeight(nextBodyHeight);
    };

    updateHeights();
    // Run one more frame after mount to avoid transient values when switching tabs.
    const rafId = window.requestAnimationFrame(updateHeights);
    window.addEventListener('resize', updateHeights);

    const observer = new ResizeObserver(updateHeights);
    if (rootRef.current?.parentElement) {
      observer.observe(rootRef.current.parentElement);
    }
    const viewportRoot = rootRef.current?.closest('[data-detail-tab-content], [data-table-viewport]') as HTMLElement | null;
    if (viewportRoot) {
      observer.observe(viewportRoot);
    }
    observer.observe(document.documentElement);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateHeights);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)]"
    >
      <div
        className="min-h-0 overflow-auto"
        style={tableBodyMaxHeight ? { maxHeight: `${tableBodyMaxHeight}px` } : undefined}
      >
        <Table containerClassName="overflow-x-visible">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn('sticky top-0 z-20 bg-card text-center', column.className)}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => handleSortClick(column.id)}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-1 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                    >
                      <span>{column.header}</span>
                      {sortBy === column.id ? (
                        sortOrder === 'asc'
                          ? <ChevronUp className="size-3.5" />
                          : <ChevronDown className="size-3.5" />
                      ) : (
                        <ChevronUp className="size-3.5 opacity-30" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: skeletonRowCount }).map((_, index) => (
                <TableRow key={`loading-skeleton-${index}`} className="hover:bg-transparent">
                  {columns.map((column) => (
                    <TableCell key={`${column.id}-skeleton-${index}`} className={column.cellClassName}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedRows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  className={cn(onRowClick && 'cursor-pointer')}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.cellClassName}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {loading && (
        <div className="sr-only" aria-live="polite">
          {loadingMessage}
        </div>
      )}

      <div
        ref={footerRef}
        className={cn(
          "flex-shrink-0 flex flex-col gap-3 border-t border-border/70 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center",
          alignPaginationToLeft ? "sm:justify-start" : "sm:justify-between",
        )}
      >
        <div className="text-sm text-muted-foreground">
          {showingResultsLabel}
        </div>

        <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", alignPaginationToLeft ? "sm:ml-4" : "")}>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Rows</span>
            <SearchableSelect
              value={pageSize}
              onValueChange={(value) => onPageSizeChange(Number(value))}
              options={pageSizeOptions.map((option) => ({ value: String(option), label: String(option) }))}
              className="h-9"
              searchPlaceholder="Search rows..."
            />
          </label>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(safePage - 1)}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <span className="min-w-20 text-center text-sm text-muted-foreground">
              {pageLabel}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(safePage + 1)}
              disabled={!canGoNext}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
