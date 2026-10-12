import { Suspense, useState, type ReactNode } from "react";
import { useChartWidth } from "../charts/useChartWidth";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { useI18n } from "../../context/I18nContext";
import useIsMobile from "../../hooks/useIsMobile";
import type { UserInfo } from "../../api_calls/UserData";
import { availableWidgets } from "./layout";
import { WidgetErrorBoundary } from "./WidgetFrame";
import { WidgetSkeleton } from "./WidgetBodies";
import type { AnyWidgetDefinition, WidgetRegistry, WidgetSize } from "./types";

export interface WidgetGalleryProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    registry: WidgetRegistry;
    user: UserInfo;
    /** When adding into a stack, only widgets that render at this size are offered. */
    stackSize?: WidgetSize;
    onAdd: (def: AnyWidgetDefinition, size: WidgetSize) => void;
}

// Roughly the width each size gets on a desktop board.
const PREVIEW_NATURAL_WIDTH: Record<WidgetSize, number> = { S: 220, M: 600, L: 600, XL: 1200 };

/**
 * A widget drawn at its real width and zoomed to fit the sheet, like a phone's
 * widget thumbnail. Rendering it at sheet width instead squashed wide layouts
 * (a seven-day week) into unreadable columns.
 */
function ScaledPreview({ size, children }: { size: WidgetSize; children: ReactNode }) {
    const { ref, width } = useChartWidth<HTMLDivElement>(360);
    const natural = PREVIEW_NATURAL_WIDTH[size];
    return (
        <div
            ref={ref}
            aria-hidden
            className="pointer-events-none max-h-72 w-full overflow-hidden rounded-lg border bg-card select-none"
        >
            <div className="p-4" style={{ width: natural, zoom: Math.min(1, width / natural) }}>
                {children}
            </div>
        </div>
    );
}

/**
 * The "+" sheet: every widget this user may add, each with a live preview at
 * the size they pick. Previews use real data — the user can already read it,
 * and the app's query cache usually has it.
 */
export default function WidgetGallery({ open, onOpenChange, registry, user, stackSize, onAdd }: WidgetGalleryProps) {
    const { t } = useI18n();
    const isMobile = useIsMobile();
    const [expanded, setExpanded] = useState<string | null>(null);
    const [size, setSize] = useState<WidgetSize | null>(null);

    const offered = availableWidgets(registry, user).filter((def) => !stackSize || def.sizes.includes(stackSize));

    const toggle = (def: AnyWidgetDefinition) => {
        setExpanded((current) => (current === def.id ? null : def.id));
        setSize(stackSize ?? def.defaultSize);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side={isMobile ? "bottom" : "right"}
                className={cn("gap-0 overflow-y-auto", isMobile ? "max-h-[85dvh] pb-[env(safe-area-inset-bottom)]" : "w-full sm:max-w-md")}
            >
                <SheetHeader>
                    <SheetTitle>{t(stackSize ? "widgets.gallery.stackTitle" : "widgets.gallery.title")}</SheetTitle>
                    <SheetDescription>{t("widgets.gallery.description")}</SheetDescription>
                </SheetHeader>

                {offered.length === 0 ? (
                    <p className="px-4 pb-6 text-sm text-muted-foreground">{t("widgets.gallery.none")}</p>
                ) : (
                    <ul className="flex flex-col gap-2 px-4 pb-6">
                        {offered.map((def) => {
                            const Icon = def.icon ?? LayoutGrid;
                            const isOpen = expanded === def.id;
                            const title = t(def.titleKey ?? def.title, def.title);
                            const description = def.description
                                ? t(def.descriptionKey ?? def.description, def.description)
                                : undefined;
                            const previewSize = size ?? def.defaultSize;
                            const Render = def.render;
                            return (
                                <li key={def.id} className="rounded-xl border">
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        onClick={() => toggle(def)}
                                        className="flex min-h-11 w-full items-center gap-3 px-3 py-2.5 text-left"
                                    >
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                            <Icon aria-hidden className="size-4" />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-medium">{title}</span>
                                            {description ? (
                                                <span className="block text-xs text-muted-foreground">{description}</span>
                                            ) : null}
                                        </span>
                                        <ChevronRight
                                            aria-hidden
                                            className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")}
                                        />
                                    </button>

                                    {isOpen ? (
                                        <div className="flex flex-col gap-3 border-t px-3 py-3">
                                            {!stackSize && def.sizes.length > 1 ? (
                                                <div role="radiogroup" aria-label={t("widgets.size")} className="flex flex-wrap gap-1.5">
                                                    {def.sizes.map((option) => (
                                                        <Button
                                                            key={option}
                                                            type="button"
                                                            role="radio"
                                                            aria-checked={previewSize === option}
                                                            size="sm"
                                                            variant={previewSize === option ? "secondary" : "ghost"}
                                                            onClick={() => setSize(option)}
                                                        >
                                                            {t(`widgets.size.${option}`)}
                                                        </Button>
                                                    ))}
                                                </div>
                                            ) : null}
                                            <ScaledPreview size={previewSize}>
                                                <WidgetErrorBoundary resetKey={`${def.id}:${previewSize}`}>
                                                    <Suspense fallback={<WidgetSkeleton size={previewSize} />}>
                                                        <Render size={previewSize} config={def.defaultConfig} user={user} preview />
                                                    </Suspense>
                                                </WidgetErrorBoundary>
                                            </ScaledPreview>
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    onAdd(def, previewSize);
                                                    setExpanded(null);
                                                    onOpenChange(false);
                                                }}
                                            >
                                                {t("widgets.gallery.add")}
                                            </Button>
                                        </div>
                                    ) : null}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </SheetContent>
        </Sheet>
    );
}
