import * as React from "react"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"
import { touchTargetHeight } from "@/lib/touchTarget"
import { uiPresetClass } from "@/config/uiPreset"
import {
  asChildRender,
  rendersNativeButton,
  focusOption,
  mergeRefs,
  radixPopupVars,
  type AutoFocusEvent,
  // Relative, not `@/`: these types are emitted into the package's d.ts.
} from "../../lib/primitiveCompat"

// Items close the menu themselves after `onSelect`, so they need a handle on
// the root; Base UI exposes one through `actionsRef`.
const ActionsContext = React.createContext<React.RefObject<MenuPrimitive.Root.Actions | null> | null>(null)

/** An action menu opened from a trigger. */
function DropdownMenu({ actionsRef, ...props }: MenuPrimitive.Root.Props) {
  const ownActions = React.useRef<MenuPrimitive.Root.Actions | null>(null)
  const actions = actionsRef ?? ownActions
  return (
    <ActionsContext.Provider value={actions}>
      <MenuPrimitive.Root data-slot="dropdown-menu" actionsRef={actions} {...props} />
    </ActionsContext.Provider>
  )
}

/** Mounts the menu at the end of `<body>`. */
function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

/** Opens the menu. `asChild` makes the single child the trigger. */
function DropdownMenuTrigger({
  asChild,
  children,
  ...props
}: MenuPrimitive.Trigger.Props & { asChild?: boolean }) {
  const render = asChildRender(asChild, children)
  return (
    <MenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      render={render}
      nativeButton={rendersNativeButton(render)}
      {...props}
    >
      {render ? undefined : children}
    </MenuPrimitive.Trigger>
  )
}

type PositionProps = Pick<
  MenuPrimitive.Positioner.Props,
  "align" | "alignOffset" | "side" | "sideOffset" | "collisionPadding" | "collisionBoundary" | "sticky"
> & { avoidCollisions?: boolean }

/**
 * The menu panel. Positioning props go to the positioner; `onCloseAutoFocus`
 * may `preventDefault()` to leave focus where it is. Defines the
 * `--radix-dropdown-menu-*` variables so a caller's width class keeps working.
 */
function DropdownMenuContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  collisionPadding,
  collisionBoundary,
  sticky,
  avoidCollisions = true,
  onCloseAutoFocus,
  finalFocus,
  style,
  ref,
  ...props
}: MenuPrimitive.Popup.Props &
  PositionProps & { onCloseAutoFocus?: (event: AutoFocusEvent) => void }) {
  const popupRef = React.useRef<HTMLDivElement>(null)
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        collisionBoundary={collisionBoundary}
        sticky={sticky}
        collisionAvoidance={avoidCollisions ? undefined : { side: "none", align: "none" }}
        className="isolate z-[60] outline-none"
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          ref={mergeRefs(popupRef, ref)}
          finalFocus={focusOption(onCloseAutoFocus, "closeAutoFocus", popupRef, finalFocus)}
          style={{ ...radixPopupVars("dropdown-menu"), ...style }}
          className={cn(
            "z-[60] max-h-(--available-height) min-w-[8rem] origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            uiPresetClass("popup", { variant: "menu" }),
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

/** Groups related items, optionally under a `DropdownMenuLabel`. */
function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

/** The event an item's `onSelect` receives; `preventDefault()` keeps the menu open. */
export interface MenuSelectEvent {
  type: "select"
  target: EventTarget | null
  currentTarget: EventTarget | null
  nativeEvent: Event
  defaultPrevented: boolean
  preventDefault(): void
  stopPropagation(): void
}

/** Props an item keeps from the old API: `onSelect` fires on click or Enter, and `textValue` names it for type-ahead. */
interface ItemCompatProps {
  onSelect?: (event: MenuSelectEvent) => void
  textValue?: string
}

/**
 * Turns an `onSelect` handler into the item's `onClick`. The menu closes after
 * the handler unless it called `preventDefault()`; that is why the item takes
 * over closing from Base UI.
 */
function useSelectHandler(
  onSelect: ((event: MenuSelectEvent) => void) | undefined,
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined,
): React.MouseEventHandler<HTMLDivElement> | undefined {
  const actions = React.useContext(ActionsContext)
  if (!onSelect) return onClick
  return (event) => {
    onClick?.(event)
    let prevented = false
    const select: MenuSelectEvent = {
      type: "select",
      target: event.target,
      currentTarget: event.currentTarget,
      nativeEvent: event.nativeEvent,
      get defaultPrevented() {
        return prevented
      },
      preventDefault() {
        prevented = true
      },
      stopPropagation() {
        event.stopPropagation()
      },
    }
    onSelect(select)
    if (!prevented) actions?.current?.close()
  }
}

/** One action. `variant="destructive"` colours it red; `inset` aligns it with items that have an indicator. */
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  onSelect,
  onClick,
  textValue,
  label,
  closeOnClick,
  ...props
}: MenuPrimitive.Item.Props &
  ItemCompatProps & {
    inset?: boolean
    variant?: "default" | "destructive"
  }) {
  const handleClick = useSelectHandler(onSelect, onClick)
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      label={label ?? textValue}
      onClick={handleClick}
      closeOnClick={onSelect ? false : closeOnClick}
      className={cn(
        touchTargetHeight,
        "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        uiPresetClass("listItem", { variant: "menu" }),
        className
      )}
      {...props}
    />
  )
}

/** An item that toggles a boolean, with a check mark when on. */
function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onSelect,
  onClick,
  textValue,
  label,
  closeOnClick,
  ...props
}: MenuPrimitive.CheckboxItem.Props & ItemCompatProps) {
  const handleClick = useSelectHandler(onSelect, onClick)
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      label={label ?? textValue}
      onClick={handleClick}
      closeOnClick={onSelect ? false : closeOnClick}
      className={cn(
        touchTargetHeight,
        "relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        uiPresetClass("listItem", { variant: "menu" }),
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-4" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

/** A set of `DropdownMenuRadioItem`s sharing one value. */
function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

/** One choice in a `DropdownMenuRadioGroup`, with a dot when chosen. */
function DropdownMenuRadioItem({
  className,
  children,
  onSelect,
  onClick,
  textValue,
  label,
  closeOnClick,
  ...props
}: MenuPrimitive.RadioItem.Props & ItemCompatProps) {
  const handleClick = useSelectHandler(onSelect, onClick)
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      label={label ?? textValue}
      onClick={handleClick}
      closeOnClick={onSelect ? false : closeOnClick}
      className={cn(
        touchTargetHeight,
        "relative flex cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        uiPresetClass("listItem", { variant: "menu" }),
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.RadioItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

/** A non-interactive heading inside the menu. A plain div, so it may sit outside a `DropdownMenuGroup`. */
function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean
}) {
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

/** A rule between groups of items. */
function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

/** A keyboard hint at the right edge of an item. */
function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** A nested menu; wrap a `DropdownMenuSubTrigger` and a `DropdownMenuSubContent`. */
function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

/** The item that opens a nested menu, with a chevron. */
function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  inset?: boolean
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        touchTargetHeight,
        "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[inset]:pl-8 data-popup-open:bg-accent data-popup-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        uiPresetClass("listItem", { variant: "menu" }),
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

/** The nested menu's panel, opening beside its trigger. */
function DropdownMenuSubContent({
  className,
  align = "start",
  alignOffset = -4,
  side = "right",
  sideOffset = 0,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      className={cn("min-w-[8rem] overflow-hidden shadow-lg", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
