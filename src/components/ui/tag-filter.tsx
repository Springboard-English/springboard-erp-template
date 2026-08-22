import { useMemo, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

/** One selectable tag and how many rows carry it. Mirrors the API's
 *  `TagCountResponse` from `GET /v2/{resource}/tags`. */
export interface TagFilterOption {
  tag: string;
  count?: number;
}

export interface TagFilterProps {
  value: readonly string[];
  onValueChange: (next: string[]) => void;
  options: readonly TagFilterOption[];
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * A multi-select over the tags in use, for a list page's filter bar.
 *
 * The sibling of {@link TagInput}: that one authors tags on a record, this one
 * picks from the ones that already exist. Selecting more than one NARROWS the
 * result — the API matches ALL of them — so the summary says "n tags" rather
 * than implying a union.
 */
export function TagFilter({
  value,
  onValueChange,
  options,
  id,
  placeholder,
  disabled = false,
  className,
  contentClassName,
}: TagFilterProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(() => new Set(value), [value]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? options.filter((option) => option.tag.includes(needle)) : options;
  }, [options, query]);

  const toggle = (tag: string) => {
    onValueChange(
      selected.has(tag) ? value.filter((existing) => existing !== tag) : [...value, tag].sort(),
    );
  };

  const summary =
    value.length === 0
      ? (placeholder ?? t('tagFilter.placeholder'))
      : value.length === 1
        ? value[0]
        : t('tagFilter.selected', '{count} tags', { count: String(value.length) });

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setQuery('');
        }
      }}
    >
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
        >
          <span className={cn('min-w-0 flex-1 truncate text-left', value.length === 0 && 'text-muted-foreground')}>
            {summary}
          </span>
          {value.length > 0 ? (
            <span
              role="button"
              tabIndex={0}
              aria-label={t('tagFilter.clear', 'Clear tags')}
              className="ml-2 shrink-0 cursor-pointer text-muted-foreground transition hover:text-foreground"
              onClick={(event) => {
                event.stopPropagation();
                onValueChange([]);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  onValueChange([]);
                }
              }}
            >
              <X className="size-4" />
            </span>
          ) : (
            <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
          )}
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={4}
          align="start"
          className={cn(
            'z-[60] w-(--radix-popover-trigger-width) min-w-[12rem] max-h-[min(18rem,var(--radix-popover-content-available-height))] overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md',
            contentClassName,
          )}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('common.search')}
              className={cn(
                'h-8 w-full rounded-md border border-input bg-background pr-2 pl-8 text-sm shadow-xs outline-none transition',
                'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
              )}
              autoFocus
            />
          </div>

          <div className="max-h-56 overflow-y-auto overscroll-contain pr-1">
            {filtered.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">{t('tagFilter.empty')}</div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.tag}
                  type="button"
                  onClick={() => toggle(option.tag)}
                  className={cn(
                    'flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition',
                    'hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground',
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{option.tag}</span>
                  {typeof option.count === 'number' ? (
                    <span className="shrink-0 text-xs text-muted-foreground">{option.count}</span>
                  ) : null}
                  {selected.has(option.tag) ? <Check className="size-4 shrink-0" /> : null}
                </button>
              ))
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
