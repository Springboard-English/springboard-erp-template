import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatTileProps {
  label: string;
  value: ReactNode;
  /** A short qualifier under the value — "of 412 all time", "12% of intake". */
  hint?: ReactNode;
  /** Optional accent dot, for tiles that pair with a series in a nearby chart. */
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * A single headline number. This is the right form for one value — a one-bar
 * bar chart is not.
 *
 * The value uses proportional figures; tabular figures are for columns that
 * must align vertically, which a tile is not.
 */
export default function StatTile({
  label,
  value,
  hint,
  accentColor,
  className,
  onClick,
}: StatTileProps) {
  const content = (
    <>
      <div className="flex items-center gap-1.5">
        {accentColor ? (
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        ) : null}
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-2 text-2xl font-semibold leading-none text-foreground">
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </>
  );

  const classes = cn(
    'rounded-2xl border border-border/70 bg-card px-4 py-3.5 text-left',
    onClick && 'transition-colors hover:bg-muted/30',
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
