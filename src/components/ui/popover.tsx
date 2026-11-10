import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"
import { uiPresetClass } from "@/config/uiPreset"
import {
  asChildRender,
  rendersNativeButton,
  focusOption,
  guardDismiss,
  mergeRefs,
  radixPopupVars,
  useDismissGuards,
  DismissGuardContext,
  type DismissGuards,
} from "@/lib/primitiveCompat"
// Relative, not `@/`: this type is emitted into the package's d.ts.
import type { PopupContentCompatProps } from "./dialog"

// `PopoverAnchor` publishes its element here so `PopoverContent` can position
// against it instead of the trigger.
const AnchorContext = React.createContext<{
  anchor: Element | null
  setAnchor: (el: Element | null) => void
} | null>(null)

/** A floating panel anchored to its trigger (or a `PopoverAnchor`). */
function Popover({ onOpenChange, ...props }: PopoverPrimitive.Root.Props) {
  const guards = React.useRef<DismissGuards>({})
  const [anchor, setAnchor] = React.useState<Element | null>(null)
  const anchorValue = React.useMemo(() => ({ anchor, setAnchor }), [anchor])
  return (
    <DismissGuardContext.Provider value={guards}>
      <AnchorContext.Provider value={anchorValue}>
        <PopoverPrimitive.Root
          data-slot="popover"
          onOpenChange={(open, details) => {
            if (!open && guardDismiss(guards, details)) return
            onOpenChange?.(open, details)
          }}
          {...props}
        />
      </AnchorContext.Provider>
    </DismissGuardContext.Provider>
  )
}

/** Opens the popover. `asChild` makes the single child the trigger. */
function PopoverTrigger({
  asChild,
  children,
  ...props
}: PopoverPrimitive.Trigger.Props & { asChild?: boolean }) {
  const render = asChildRender(asChild, children)
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      render={render}
      nativeButton={rendersNativeButton(render)}
      {...props}
    >
      {render ? undefined : children}
    </PopoverPrimitive.Trigger>
  )
}

/** Positioner props a caller may set on `PopoverContent`, plus the old `avoidCollisions` switch. */
type PositionProps = Pick<
  PopoverPrimitive.Positioner.Props,
  "align" | "alignOffset" | "side" | "sideOffset" | "collisionPadding" | "collisionBoundary" | "sticky"
> & { avoidCollisions?: boolean }

/**
 * The floating panel. Positioning props go to the positioner; focus and
 * dismiss handlers work as on `DialogContent`. Defines the `--radix-popover-*`
 * variables so a caller's width class keeps working.
 */
function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  collisionPadding,
  collisionBoundary,
  sticky,
  avoidCollisions = true,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  initialFocus,
  finalFocus,
  style,
  ref,
  ...props
}: PopoverPrimitive.Popup.Props & PositionProps & PopupContentCompatProps) {
  const anchor = React.useContext(AnchorContext)?.anchor
  const popupRef = React.useRef<HTMLDivElement>(null)
  useDismissGuards({ onEscapeKeyDown, onPointerDownOutside, onInteractOutside })
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        collisionBoundary={collisionBoundary}
        sticky={sticky}
        collisionAvoidance={avoidCollisions ? undefined : { side: "none", align: "none" }}
        anchor={anchor ?? undefined}
        // z-[60] for the same reason as SelectContent: portalled to <body>,
        // so a Popover inside a Dialog sits beside the z-[60] overlay rather
        // than inside it, and at z-50 it would open invisibly behind it. The
        // searchable-select's own popover uses z-[60] too.
        className="isolate z-[60]"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          ref={mergeRefs(popupRef, ref)}
          initialFocus={focusOption(onOpenAutoFocus, "openAutoFocus", popupRef, initialFocus)}
          finalFocus={focusOption(onCloseAutoFocus, "closeAutoFocus", popupRef, finalFocus)}
          style={{ ...radixPopupVars("popover"), ...style }}
          className={cn(
            "z-[60] w-72 origin-(--transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            uiPresetClass("popup", { variant: "popover" }),
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

/** Marks the element the popover should hang from when that is not the trigger. `asChild` uses the single child. */
function PopoverAnchor({
  asChild,
  children,
  ref,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const ctx = React.useContext(AnchorContext)
  const render = asChildRender(asChild, children)
  return useRender({
    defaultTagName: "div",
    render,
    ref: mergeRefs<Element>((el) => ctx?.setAnchor(el), ref as React.Ref<Element>),
    props: {
      "data-slot": "popover-anchor",
      children: render ? undefined : children,
      ...props,
    },
  })
}

/** The title block of a popover. */
function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

/** The popover's heading. */
function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <div
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

/** The popover's supporting text. */
function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
}
