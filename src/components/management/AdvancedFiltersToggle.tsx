import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";

export interface AdvancedFiltersToggleProps {
  open: boolean;
  onToggle?: () => void;
  activeCount?: number;
  className?: string;
}

const AdvancedFiltersToggle = forwardRef<
  HTMLButtonElement,
  AdvancedFiltersToggleProps & ComponentPropsWithoutRef<"button">
>(function AdvancedFiltersToggle({
  open,
  onToggle,
  activeCount = 0,
  className,
  onClick,
  ...buttonProps
}, ref) {
  const { t } = useI18n();
  const hasActive = activeCount > 0;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      onToggle?.();
    }
  };

  return (
    <Button
      ref={ref}
      type="button"
      variant={open || hasActive ? "secondary" : "outline"}
      onClick={handleClick}
      className={cn("gap-1.5", className)}
      {...buttonProps}
    >
      <SlidersHorizontal className="size-4" />
      {t("common.filters")}
      {hasActive && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground">
          {activeCount}
        </span>
      )}
    </Button>
  );
});

export default AdvancedFiltersToggle;
