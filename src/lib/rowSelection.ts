// Pure row-selection logic shared by `SimpleDataTable` and `MobileCardList`.
// Selection is a list of rows owned by the caller and compared by `rowKey`, so
// it survives paging, refetches and the switch between table and cards.

/**
 * Row selection a caller hands to `SimpleDataTable` or `MobileCardList`. The
 * caller owns `selected`; the components only report the next list through
 * `onChange`. `isSelectable` greys out single rows; `disabled` greys out every
 * checkbox and `disabledReason` says why.
 */
export interface RowSelection<T> {
  selected: T[];
  onChange: (rows: T[]) => void;
  isSelectable?: (row: T) => boolean;
  disabled?: boolean;
  disabledReason?: string;
}

/** The header checkbox's value: ticked, empty, or Radix's `"indeterminate"`. */
export type RowSelectionCheckedState = boolean | "indeterminate";

/** What the header checkbox for one page shows, and whether it can be pressed. */
export interface PageSelectionState {
  checked: RowSelectionCheckedState;
  /** Rows on the page that can be selected. */
  selectableCount: number;
  /** Selectable rows on the page that are selected now. */
  selectedCount: number;
}

/** True when `row` is in `selected`, compared by `rowKey`. */
export function isRowSelected<T>(
  selected: readonly T[],
  row: T,
  rowKey: (row: T) => string | number,
): boolean {
  const key = rowKey(row);
  return selected.some((item) => rowKey(item) === key);
}

/** Adds `row` to the selection, or removes it when it is already there. Order is kept. */
export function toggleRowSelection<T>(
  selected: readonly T[],
  row: T,
  rowKey: (row: T) => string | number,
): T[] {
  const key = rowKey(row);
  return isRowSelected(selected, row, rowKey)
    ? selected.filter((item) => rowKey(item) !== key)
    : [...selected, row];
}

/**
 * The header checkbox state for the rows on screen. Only selectable rows
 * count: a page whose every selectable row is ticked reads as checked even if
 * some rows cannot be ticked at all.
 */
export function pageSelectionState<T>(
  selected: readonly T[],
  pageRows: readonly T[],
  rowKey: (row: T) => string | number,
  isSelectable?: (row: T) => boolean,
): PageSelectionState {
  const selectedKeys = new Set(selected.map(rowKey));
  const selectable = isSelectable ? pageRows.filter(isSelectable) : pageRows;
  const selectedCount = selectable.filter((row) => selectedKeys.has(rowKey(row))).length;
  const checked: RowSelectionCheckedState =
    selectable.length > 0 && selectedCount === selectable.length
      ? true
      : selectedCount > 0
        ? "indeterminate"
        : false;
  return { checked, selectableCount: selectable.length, selectedCount };
}

/**
 * What pressing the header checkbox does: clears the page's rows when every
 * selectable one is ticked, otherwise adds the missing selectable ones. Rows
 * on other pages are never touched.
 */
export function togglePageSelection<T>(
  selected: readonly T[],
  pageRows: readonly T[],
  rowKey: (row: T) => string | number,
  isSelectable?: (row: T) => boolean,
): T[] {
  const { checked } = pageSelectionState(selected, pageRows, rowKey, isSelectable);
  if (checked === true) {
    const pageKeys = new Set(pageRows.map(rowKey));
    return selected.filter((item) => !pageKeys.has(rowKey(item)));
  }
  const selectedKeys = new Set(selected.map(rowKey));
  const missing = pageRows.filter(
    (row) => (!isSelectable || isSelectable(row)) && !selectedKeys.has(rowKey(row)),
  );
  return [...selected, ...missing];
}
