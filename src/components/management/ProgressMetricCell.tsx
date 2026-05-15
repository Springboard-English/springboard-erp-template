type ProgressMetricCellProps = {
  primaryLabel: string;
  secondaryLabel?: string;
  percent: number;
};

function clampPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  return value;
}

export default function ProgressMetricCell({
  primaryLabel,
  secondaryLabel,
  percent,
}: ProgressMetricCellProps) {
  const normalizedPercent = clampPercent(percent);
  const isOverflow = normalizedPercent > 100;
  const trackPercent = Math.min(100, normalizedPercent);

  return (
    <div className="flex min-w-[220px] flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="truncate">{primaryLabel}</span>
        {secondaryLabel ? (
          <span className="shrink-0 tabular-nums">{secondaryLabel}</span>
        ) : null}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/70">
        <div
          className={`h-full rounded-full transition-[width] ${isOverflow ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${trackPercent}%` }}
        />
      </div>
    </div>
  );
}
