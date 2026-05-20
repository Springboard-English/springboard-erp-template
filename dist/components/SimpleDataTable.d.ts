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
export default function SimpleDataTable<T>({ columns, rows, rowKey, loading, loadingMessage, emptyMessage, page, pageSize, pageSizeOptions, onPageChange, onPageSizeChange, onRowClick, paginationMode, totalRowCount, sortBy, sortOrder, onSortChange, alignPaginationToLeft, onLoadingChange, }: SimpleDataTableProps<T>): import("react/jsx-runtime").JSX.Element;
