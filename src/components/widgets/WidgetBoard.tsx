import { Suspense, useState, type ReactNode } from "react";
import { lazyWithPreload } from "../../utils/lazyWithPreload";
import { Pencil, Plus, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../context/I18nContext";
import {
    addToStack,
    addWidget,
    configureEntry,
    moveEntry,
    moveEntryTo,
    moveStackChild,
    removeEntry,
    resizeEntry,
    unstack,
} from "./layout";
import useWidgetLayout from "./useWidgetLayout";
import WidgetFrame, { type WidgetFrameActions, type WidgetSortableBinding } from "./WidgetFrame";
import WidgetGallery from "./WidgetGallery";
import WidgetConfigDialog, { type WidgetConfigTarget } from "./WidgetConfigDialog";
import { WidgetEmpty } from "./WidgetBodies";
import type { WidgetDefaults, WidgetLayoutEntry, WidgetRegistry, WidgetSize } from "./types";

// Loaded BEFORE edit mode opens. Swapping it in after the static grid has
// rendered would remount every widget, closing any menu the user just opened.
const WidgetSortableGrid = lazyWithPreload(() => import("./WidgetSortableGrid"));

// Fixed rows, as many as the layout needs: every widget snaps to whole rows
// (WidgetFrame measures how many), so edges line up across columns. One row
// keeps an S tile square-ish.
const GRID_CLASS = "grid grid-flow-row-dense auto-rows-[8.5rem] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4";

export interface WidgetBoardProps {
    /** Key in the user's `info` the layout is stored under — one per app, e.g. `dashboard_lms`. */
    storageKey: string;
    /** Define at module scope: a new array each render recomputes the layout. */
    registry: WidgetRegistry;
    defaults: WidgetDefaults;
    /** Rendered left of the Edit button — usually the page greeting. */
    header?: ReactNode;
    /** Extra attributes for a widget's frame, e.g. a tour anchor, keyed by widget id. */
    frameAttributes?: (widgetId: string) => Record<string, string> | undefined;
}

/**
 * A home page of widgets the user arranges, like a phone's home screen: Edit
 * to remove, resize, reorder (drag or menu) and stack; "+" opens the gallery.
 * The layout is an ordered list packed densely, never x/y positions, so one
 * saved layout reads the same at four columns and at two.
 */
export default function WidgetBoard({ storageKey, registry, defaults, header, frameAttributes }: WidgetBoardProps) {
    const { user } = useAuth();
    const { t } = useI18n();
    const layout = useWidgetLayout({ storageKey, registry, defaults });
    const [gallery, setGallery] = useState<{ stackId?: string; stackSize?: WidgetSize } | null>(null);
    const [configTarget, setConfigTarget] = useState<WidgetConfigTarget | null>(null);

    if (!user) return null;

    const { items, editing, update } = layout;

    const actions: WidgetFrameActions = {
        remove: (id) => update((current) => removeEntry(current, id)),
        resize: (id, size) => update((current) => resizeEntry(current, id, size)),
        move: (id, delta) => update((current) => moveEntry(current, id, delta)),
        configure: (id, def, config) => setConfigTarget({ id, def, config }),
        addToStack: (id, size) => setGallery({ stackId: id, stackSize: size }),
        unstack: (id) => update((current) => unstack(current, id)),
        moveTab: (stackId, childId, delta) => update((current) => moveStackChild(current, stackId, childId, delta)),
    };

    const renderFrame = (entry: WidgetLayoutEntry, index: number, sortable?: WidgetSortableBinding) => (
        <WidgetFrame
            key={entry.id}
            entry={entry}
            registry={registry}
            user={user}
            storageKey={storageKey}
            editing={editing}
            isFirst={index === 0}
            isLast={index === items.length - 1}
            actions={actions}
            sortable={sortable}
            frameAttributes={frameAttributes}
        />
    );

    const staticGrid = <div className={GRID_CLASS}>{items.map((entry, index) => renderFrame(entry, index))}</div>;

    return (
        <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
                <div className="min-w-0 flex-1">{header}</div>
                {editing ? (
                    <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setGallery({})}>
                            <Plus aria-hidden />
                            {t("widgets.add")}
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={layout.resetToDefaults}>
                            <RotateCcw aria-hidden />
                            {t("widgets.reset")}
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={layout.cancelEditing} disabled={layout.saving}>
                            {t("common.cancel")}
                        </Button>
                        <Button type="button" size="sm" onClick={() => void layout.save()} disabled={layout.saving}>
                            {layout.saving ? t("widgets.saving") : t("widgets.done")}
                        </Button>
                    </div>
                ) : (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onPointerEnter={() => void WidgetSortableGrid.preload().catch(() => undefined)}
                        onClick={() => void WidgetSortableGrid.preload().then(layout.startEditing, layout.startEditing)}
                    >
                        <Pencil aria-hidden />
                        {t("widgets.edit")}
                    </Button>
                )}
            </div>

            {items.length === 0 ? (
                <WidgetEmpty className="rounded-xl border border-dashed py-10" message={t("widgets.emptyBoard")} />
            ) : editing ? (
                <Suspense fallback={staticGrid}>
                    <WidgetSortableGrid
                        items={items}
                        className={GRID_CLASS}
                        onMove={(activeId, overId) => update((current) => moveEntryTo(current, activeId, overId))}
                        renderItem={(entry, binding) =>
                            renderFrame(entry, items.findIndex((item) => item.id === entry.id), binding)
                        }
                    />
                </Suspense>
            ) : (
                staticGrid
            )}

            <WidgetGallery
                open={gallery !== null}
                onOpenChange={(open) => !open && setGallery(null)}
                registry={registry}
                user={user}
                stackSize={gallery?.stackSize}
                onAdd={(def, size) => {
                    const target = gallery?.stackId;
                    update((current) => (target ? addToStack(current, target, def) : addWidget(current, def, size)));
                }}
            />
            <WidgetConfigDialog
                target={configTarget}
                onClose={() => setConfigTarget(null)}
                onSave={(id, config) => update((current) => configureEntry(current, id, config))}
            />
        </section>
    );
}
