import { CheckIcon, MinusIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"
import { touchHitArea } from "@/lib/touchTarget"

type CheckedState = boolean | "indeterminate"

/**
 * The suite's checkbox: 26px with a 44px tap area on touch. `checked` may be
 * `"indeterminate"`, which draws a dash; `data-state` mirrors it for callers
 * that style on it.
 */
function Checkbox({
  className,
  checked,
  defaultChecked,
  indeterminate: indeterminateProp,
  onCheckedChange,
  ...props
}: Omit<CheckboxPrimitive.Root.Props, "checked" | "defaultChecked" | "onCheckedChange"> & {
  checked?: CheckedState
  defaultChecked?: CheckedState
  onCheckedChange?: (checked: boolean) => void
}) {
  const indeterminate =
    indeterminateProp ?? (checked === "indeterminate" || (checked === undefined && defaultChecked === "indeterminate"))
  const dataState =
    checked === undefined ? undefined : indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-state={dataState}
      // A real <button>, as before, so `disabled:` styles and the `peer`
      // relationship with a sibling label keep working.
      nativeButton
      render={<button type="button" />}
      checked={checked === undefined ? undefined : checked === true}
      defaultChecked={defaultChecked === undefined ? undefined : defaultChecked === true}
      indeterminate={indeterminate}
      onCheckedChange={onCheckedChange ? (next) => onCheckedChange(next) : undefined}
      className={cn(
        touchHitArea,
        "peer relative size-[26px] shrink-0 rounded-[9px] border-2 border-input bg-card shadow-xs transition-all duration-200 ease-bounce outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error data-checked:border-primary data-checked:bg-primary data-checked:text-white data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-white dark:bg-input/30",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        {indeterminate ? (
          <MinusIcon className="size-4" strokeWidth={3} />
        ) : (
          <CheckIcon className="size-4" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
