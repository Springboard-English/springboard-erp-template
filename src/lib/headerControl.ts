// One look for every control in the desktop header toolbar (Refresh, Report,
// Guides, language, notifications, colour mode): a ghost circle the height of
// a Button, no border or fill at rest, a muted fill on hover. Pair it with
// `variant="ghost"` and `size="icon"` on a Button.

/** Classes for a header toolbar icon button. */
export const headerIconButton = "rounded-full text-foreground hover:bg-muted";

/**
 * The same circle for a plain `<button>`: 44px on touch, 36px on a mouse
 * desktop, matching `Button`'s `icon` size.
 */
export const headerIconButtonPlain =
    "inline-flex size-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:size-9";
