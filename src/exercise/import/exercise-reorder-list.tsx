import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { CategoryPill, type SkillTag } from "../index";
import { Button } from "../../exports";
import { useStableI18n } from "./i18n";
import { usePendingChangesSource } from "../../exports";
import {
  reorderBlocks,
  reorderWithinSection,
  toBlocks,
  type Orderable,
} from "./reorder";
import { cn } from "../../lib/utils";

// Drag-and-drop reorder over a test's exercises, shared by the teacher's test
// detail and the AI-import review. Sections drag as one unit and their questions
// reorder within them, never across — the flat order stays contiguous per
// section, which the runner's paging requires (see lib/reorder.ts).
//
// Two sortable levels in one DndContext: the top-level list of blocks (a section
// card or a standalone row), and, inside each section card, its questions. Cross-
// section drops are refused in onDragEnd, so a question can only leave a section
// by moving the whole section.
//
// The new order is saved through the shared pending-changes bar, not a footer
// of its own: once something has moved, the bar shows "1 unsaved change" with
// Save/Discard, exactly as every other edit in the studio does. The only
// control left here is Done, for leaving the mode with nothing moved.

export interface ReorderRow {
  /** Stable id: the question key, or the draft node id. */
  key: string;
  title: string;
  subtitle: string;
  skill: SkillTag | null;
  /** The section this question belongs to; null for a standalone question. */
  sectionKey: string | null;
  /** Shown on the section card header. */
  sectionLabel: string | null;
  partLabel: string | null;
}

// Top-level sortable ids are namespaced so they can't collide with a question
// key (which is used verbatim as the nested sortable id).
const blockId = (sectionKey: string | null, firstKey: string) =>
  sectionKey !== null ? `sec:${sectionKey}` : `one:${firstKey}`;

export function ExerciseReorderList({
  rows,
  heading,
  onSave,
  onCancel,
  saving = false,
  saveLabel,
}: {
  rows: ReorderRow[];
  /** What this mode is for, drawn beside Done. */
  heading?: ReactNode;
  /** Persist the order. Awaited by the bar; report failure with a toast. */
  onSave: (orderedKeys: string[]) => void | Promise<void>;
  /** Leave the mode — with nothing moved, or discarding what was. */
  onCancel: () => void;
  saving?: boolean;
  saveLabel?: string;
}) {
  const { t } = useStableI18n();
  // Snapshot the incoming order once; the working order is local until saved.
  const [order, setOrder] = useState<string[]>(() => rows.map((r) => r.key));
  const rowByKey = useMemo(() => {
    const map = new Map<string, ReorderRow>();
    for (const row of rows) map.set(row.key, row);
    return map;
  }, [rows]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const orderables: Orderable[] = order
    .map((key) => rowByKey.get(key))
    .filter((r): r is ReorderRow => Boolean(r))
    .map((r) => ({ id: r.key, sectionKey: r.sectionKey }));
  const blocks = toBlocks(orderables);
  const topLevelIds = blocks.map((b) => blockId(b.sectionKey, b.ids[0]));
  const moved = order.filter((key, i) => key !== rows[i]?.key).length;
  const dirty = order.length !== rows.length || moved > 0;

  usePendingChangesSource({
    section: t("exercise.import.reorder.section", "Question order"),
    items: dirty
      ? [
          {
            key: t("exercise.import.reorder.order", "Order"),
            value:
              moved === 1
                ? t("exercise.import.reorder.movedOne", "1 question moved")
                : t("exercise.import.reorder.movedOther", "{n} questions moved", { n: moved }),
          },
        ]
      : [],
    saving,
    saveLabel: saveLabel ?? t("exercise.import.reorder.saveOrder", "Save Order"),
    save: () => onSave(order),
    discard: onCancel,
  });

  // The two sortable levels live in ONE DndContext, so plain `closestCenter`
  // ranks every droppable on the page against the dragged item — including ones
  // at the other level. Dragging a question inside a section would then report
  // the section CARD as `over` (its box encloses the questions, so its centre
  // often wins), and dragging a section whichever question happens to be
  // nearest. `handleDragEnd` refuses both as cross-level drops, so the row would
  // spring back and reordering look broken — most visibly in AI import, where
  // an extracted paper is nearly all sections.
  //
  // Narrowing the candidates to the dragged item's own siblings first means
  // `over` is always something the drop handler can act on.
  const collisionDetection = useCallback<CollisionDetection>(
    (args) => {
      const active = String(args.active.id);
      const siblings = topLevelIds.includes(active)
        ? topLevelIds
        : blocks.find((b) => b.sectionKey !== null && b.ids.includes(active))?.ids ?? [];
      return closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter((container) =>
          siblings.includes(String(container.id)),
        ),
      });
    },
    // Recomputed per render along with the order they describe; both are plain
    // arrays derived from `order`, so a stale closure here would drop onto the
    // previous layout.
    [topLevelIds, blocks],
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    // A top-level block move (section card or standalone row).
    const from = topLevelIds.indexOf(activeId);
    if (from !== -1) {
      const to = topLevelIds.indexOf(overId);
      if (to === -1) return;
      setOrder(reorderBlocks(orderables, from, to));
      return;
    }

    // Otherwise a question move inside a section — only within the same one.
    const block = blocks.find((b) => b.sectionKey !== null && b.ids.includes(activeId));
    if (!block || block.sectionKey === null) return;
    if (!block.ids.includes(overId)) return; // refuse a cross-section drop
    setOrder(
      reorderWithinSection(
        orderables,
        block.sectionKey,
        block.ids.indexOf(activeId),
        block.ids.indexOf(overId),
      ),
    );
  }

  return (
    <div className="space-y-4">
      {/* Done is the way out when nothing has moved. Once something has, the
          bar's Save and Discard are the only exits — a Done that quietly threw
          the new order away would be the silent loss the bar exists to stop. */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">{heading}</div>
        <Button
          variant="outline"
          size="sm"
          disabled={dirty || saving}
          title={dirty ? t("exercise.import.reorder.saveFirst", "Save or discard the new order first") : undefined}
          onClick={onCancel}
        >
          {t("exercise.import.reorder.done", "Done")}
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={topLevelIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {blocks.map((block, blockIndex) => {
              const id = topLevelIds[blockIndex];
              if (block.sectionKey === null) {
                const row = rowByKey.get(block.ids[0]);
                if (!row) return null;
                return <StandaloneRow key={id} id={id} row={row} />;
              }
              const first = rowByKey.get(block.ids[0]);
              return (
                <SectionCard
                  key={id}
                  id={id}
                  partLabel={first?.partLabel ?? null}
                  sectionLabel={first?.sectionLabel ?? null}
                  questionIds={block.ids}
                  rowByKey={rowByKey}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

/** Small drag grip; spreads dnd-kit's listeners/attributes onto the handle. */
function Grip({
  attributes,
  listeners,
}: {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
}) {
  const { t } = useStableI18n();
  return (
    <button
      type="button"
      className="grid size-11 shrink-0 cursor-grab md:pointer-fine:size-9 touch-none place-items-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing"
      aria-label={t("exercise.import.reorder.drag", "Drag to reorder")}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );
}

function StandaloneRow({ id, row }: { id: string; row: ReorderRow }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-2xl border-2 border-border bg-card p-3 shadow-sm",
        isDragging && "z-10 border-rose-300 shadow-md",
      )}
    >
      <Grip attributes={attributes} listeners={listeners} />
      <RowBody row={row} />
    </div>
  );
}

function SectionCard({
  id,
  partLabel,
  sectionLabel,
  questionIds,
  rowByKey,
}: {
  id: string;
  partLabel: string | null;
  sectionLabel: string | null;
  questionIds: string[];
  rowByKey: Map<string, ReorderRow>;
}) {
  const { t } = useStableI18n();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-2 shadow-sm",
        isDragging && "z-10 border-rose-300 shadow-md",
      )}
    >
      <div className="flex items-center gap-2 px-1 py-1.5">
        <Grip attributes={attributes} listeners={listeners} />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-extrabold text-rose-700">
            {partLabel || t("exercise.import.reorder.part", "Part")}
            {sectionLabel ? ` · ${sectionLabel}` : ""}
          </p>
          <p className="text-[11px] font-semibold text-muted-foreground">
            {questionIds.length === 1
              ? t(
                  "exercise.import.reorder.sectionHintOne",
                  "1 question — drag to reorder within, or drag this card to move the whole section",
                )
              : t(
                  "exercise.import.reorder.sectionHintOther",
                  "{n} questions — drag to reorder within, or drag this card to move the whole section",
                  { n: questionIds.length },
                )}
          </p>
        </div>
      </div>
      <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 pl-3">
          {questionIds.map((key) => {
            const row = rowByKey.get(key);
            return row ? <QuestionRow key={key} row={row} /> : null;
          })}
        </div>
      </SortableContext>
    </div>
  );
}

function QuestionRow({ row }: { row: ReorderRow }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: row.key });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border bg-card p-2.5",
        isDragging && "z-10 border-rose-300 shadow-md",
      )}
    >
      <Grip attributes={attributes} listeners={listeners} />
      <RowBody row={row} />
    </div>
  );
}

function RowBody({ row }: { row: ReorderRow }) {
  const { t } = useStableI18n();
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-foreground">
          {row.title || t("exercise.import.reorder.untitled", "Untitled question")}
        </p>
        <p className="truncate text-xs font-semibold text-muted-foreground">
          {row.subtitle}
        </p>
      </div>
      {row.skill ? <CategoryPill skill={row.skill} /> : null}
    </div>
  );
}
