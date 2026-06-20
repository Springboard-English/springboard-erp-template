import { useMemo, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';
import { useI18n } from '@/context/I18nContext';

export interface SearchableSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: string;
}

interface SearchableSelectProps {
  id?: string;
  value: string | number;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  onValueChange: (value: string) => void;
}

export function SearchableSelect({
  id,
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  disabled = false,
  className,
  contentClassName,
  onValueChange,
}: SearchableSelectProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const normalizedValue = String(value ?? '');
  const resolvedPlaceholder = placeholder ?? t('searchableSelect.placeholder');
  const resolvedSearchPlaceholder = searchPlaceholder ?? t('common.search');
  const resolvedEmptyMessage = emptyMessage ?? t('searchableSelect.empty');

  const selectedOption = useMemo(
    () => options.find((option) => option.value === normalizedValue),
    [normalizedValue, options],
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => {
      const haystack = `${option.label} ${option.keywords ?? ''} ${option.value}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [options, query]);

  const handleSelect = (nextValue: string) => {
    onValueChange(nextValue);
    setOpen(false);
    setQuery('');
  };

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
          onPointerDownOutside={() => setQuery('')}
          onEscapeKeyDown={() => setQuery('')}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={resolvedSearchPlaceholder}
              className={cn(
                'h-8 w-full rounded-md border border-input bg-background pr-2 pl-8 text-sm shadow-xs outline-none transition',
                'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
              )}
              autoFocus
            />
          </div>

          <div
            className="max-h-56 overflow-y-auto overscroll-contain pr-1 [scrollbar-gutter:stable] touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
            onWheelCapture={(event) => event.stopPropagation()}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">{resolvedEmptyMessage}</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === normalizedValue;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
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
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
