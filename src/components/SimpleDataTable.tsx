import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { pageSelectionState, togglePageSelection, toggleRowSelection } from '@/lib/rowSelection';
// Relative: this type reaches the published .d.ts, where `@/` does not resolve.
import type { RowSelection } from '../lib/rowSelection';
import { SearchableSelect } from '@/components/ui/searchable-select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { touchTargetHeight } from '@/lib/touchTarget';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

export interface SimpleDataTableColumn<T> {
  id: string;
  header: ReactNode;
  className?: string;
  cellClassName?: string;
  render: (row: T) => ReactNode;
  sortable?: boolean;
}

export type SimpleDataTableSortOrder = 'asc' | 'desc';

export interface SimpleDataTableClassNames {
  /** Outer container (border, radius, background, shadow). */
  root?: string;
  /** Scrollable table viewport. */
  scroll?: string;
  /** Header row. */
  headRow?: string;
  /** Each header cell (merged after per-column className). */
  headCell?: string;
  /** The sortable header button. */
  sortButton?: string;
  /** Each body row (merged after per-row state classes). */
  row?: string;
  /** Each body cell (merged after per-column cellClassName). */
  cell?: string;
  /** The empty-state cell. */
  emptyCell?: string;
  /** Footer / pagination bar. */
  footer?: string;
  /** "Showing x–y of z" label. */
  showingLabel?: string;
}

export interface SimpleDataTableProps<T> {
  columns: Array<SimpleDataTableColumn<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  /**
   * Set this when the view pairs the table with a `MobileCardList`.
   *
   * `hidden md:block` on a wrapper only *hides* the table on a phone — it stays
   * mounted, with every row component, its effects and its measurements alive
   * behind the card list that replaced it. This unmounts it instead.
   *
   * Opt-in rather than the default, because a table with no card list beside it
   * is better cramped than absent: a view with no mobile surface would be left
   * blank, which is worse than the squeeze.
   */
  desktopOnly?: boolean;
  /** Convenience alias for `classNames.root`. */
  className?: string;
  /** Granular restyling slots for the table chrome. */
  classNames?: SimpleDataTableClassNames;
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
  hoveredRow?: T | null;
  onHoveredRowChange?: (row: T | null) => void;
  /**
   * Adds a tick-box column, with a header box for the rows on this page.
   * Kept by `rowKey`, so ticks survive paging. Row clicks still go to
   * `onRowClick`; with no `onRowClick` a row click toggles its tick.
   */
  selection?: RowSelection<T>;
}

/**
 * The suite's desktop table: sortable headers, client or server paging, a
 * loading skeleton, an empty state and, with `selection`, a tick-box column.
 * Pair it with a `MobileCardList` and set `desktopOnly`.
 */
export default function SimpleDataTable<T>({
  columns,
  rows,
  rowKey,
  desktopOnly = false,
  className,
  classNames,
  loading = false,
  loadingMessage,
  emptyMessage,
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
  hoveredRow = null,
  onHoveredRowChange,
  selection,
}: SimpleDataTableProps<T>) {
  const isMobileViewport = useIsMobile();
  const { t } = useI18n();
  const resolvedLoadingMessage = loadingMessage ?? t('simpleDataTable.loading');
  const resolvedEmptyMessage = emptyMessage ?? t('simpleDataTable.empty');
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
    ? t('simpleDataTable.noResults')
    : usesServerPagination && canGoNext
      ? t('simpleDataTable.showingRangePartial', undefined, { start: startIndex + 1, end: endIndex })
      : t('simpleDataTable.showingRange', undefined, { start: startIndex + 1, end: endIndex, total: totalRows });
  const pageLabel = usesServerPagination && canGoNext
    ? t('simpleDataTable.pagePartial', undefined, { page: safePage + 1 })
    : t('simpleDataTable.page', undefined, { page: safePage + 1, totalPages });
  const skeletonRowCount = Math.max(3, Math.min(pageSize || 5, 8));

  useEffect(() => {
    if (!onLoadingChange) {
      return;
    }
    onLoadingChange(loadingKey, loading, resolvedLoadingMessage);
    return () => {
      onLoadingChange(loadingKey, false);
    };
  }, [loading, resolvedLoadingMessage, loadingKey, onLoadingChange]);

  const handleSortClick = (columnId: string) => {
    if (!onSortChange) {
      return;
    }
    const nextOrder = sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(columnId, nextOrder);
  };

  const hoveredRowKey = hoveredRow ? rowKey(hoveredRow) : null;

  const selectedKeys = useMemo(
    () => new Set((selection?.selected ?? []).map(rowKey)),
    [selection?.selected, rowKey],
  );
  const canSelectRow = (row: T) =>
    Boolean(selection) && !selection?.disabled && (selection?.isSelectable?.(row) ?? true);
  const toggleRow = (row: T) => {
    if (!selection || !canSelectRow(row)) return;
    selection.onChange(toggleRowSelection(selection.selected, row, rowKey));
  };
  const pageState = selection
    ? pageSelectionState(selection.selected, paginatedRows, rowKey, selection.isSelectable)
    : null;

  // Prepended as an ordinary column, so the skeleton, empty state and preset
  // styling all count it without a special case.
  const selectionColumn: SimpleDataTableColumn<T> | null = selection
    ? {
        id: '__select',
        className: 'w-12',
        cellClassName: 'w-12',
        header: (
          // `flex`, not `inline-flex`: inline, the box sits on the text baseline,
          // which moves when the tick draws, and the row height moves with it.
          <span className="flex items-center justify-center" title={selection.disabled ? selection.disabledReason : undefined}>
            <Checkbox
              aria-label={t('rowSelection.selectPage')}
              checked={pageState?.checked ?? false}
              disabled={selection.disabled || !pageState || pageState.selectableCount === 0}
              onCheckedChange={() =>
                selection.onChange(
                  togglePageSelection(selection.selected, paginatedRows, rowKey, selection.isSelectable),
                )
              }
            />
          </span>
        ),
        render: (row) => (
          <span
            className="flex items-center justify-center"
            title={selection.disabled ? selection.disabledReason : undefined}
            // The tick is its own control; it must not also open the row.
            onClick={(event) => event.stopPropagation()}
          >
            <Checkbox
              aria-label={t('rowSelection.selectRow')}
              checked={selectedKeys.has(rowKey(row))}
              disabled={!canSelectRow(row)}
              onCheckedChange={() => toggleRow(row)}
            />
          </span>
        ),
      }
    : null;
  const tableColumns = selectionColumn ? [selectionColumn, ...columns] : columns;
  const handleRowClick = onRowClick ?? (selection ? toggleRow : undefined);

  const renderTableRow = (row: T) => (
    <TableRow
      key={rowKey(row)}
      data-state={selection && selectedKeys.has(rowKey(row)) ? 'selected' : undefined}
      className={cn(
        'odd:bg-transparent even:bg-muted/20',
        handleRowClick && 'cursor-pointer',
        hoveredRowKey === rowKey(row) && 'bg-muted/35',
        classNames?.row,
      )}
      onClick={handleRowClick ? () => handleRowClick(row) : undefined}
      onMouseEnter={onHoveredRowChange ? () => onHoveredRowChange(row) : undefined}
      onFocus={onHoveredRowChange ? () => onHoveredRowChange(row) : undefined}
    >
      {tableColumns.map((column) => (
        <TableCell key={column.id} className={cn(column.cellClassName, classNames?.cell)}>
          {column.render(row)}
        </TableCell>
      ))}
    </TableRow>
  );

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
      // Measured whenever the ref is attached; the literal is only the
      // first-paint fallback, sized for the footer's 36px `size="sm"` buttons.
      const footerHeight = footerRef.current?.offsetHeight ?? 88;
      const bottomGap = 16;

      if (containerVisibleHeight <= 0) {
        setTableBodyMaxHeight(null);
        return;
      }

      const availableHeight = containerVisibleHeight - rootTopWithinContainer - bottomGap;

      // Always allocate space for the header, footer, and at least some rows.
      // Minimum is header (64px) + footer (88px) + one row (48px) = 200px.
      // A row carrying a 44px icon button is 48px; less clamps it in half.
      const minRequiredSpace = 200;
      if (availableHeight < minRequiredSpace) {
        // If there's truly no space, still clamp to avoid overflow pushing footer out of view
        const nextBodyHeight = Math.max(48, availableHeight - footerHeight - 8);
        setTableBodyMaxHeight(Math.max(0, nextBodyHeight));
        return;
      }

      const nextBodyHeight = Math.max(120, Math.floor(availableHeight - footerHeight - 8));
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

  // Below every hook, so the hook order stays stable across the breakpoint.
  if (desktopOnly && isMobileViewport) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-md",
        className,
        classNames?.root,
      )}
    >
      <div
        className={cn("min-h-0 overflow-auto", classNames?.scroll)}
        style={tableBodyMaxHeight ? { maxHeight: `${tableBodyMaxHeight}px` } : undefined}
      >
        <Table containerClassName="overflow-x-visible">
          <TableHeader>
            <TableRow className={cn("hover:bg-transparent", classNames?.headRow)}>
              {tableColumns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn('sticky top-0 z-[1] bg-card text-center', column.className, classNames?.headCell)}
                >
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => handleSortClick(column.id)}
                      className={cn(touchTargetHeight, "inline-flex w-full cursor-pointer items-center justify-center gap-1 whitespace-nowrap text-center text-sm font-medium text-muted-foreground", classNames?.sortButton)}
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
                  {tableColumns.map((column) => (
                    <TableCell key={`${column.id}-skeleton-${index}`} className={column.cellClassName}>
                      <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedRows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={tableColumns.length}
                  className={cn("py-10 text-center text-sm text-muted-foreground", classNames?.emptyCell)}
                >
                  {resolvedEmptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row) => renderTableRow(row))
            )}
          </TableBody>
        </Table>
      </div>

      {loading && (
        <div className="sr-only" aria-live="polite">
          {resolvedLoadingMessage}
        </div>
      )}

      <div
        ref={footerRef}
        className={cn(
          "flex-shrink-0 flex flex-col gap-3 border-t border-border/70 bg-card px-4 py-3 sm:flex-row sm:items-center",
          alignPaginationToLeft ? "sm:justify-start" : "sm:justify-between",
          classNames?.footer,
        )}
      >
        <div className={cn("text-sm text-muted-foreground", classNames?.showingLabel)}>
          {showingResultsLabel}
        </div>

        <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", alignPaginationToLeft ? "sm:ml-4" : "")}>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t('simpleDataTable.rows')}</span>
            <SearchableSelect
              value={pageSize}
              onValueChange={(value) => onPageSizeChange(Number(value))}
              options={pageSizeOptions.map((option) => ({ value: String(option), label: String(option) }))}
              // Dense in the footer on desktop; the primitive's 44px stands on
              // touch. A bare `h-9` here would pin it to 36px on a phone too.
              className="md:h-9"
              searchPlaceholder={t('simpleDataTable.searchRows')}
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
              {t('simpleDataTable.previous')}
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
              {t('simpleDataTable.next')}
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
