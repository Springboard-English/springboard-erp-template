import { cn } from '@/lib/utils';
import ChartLegend from '@/components/charts/ChartLegend';
import { useChartPalette } from '@/components/charts/palette';

export interface FunnelStage {
  key: string;
  label: string;
  /** Bar length — how many reached this stage. */
  reached: number;
  /** Breakdown of those sitting here now. Rendered as a second, inset bar. */
  current?: { accepted: number; inProgress: number; declined: number };
}

interface FunnelBarsProps {
  stages: FunnelStage[];
  emptyMessage?: string;
  className?: string;
  onStageClick?: (stage: FunnelStage) => void;
}

/**
 * A horizontal stage funnel.
 *
 * Horizontal because stage names are words, not dates — a vertical version
 * would either rotate the labels or truncate them. Each bar is scaled against
 * the widest stage rather than against its own predecessor, so the shape of the
 * drop-off is readable at a glance.
 *
 * Built from divs rather than SVG: the bars are rectangles with percentage
 * widths, which reflows for free and keeps the labels as real, selectable text.
 */
export default function FunnelBars({
  stages,
  emptyMessage = 'No stages to show.',
  className,
  onStageClick,
}: FunnelBarsProps) {
  const palette = useChartPalette();
  const max = Math.max(0, ...stages.map((stage) => stage.reached));

  if (stages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const hasCurrent = stages.some((stage) => stage.current);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {hasCurrent ? (
        <ChartLegend
          items={[
            { label: 'Reached', color: palette.series(0) },
            // Order matters: green next to red fails colour-vision separation,
            // so "in progress" sits between them. See palette.ts.
            { label: 'Here now · accepted', color: palette.outcome.accepted },
            { label: 'in progress', color: palette.outcome.inProgress },
            { label: 'declined', color: palette.outcome.declined },
          ]}
        />
      ) : null}
      <ol className="space-y-3">
        {stages.map((stage) => {
          const width = max > 0 ? (stage.reached / max) * 100 : 0;
          const current = stage.current;
          const currentTotal = current
            ? current.accepted + current.inProgress + current.declined
            : 0;
          const row = (
            <>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="truncate text-sm font-medium text-foreground">
                  {stage.label}
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                  {stage.reached.toLocaleString()}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-md bg-muted/60">
                <div
                  className="h-full rounded-md transition-[width] duration-300"
                  style={{
                    width: `${width}%`,
                    backgroundColor: palette.series(0),
                  }}
                />
              </div>
              {current && currentTotal > 0 ? (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1">
                    {/* Scaled against the same maximum as the bar above it. An
                        earlier version let this row fill its container, so 22
                        here-now drew exactly as wide as 50 — the one thing a
                        bar must never do. */}
                    <div
                      className="flex h-1.5 gap-[2px]"
                      style={{
                        width: `${max > 0 ? (currentTotal / max) * 100 : 0}%`,
                      }}
                    >
                      {/* A 2px surface gap separates the segments; nothing is
                          outlined. */}
                      {(
                        [
                          ['accepted', current.accepted, palette.outcome.accepted],
                          ['inProgress', current.inProgress, palette.outcome.inProgress],
                          ['declined', current.declined, palette.outcome.declined],
                        ] as const
                      )
                        .filter(([, value]) => value > 0)
                        .map(([key, value, color]) => (
                          <div
                            key={key}
                            className="h-full rounded-full"
                            style={{
                              width: `${(value / currentTotal) * 100}%`,
                              backgroundColor: color,
                            }}
                          />
                        ))}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {currentTotal.toLocaleString()} here now
                  </span>
                </div>
              ) : null}
            </>
          );

          return (
            <li key={stage.key}>
              {onStageClick ? (
                <button
                  type="button"
                  onClick={() => onStageClick(stage)}
                  className="w-full rounded-lg text-left transition-opacity hover:opacity-80"
                >
                  {row}
                </button>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
