import { useEffect, useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import { touchHitArea } from '@/lib/touchTarget';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';
import { ComboboxField, comboboxItemClassName } from './combobox-field';

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
  /**
   * Set once `options` holds the full answer from the server. A selected tag
   * missing from a loaded list no longer exists, so it is dropped from `value`
   * instead of filtering every row away. Leave it unset while loading, or a
   * remembered filter would be wiped by the empty first render.
   */
  optionsLoaded?: boolean;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

/** A row in the open list: a known tag, or a selected one the server no longer reports. */
interface TagFilterRow {
  tag: string;
  count?: number;
  stale: boolean;
}

/**
 * A multi-select over the tags in use, for a list page's filter bar.
 *
 * The sibling of {@link TagInput}: that one authors tags on a record, this one
 * picks from the ones that already exist. Selecting more than one NARROWS the
 * result — the API matches ALL of them — so the summary says "n tags" rather
 * than implying a union. The field is the search box, and the tags chosen when
 * it opened lead the list, so even one no longer in use can be unticked.
 */
export function TagFilter({
  value,
  onValueChange,
  options,
  optionsLoaded = false,
  id,
  placeholder,
  disabled = false,
  className,
  contentClassName,
}: TagFilterProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  // The selection as it was on opening. Ordering by it, not the live value,
  // keeps a row from jumping to the top the moment it is ticked.
  const [pinnedTags, setPinnedTags] = useState<readonly string[]>([]);

  const selected = useMemo(() => new Set(value), [value]);

  useEffect(() => {
    if (!optionsLoaded) {
      return;
    }
    const known = new Set(options.map((option) => option.tag));
    const kept = value.filter((tag) => known.has(tag));
    if (kept.length !== value.length) {
      onValueChange(kept);
    }
  }, [onValueChange, options, optionsLoaded, value]);

  const rows = useMemo(() => {
    const known = new Map(options.map((option) => [option.tag, option]));
    const pinned = new Set(pinnedTags);
    const leading: TagFilterRow[] = [];
    for (const tag of pinnedTags) {
      const option = known.get(tag);
      // A stale tag only stays listed while it is still selected.
      if (option || selected.has(tag)) {
        leading.push({ tag, count: option?.count, stale: !option });
      }
    }
    const rest: TagFilterRow[] = options
      .filter((option) => !pinned.has(option.tag))
      .map((option) => ({ tag: option.tag, count: option.count, stale: false }));
    const needle = (query ?? '').trim().toLowerCase();
    const all = [...leading, ...rest];
    return needle ? all.filter((row) => row.tag.includes(needle)) : all;
  }, [options, pinnedTags, query, selected]);

  const toggle = (tag: string) => {
    onValueChange(
      selected.has(tag) ? value.filter((existing) => existing !== tag) : [...value, tag].sort(),
    );
  };

  const summary =
    value.length === 0
      ? ''
      : value.length === 1
        ? value[0]
        : t('tagFilter.selected', '{count} tags', { count: String(value.length) });

  const clearButton =
    value.length > 0 && !disabled ? (
      <button
        type="button"
        aria-label={t('tagFilter.clear', 'Clear tags')}
        className={cn(touchHitArea, 'relative cursor-pointer text-muted-foreground transition hover:text-foreground')}
        // mousedown, not click: keep the field from opening under the press.
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
          onValueChange([]);
        }}
      >
        <X className="size-4" />
      </button>
    ) : undefined;

  return (
    <ComboboxField
      id={id}
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setPinnedTags([...value]);
        }
        setOpen(next);
      }}
      displayValue={summary}
      query={query}
      onQueryChange={setQuery}
      placeholder={placeholder ?? t('tagFilter.placeholder')}
      searchPlaceholder={t('common.search')}
      disabled={disabled}
      className={className}
      contentClassName={contentClassName}
      itemCount={rows.length}
      onPick={(index) => {
        const row = rows[index];
        if (row) {
          toggle(row.tag);
        }
      }}
      trailing={clearButton}
    >
      {({ activeIndex, setActiveIndex, itemId, listId }) => (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          className="max-h-64 overflow-y-auto overscroll-contain pr-1"
        >
          {rows.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">{t('tagFilter.empty')}</div>
          ) : (
            rows.map((row, index) => {
              const isSelected = selected.has(row.tag);
              return (
                <button
                  key={row.tag}
                  id={itemId(index)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  onClick={() => toggle(row.tag)}
                  onMouseMove={() => setActiveIndex(index)}
                  className={cn(comboboxItemClassName(index === activeIndex), isSelected && 'font-medium')}
                >
                  <span className={cn('min-w-0 flex-1 truncate', row.stale && 'text-muted-foreground line-through')}>
                    {row.tag}
                  </span>
                  {row.stale ? (
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {t('tagFilter.stale', 'Not in use')}
                    </span>
                  ) : typeof row.count === 'number' ? (
                    <span className="shrink-0 text-xs text-muted-foreground">{row.count}</span>
                  ) : null}
                  {isSelected ? <Check className="size-4 shrink-0" /> : null}
                </button>
              );
            })
          )}
        </div>
      )}
    </ComboboxField>
  );
}
