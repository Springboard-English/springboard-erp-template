import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdvancedFiltersPanelProps {
  open: boolean;
  onClear: () => void;
  onApply: () => void;
  children: ReactNode;
  className?: string;
  gridClassName?: string;
}

export default function AdvancedFiltersPanel({
  open,
  onClear,
  onApply,
  children,
  className,
  gridClassName,
}: AdvancedFiltersPanelProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={cn("rounded-lg border border-border/70 bg-card/60 p-3", className)}>
      <div
        className={cn(
          "grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(min(18rem,100%),1fr))] [&>*]:min-w-0",
          gridClassName,
        )}
      >
        {children}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClear}>
          Clear filters
        </Button>
        <Button type="button" onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}
