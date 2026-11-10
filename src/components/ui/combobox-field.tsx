import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import { fieldHeight, touchTargetHeight } from '@/lib/touchTarget';
import { cn } from '@/lib/utils';

/** What {@link ComboboxField} hands its list renderer for one open popover. */
export interface ComboboxListState {
  /** Index of the keyboard-highlighted item. */
  activeIndex: number;
  /** Moves the highlight, e.g. on hover. */
  setActiveIndex: (index: number) => void;
  /** DOM id for item `index`, so the field can point `aria-activedescendant` at it. */
  itemId: (index: number) => string;
  /** Id the list element must carry; the field's `aria-controls` names it. */
  listId: string;
}

interface ComboboxFieldProps {
  id?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Text the field shows while nobody is typing: the chosen label or a summary. */
  displayValue: string;
  /** Typed search, or `null` until the user edits the field after opening. */
  query: string | null;
  onQueryChange: (query: string | null) => void;
  /** Shown when the field is closed and empty. */
  placeholder: string;
  /** Shown when the field is open and empty. */
  searchPlaceholder: string;
  disabled?: boolean;
  /** Swaps the chevron for a spinner. */
  loading?: boolean;
  className?: string;
  contentClassName?: string;
  /** How many keyboard-reachable items the list renders. */
  itemCount: number;
  /** Enter on the highlighted item. */
  onPick: (index: number) => void;
  /** Rendered at the right edge of the field instead of the chevron, e.g. a clear button. */
  trailing?: ReactNode;
  children: (state: ComboboxListState) => ReactNode;
}

/**
 * The field-plus-popover shell shared by `SearchableSelect` and `TagFilter`.
 *
 * The field itself is the search box: opening it selects its text, so typing
 * replaces the current label in place instead of moving to a second input in
 * the popover. Arrow keys move the highlight, Enter picks, Escape and Tab
 * close. The highlight starts on the first item, which callers keep for the
 * current choice.
 */
export function ComboboxField({
  id,
  open,
  onOpenChange,
  displayValue,
  query,
  onQueryChange,
  placeholder,
  searchPlaceholder,
  disabled = false,
  loading = false,
  className,
  contentClassName,
  itemCount,
  onPick,
  trailing,
  children,
}: ComboboxFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const itemId = (index: number) => `${listId}-item-${index}`;

  // A new search or a fresh open starts again on the first item, the current choice.
  useEffect(() => {
    setActiveIndex(0);
  }, [open, query]);

  // Keep the highlighted item visible while arrowing through a long list.
  useEffect(() => {
    if (!open) {
      return;
    }
    document.getElementById(`${listId}-item-${activeIndex}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, listId, open]);

  const setOpen = (next: boolean) => {
    if (next === open) {
      return;
    }
    onOpenChange(next);
    if (!next) {
      onQueryChange(null);
    }
  };

  const openAndSelect = () => {
    if (disabled) {
      return;
    }
    setOpen(true);
    // Selecting the label is what makes the first keystroke replace it.
    inputRef.current?.select();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        openAndSelect();
        return;
      }
      if (itemCount === 0) {
        return;
      }
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((current) => (current + step + itemCount) % itemCount);
      return;
    }
    if (event.key === 'Enter' && open) {
      // Enter would otherwise submit the surrounding form.
      event.preventDefault();
      if (activeIndex < itemCount) {
        onPick(activeIndex);
      }
      return;
    }
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      // Stop a surrounding dialog from closing on the same keystroke.
      event.stopPropagation();
      setOpen(false);
    }
  };

  const inputValue = open && query !== null ? query : displayValue;

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next, details) => {
        // Clicking the field is not "outside": it should keep the list open.
        if (
          !next &&
          details.reason === 'outside-press' &&
          anchorRef.current?.contains(details.event.target as Node)
        ) {
          details.cancel();
          return;
        }
        setOpen(next);
      }}
    >
        <div
          ref={anchorRef}
          className={cn('relative w-full min-w-0', className)}
          onClick={(event) => event.stopPropagation()}
        >
          <input
            ref={inputRef}
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && itemCount > 0 ? itemId(activeIndex) : undefined}
            autoComplete="off"
            disabled={disabled}
            value={inputValue}
            placeholder={open ? searchPlaceholder : placeholder}
            onClick={openAndSelect}
            onChange={(event) => {
              setOpen(true);
              onQueryChange(event.target.value);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setOpen(false)}
            className={cn(
              fieldHeight,
              'w-full min-w-0 cursor-pointer truncate rounded-md border border-input bg-background pr-9 pl-3 text-base shadow-xs outline-none transition md:text-sm',
              'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              open && 'cursor-text',
            )}
          />
          <span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center">
            {loading ? (
              <Loader2 className="pointer-events-none size-4 animate-spin text-muted-foreground" />
            ) : (
              (trailing ?? <ChevronDown className="pointer-events-none size-4 text-muted-foreground" />)
            )}
          </span>
        </div>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          anchor={anchorRef}
          sideOffset={4}
          align="start"
          className="isolate z-[60]"
        >
          <PopoverPrimitive.Popup
            className={cn(
              'z-[60] w-(--anchor-width) min-w-[12rem] max-h-[min(18rem,var(--available-height))] overflow-hidden rounded-md border border-border bg-popover p-1 text-base text-popover-foreground shadow-md md:text-sm',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
              'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
              'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
              contentClassName,
            )}
            // The field keeps focus throughout: it is the combobox input.
            initialFocus={false}
            finalFocus={false}
            // Pressing inside the list must not blur the field, or the blur would
            // close the list before the click lands.
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => event.stopPropagation()}
          >
            {children({ activeIndex, setActiveIndex, itemId, listId })}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

/** Classes for one list row; `active` is the keyboard highlight. */
export function comboboxItemClassName(active: boolean): string {
  return cn(
    touchTargetHeight,
    'flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left outline-none transition',
    'disabled:pointer-events-none disabled:opacity-50',
    active && 'bg-accent text-accent-foreground',
  );
}
