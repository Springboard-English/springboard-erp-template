import type { ReactNode } from 'react';

/** The bar's colour: a status ink, or neutral grey for something that needs nothing. */
export type ProgressMetricTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

// Each falls back to the status ink for an app that does not load tokens.css
const TONE_BAR: Record<ProgressMetricTone, string> = {
  neutral: 'bg-[var(--bar-idle,var(--muted-foreground))]',
  info: 'bg-[var(--bar-blue,var(--info))]',
  success: 'bg-[var(--bar-green,var(--success))]',
  warning: 'bg-[var(--bar-amber,var(--warning))]',
  error: 'bg-[var(--bar-red,var(--error))]',
};

type ProgressMetricCellProps = {
  tone?: ProgressMetricTone;
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

/** Labels around a progress bar; past 100% the bar turns destructive whatever its tone. */
export default function ProgressMetricCell({
  tone = 'info',
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
        <div className="truncate text-xs text-muted-foreground">
          {topLabel}
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="truncate">{primaryLabel}</span>
        {secondaryLabel ? <span className="shrink-0 tabular-nums">{secondaryLabel}</span> : null}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--track,color-mix(in_oklab,var(--muted)_70%,transparent))]">
        <div
          className={`h-full rounded-full transition-[width] ${isOverLimit ? 'bg-destructive' : TONE_BAR[tone]}`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
      {bottomLeftLabel || bottomRightLabel ? (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="truncate">{bottomLeftLabel}</span>
          <span className="truncate text-right">{bottomRightLabel}</span>
        </div>
      ) : bottomLabel ? (
        <div className="truncate text-xs text-muted-foreground">{bottomLabel}</div>
      ) : null}
    </div>
  );
}
