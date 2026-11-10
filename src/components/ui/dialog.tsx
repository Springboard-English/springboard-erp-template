import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { touchHitArea } from "@/lib/touchTarget"
import { Button } from "@/components/ui/button"
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
  type AutoFocusEvent,
  type DismissGuards,
  // Relative, not `@/`: these types are emitted into the package's d.ts.
} from "../../lib/primitiveCompat"

/** Props every popup content keeps from the old API: focus and dismiss handlers that `preventDefault()` to opt out. */
export interface PopupContentCompatProps extends DismissGuards {
  onOpenAutoFocus?: (event: AutoFocusEvent) => void
  onCloseAutoFocus?: (event: AutoFocusEvent) => void
}

/** A modal dialog. Wrap a `DialogTrigger` and a `DialogContent`; `open`/`onOpenChange` control it. */
function Dialog({ onOpenChange, ...props }: DialogPrimitive.Root.Props) {
  const guards = React.useRef<DismissGuards>({})
  return (
    <DismissGuardContext.Provider value={guards}>
      <DialogPrimitive.Root
        data-slot="dialog"
        onOpenChange={(open, details) => {
          // Content's `onEscapeKeyDown` and friends get first refusal.
          if (!open && guardDismiss(guards, details)) return
          onOpenChange?.(open, details)
        }}
        {...props}
      />
    </DismissGuardContext.Provider>
  )
}

/** Opens the dialog. `asChild` makes the single child the trigger. */
function DialogTrigger({
  asChild,
  children,
  ...props
}: DialogPrimitive.Trigger.Props & { asChild?: boolean }) {
  const render = asChildRender(asChild, children)
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      render={render}
      nativeButton={rendersNativeButton(render)}
      {...props}
    >
      {render ? undefined : children}
    </DialogPrimitive.Trigger>
  )
}

/** Mounts the dialog at the end of `<body>`. */
function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

/** Closes the dialog. `asChild` makes the single child the close control. */
function DialogClose({
  asChild,
  children,
  ...props
}: DialogPrimitive.Close.Props & { asChild?: boolean }) {
  const render = asChildRender(asChild, children)
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      render={render}
      nativeButton={rendersNativeButton(render)}
      {...props}
    >
      {render ? undefined : children}
    </DialogPrimitive.Close>
  )
}

/** The dimmed backdrop behind the dialog. */
function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-[60] bg-black/50 data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0",
        uiPresetClass("overlay"),
        className
      )}
      {...props}
    />
  )
}

/**
 * The dialog panel, centred, with its overlay and a close button.
 * `onOpenAutoFocus`/`onCloseAutoFocus` and the dismiss handlers keep their
 * old meaning: `preventDefault()` keeps focus where it is or keeps the
 * dialog open.
 */
function DialogContent({
  className,
  children,
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
}: DialogPrimitive.Popup.Props &
  PopupContentCompatProps & {
    showCloseButton?: boolean
  }) {
  const { t } = useI18n()
  const presetClass = uiPresetClass("dialogContent")
  const popupRef = React.useRef<HTMLDivElement>(null)
  useDismissGuards({ onEscapeKeyDown, onPointerDownOutside, onInteractOutside })
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        ref={mergeRefs(popupRef, ref)}
        initialFocus={focusOption(onOpenAutoFocus, "openAutoFocus", popupRef, initialFocus)}
        finalFocus={focusOption(onCloseAutoFocus, "closeAutoFocus", popupRef, finalFocus)}
        className={cn(
          "fixed top-[50%] left-[50%] z-[60] grid max-h-[calc(100vh-1rem)] w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 sm:max-w-lg",
          presetClass,
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className={cn(
              // A 24px box round the 16px icon (WCAG 2.5.8), the icon where it always sat.
              "absolute top-3 right-3 inline-flex size-6 items-center justify-center rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              touchHitArea,
            )}
          >
            <XIcon />
            <span className="sr-only">{t("common.close")}</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

/** The title block at the top of a dialog. */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

/** The action row at the bottom of a dialog; `showCloseButton` adds an outline Close. */
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const { t } = useI18n()
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "shrink-0 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          {t("common.close")}
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

/** The dialog's heading, announced as its accessible name. */
function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

/** The dialog's supporting text. `asChild` renders the single child as the description. */
function DialogDescription({
  className,
  asChild,
  children,
  ...props
}: DialogPrimitive.Description.Props & { asChild?: boolean }) {
  const render = asChildRender(asChild, children)
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      render={render}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {render ? undefined : children}
    </DialogPrimitive.Description>
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
