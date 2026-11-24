import { useState, type FocusEvent } from 'react';
import { cn } from '@/lib/utils';
import { useChartPalette } from '@/components/charts/palette';
import { useChartWidth } from '@/components/charts/useChartWidth';

/** One line: a value per point on the x axis, null where it has none. */
export interface LineChartSeries {
  id: string;
  label: string;
  /** A literal colour (`palette.skill(...)`, `palette.series(i)`); the line, dots and swatch draw in it. */
  color: string;
  values: Array<number | null>;
  /** The headline line is drawn thicker. */
  emphasis?: boolean;
}

/** A shaded band, low to high per point, such as a class's middle half. */
export interface LineChartBand {
  label: string;
  color: string;
  low: Array<number | null>;
  high: Array<number | null>;
}

export interface LineChartProps {
  /** The x axis text, one per point, oldest first. */
  labels: string[];
  series: LineChartSeries[];
  band?: LineChartBand;
  ariaLabel: string;
  /** The drawing's height in pixels; the width follows the container. */
  height?: number;
  /** The y axis runs from 0 to this. */
  max?: number;
  /** Gridlines, in axis units. */
  ticks?: number[];
  /** A value as text, for ticks and the tooltip ("64%"). */
  formatValue?: (value: number) => string;
  /** Opens a line's detail from its legend entry. */
  onSeriesClick?: (id: string) => void;
  /** Lift the pen where a point has no value; by default the line joins across it. */
  breakAtGaps?: boolean;
  className?: string;
}

const PADDING = { top: 12, right: 28, bottom: 32, left: 40 };
const DEFAULT_HEIGHT = 280;
// Within this many pixels of the right edge, the tooltip opens to the line's left.
const TIP_REACH = 200;

/** The x position of point `index` of `count`; a single point sits in the middle. */
export function lineX(index: number, count: number, width: number): number {
  const span = width - PADDING.left - PADDING.right;
  if (count <= 1) return PADDING.left + span / 2;
  return PADDING.left + (index * span) / (count - 1);
}

/** The y position of a value on a 0 to `max` axis. */
export function lineY(value: number, height: number, max = 100): number {
  return PADDING.top + ((max - value) * (height - PADDING.top - PADDING.bottom)) / max;
}

/**
 * An SVG path through the non-null values. A point with none is stepped over,
 * so the line joins its neighbours, unless `breakAtGaps` lifts the pen there.
 */
export function linePath(
  values: Array<number | null>,
  width: number,
  height: number,
  max = 100,
  breakAtGaps = false,
): string {
  let path = '';
  let pen = false;
  values.forEach((value, index) => {
    if (value === null) {
      if (breakAtGaps) pen = false;
      return;
    }
    path += `${pen ? 'L' : 'M'}${lineX(index, values.length, width).toFixed(1)},${lineY(value, height, max).toFixed(1)}`;
    pen = true;
  });
  return path;
}

/** A closed path over the points where both edges of the band are known. */
function bandPath(band: LineChartBand, width: number, height: number, max: number): string {
  const count = band.low.length;
  const known = band.low
    .map((low, index) => ({ index, low, high: band.high[index] }))
    .filter((p): p is { index: number; low: number; high: number } => p.low !== null && p.high !== null);
  if (known.length < 2) return '';
  const at = (index: number, value: number) =>
    `${lineX(index, count, width).toFixed(1)},${lineY(value, height, max).toFixed(1)}`;
  const top = known.map((p) => at(p.index, p.high));
  const bottom = known.slice().reverse().map((p) => at(p.index, p.low));
  return `M${top.join('L')}L${bottom.join('L')}Z`;
}

/** The point nearest an x position on the drawing. */
export function nearestIndex(x: number, count: number, width: number): number {
  if (count <= 1) return 0;
  const step = (width - PADDING.left - PADDING.right) / (count - 1);
  return Math.min(count - 1, Math.max(0, Math.round((x - PADDING.left) / step)));
}

/** One figure in the hover tooltip. */
export interface LinePointFigure {
  id: string;
  label: string;
  color: string;
  text: string;
  band?: boolean;
}

/** Every figure at one point, lines first then the band; a line with no value there is left out. */
export function linePointFigures(
  series: LineChartSeries[],
  band: LineChartBand | undefined,
  index: number,
  format: (value: number) => string,
): LinePointFigure[] {
  const figures: LinePointFigure[] = series.flatMap((line) => {
    const value = line.values[index];
    return value === null || value === undefined
      ? []
      : [{ id: line.id, label: line.label, color: line.color, text: format(value) }];
  });
  const low = band?.low[index];
  const high = band?.high[index];
  if (band && low != null && high != null) {
    figures.push({ id: 'band', label: band.label, color: band.color, text: `${format(low)}–${format(high)}`, band: true });
  }
  return figures;
}

const percent = (value: number) => `${Math.round(value * 10) / 10}%`;

/**
 * A line chart over time, dependency-free SVG drawn at the container's real
 * width so text keeps its size. Lines (one colour each, never by colour alone:
 * the legend names them) over an optional shaded band. Hovering or focusing a
 * legend entry brings its line forward and fades the rest; hovering the drawing
 * draws a crosshair at the nearest point with a tooltip of every figure there.
 * With `onSeriesClick`, a legend entry opens that line's detail. Values default
 * to percentages on a 0–100 axis.
 */
export default function LineChart({
  labels,
  series,
  band,
  ariaLabel,
  height = DEFAULT_HEIGHT,
  max = 100,
  ticks = [0, 25, 50, 75, 100],
  formatValue = percent,
  onSeriesClick,
  breakAtGaps = false,
  className,
}: LineChartProps) {
  const palette = useChartPalette();
  const { ref, width: measured } = useChartWidth<HTMLDivElement>();
  const width = Math.max(320, Math.round(measured));
  // The legend entry in focus: a series id, "band", or nothing.
  const [focused, setFocused] = useState<string | null>(null);
  // The point under the pointer, for the crosshair and its tooltip.
  const [hovered, setHovered] = useState<number | null>(null);
  const count = labels.length;
  // About one date per 110 px fits under the axis; the first and last always show.
  const labelEvery = Math.max(1, Math.ceil(count / Math.max(2, Math.floor(width / 110))));
  const area = band ? bandPath(band, width, height, max) : '';
  const dimmed = (id: string) => focused !== null && focused !== id;
  const focusProps = (id: string) => ({
    onMouseEnter: () => setFocused(id),
    onMouseLeave: () => setFocused(null),
    // Keyboard focus only: a dialog's auto-focus on its first button must not fade every other line.
    onFocus: (event: FocusEvent<HTMLButtonElement>) => {
      if (event.currentTarget.matches(':focus-visible')) setFocused(id);
    },
    onBlur: () => setFocused(null),
  });
  const legendClass = (id: string) =>
    cn(
      'flex items-center gap-1.5 rounded-sm transition-opacity hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      dimmed(id) && 'opacity-50',
    );

  return (
    <div className={cn('min-w-0', className)}>
      <div ref={ref} className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="block"
          role="img"
          aria-label={ariaLabel}
          onMouseMove={(event) => {
            if (count === 0) return;
            const box = event.currentTarget.getBoundingClientRect();
            setHovered(nearestIndex(event.clientX - box.left, count, width));
          }}
          onMouseLeave={() => setHovered(null)}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={width - PADDING.right}
                y1={lineY(tick, height, max)}
                y2={lineY(tick, height, max)}
                stroke={palette.grid}
              />
              <text
                x={PADDING.left - 6}
                y={lineY(tick, height, max) + 4}
                textAnchor="end"
                fontSize={11}
                className="fill-muted-foreground tabular-nums"
              >
                {formatValue(tick)}
              </text>
            </g>
          ))}
          {area && band && (
            <path
              d={area}
              fill={band.color}
              className="transition-[fill-opacity]"
              fillOpacity={focused === 'band' ? 0.25 : dimmed('band') ? 0.04 : 0.12}
            />
          )}
          {series.map((line) => (
            <g key={line.id} className="transition-opacity" opacity={dimmed(line.id) ? 0.15 : 1}>
              <path
                d={linePath(line.values, width, height, max, breakAtGaps)}
                fill="none"
                stroke={line.color}
                strokeWidth={(line.emphasis ? 3 : 2) + (focused === line.id ? 1.5 : 0)}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {line.values.map((value, index) =>
                value === null ? null : (
                  <circle
                    key={index}
                    cx={lineX(index, count, width)}
                    cy={lineY(value, height, max)}
                    r={(line.emphasis ? 4 : 3) + (index === hovered ? 2 : 0)}
                    fill={line.color}
                  >
                    <title>{`${line.label} · ${labels[index]}: ${formatValue(value)}`}</title>
                  </circle>
                ),
              )}
            </g>
          ))}
          {hovered !== null && (
            <line
              x1={lineX(hovered, count, width)}
              x2={lineX(hovered, count, width)}
              y1={PADDING.top}
              y2={height - PADDING.bottom}
              stroke={palette.axis}
              strokeDasharray="3 3"
              pointerEvents="none"
            />
          )}
          {labels.map((label, index) =>
            index % labelEvery === 0 || index === count - 1 ? (
              <text
                key={index}
                x={lineX(index, count, width)}
                y={height - 10}
                textAnchor="middle"
                fontSize={11}
                className="fill-muted-foreground"
              >
                {label}
              </text>
            ) : null,
          )}
        </svg>
        {hovered !== null && linePointFigures(series, band, hovered, formatValue).length > 0 && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-10 min-w-40 rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
            // Beside the crosshair, on whichever side has room, near the top of the drawing.
            style={{
              left: lineX(hovered, count, width),
              top: PADDING.top,
              transform:
                lineX(hovered, count, width) > width - TIP_REACH ? 'translateX(calc(-100% - 10px))' : 'translateX(10px)',
            }}
          >
            <div className="mb-1 font-medium">{labels[hovered]}</div>
            <ul className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-0.5">
              {linePointFigures(series, band, hovered, formatValue).map((figure) => (
                <li key={figure.id} className="contents">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="inline-block size-2 shrink-0 rounded-sm"
                      style={{ backgroundColor: figure.color, opacity: figure.band ? 0.35 : 1 }}
                      aria-hidden
                    />
                    <span className="truncate">{figure.label}</span>
                  </span>
                  <span className="whitespace-nowrap text-right tabular-nums">{figure.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {series.map((line) => (
          <li key={line.id}>
            <button
              type="button"
              aria-pressed={focused === line.id}
              className={legendClass(line.id)}
              {...focusProps(line.id)}
              onClick={onSeriesClick ? () => onSeriesClick(line.id) : undefined}
            >
              <span className="inline-block h-2 w-3 rounded-sm" style={{ backgroundColor: line.color }} aria-hidden />
              <span className={onSeriesClick ? 'underline decoration-dotted underline-offset-2' : undefined}>
                {line.label}
              </span>
            </button>
          </li>
        ))}
        {band && (
          <li>
            <button type="button" aria-pressed={focused === 'band'} className={legendClass('band')} {...focusProps('band')}>
              <span
                className="inline-block h-2 w-3 rounded-sm"
                style={{ backgroundColor: band.color, opacity: 0.3 }}
                aria-hidden
              />
              {band.label}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
