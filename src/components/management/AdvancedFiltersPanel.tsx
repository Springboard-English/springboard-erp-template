import * as Popover from "@radix-ui/react-popover";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";

export interface AdvancedFiltersPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  onClear?: () => void;
  onApply?: () => void;
  children: ReactNode;
  className?: string;
  gridClassName?: string;
}

export default function AdvancedFiltersPanel({
  open,
  onOpenChange,
  trigger,
  onClear,
  onApply,
  children,
  className,
  gridClassName,
}: AdvancedFiltersPanelProps) {
  const { t } = useI18n();
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          side="bottom"
          sideOffset={6}
          className={cn(
            "z-20 w-[min(calc(100vw-2rem),72rem)]",
            "outline-none data-[state=closed]:pointer-events-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          )}
        >
          <div
            className={cn(
              "rounded-lg border border-border/60 bg-background px-4 pb-4 pt-3 shadow-lg",
              className,
            )}
          >
            <div className="mb-3 flex items-center gap-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                {t("common.filters")}
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <div
              className={cn(
                "grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(18rem,100%),1fr))] [&>*]:min-w-0",
                gridClassName,
              )}
            >
              {children}
            </div>
            {(onClear || onApply) && (
              <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/30 pt-3">
                {onClear && (
                  <Button type="button" size="sm" variant="ghost" onClick={onClear}>
                    {t("common.clearAll")}
                  </Button>
                )}
                {onApply && (
                  <Button type="button" size="sm" onClick={onApply}>
                    {t("common.applyFilters")}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
