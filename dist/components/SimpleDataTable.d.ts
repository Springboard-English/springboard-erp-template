import { type ReactNode } from 'react';
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
     * is better cramped than absent: some views still have no mobile surface at
     * all, and blanking them would be worse than the squeeze.
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
}
export default function SimpleDataTable<T>({ columns, rows, rowKey, desktopOnly, className, classNames, loading, loadingMessage, emptyMessage, page, pageSize, pageSizeOptions, onPageChange, onPageSizeChange, onRowClick, paginationMode, totalRowCount, sortBy, sortOrder, onSortChange, alignPaginationToLeft, onLoadingChange, hoveredRow, onHoveredRowChange, }: SimpleDataTableProps<T>): import("react/jsx-runtime").JSX.Element | null;
