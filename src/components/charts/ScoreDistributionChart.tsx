import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import ChartLegend from '@/components/charts/ChartLegend';
import { columnPath, integerScale } from '@/components/charts/TrendChart';
import { useChartPalette } from '@/components/charts/palette';
import { useChartWidth } from '@/components/charts/useChartWidth';

export interface ScoreDistributionBin {
  /** Printed under the column, e.g. "40–50". */
  label: string;
  /** Inclusive lower edge. */
  lower: number;
  /** Exclusive upper edge, except on the last bin. */
  upper: number;
  count: number;
  /** 0..1, 1.0 at the top of the cohort. Null when nobody has been scored. */
  percentile: number | null;
}

interface ScoreDistributionChartProps {
  bins: ScoreDistributionBin[];
  /**
   * Bar fill. Any CSS colour — a hex, or a custom property reference like
   * `var(--rose-500)` for a consumer whose design system forbids raw hex.
   */
  color: string;
  /** Fill for the bin holding `highlightScore`. Defaults to `color`. */
  highlightColor?: string;
  /** Marks the bin this score falls in — "your score", or the selected row. */
  highlightScore?: number | null;
  height?: number;
  emptyMessage?: string;
  ariaLabel?: string;
  className?: string;
  /** Tooltip and legend copy, so each consumer owns its own translations. */
  labels?: {
    students?: string;
    percentile?: string;
    cohort?: string;
    highlight?: string;
  };
  /** Formats the 0..1 percentile. Defaults to a whole percentage. */
  formatPercentile?: (fraction: number) => string;
}

const PADDING = { top: 16, right: 8, bottom: 30, left: 40 };
const MAX_BAR_WIDTH = 48;
const BAR_GAP = 2;
/** Below this band width a count printed over the column would collide. */
const MIN_BAND_FOR_COUNTS = 28;

function defaultFormatPercentile(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

/**
 * How a cohort's scores are spread: one column per score range, its height the
 * number of people in it.
 *
 * A table of ranks answers "how did this student do"; only the shape answers
 * "how did the group do". A mean of 60% is the same number for a tight middle
 * and for two clusters at 30 and 90, and those are very different rooms to
 * teach.
 *
 * The bins arrive already computed from the API, deliberately. The percentile
 * in the tooltip is the same figure the rest of the platform reports, so
 * binning here in the browser would eventually mean two screens disagreeing
 * about where a student stands.
 */
export default function ScoreDistributionChart({
  bins,
  color,
  highlightColor,
  highlightScore = null,
  height = 220,
  emptyMessage = 'No scores yet.',
  ariaLabel = 'Score distribution',
  className,
  labels,
  formatPercentile = defaultFormatPercentile,
}: ScoreDistributionChartProps) {
  const palette = useChartPalette();
  const { ref, width } = useChartWidth<HTMLDivElement>();
  const [hovered, setHovered] = useState<number | null>(null);

  const totalCount = useMemo(
    () => bins.reduce((sum, bin) => sum + bin.count, 0),
    [bins],
  );
  const maxCount = useMemo(
    () => Math.max(0, ...bins.map((bin) => bin.count)),
    [bins],
  );

  const highlightIndex = useMemo(() => {
    if (highlightScore === null || highlightScore === undefined) {
      return null;
    }
    // Clamped into the end bins: a score outside the test's own scale is
    // representable, and a student the chart cannot place is a student the
    // chart has quietly lost.
    const index = bins.findIndex(
      (bin, position) =>
        highlightScore < bin.upper || position === bins.length - 1,
    );
    return index === -1 ? null : index;
  }, [bins, highlightScore]);

  const plotWidth = Math.max(0, width - PADDING.left - PADDING.right);
  const plotHeight = Math.max(0, height - PADDING.top - PADDING.bottom);
  const band = bins.length > 0 ? plotWidth / bins.length : 0;
  const barWidth = Math.max(2, Math.min(MAX_BAR_WIDTH, band - BAR_GAP));
  const { max: scaleMax, step: tickStep } = integerScale(maxCount);
  const ticks = Array.from(
    { length: Math.round(scaleMax / tickStep) + 1 },
    (_, index) => index * tickStep,
  );

  // Draw at most one label per ~48px, so ranges thin out instead of colliding.
  const labelStride = Math.max(
    1,
    Math.ceil(bins.length / Math.max(1, Math.floor(plotWidth / 48))),
  );
  const showCounts = band >= MIN_BAND_FOR_COUNTS;

  const hoveredBin = hovered === null ? null : bins[hovered];
  const accent = highlightColor ?? color;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* A legend only when two colours are on screen. A single-series
          histogram needs none — the heading already names it. */}
      {highlightIndex !== null ? (
        <ChartLegend
          items={[
            { label: labels?.cohort ?? 'Cohort', color },
            { label: labels?.highlight ?? 'Selected score', color: accent },
          ]}
        />
      ) : null}
      <div ref={ref} className="relative w-full">
        {bins.length === 0 || totalCount === 0 ? (
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

              {bins.map((bin, index) => {
                const bandX = PADDING.left + index * band;
                const x = bandX + (band - barWidth) / 2;
                const isHovered = hovered === index;
                const isHighlight = highlightIndex === index;
                const barHeight = (bin.count / scaleMax) * plotHeight;
                const y = PADDING.top + plotHeight - barHeight;

                return (
                  <g key={bin.label}>
                    {bin.count > 0 ? (
                      <path
                        d={columnPath(x, y, barWidth, barHeight, true)}
                        // Set through `style`, not the `fill` attribute: `var()`
                        // does not resolve in an SVG presentation attribute, and
                        // this is what lets a consumer pass a design token
                        // instead of a hex. Do not "simplify" it back.
                        style={{ fill: isHighlight ? accent : color }}
                        opacity={hovered === null || isHovered ? 1 : 0.45}
                      />
                    ) : null}
                    {showCounts && bin.count > 0 ? (
                      <text
                        x={bandX + band / 2}
                        y={y - 5}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[10px] font-medium tabular-nums"
                      >
                        {bin.count}
                      </text>
                    ) : null}
                    {index % labelStride === 0 ? (
                      <text
                        x={bandX + band / 2}
                        y={height - 9}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[10px]"
                      >
                        {bin.label}
                      </text>
                    ) : null}
                    {/* Hit target the full height of the band, including the
                        gap, so reading a short column does not require landing
                        on it. Focusable, so the tooltip is reachable without a
                        pointer. */}
                    <rect
                      x={bandX}
                      y={PADDING.top}
                      width={band}
                      height={plotHeight}
                      fill="transparent"
                      tabIndex={0}
                      role="button"
                      aria-label={`${bin.label}: ${bin.count}`}
                      onMouseEnter={() => setHovered(index)}
                      onFocus={() => setHovered(index)}
                      onBlur={() => setHovered(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {hoveredBin ? (
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
                  {hoveredBin.label}
                </p>
                <dl className="mt-1.5 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-xs text-muted-foreground">
                      {labels?.students ?? 'Students'}
                    </dt>
                    <dd className="text-xs font-medium tabular-nums text-foreground">
                      {hoveredBin.count}
                    </dd>
                  </div>
                  {hoveredBin.percentile !== null ? (
                    <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-1">
                      <dt className="text-xs font-medium text-muted-foreground">
                        {labels?.percentile ?? 'Percentile'}
                      </dt>
                      <dd className="text-xs font-semibold tabular-nums text-foreground">
                        {formatPercentile(hoveredBin.percentile)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export type { ScoreDistributionChartProps };
