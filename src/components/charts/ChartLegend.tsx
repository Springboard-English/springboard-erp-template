import { cn } from '@/lib/utils';

export interface ChartLegendItem {
  label: string;
  color: string;
  value?: string | number;
}

interface ChartLegendProps {
  items: ChartLegendItem[];
  className?: string;
}

/**
 * A legend is present whenever a chart draws two or more series, so identity is
 * never carried by colour alone. The swatch wears the series colour; the text
 * stays in the theme's ink.
 */
export default function ChartLegend({ items, className }: ChartLegendProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
          {item.value !== undefined ? (
            <span className="text-xs font-medium tabular-nums text-foreground">
              {item.value}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
