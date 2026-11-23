import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

/**
 * `list`: a list page. It ends one bottom pad above the window's foot, where
 * every list's table ends. `detail`: a record page. It runs to the window's
 * foot, because its section pane pads its own foot.
 */
export type PageFrameVariant = "list" | "detail";

/**
 * `none`: the frame clips, and its `min-h-0 flex-1` children scroll inside.
 * `content`: the frame itself scrolls, for a page whose content cannot be
 * split into filling regions. The window never scrolls in either case.
 */
export type PageFrameScroll = "none" | "content";

export interface PageFrameOptions {
  variant?: PageFrameVariant;
  scroll?: PageFrameScroll;
}

// The pads come from DashboardLayout's `--page-pad-top`/`--page-pad-bottom`;
// the fallbacks are its desktop values, for a page rendered outside it.
const FRAME_BASE = "w-full max-w-[1700px] space-y-4 md:flex md:min-h-0 md:flex-col";
const FRAME_HEIGHT: Record<PageFrameVariant, string> = {
  list: "md:h-[calc(100dvh-var(--page-pad-top,3rem)-var(--page-pad-bottom,1.25rem))]",
  detail: "md:h-[calc(100dvh-var(--page-pad-top,3rem))] md:-mb-[var(--page-pad-bottom,1.25rem)]",
};
const FRAME_SCROLL: Record<PageFrameScroll, string> = {
  none: "md:overflow-hidden",
  content: "md:overflow-y-auto md:overflow-x-hidden md:pr-1",
};

/**
 * The classes that make a routed view fill the window on desktop without the
 * page scrolling: the page width, the window's height less the shell's pads,
 * and a flex column whose `min-h-0 flex-1` child takes the rest. Phones keep
 * a normal scrolling page. For a shell that renders its own element; others
 * use `PageFrame`.
 */
export function pageFrameClassName({
  variant = "list",
  scroll = "none",
}: PageFrameOptions = {}): string {
  return cn(FRAME_BASE, FRAME_HEIGHT[variant], FRAME_SCROLL[scroll]);
}

export interface PageFrameProps
  extends PageFrameOptions,
    Omit<HTMLAttributes<HTMLElement>, "children"> {
  children: ReactNode;
  /** The element drawn; `section` by default. */
  as?: "section" | "div";
}

/**
 * A routed view's outer element, sized by `pageFrameClassName`. Put the
 * `PageHeader` first and give the region that should take the rest of the
 * window `min-h-0 flex-1` (a `SimpleDataTable` takes `fill`). A record page
 * uses `DetailView`, which already renders in the detail frame.
 */
export function PageFrame({
  variant,
  scroll,
  as: Element = "section",
  className,
  children,
  ...rest
}: PageFrameProps) {
  return (
    <Element data-page-frame={variant ?? "list"} className={cn(pageFrameClassName({ variant, scroll }), className)} {...rest}>
      {children}
    </Element>
  );
}

export default PageFrame;
