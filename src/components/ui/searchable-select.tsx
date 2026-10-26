import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { touchTargetHeight } from '@/lib/touchTarget';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { ComboboxField, comboboxItemClassName } from './combobox-field';
// Relative, not `@/`: this module's types are emitted, and tsc writes an import
// specifier into a .d.ts verbatim — a consumer would resolve `@/` against its
// OWN src and silently get `any`. `scripts/check-dts-portable.mjs` enforces it.
import { toPageSize, type FetchCursorPage } from '../../utils/cursorPagination';

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

/**
 * Adapts a resource's cursor page-fetcher into the {@link SearchableSelectProps.loadOptions}
 * prop, so an inline-option fetcher can be an ordinary `FetchCursorPage` like
 * every other list rather than a fifth page shape.
 *
 * `fetchPage` takes the query and RETURNS the fetcher, because a combobox's
 * search is part of the request while `FetchCursorPage` is deliberately only
 * `(size, cursor, signal)` — binding `q` in the closure is what keeps that
 * signature the same for tables, exports and dropdowns alike.
 *
 * `extraOptions` pins sentinels such as an "All" entry, and only to the
 * unfiltered first page — a sentinel repeated on page two, or surviving a
 * search that excludes it, reads as a result.
 */
export function toLoadOptions<T>(
  fetchPage: (query: string) => FetchCursorPage<T>,
  toOption: (item: T) => SearchableSelectOption,
  extraOptions: SearchableSelectOption[] = [],
): (params: SearchableSelectLoadParams) => Promise<SearchableSelectPage> {
  return async ({ query, cursor, pageSize, signal }) => {
    const page = await fetchPage(query)(toPageSize(pageSize), cursor, signal);
    const prefix = cursor === null && !query.trim() ? extraOptions : [];
    return {
      options: [...prefix, ...page.items.map(toOption)],
      nextCursor: page.nextCursor,
    };
  };
}

const DEFAULT_PAGE_SIZE = 25;
const SEARCH_DEBOUNCE_MS = 300;

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

/**
 * A single-choice combobox over a static list or cursor-paged `loadOptions`.
 * The field doubles as the search box: opening it selects the current label so
 * typing replaces it, and the current choice is listed first and highlighted.
 */
export function SearchableSelect({
  id,
  value,
  options = [],
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  className,
  contentClassName,
  onValueChange,
  onOptionSelect,
  loadOptions,
  pageSize = DEFAULT_PAGE_SIZE,
  selectedOption: selectedOptionProp,
  loadMoreLabel,
}: SearchableSelectProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  // `null` until the user types after opening: the field still shows the label
  // and the list is unfiltered.
  const [query, setQuery] = useState<string | null>(null);
  const searchText = (query ?? '').trim();
  const normalizedValue = String(value ?? '');
  const isAsync = typeof loadOptions === 'function';
  const resolvedPlaceholder = placeholder ?? t('searchableSelect.placeholder');
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('common.search');
  const resolvedEmptyMessage = emptyMessage ?? t('searchableSelect.empty');
  const resolvedLoadMoreLabel = loadMoreLabel ?? t('searchableSelect.loadMore');

  // Async paging state.
  const [asyncOptions, setAsyncOptions] = useState<SearchableSelectOption[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Debounced mirror of `query`, only used to drive async fetches.
  const [debouncedQuery, setDebouncedQuery] = useState('');
  // Bumps on every reset so in-flight responses from a stale query are ignored.
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  // Keep the latest loadOptions / t without making them fetch-effect dependencies.
  // useI18n returns a fresh `t` every render, and consumers may pass an inline
  // loadOptions — depending on either would re-run the fetch effect forever.
  const loadOptionsRef = useRef(loadOptions);
  loadOptionsRef.current = loadOptions;
  const tRef = useRef(t);
  tRef.current = t;

  const staticSelectedOption = useMemo(
    () => options.find((option) => option.value === normalizedValue),
    [normalizedValue, options],
  );

  const selectedOption = isAsync
    ? (selectedOptionProp?.value === normalizedValue ? selectedOptionProp : undefined) ??
      asyncOptions.find((option) => option.value === normalizedValue) ??
      (selectedOptionProp && normalizedValue ? selectedOptionProp : undefined)
    : staticSelectedOption;

  const filteredOptions = useMemo(() => {
    if (isAsync) {
      return asyncOptions;
    }
    const normalizedQuery = searchText.toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => {
      const haystack = `${option.label} ${option.keywords ?? ''} ${option.value}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [asyncOptions, isAsync, options, searchText]);

  // Debounce the query for async mode.
  useEffect(() => {
    if (!isAsync) {
      return;
    }
    const handle = setTimeout(() => setDebouncedQuery(searchText), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [isAsync, searchText]);

  const runFetch = useCallback(
    async (cursor: string | null, mode: 'reset' | 'more') => {
      const load = loadOptionsRef.current;
      if (!load) {
        return;
      }
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const requestId = ++requestIdRef.current;

      if (mode === 'reset') {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const page = await load({
          query: debouncedQuery,
          cursor,
          pageSize,
          signal: controller.signal,
        });
        if (requestId !== requestIdRef.current) {
          return;
        }
        setAsyncOptions((current) =>
          mode === 'reset' ? page.options : [...current, ...page.options],
        );
        setNextCursor(page.nextCursor ?? null);
      } catch (fetchError) {
        if (controller.signal.aborted || requestId !== requestIdRef.current) {
          return;
        }
        setError(
          fetchError instanceof Error ? fetchError.message : tRef.current('searchableSelect.error'),
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [debouncedQuery, pageSize],
  );

  // Fetch the first page whenever the popover is open and the (debounced) query changes.
  useEffect(() => {
    if (!isAsync || !open) {
      return;
    }
    setAsyncOptions([]);
    setNextCursor(null);
    void runFetch(null, 'reset');
  }, [debouncedQuery, isAsync, open, runFetch]);

  // Abort any in-flight request and reset transient query state when closing.
  useEffect(() => {
    if (open || !isAsync) {
      return;
    }
    abortRef.current?.abort();
    requestIdRef.current += 1;
    setLoading(false);
    setLoadingMore(false);
  }, [isAsync, open]);

  // The current choice leads the list, so the highlight opens on it. It is
  // pinned even when it is not on a loaded page yet, until a search leaves it out.
  const orderedOptions = useMemo(() => {
    const rest = filteredOptions.filter((option) => option.value !== normalizedValue);
    const selectedInList = filteredOptions.find((option) => option.value === normalizedValue);
    const pinned = selectedInList ?? (searchText === '' ? selectedOption : undefined);
    return pinned ? [pinned, ...rest] : rest;
  }, [filteredOptions, normalizedValue, searchText, selectedOption]);

  const resetQuery = () => {
    setQuery(null);
    setDebouncedQuery('');
  };

  const handleLoadMore = () => {
    if (!nextCursor || loadingMore || loading) {
      return;
    }
    void runFetch(nextCursor, 'more');
  };

  const handleSelect = (option: SearchableSelectOption) => {
    onValueChange(option.value);
    onOptionSelect?.(option);
    setOpen(false);
    resetQuery();
  };

  const showEmpty = orderedOptions.length === 0 && !loading;

  return (
    <ComboboxField
      id={id}
      open={open}
      onOpenChange={setOpen}
      displayValue={selectedOption?.label ?? ''}
      query={query}
      onQueryChange={(next) => {
        setQuery(next);
        if (next === null) {
          setDebouncedQuery('');
        }
      }}
      placeholder={resolvedPlaceholder}
      searchPlaceholder={resolvedSearchPlaceholder}
      disabled={disabled}
      loading={isAsync && loading}
      className={className}
      contentClassName={contentClassName}
      itemCount={orderedOptions.length}
      onPick={(index) => {
        const option = orderedOptions[index];
        if (option && !option.disabled) {
          handleSelect(option);
        }
      }}
    >
      {({ activeIndex, setActiveIndex, itemId, listId }) => (
        <div
          id={listId}
          role="listbox"
          className="max-h-64 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable] touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onWheelCapture={(event) => event.stopPropagation()}
        >
          {error ? (
            <div className="px-2 py-1.5 text-sm text-destructive">{error}</div>
          ) : null}

          {showEmpty && !error ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">{resolvedEmptyMessage}</div>
          ) : (
            orderedOptions.map((option, index) => {
              const isSelected = option.value === normalizedValue;

              return (
                <button
                  key={option.value}
                  id={itemId(index)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => handleSelect(option)}
                  onMouseMove={() => setActiveIndex(index)}
                  disabled={option.disabled}
                  className={cn(comboboxItemClassName(index === activeIndex), isSelected && 'font-medium')}
                >
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {isSelected ? <Check className="size-4 shrink-0" /> : null}
                </button>
              );
            })
          )}

          {isAsync && loading && orderedOptions.length === 0 ? (
            <div className="flex items-center justify-center gap-2 px-2 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {t('searchableSelect.loading')}
            </div>
          ) : null}

          {isAsync && nextCursor && !error ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleLoadMore}
              disabled={loadingMore || loading}
              className={cn(
                touchTargetHeight,
                'mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground outline-none transition',
                'hover:bg-accent hover:text-accent-foreground',
                'disabled:pointer-events-none disabled:opacity-50',
              )}
            >
              {loadingMore ? <Loader2 className="size-3.5 animate-spin" /> : null}
              {resolvedLoadMoreLabel}
            </button>
          ) : null}
        </div>
      )}
    </ComboboxField>
  );
}
