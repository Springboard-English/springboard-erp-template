"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { touchHitArea } from "@/lib/touchTarget"
import { useI18n } from "@/context/I18nContext"
import { uiPresetClass } from "@/config/uiPreset"
import {
  asChildRender,
  rendersNativeButton,
  focusOption,
  guardDismiss,
  mergeRefs,
  useDismissGuards,
  DismissGuardContext,
  type DismissGuards,
} from "@/lib/primitiveCompat"
// Relative, not `@/`: this type is emitted into the package's d.ts.
import type { PopupContentCompatProps } from "./dialog"

/** A panel that slides in from an edge. Wrap a `SheetTrigger` and a `SheetContent`. */
function Sheet({ onOpenChange, ...props }: SheetPrimitive.Root.Props) {
  const guards = React.useRef<DismissGuards>({})
  return (
    <DismissGuardContext.Provider value={guards}>
      <SheetPrimitive.Root
        data-slot="sheet"
        onOpenChange={(open, details) => {
          if (!open && guardDismiss(guards, details)) return
          onOpenChange?.(open, details)
        }}
        {...props}
      />
    </DismissGuardContext.Provider>
  )
}

/** Opens the sheet. `asChild` makes the single child the trigger. */
function SheetTrigger({
  asChild,
  children,
  ...props
}: SheetPrimitive.Trigger.Props & { asChild?: boolean }) {
  const render = asChildRender(asChild, children)
  return (
    <SheetPrimitive.Trigger
      data-slot="sheet-trigger"
      render={render}
      nativeButton={rendersNativeButton(render)}
      {...props}
    >
      {render ? undefined : children}
    </SheetPrimitive.Trigger>
  )
}

/** Closes the sheet. `asChild` makes the single child the close control. */
function SheetClose({
  asChild,
  children,
  ...props
}: SheetPrimitive.Close.Props & { asChild?: boolean }) {
  const render = asChildRender(asChild, children)
  return (
    <SheetPrimitive.Close
      data-slot="sheet-close"
      render={render}
      nativeButton={rendersNativeButton(render)}
      {...props}
    >
      {render ? undefined : children}
    </SheetPrimitive.Close>
  )
}

/** Mounts the sheet at the end of `<body>`. */
function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

/** The dimmed backdrop behind the sheet. */
function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-[60] bg-black/50 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
        uiPresetClass("overlay"),
        className
      )}
      {...props}
    />
  )
}

/** The sheet panel, pinned to `side`, with its overlay and a close button. Focus and dismiss handlers work as on `DialogContent`. */
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  initialFocus,
  finalFocus,
  ref,
  ...props
}: SheetPrimitive.Popup.Props &
  PopupContentCompatProps & {
    side?: "top" | "right" | "bottom" | "left"
    showCloseButton?: boolean
  }) {
  const { t } = useI18n()
  // The open edge is passed as `variant` so a preset can style, say, a bottom
  // sheet differently from a side one.
  const presetClass = uiPresetClass("sheetContent", { variant: side })
  const popupRef = React.useRef<HTMLDivElement>(null)
  useDismissGuards({ onEscapeKeyDown, onPointerDownOutside, onInteractOutside })
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        ref={mergeRefs(popupRef, ref)}
        initialFocus={focusOption(onOpenAutoFocus, "openAutoFocus", popupRef, initialFocus)}
        finalFocus={focusOption(onCloseAutoFocus, "closeAutoFocus", popupRef, finalFocus)}
        className={cn(
          "fixed z-[60] flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-closed:animate-out data-closed:duration-300 data-open:animate-in data-open:duration-500",
          side === "right" &&
            "inset-y-0 right-0 h-full w-3/4 border-l data-closed:slide-out-to-right data-open:slide-in-from-right sm:max-w-sm",
          side === "left" &&
            "inset-y-0 left-0 h-full w-3/4 border-r data-closed:slide-out-to-left data-open:slide-in-from-left sm:max-w-sm",
          side === "top" &&
            "inset-x-0 top-0 h-auto border-b data-closed:slide-out-to-top data-open:slide-in-from-top",
          side === "bottom" &&
            "inset-x-0 bottom-0 h-auto border-t data-closed:slide-out-to-bottom data-open:slide-in-from-bottom",
          presetClass,
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            className={cn(
              "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none",
              touchHitArea,
            )}
          >
            <XIcon className="size-4" />
            <span className="sr-only">{t("common.close")}</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

/** The title block at the top of a sheet. */
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

/** The action row pinned to the bottom of a sheet. */
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

/** The sheet's heading, announced as its accessible name. */
function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  )
}

/** The sheet's supporting text. */
function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
