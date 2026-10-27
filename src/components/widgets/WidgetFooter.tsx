import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";

/** The frame's footer element, once mounted; null outside a frame (the gallery's previews). */
export const WidgetFooterContext = createContext<HTMLElement | null>(null);

/**
 * Pins its children (a pager, a "View all" link) to the bottom of the widget's
 * card, so every widget's navigation sits at the same place however tall its
 * content is. Outside a frame it renders in place.
 */
export function WidgetFooter({ children }: { children: ReactNode }) {
    const node = useContext(WidgetFooterContext);
    return node ? createPortal(children, node) : <>{children}</>;
}
