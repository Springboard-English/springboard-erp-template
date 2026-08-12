import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useChartPalette } from '@/components/charts/palette';

export interface CategoryDatum {
  label: string;
  value: number;
}

interface CategoryBarsProps {
  data: CategoryDatum[];
  /**
   * Rows past this are folded into a single "Other" row rather than given
   * invented colours. Set to 0 to keep every row.
   */
  maxRows?: number;
  otherLabel?: string;
  emptyMessage?: string;
  className?: string;
  onSelect?: (label: string) => void;
  /**
   * The highlighted row, and a callback as the pointer moves over one.
   *
   * These mirror `DonutChart`'s pair so the two can be driven from a single
   * piece of state — hovering a bar highlights its wedge and the other way
   * round. Leave both unset for an unlinked list.
   *
   * `activeLabel` may name a row this list does not have (a donut folds more
   * aggressively than the list beside it); nothing highlights, which is the
   * correct outcome rather than an error.
   */
  activeLabel?: string | null;
  onActiveChange?: (label: string | null) => void;
  /**
   * Maps a row's label to the label the *other* component knows it by, so a
   * row folded into "Other" over there still highlights the right thing.
   * Defaults to identity.
   */
  activeLabelFor?: (label: string) => string;
}

/**
 * Ranked horizontal bars — the default form for comparing magnitudes across
 * named categories, and the reason this is a bar chart and not a pie: a bar
 * makes close values comparable, which a wedge does not.
 *
 * Every row shows its value as text, which is also what licenses the lighter
 * categorical slots on a white surface.
 */
export default function CategoryBars({
  data,
  maxRows = 6,
  otherLabel = 'Other',
  emptyMessage = 'Nothing to show.',
  className,
  onSelect,
  activeLabel = null,
  onActiveChange,
  activeLabelFor = (label) => label,
}: CategoryBarsProps) {
  const palette = useChartPalette();

  const rows = useMemo(() => {
    const sorted = [...data].sort((left, right) => right.value - left.value);
    if (maxRows <= 0 || sorted.length <= maxRows) {
      return sorted.map((row, index) => ({ ...row, isOther: false, index }));
    }

    const head = sorted.slice(0, maxRows - 1);
    const tail = sorted.slice(maxRows - 1);
    return [
      ...head.map((row, index) => ({ ...row, isOther: false, index })),
      {
        label: otherLabel,
        value: tail.reduce((sum, row) => sum + row.value, 0),
        isOther: true,
        index: head.length,
      },
    ];
  }, [data, maxRows, otherLabel]);

  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const max = Math.max(0, ...rows.map((row) => row.value));

  if (rows.length === 0 || total === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const linked = activeLabel !== null;

  return (
    <ul
      className={cn('space-y-2.5', className)}
      onMouseLeave={onActiveChange ? () => onActiveChange(null) : undefined}
    >
      {rows.map((row) => {
        const color = row.isOther ? palette.other : palette.series(row.index);
        const share = total > 0 ? (row.value / total) * 100 : 0;
        const isActive = linked && activeLabelFor(row.label) === activeLabel;
        const content = (
          <>
            <div className="mb-1 flex items-baseline gap-3">
              <span
                aria-hidden
                className="size-2.5 shrink-0 translate-y-[1px] rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                {row.label}
              </span>
              <span className="shrink-0 text-sm font-medium tabular-nums text-foreground">
                {row.value.toLocaleString()}
              </span>
              <span className="w-11 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {share.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full transition-[width] duration-300"
                style={{
                  width: `${max > 0 ? (row.value / max) * 100 : 0}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </>
        );

        return (
          <li
            key={row.label}
            // Dim the rest rather than brightening this one, so the highlight
            // reads the same way the donut's does.
            className={cn(
              'transition-opacity',
              linked && !isActive && 'opacity-40',
            )}
            onMouseEnter={
              onActiveChange
                ? () => onActiveChange(activeLabelFor(row.label))
                : undefined
            }
          >
            {onSelect && !row.isOther ? (
              <button
                type="button"
                onClick={() => onSelect(row.label)}
                onFocus={
                  onActiveChange
                    ? () => onActiveChange(activeLabelFor(row.label))
                    : undefined
                }
                className="w-full rounded-lg text-left transition-opacity hover:opacity-80"
              >
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
}
