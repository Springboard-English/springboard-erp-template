import * as Popover from "@radix-ui/react-popover";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useIsMobile from "@/hooks/useIsMobile";
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

/**
 * A list page's filter fields behind its Filters toggle: a popover under the
 * toggle on desktop, a full-screen dialog with the actions pinned to the
 * bottom on a phone.
 */
export default function AdvancedFiltersPanel(props: AdvancedFiltersPanelProps) {
  const isMobile = useIsMobile();
  return isMobile ? <FiltersDialog {...props} /> : <FiltersPopover {...props} />;
}

/** The desktop popover, anchored under the toggle and as wide as the page allows. */
function FiltersPopover({
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
              <span className="text-[11px] font-semibold text-muted-foreground/50">
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

/** The phone dialog: fills the screen, fields scroll, actions stay above the home indicator. */
function FiltersDialog({
  open,
  onOpenChange,
  trigger,
  onClear,
  onApply,
  children,
  className,
}: AdvancedFiltersPanelProps) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className={cn(
          "inset-0 top-0 left-0 flex h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 p-0",
          "data-[state=open]:slide-in-from-bottom-4 data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100",
          className,
        )}
      >
        <div className="flex min-h-14 shrink-0 items-center border-b border-border/60 px-4 pr-14 pt-[env(safe-area-inset-top)]">
          <DialogTitle className="text-base">{t("common.filters")}</DialogTitle>
          {/* Radix warns without a description; the title says it all. */}
          <DialogDescription className="sr-only">{t("common.filters")}</DialogDescription>
        </div>
        <div className="grid min-h-0 flex-1 content-start gap-4 overflow-y-auto px-4 py-4 [&>*]:min-w-0">
          {children}
        </div>
        <div className="flex shrink-0 gap-2 border-t border-border/60 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          {onClear && (
            <Button type="button" variant="outline" className="flex-1" onClick={onClear}>
              {t("common.clearAll")}
            </Button>
          )}
          {onApply ? (
            <Button type="button" className="flex-1" onClick={onApply}>
              {t("common.applyFilters")}
            </Button>
          ) : (
            <Button type="button" className="flex-1" onClick={() => onOpenChange(false)}>
              {t("common.close")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
