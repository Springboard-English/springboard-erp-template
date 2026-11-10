// The primitives under components/ui are built on Base UI, but their public
// props keep the shape the apps were written against when they were Radix:
// `asChild` on anything that renders a child, `onSelect` on menu items,
// `onOpenAutoFocus` and the dismiss handlers on dialog and popover content,
// `--radix-*` CSS variables in a caller's className. This module holds the
// translations, so each component file stays a thin styling layer.

import * as React from "react"

// ---------------------------------------------------------------------------
// `asChild` → `render`
// ---------------------------------------------------------------------------

/**
 * Turns Radix's `asChild` into Base UI's `render` element. Returns the single
 * child element to render into, or `undefined` when `asChild` is off. Like
 * Radix's Slot, exactly one element child is required.
 */
export function asChildRender(
  asChild: boolean | undefined,
  children: React.ReactNode,
): React.ReactElement | undefined {
  if (!asChild) return undefined
  const only = React.Children.only(children)
  return React.isValidElement(only) ? only : undefined
}

/**
 * Whether a `render` element ends up as a native `<button>`. Base UI needs to
 * know before mount; a host tag is read directly and any component is assumed
 * to be `Button`, which is what the apps wrap.
 */
export function rendersNativeButton(render: React.ReactElement | undefined): boolean {
  if (!render) return true
  return typeof render.type === "string" ? render.type === "button" : true
}

// ---------------------------------------------------------------------------
// Focus handlers: `onOpenAutoFocus` / `onCloseAutoFocus` → `initialFocus` / `finalFocus`
// ---------------------------------------------------------------------------

/** The event a Radix-style auto-focus handler receives. `preventDefault()` keeps focus where the handler put it. */
export interface AutoFocusEvent {
  type: "openAutoFocus" | "closeAutoFocus"
  /** The popup element, so a handler can `querySelector` inside it. */
  currentTarget: HTMLElement | null
  target: HTMLElement | null
  defaultPrevented: boolean
  preventDefault(): void
}

type FocusOption =
  | boolean
  | React.RefObject<HTMLElement | null>
  // `any` because each Base UI popup names its interaction type differently.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((interaction: any) => boolean | HTMLElement | null | void)

/**
 * Wraps a Radix-style auto-focus handler as a Base UI focus option. When the
 * handler calls `preventDefault()` the option returns `false`, which tells
 * Base UI not to move focus; otherwise Base UI's default applies.
 */
export function focusOption(
  handler: ((event: AutoFocusEvent) => void) | undefined,
  type: AutoFocusEvent["type"],
  popupRef: React.RefObject<HTMLElement | null>,
  fallback: FocusOption | undefined,
): FocusOption | undefined {
  if (!handler) return fallback
  return () => {
    let prevented = false
    const event: AutoFocusEvent = {
      type,
      currentTarget: popupRef.current,
      target: popupRef.current,
      get defaultPrevented() {
        return prevented
      },
      preventDefault() {
        prevented = true
      },
    }
    handler(event)
    // `undefined` hands the decision back to Base UI's default.
    return prevented ? false : undefined
  }
}

// ---------------------------------------------------------------------------
// Dismiss handlers: `onEscapeKeyDown` / `onPointerDownOutside` / `onInteractOutside`
// → `onOpenChange` reasons
// ---------------------------------------------------------------------------

/** The event a Radix-style dismiss handler receives. `preventDefault()` keeps the popup open. */
export interface DismissEvent {
  type: "escapeKeyDown" | "pointerDownOutside" | "interactOutside" | "focusOutside"
  target: EventTarget | null
  currentTarget: EventTarget | null
  /** The key for an Escape press, so a handler can read `event.key`. */
  key?: string
  detail: { originalEvent: Event }
  nativeEvent: Event
  defaultPrevented: boolean
  preventDefault(): void
  stopPropagation(): void
}

export interface DismissGuards {
  onEscapeKeyDown?: (event: DismissEvent) => void
  onPointerDownOutside?: (event: DismissEvent) => void
  onInteractOutside?: (event: DismissEvent) => void
}

/**
 * Shared by a popup root and its content: the content writes its dismiss
 * handlers here each render, and the root consults them in `onOpenChange`.
 * One provider per root, so a popover inside a dialog finds its own.
 */
export const DismissGuardContext = React.createContext<React.RefObject<DismissGuards> | null>(null)

/** Registers the content's dismiss handlers with the nearest root. */
export function useDismissGuards(guards: DismissGuards): void {
  const ref = React.useContext(DismissGuardContext)
  if (ref) {
    // Written during render on purpose: the root reads it from an event
    // handler, never during its own render, so there is nothing to tear.
    ref.current.onEscapeKeyDown = guards.onEscapeKeyDown
    ref.current.onPointerDownOutside = guards.onPointerDownOutside
    ref.current.onInteractOutside = guards.onInteractOutside
  }
}

interface ChangeDetails {
  reason: string
  event: Event
  cancel: () => void
}

function dismissEvent(type: DismissEvent["type"], native: Event): DismissEvent {
  let prevented = false
  return {
    type,
    target: native.target,
    currentTarget: native.currentTarget,
    key: (native as KeyboardEvent).key,
    detail: { originalEvent: native },
    nativeEvent: native,
    get defaultPrevented() {
      return prevented
    },
    preventDefault() {
      prevented = true
    },
    stopPropagation() {
      native.stopPropagation()
    },
  }
}

/**
 * Runs the registered dismiss handlers for a close request and cancels it
 * when one of them called `preventDefault()`. Returns `true` when cancelled.
 * Radix fired `onPointerDownOutside` and then `onInteractOutside` for one
 * outside press; both run here too.
 */
export function guardDismiss(
  guardsRef: React.RefObject<DismissGuards>,
  details: ChangeDetails,
): boolean {
  const guards = guardsRef.current
  const run = (handler: ((event: DismissEvent) => void) | undefined, type: DismissEvent["type"]) => {
    if (!handler) return false
    const event = dismissEvent(type, details.event)
    handler(event)
    return event.defaultPrevented
  }

  let cancelled = false
  if (details.reason === "escape-key") {
    cancelled = run(guards.onEscapeKeyDown, "escapeKeyDown")
  } else if (details.reason === "outside-press") {
    cancelled = run(guards.onPointerDownOutside, "pointerDownOutside")
    cancelled = run(guards.onInteractOutside, "interactOutside") || cancelled
  } else if (details.reason === "focus-out") {
    cancelled = run(guards.onInteractOutside, "focusOutside")
  }
  if (cancelled) details.cancel()
  return cancelled
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

/** Composes refs so a component can keep its own handle on an element and still forward the caller's. */
export function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

/**
 * Inline style that defines Radix's positioning variables in terms of Base
 * UI's, so a caller's `w-(--radix-popover-trigger-width)` keeps working.
 * `name` is the Radix component: `popover`, `dropdown-menu` or `select`.
 */
export function radixPopupVars(name: "popover" | "dropdown-menu" | "select"): React.CSSProperties {
  return {
    [`--radix-${name}-trigger-width`]: "var(--anchor-width)",
    [`--radix-${name}-trigger-height`]: "var(--anchor-height)",
    [`--radix-${name}-content-available-width`]: "var(--available-width)",
    [`--radix-${name}-content-available-height`]: "var(--available-height)",
    [`--radix-${name}-content-transform-origin`]: "var(--transform-origin)",
  } as React.CSSProperties
}
