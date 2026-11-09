import type { ReactNode } from "react";
import { buttonTarget } from "@/lib/touchTarget";
import { cn } from "@/lib/utils";

/** One pill: the value it sets and what it shows. */
export interface FilterPillOption<T extends string> {
  value: T;
  label: ReactNode;
}

export interface FilterPillsProps<T extends string> {
  value: T;
  options: Array<FilterPillOption<T>>;
  onValueChange: (value: T) => void;
  /** Names the row for screen readers, such as "Topic". */
  label: string;
  className?: string;
}

/**
 * A row of pills that sets one filter value, for a short list of choices shown
 * at once (topics, categories) under a page's own tabs. It reads as a filter,
 * not as a second level of tabs. The row scrolls sideways instead of wrapping,
 * so it stays one line on a phone.
 */
export function FilterPills<T extends string>({
  value,
  options,
  onValueChange,
  label,
  className,
}: FilterPillsProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      // The 4px inset keeps the focus ring from being clipped by the scroll box.
      className={cn("-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onValueChange(option.value)}
            className={cn(
              buttonTarget,
              "inline-flex shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-[var(--selected,var(--primary))] bg-[var(--selected,var(--primary))] text-[var(--selected-foreground,var(--primary-foreground))]"
                : "border-border/70 bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
