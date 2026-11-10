"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

/** A hairline rule, horizontal by default. `decorative` is accepted for callers written against the old API and ignored. */
function Separator({
  className,
  orientation = "horizontal",
  // Base UI always exposes the rule as a separator; the flag is kept so
  // existing call sites keep compiling.
  decorative: _decorative,
  ...props
}: SeparatorPrimitive.Props & { decorative?: boolean }) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
