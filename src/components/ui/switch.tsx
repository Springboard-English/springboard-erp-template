import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"
import { touchHitArea } from "@/lib/touchTarget"
import { uiPresetClass } from "@/config/uiPreset"

/** An on/off toggle in two sizes, with a 44px tap area on touch. */
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      // A real <button>, as before, so `disabled:` styles and form focus order
      // keep working.
      nativeButton
      render={<button type="button" />}
      className={cn(
        touchHitArea,
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 border-muted p-0.5 shadow-xs transition-all duration-200 ease-bounce outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[30px] data-[size=default]:w-[52px] data-[size=sm]:h-5 data-[size=sm]:w-9 data-checked:border-primary data-checked:bg-primary data-unchecked:border-input data-unchecked:bg-input",
        uiPresetClass("switch", { size }),
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-bounce group-data-[size=default]/switch:size-[22px] group-data-[size=sm]/switch:size-4 data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0",
          uiPresetClass("switchThumb", { size })
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
