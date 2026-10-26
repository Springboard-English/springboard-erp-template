// Touch-target classes shared by every app. Phones (below `md`) and any
// coarse-pointer screen, iPads included, get a 44×44px floor (WCAG 2.5.5,
// Apple HIG); a desktop with a mouse gets 36px controls.
//
// They are minimums rather than heights, so a caller's `h-8` or `size-9`
// cannot shrink a control below the floor: `min-height` always beats `height`.
// The desktop rung is `md:pointer-fine:`, so an iPad (wider than `md`, coarse
// pointer) keeps the 44px floor.

/**
 * The suite's button height for a plain `<button>` drawn as a button (pill,
 * segmented toggle, pager arrow): at least 44×44px on touch, 36×36px on a
 * mouse desktop. The same floor `Button` carries.
 */
export const buttonTarget =
  "min-h-11 min-w-11 md:pointer-fine:min-h-9 md:pointer-fine:min-w-9";

/** The suite's text-field height: 44px on touch, 36px on a mouse desktop, matching `buttonTarget`. */
export const fieldHeight = "h-11 md:pointer-fine:h-9";

/** Grows a control to at least 44×44px on phones and touch screens. */
export const touchTarget =
  "max-md:min-h-11 max-md:min-w-11 pointer-coarse:min-h-11 pointer-coarse:min-w-11";

/** Grows a full-width row or menu item to at least 44px tall on phones and touch screens. */
export const touchTargetHeight = "max-md:min-h-11 pointer-coarse:min-h-11";

/**
 * Gives a small control an invisible tap area of at least 44×44px centred on
 * it, on phones and touch screens, without moving the layout. The element must
 * be positioned (`relative` or `absolute`) and must not use `after:` for
 * anything else.
 */
export const touchHitArea =
  "max-md:after:absolute max-md:after:top-1/2 max-md:after:left-1/2 max-md:after:size-full max-md:after:min-h-11 max-md:after:min-w-11 max-md:after:-translate-1/2 " +
  "pointer-coarse:after:absolute pointer-coarse:after:top-1/2 pointer-coarse:after:left-1/2 pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 pointer-coarse:after:-translate-1/2";
