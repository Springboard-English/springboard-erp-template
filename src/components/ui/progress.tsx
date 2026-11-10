import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

/** A shimmering progress bar. `className` sizes the bar itself; `value` is 0–100 and reads as 0 when missing. */
function Progress({
  className,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      // The root is the visible bar, so a caller's `h-2` lands where it did.
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      value={value ?? 0}
      {...props}
    >
      <ProgressPrimitive.Track data-slot="progress-track" className="size-full">
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="springboard-shimmer h-full rounded-full transition-all duration-500 ease-soft"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
