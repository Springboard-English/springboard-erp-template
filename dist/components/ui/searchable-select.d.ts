export interface SearchableSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    keywords?: string;
}
/** Arguments passed to {@link SearchableSelectProps.loadOptions} for a single cursor page. */
export interface SearchableSelectLoadParams {
    /** Current (debounced) search query. Empty string when the field is blank. */
    query: string;
    /** Cursor token for the page to fetch. `null` requests the first page. */
    cursor: string | null;
    /** Requested page size. */
    pageSize: number;
    /** Aborts stale requests when the query changes or the popover closes. */
    signal: AbortSignal;
}
/** A single cursor-paginated page returned by {@link SearchableSelectProps.loadOptions}. */
export interface SearchableSelectPage {
    options: SearchableSelectOption[];
    /** Cursor for the next page, or `null`/`undefined` when there are no more pages. */
    nextCursor?: string | null;
}
interface SearchableSelectProps {
    id?: string;
    value: string | number;
    options?: SearchableSelectOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    disabled?: boolean;
    className?: string;
    contentClassName?: string;
    onValueChange: (value: string) => void;
    /**
     * Fired alongside `onValueChange` with the full selected option. Useful in
     * async mode to remember the chosen label for {@link selectedOption}, since
     * the option may not be present in a later loaded page.
     */
    onOptionSelect?: (option: SearchableSelectOption) => void;
    /**
     * Enables cursor/page-size async loading. When provided, `options` is ignored
     * for the list body and the component fetches pages on open, on (debounced)
     * search, and when the user clicks "Load more". Server-side search is assumed,
     * so results are not filtered client-side.
     */
    loadOptions?: (params: SearchableSelectLoadParams) => Promise<SearchableSelectPage>;
    /** Page size passed to {@link loadOptions}. Defaults to 25. */
    pageSize?: number;
    /**
     * Used to render the trigger label when the selected value has not (yet) been
     * loaded into the async list. Falls back to a matching loaded option, then the
     * raw value.
     */
    selectedOption?: SearchableSelectOption;
    /** Label for the "Load more" button. Defaults to the i18n `searchableSelect.loadMore`. */
    loadMoreLabel?: string;
}
export declare function SearchableSelect({ id, value, options, placeholder, searchPlaceholder, emptyMessage, disabled, className, contentClassName, onValueChange, onOptionSelect, loadOptions, pageSize, selectedOption: selectedOptionProp, loadMoreLabel, }: SearchableSelectProps): import("react/jsx-runtime").JSX.Element;
export {};
