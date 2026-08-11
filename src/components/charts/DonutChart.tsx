import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { CategoryDatum } from '@/components/charts/CategoryBars';
import { useChartPalette } from '@/components/charts/palette';

interface DonutChartProps {
  data: CategoryDatum[];
  /** Segments past this fold into one "Other" wedge. */
  maxSegments?: number;
  otherLabel?: string;
  /** Caption under the total, in the hole. */
  centerLabel?: string;
  /** Drive the highlight from outside — e.g. from a paired list. */
  activeLabel?: string | null;
  onActiveChange?: (label: string | null) => void;
  onSelect?: (label: string) => void;
  emptyMessage?: string;
  className?: string;
  ariaLabel?: string;
}

const SIZE = 240;
const RADIUS = 88;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** The surface shows through between wedges rather than a stroke being drawn. */
const GAP = 2;

/**
 * Part-to-whole, at a glance.
 *
 * Deliberately capped and folded into "Other": a donut is only readable for a
 * handful of clearly different shares. If the reader needs to compare close
 * values or rank them, pair it with `CategoryBars` — or use those alone.
 */
export default function DonutChart({
  data,
  maxSegments = 6,
  otherLabel = 'Other',
  centerLabel = 'Total',
  activeLabel,
  onActiveChange,
  onSelect,
  emptyMessage = 'Nothing to show.',
  className,
  ariaLabel = 'Share by category',
}: DonutChartProps) {
  const palette = useChartPalette();
  const [internalActive, setInternalActive] = useState<string | null>(null);
  const active = activeLabel !== undefined ? activeLabel : internalActive;

  function setActive(label: string | null) {
    if (activeLabel === undefined) {
      setInternalActive(label);
    }
    onActiveChange?.(label);
  }

  const segments = useMemo(() => {
    const sorted = [...data]
      .filter((row) => row.value > 0)
      .sort((left, right) => right.value - left.value);
    const capped =
      maxSegments > 0 && sorted.length > maxSegments
        ? [
            ...sorted.slice(0, maxSegments - 1),
            {
              label: otherLabel,
              value: sorted
                .slice(maxSegments - 1)
                .reduce((sum, row) => sum + row.value, 0),
            },
          ]
        : sorted;

    const total = capped.reduce((sum, row) => sum + row.value, 0);
    let offset = 0;
    return capped.map((row, index) => {
      const share = total > 0 ? row.value / total : 0;
      const length = share * CIRCUMFERENCE;
      const segment = {
        ...row,
        share: share * 100,
        color:
          row.label === otherLabel && capped.length > 1 && index === capped.length - 1
            ? palette.other
            : palette.series(index),
        // Shrink by the gap and nudge forward by half of it, so the gap is
        // shared evenly between neighbours.
        dashArray: `${Math.max(0, length - GAP)} ${CIRCUMFERENCE - Math.max(0, length - GAP)}`,
        dashOffset: -(offset + GAP / 2),
      };
      offset += length;
      return segment;
    });
  }, [data, maxSegments, otherLabel, palette]);

  const total = segments.reduce((sum, row) => sum + row.value, 0);
  const activeSegment = segments.find((row) => row.label === active) ?? null;

  if (segments.length === 0 || total === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-10 text-sm text-muted-foreground',
          className,
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={cn('h-auto w-full max-w-[260px]', className)}
      role="img"
      aria-label={ariaLabel}
      onMouseLeave={() => setActive(null)}
    >
      <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
        {segments.map((segment) => (
          <circle
            key={segment.label}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={segment.color}
            strokeWidth={active === segment.label ? STROKE + 4 : STROKE}
            strokeDasharray={segment.dashArray}
            strokeDashoffset={segment.dashOffset}
            opacity={active === null || active === segment.label ? 1 : 0.35}
            className={cn('transition-all duration-150', onSelect && 'cursor-pointer')}
            onMouseEnter={() => setActive(segment.label)}
            onClick={onSelect ? () => onSelect(segment.label) : undefined}
          />
        ))}
      </g>

      {activeSegment ? (
        <>
          <text
            x={SIZE / 2}
            y={SIZE / 2 - 9}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px] font-medium"
          >
            {activeSegment.label}
          </text>
          <text
            x={SIZE / 2}
            y={SIZE / 2 + 5}
            textAnchor="middle"
            className="fill-foreground text-[13px] font-bold"
          >
            {activeSegment.value.toLocaleString()}
          </text>
          <text
            x={SIZE / 2}
            y={SIZE / 2 + 18}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
          >
            {activeSegment.share.toFixed(1)}%
          </text>
        </>
      ) : (
        <>
          <text
            x={SIZE / 2}
            y={SIZE / 2 - 4}
            textAnchor="middle"
            className="fill-muted-foreground text-[9px] font-semibold uppercase tracking-[0.14em]"
          >
            {centerLabel}
          </text>
          <text
            x={SIZE / 2}
            y={SIZE / 2 + 12}
            textAnchor="middle"
            className="fill-foreground text-[15px] font-bold"
          >
            {total.toLocaleString()}
          </text>
        </>
      )}
    </svg>
  );
}
