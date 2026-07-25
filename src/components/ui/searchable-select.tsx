import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Loader2, Search } from 'lucide-react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

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
  const [query, setQuery] = useState('');
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
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => {
      const haystack = `${option.label} ${option.keywords ?? ''} ${option.value}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [asyncOptions, isAsync, options, query]);

  // Debounce the query for async mode.
  useEffect(() => {
    if (!isAsync) {
      return;
    }
    const handle = setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [isAsync, query]);

  const runFetch = useCallback(
    async (cursor: string | null, mode: 'reset' | 'more') => {
      if (!loadOptions) {
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
        const page = await loadOptions({
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
          fetchError instanceof Error ? fetchError.message : t('searchableSelect.error'),
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [debouncedQuery, loadOptions, pageSize, t],
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

  const resetQuery = () => {
    setQuery('');
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

  const showEmpty = filteredOptions.length === 0 && !loading;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-10 w-full min-w-0 cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition',
            'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <span className={cn('min-w-0 flex-1 truncate text-left', !selectedOption && 'text-muted-foreground')}>
            {selectedOption?.label ?? resolvedPlaceholder}
          </span>
          <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={4}
          align="start"
          className={cn(
            'z-50 w-(--radix-popover-trigger-width) min-w-[12rem] max-h-[min(18rem,var(--radix-popover-content-available-height))] overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            contentClassName,
          )}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onPointerDownOutside={resetQuery}
          onEscapeKeyDown={resetQuery}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={resolvedSearchPlaceholder}
              className={cn(
                'h-8 w-full rounded-md border border-input bg-background pr-8 pl-8 text-sm shadow-xs outline-none transition',
                'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
              )}
              autoFocus
            />
            {isAsync && loading ? (
              <Loader2 className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
            ) : null}
          </div>

          <div
            className="max-h-56 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable] touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
            onWheelCapture={(event) => event.stopPropagation()}
          >
            {error ? (
              <div className="px-2 py-1.5 text-sm text-destructive">{error}</div>
            ) : null}

            {showEmpty && !error ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">{resolvedEmptyMessage}</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === normalizedValue;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    disabled={option.disabled}
                    className={cn(
                      'flex w-full min-w-0 cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm outline-none transition',
                      'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
                      'disabled:pointer-events-none disabled:opacity-50',
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {isSelected ? <Check className="ml-2 size-4 shrink-0" /> : null}
                  </button>
                );
              })
            )}

            {isAsync && loading && filteredOptions.length === 0 ? (
              <div className="flex items-center justify-center gap-2 px-2 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                {t('searchableSelect.loading')}
              </div>
            ) : null}

            {isAsync && nextCursor && !error ? (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore || loading}
                className={cn(
                  'mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm px-2 py-1.5 text-sm text-muted-foreground outline-none transition',
                  'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
                  'disabled:pointer-events-none disabled:opacity-50',
                )}
              >
                {loadingMore ? <Loader2 className="size-3.5 animate-spin" /> : null}
                {resolvedLoadMoreLabel}
              </button>
            ) : null}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
