import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";

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

/**
 * The widget's "All ›" button at the foot of its card: the way to the full list
 * for a widget that shows only its first few rows and has no pager.
 */
export function WidgetAllLink({ to, label }: { to: string; label?: string }) {
    const { t } = useI18n();
    return (
        <WidgetFooter>
            <div className="flex justify-end">
                <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                    <Link to={to}>
                        {label ?? t("widgets.all", "All")}
                        <ChevronRight aria-hidden className="size-4" />
                    </Link>
                </Button>
            </div>
        </WidgetFooter>
    );
}
