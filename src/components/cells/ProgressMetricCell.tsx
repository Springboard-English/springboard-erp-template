import type { ReactNode } from 'react';

type ProgressMetricCellProps = {
  topLabel?: ReactNode;
  primaryLabel: ReactNode;
  secondaryLabel?: ReactNode;
  percent: number;
  bottomLabel?: ReactNode;
  bottomLeftLabel?: ReactNode;
  bottomRightLabel?: ReactNode;
};

function normalizePercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

export default function ProgressMetricCell({
  topLabel,
  primaryLabel,
  secondaryLabel,
  percent,
  bottomLabel,
  bottomLeftLabel,
  bottomRightLabel,
}: ProgressMetricCellProps) {
  const normalizedPercent = normalizePercent(percent);
  const isOverLimit = normalizedPercent > 100;
  const progressWidth = Math.min(100, normalizedPercent);

  return (
    <div className="flex min-w-[220px] flex-col gap-1.5">
      {topLabel ? (
        <div className="truncate text-[11px] text-muted-foreground">
          {topLabel}
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="truncate">{primaryLabel}</span>
        {secondaryLabel ? <span className="shrink-0 tabular-nums">{secondaryLabel}</span> : null}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/70">
        <div
          className={`h-full rounded-full transition-[width] ${isOverLimit ? 'bg-destructive' : 'bg-primary'}`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
      {bottomLeftLabel || bottomRightLabel ? (
        <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <span className="truncate">{bottomLeftLabel}</span>
          <span className="truncate text-right">{bottomRightLabel}</span>
        </div>
      ) : bottomLabel ? (
        <div className="truncate text-[11px] text-muted-foreground">{bottomLabel}</div>
      ) : null}
    </div>
  );
}
