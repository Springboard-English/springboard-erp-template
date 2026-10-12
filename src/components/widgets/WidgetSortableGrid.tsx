import type { ReactNode } from "react";
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    pointerWithin,
    useSensor,
    useSensors,
    type CollisionDetection,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    rectSortingStrategy,
    sortableKeyboardCoordinates,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { WidgetLayoutEntry } from "./types";
import type { WidgetSortableBinding } from "./WidgetFrame";

/**
 * The drag layer, loaded only in edit mode so view mode never pays for
 * dnd-kit. The grid's classes arrive as a prop so the static and sortable
 * grids cannot drift apart.
 */

// Drop where the pointer is. `closestCenter` alone compares the dragged card's
// centre, so a full-width widget dropped on a half-width one landed a slot off.
// The keyboard sensor has no pointer, and falls through to it.
const pointerFirst: CollisionDetection = (args) => {
    const hits = pointerWithin(args);
    return hits.length > 0 ? hits : closestCenter(args);
};

function SortableSlot({
    entry,
    renderItem,
}: {
    entry: WidgetLayoutEntry;
    renderItem: (entry: WidgetLayoutEntry, binding: WidgetSortableBinding) => ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entry.id });
    return renderItem(entry, {
        setNodeRef,
        style: { transform: CSS.Transform.toString(transform), transition },
        handleProps: { ...attributes, ...listeners },
        isDragging,
    });
}

export default function WidgetSortableGrid({
    items,
    className,
    onMove,
    renderItem,
}: {
    items: WidgetLayoutEntry[];
    className: string;
    onMove: (activeId: string, overId: string) => void;
    renderItem: (entry: WidgetLayoutEntry, binding: WidgetSortableBinding) => ReactNode;
}) {
    const sensors = useSensors(
        // A small threshold so a tap on the handle still focuses rather than drags.
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (over && active.id !== over.id) onMove(String(active.id), String(over.id));
    };

    return (
        <DndContext sensors={sensors} collisionDetection={pointerFirst} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((entry) => entry.id)} strategy={rectSortingStrategy}>
                <div className={className}>
                    {items.map((entry) => (
                        <SortableSlot key={entry.id} entry={entry} renderItem={renderItem} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
