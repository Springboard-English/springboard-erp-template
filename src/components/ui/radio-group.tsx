import { CircleIcon } from "lucide-react"
import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"
import { touchHitArea } from "@/lib/touchTarget"

/** A set of `RadioGroupItem`s sharing one value; a vertical grid by default. */
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

/** One radio button, 20px with a 44px tap area on touch. */
function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      // A real <button>, as before, so `disabled:` styles keep working.
      nativeButton
      render={<button type="button" />}
      className={cn(
        touchHitArea,
        "relative aspect-square size-5 shrink-0 rounded-full border-2 border-input bg-card text-primary shadow-xs transition-all duration-200 ease-bounce outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error data-checked:border-primary dark:bg-input/30",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 fill-primary" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
