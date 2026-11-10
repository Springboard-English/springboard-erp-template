import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { touchTargetHeight } from "@/lib/touchTarget"
import { radixPopupVars } from "@/lib/primitiveCompat"

type SelectItems = Array<{ value: unknown; label: React.ReactNode }>

/**
 * Collects `{ value, label }` from every `SelectItem` in the tree so the
 * trigger can show the chosen item's label while the list is closed. Base UI
 * only shows the raw value without this map. Items rendered by a component
 * of the caller's own are not seen; pass `items` explicitly then.
 */
function collectItems(children: React.ReactNode, out: SelectItems = []): SelectItems {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    const props = child.props as { value?: unknown; children?: React.ReactNode }
    if (child.type === SelectItem) {
      out.push({ value: props.value, label: props.children })
    } else if (props.children) {
      collectItems(props.children, out)
    }
  })
  return out
}

type SelectProps = Omit<
  SelectPrimitive.Root.Props<string, false>,
  "onValueChange" | "value" | "defaultValue"
> & {
  value?: string | null
  defaultValue?: string | null
  /** Called with the chosen item's value. */
  onValueChange?: (value: string) => void
}

/** A single-choice dropdown of string values. Wrap a `SelectTrigger` (with `SelectValue`) and a `SelectContent` of `SelectItem`s. */
function Select({ items, children, onValueChange, ...props }: SelectProps) {
  const derived = React.useMemo(() => (items ? undefined : collectItems(children)), [items, children])
  return (
    <SelectPrimitive.Root
      data-slot="select"
      items={items ?? derived}
      // Base UI can report `null` on a clear; a single select of ours never
      // clears, so the callback keeps its one-string shape.
      onValueChange={onValueChange ? (value) => onValueChange(value as string) : undefined}
      {...props}
    >
      {children}
    </SelectPrimitive.Root>
  )
}

/** Groups related items, optionally under a `SelectLabel`. */
function SelectGroup({ ...props }: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

/** Shows the chosen item's label inside the trigger, or `placeholder` when nothing is chosen. */
function SelectValue({ ...props }: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/** The button that opens the list; a field-height control in two sizes. */
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        touchTargetHeight,
        "flex w-fit items-center justify-between gap-2 rounded-md border-2 border-input bg-card px-4 py-2 text-sm font-semibold whitespace-nowrap shadow-xs transition-all duration-200 ease-soft outline-none focus-visible:-translate-y-px focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-error data-[placeholder]:text-ink-300 data-[placeholder]:font-medium data-[size=default]:h-12 data-[size=sm]:h-9 md:pointer-fine:data-[size=default]:h-9 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon render={<ChevronDownIcon className="size-4 opacity-50" />} />
    </SelectPrimitive.Trigger>
  )
}

type PositionProps = Pick<
  SelectPrimitive.Positioner.Props,
  "align" | "alignOffset" | "side" | "sideOffset" | "collisionPadding"
> & {
  /** `item-aligned` overlaps the chosen item with the trigger; `popper` drops the list below it. */
  position?: "item-aligned" | "popper"
}

/**
 * The list. `position="item-aligned"` (default) lines the chosen item up with
 * the trigger, as a native select does; `popper` drops the list below.
 * Defines the `--radix-select-*` variables so a caller's width class keeps
 * working.
 */
function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 0,
  collisionPadding,
  style,
  ...props
}: SelectPrimitive.Popup.Props & PositionProps) {
  const popper = position === "popper"
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={popper ? sideOffset || 4 : sideOffset}
        collisionPadding={collisionPadding}
        alignItemWithTrigger={!popper}
        // z-[60], not z-50, and it has to match Dialog/Sheet exactly: this is
        // portalled to <body>, so it is a SIBLING of DialogOverlay (z-[60]),
        // not a child of it. At z-50 a Select opened inside a Dialog renders
        // underneath the overlay — it opens and is focusable, it is just
        // painted out of sight, which reads as "the dropdown doesn't open".
        // Equal z-index is enough — the select portal is appended after the
        // dialog's, so DOM order breaks the tie.
        className="isolate z-[60]"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-position={position}
          style={{ ...radixPopupVars("select"), ...style }}
          className={cn(
            "relative z-[60] max-h-(--available-height) min-w-[8rem] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border-2 bg-popover text-popover-foreground shadow-lg data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            popper && "w-full min-w-(--anchor-width)",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List className="p-1 scroll-my-1">{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

/** A non-interactive heading inside a `SelectGroup`. */
function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

/** One option; its children are the label shown in the list and in the trigger. `textValue` names it for type-ahead. */
function SelectItem({
  className,
  children,
  textValue,
  label,
  ...props
}: SelectPrimitive.Item.Props & { textValue?: string }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      label={label ?? textValue}
      className={cn(
        touchTargetHeight,
        "relative flex w-full cursor-pointer items-center gap-2 rounded-xs py-2 pr-8 pl-3 text-sm font-semibold outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/** A rule between groups of items. */
function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/** The arrow shown at the top of a list that scrolls. */
function SelectScrollUpButton({
  className,
  ...props
}: SelectPrimitive.ScrollUpArrow.Props) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  )
}

/** The arrow shown at the bottom of a list that scrolls. */
function SelectScrollDownButton({
  className,
  ...props
}: SelectPrimitive.ScrollDownArrow.Props) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
