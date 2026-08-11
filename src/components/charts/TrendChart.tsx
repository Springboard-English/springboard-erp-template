import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import ChartLegend from '@/components/charts/ChartLegend';
import { useChartPalette } from '@/components/charts/palette';
import { useChartWidth } from '@/components/charts/useChartWidth';

export interface TrendSeries {
  key: string;
  label: string;
  color: string;
}

export interface TrendPoint {
  key: string;
  /** Axis tick text. Ticks are thinned automatically when space is tight. */
  label: string;
  /** Full text for the tooltip — usually the unabbreviated date. */
  tooltipLabel?: string;
  values: Record<string, number>;
}

interface TrendChartProps {
  points: TrendPoint[];
  /** Stack order, bottom to top. Also the legend order. */
  series: TrendSeries[];
  height?: number;
  emptyMessage?: string;
  className?: string;
  ariaLabel?: string;
}

const PADDING = { top: 10, right: 8, bottom: 26, left: 40 };
const MAX_BAR_WIDTH = 24;
const SEGMENT_GAP = 2;
const CORNER = 4;

/** Rounded at the data end, square at the baseline. */
function columnPath(
  x: number,
  y: number,
  width: number,
  height: number,
  rounded: boolean,
): string {
  if (height <= 0) {
    return '';
  }

  const r = rounded ? Math.min(CORNER, width / 2, height) : 0;
  if (r <= 0) {
    return `M${x},${y}h${width}v${height}h${-width}Z`;
  }

  return [
    `M${x},${y + height}`,
    `V${y + r}`,
    `a${r},${r} 0 0 1 ${r},${-r}`,
    `h${width - r * 2}`,
    `a${r},${r} 0 0 1 ${r},${r}`,
    `V${y + height}`,
    'Z',
  ].join('');
}

/**
 * An axis whose ticks are whole numbers.
 *
 * These columns count things, so a gridline at 12.5 leads is meaningless — which
 * is what a plain "round the maximum up, then halve it" scale produces for a
 * maximum of 22. Only whole-number steps are considered, and the scale with the
 * least wasted headroom wins.
 */
function integerScale(maxValue: number): { max: number; step: number } {
  if (maxValue <= 0) {
    return { max: 1, step: 1 };
  }

  let best: { max: number; step: number } | null = null;
  for (let exponent = 0; exponent <= Math.ceil(Math.log10(maxValue)) + 1; exponent += 1) {
    for (const base of [1, 2, 5]) {
      const step = base * 10 ** exponent;
      const intervals = Math.ceil(maxValue / step);
      if (intervals < 1 || intervals > 6) {
        continue;
      }

      const candidate = { max: step * intervals, step };
      if (!best || candidate.max < best.max) {
        best = candidate;
      }
    }
  }

  return best ?? { max: maxValue, step: maxValue };
}

/**
 * Stacked columns over time.
 *
 * Stacked rather than grouped because the segments are parts of one whole — the
 * column height is the total received in that bucket, and a grouped chart would
 * invite reading a subset against the total as if they were peers.
 */
export default function TrendChart({
  points,
  series,
  height = 260,
  emptyMessage = 'Nothing in this range.',
  className,
  ariaLabel = 'Trend over time',
}: TrendChartProps) {
  const palette = useChartPalette();
  const { ref, width } = useChartWidth<HTMLDivElement>();
  const [hovered, setHovered] = useState<number | null>(null);

  const totals = useMemo(
    () =>
      points.map((point) =>
        series.reduce((sum, entry) => sum + (point.values[entry.key] ?? 0), 0),
      ),
    [points, series],
  );
  const maxTotal = useMemo(() => Math.max(0, ...totals), [totals]);

  const plotWidth = Math.max(0, width - PADDING.left - PADDING.right);
  const plotHeight = Math.max(0, height - PADDING.top - PADDING.bottom);
  const band = points.length > 0 ? plotWidth / points.length : 0;
  const barWidth = Math.max(2, Math.min(MAX_BAR_WIDTH, band - 6));
  const { max: scaleMax, step: tickStep } = integerScale(maxTotal);
  const ticks = Array.from(
    { length: Math.round(scaleMax / tickStep) + 1 },
    (_, index) => index * tickStep,
  );

  // Draw at most one label per ~56px, so ticks thin out instead of colliding.
  const labelStride = Math.max(1, Math.ceil(points.length / Math.max(1, Math.floor(plotWidth / 56))));

  const legendItems = series.map((entry) => ({
    label: entry.label,
    color: entry.color,
  }));

  const hoveredPoint = hovered === null ? null : points[hovered];

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <ChartLegend items={legendItems} />
      <div ref={ref} className="relative w-full">
        {points.length === 0 || maxTotal === 0 ? (
          <div
            className="flex items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 text-sm text-muted-foreground"
            style={{ height }}
          >
            {emptyMessage}
          </div>
        ) : (
          <>
            <svg
              width={width}
              height={height}
              role="img"
              aria-label={ariaLabel}
              onMouseLeave={() => setHovered(null)}
            >
              {ticks.map((tick) => {
                const y = PADDING.top + plotHeight - (tick / scaleMax) * plotHeight;
                return (
                  <g key={tick}>
                    <line
                      x1={PADDING.left}
                      x2={PADDING.left + plotWidth}
                      y1={y}
                      y2={y}
                      stroke={tick === 0 ? palette.axis : palette.grid}
                      strokeWidth={1}
                    />
                    <text
                      x={PADDING.left - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      className="fill-muted-foreground text-[10px] tabular-nums"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {points.map((point, index) => {
                const bandX = PADDING.left + index * band;
                const x = bandX + (band - barWidth) / 2;
                const isHovered = hovered === index;
                // Walk the stack top-down so the topmost non-empty segment is
                // the one that gets the rounded data end.
                const stacked = series
                  .map((entry) => ({
                    entry,
                    value: point.values[entry.key] ?? 0,
                  }))
                  .filter((item) => item.value > 0);

                let cursorY = PADDING.top + plotHeight;
                const shapes = stacked.map((item, stackIndex) => {
                  const rawHeight = (item.value / scaleMax) * plotHeight;
                  const isTop = stackIndex === stacked.length - 1;
                  // The gap is cut out of the segment, not drawn over it, so
                  // the surface shows through between fills.
                  const gap = isTop ? 0 : SEGMENT_GAP;
                  const drawnHeight = Math.max(0, rawHeight - gap);
                  const y = cursorY - rawHeight;
                  cursorY -= rawHeight;
                  return (
                    <path
                      key={item.entry.key}
                      d={columnPath(x, y, barWidth, drawnHeight, isTop)}
                      fill={item.entry.color}
                      opacity={hovered === null || isHovered ? 1 : 0.4}
                    />
                  );
                });

                return (
                  <g key={point.key}>
                    {shapes}
                    {index % labelStride === 0 ? (
                      <text
                        x={bandX + band / 2}
                        y={height - 8}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[10px]"
                      >
                        {point.label}
                      </text>
                    ) : null}
                    {/* A hit target the full height of the band, so hovering
                        does not require landing on a short column. */}
                    <rect
                      x={bandX}
                      y={PADDING.top}
                      width={band}
                      height={plotHeight}
                      fill="transparent"
                      onMouseEnter={() => setHovered(index)}
                    />
                  </g>
                );
              })}
            </svg>

            {hoveredPoint ? (
              <div
                className="pointer-events-none absolute z-10 min-w-[9rem] rounded-xl border border-border/70 bg-popover px-3 py-2 shadow-lg"
                style={{
                  left: Math.min(
                    Math.max(PADDING.left + (hovered ?? 0) * band + band / 2 - 72, 0),
                    Math.max(width - 152, 0),
                  ),
                  top: 0,
                }}
              >
                <p className="text-xs font-semibold text-foreground">
                  {hoveredPoint.tooltipLabel ?? hoveredPoint.label}
                </p>
                <dl className="mt-1.5 space-y-1">
                  {series.map((entry) => (
                    <div
                      key={entry.key}
                      className="flex items-center justify-between gap-4"
                    >
                      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                          aria-hidden
                          className="size-2 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        {entry.label}
                      </dt>
                      <dd className="text-xs font-medium tabular-nums text-foreground">
                        {hoveredPoint.values[entry.key] ?? 0}
                      </dd>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-1">
                    <dt className="text-xs font-medium text-muted-foreground">
                      Total
                    </dt>
                    <dd className="text-xs font-semibold tabular-nums text-foreground">
                      {totals[hovered ?? 0]}
                    </dd>
                  </div>
                </dl>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
