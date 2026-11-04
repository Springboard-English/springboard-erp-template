import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { getEventCoordinates } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { touchHitArea } from "../../lib/touchTarget";
import { cn } from "../../lib/utils";
import type { Translate } from "../i18n";

// Assign N paragraphs to N slots, with the pool DEPLETING — a paragraph fills
// one slot only.
//
// Gapped text and jumbled paragraphs are the same interaction wearing different
// clothes: both hand the student a lettered pool and ask which item belongs
// where. Only the slots differ — inline in a passage for a gapped text, an
// ordered list for a jumbled one — so the machinery, the depletion rule, the
// keyboard path and the layout all live here once.
//
// Answers stay per question upstream (each slot is one `mcq` question whose
// answer is the chosen option id): this is only a presentation over the
// section's questions.
//
// TWO PRESENTATIONS, chosen by how much room this has (see `SELECT_MODE_BELOW`):
// dragging when the pool can sit beside the text, and a SELECT at each slot
// when it cannot.

export interface DropItem {
  /** The option id — what gets stored as that slot's answer. */
  id: string;
  /** A-F, or whatever the paper letters them. */
  letter: string;
  label: string;
}

/** Which of the two presentations is on screen. */
export type DropMode = "drag" | "select";

const POOL_ID = "__pool__";

/**
 * Below this container width the slots become selects.
 *
 * It is the `@3xl` the grid below stacks at, deliberately: side by side, the
 * pool is a short reach from the gap, which is the whole case for dragging.
 * STACKED it is not — on a phone the pool sits a full screen below the passage,
 * so placing one paragraph means dragging across a scroll boundary with a
 * finger, which does not work in practice. So there is no stacked drag layout;
 * narrow is always a select.
 */
const SELECT_MODE_BELOW = 768;

/** How much of a paragraph a native picker can usefully show on one line. */
const OPTION_PREVIEW = 60;

/**
 * The furthest below the dragged copy's top edge the pointer may sit.
 *
 * dnd-kit sizes the overlay to the GRABBED card, which in the pool shows the
 * whole paragraph — often 250px tall — while the copy is clamped to two lines
 * so it doesn't cover the gaps being aimed at. Drawn at the top of that box, a
 * card grabbed halfway down would follow the cursor from 60px above it, and
 * from nearly 200px when grabbed by its bottom edge. The copy is moved down to the
 * grab point instead, less this much, so the pointer is always on it.
 */
const OVERLAY_GRAB_Y = 20;

/**
 * What the select at a slot needs, published by `ParagraphDrop` so `SlotContent`
 * can render one wherever a caller places it. Null while dragging.
 */
const PickerContext = createContext<{
  items: DropItem[];
  /** itemId -> the slot holding it. */
  slotOf: Map<string, string>;
  /** slotId -> the human name of that slot, e.g. "gap 37". */
  nameOf: Map<string, string>;
  choose: (slotId: string, itemId: string | null) => void;
  disabled?: boolean;
} | null>(null);

/** The slot the surrounding `slot()` call is drawing. */
const SlotIdContext = createContext<string | null>(null);

/** The draggable card for one paragraph. */
function ItemCard({
  item,
  compact,
  disabled,
  dragging,
}: {
  item: DropItem;
  compact?: boolean;
  disabled?: boolean;
  dragging?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border-2 bg-card p-2.5 text-left text-sm leading-6 shadow-sm",
        dragging ? "border-rose-400 shadow-lg" : "border-border",
        // The overlay copy asks for `grabbing` outright rather than via
        // `active:`. `:active` is the element the pointer went DOWN on — the
        // original card, still sitting in the pool at 40% — while the copy that
        // follows the cursor was created afterwards and is never in that state.
        // Relying on the variant would leave the whole drag under an open hand.
        dragging
          ? "cursor-grabbing"
          : !disabled && "cursor-grab active:cursor-grabbing",
      )}
    >
      {!disabled ? (
        <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      ) : null}
      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-rose-100 text-xs font-extrabold text-rose-700">
        {item.letter}
      </span>
      <span className={cn("min-w-0 text-foreground", compact && "line-clamp-2")}>
        {item.label}
      </span>
    </div>
  );
}

function Draggable({
  item,
  compact,
  disabled,
}: {
  item: DropItem;
  compact?: boolean;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      // The original stays in place while a DragOverlay copy follows the cursor,
      // so the pool doesn't reflow under the pointer mid-drag.
      className={cn("touch-none", isDragging && "opacity-40")}
    >
      <ItemCard item={item} compact={compact} disabled={disabled} />
    </div>
  );
}

function Slot({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <SlotIdContext.Provider value={id}>
      <span
        ref={setNodeRef}
        className={cn(
          "transition-colors",
          isOver && "rounded-xl outline-2 outline-offset-2 outline-rose-400",
          className,
        )}
      >
        {children}
      </span>
    </SlotIdContext.Provider>
  );
}

/** The same wrapper with no drop target — nothing is dragged in select mode. */
function PlainSlot({ id, children }: { id: string; children: ReactNode }) {
  return <SlotIdContext.Provider value={id}>{children}</SlotIdContext.Provider>;
}

/**
 * Which presentation fits, measured rather than assumed.
 *
 * A container measurement, not a viewport one, for the reason the grid uses a
 * container query: this same block renders inside the half-width questions
 * column when the PART carries a reading passage, and that column is narrow on
 * a screen that is not. Laid out before paint, so the first frame a student
 * sees is already the right one.
 */
function useDropMode(ref: React.RefObject<HTMLDivElement | null>): DropMode {
  const [mode, setMode] = useState<DropMode>("select");
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setMode(el.clientWidth < SELECT_MODE_BELOW ? "select" : "drag");
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return mode;
}

export function ParagraphDrop({
  items,
  slots,
  slotNames,
  assignment,
  onAssign,
  renderSlots,
  disabled,
  poolLabel,
  selectPoolLabel = poolLabel,
}: {
  items: DropItem[];
  /** Slot ids, in the order the questions are numbered. */
  slots: string[];
  /**
   * What to call each slot in the select's label and in "already in …",
   * parallel to `slots` — "gap 37", "position 3". The paper's numbering lives
   * with the caller that prints it, so it is passed rather than re-derived.
   */
  slotNames?: string[];
  /** slotId -> itemId. A slot with no entry is empty. */
  assignment: Record<string, string | undefined>;
  /**
   * Assign (or clear, with null) one slot. Called with the PREVIOUS holder too,
   * so the caller can clear it in the same update — a paragraph moved from one
   * gap to another must leave the first, or depletion breaks.
   */
  onAssign: (slotId: string, itemId: string | null, previousSlotId?: string) => void;
  /**
   * Draws the slots — inline in a passage, or as an ordered list. Told which
   * presentation it is in, because an empty slot is a drop TARGET in one (and
   * wants to be big) and a select in the other (which draws itself).
   */
  renderSlots: (
    slot: (slotId: string, content: ReactNode) => ReactNode,
    mode: DropMode,
  ) => ReactNode;
  disabled?: boolean;
  poolLabel: string;
  /** The same heading, worded for a screen where nothing is dragged. */
  selectPoolLabel?: string;
}) {
  const { t } = useI18n();
  // `offsetY` places the two-line copy under the pointer — see OVERLAY_GRAB_Y.
  const [dragging, setDragging] = useState<{ item: DropItem; offsetY: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mode = useDropMode(wrapperRef);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const itemById = new Map(items.map((item) => [item.id, item]));
  const slotOf = new Map<string, string>();
  for (const slotId of slots) {
    const itemId = assignment[slotId];
    if (itemId) slotOf.set(itemId, slotId);
  }
  const nameOf = new Map<string, string>();
  slots.forEach((slotId, index) => {
    nameOf.set(slotId, slotNames?.[index] ?? t("exercise.renderer.slotName", "slot {n}", { n: index + 1 }));
  });
  const pool = items.filter((item) => !slotOf.has(item.id));

  /**
   * One slot's choice, from the select. Same rule as a drop: a paragraph lives
   * in one slot, so choosing it here takes it out of wherever it was.
   */
  function choose(slotId: string, itemId: string | null) {
    if (!itemId) {
      onAssign(slotId, null);
      return;
    }
    const from = slotOf.get(itemId);
    if (from === slotId) return;
    onAssign(slotId, itemId, from);
  }

  function handleDragEnd(event: DragEndEvent) {
    setDragging(null);
    const { active, over } = event;
    if (!over) return;
    const itemId = String(active.id);
    const target = String(over.id);
    const from = slotOf.get(itemId);

    // Dropped back on the pool: free it.
    if (target === POOL_ID) {
      if (from) onAssign(from, null);
      return;
    }
    if (!slots.includes(target) || from === target) return;
    // Whatever was already in the target goes back to the pool rather than
    // being silently overwritten — the student can see what they displaced.
    onAssign(target, itemId, from);
  }

  // The measured element is OUTSIDE the branch, and stays mounted across a
  // switch: hang the ref off either presentation and the observer ends up
  // watching a detached node the moment the mode first changes, so the layout
  // would never change back.
  return (
    <div ref={wrapperRef} className="@container">
      {mode === "select" ? (
        <PickerContext.Provider value={{ items, slotOf, nameOf, choose, disabled }}>
          {/* ONE COLUMN, and no drop targets anywhere in it. The passage (or
              the ordered list) first, then every paragraph in full underneath —
              undepleted, unlike the drag pool, because a student re-reading to
              check an answer still needs the text of the one they already
              placed. */}
          <div className="space-y-4">
            {renderSlots(
              (slotId, content) => (
                <PlainSlot key={slotId} id={slotId}>
                  {content}
                </PlainSlot>
              ),
              "select",
            )}
            <ReferenceList
              label={selectPoolLabel}
              items={items}
              slotOf={slotOf}
              nameOf={nameOf}
            />
          </div>
        </PickerContext.Provider>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={(event: DragStartEvent) => {
            const item = itemById.get(String(event.active.id));
            if (!item) return;
            // Measured off the card the pointer went down on: dnd-kit fills
            // `active.rect.current.initial` only AFTER onDragStart, so it is still
            // null here. A keyboard drag has no pointer to keep the copy under.
            const pointer = getEventCoordinates(event.activatorEvent);
            const target = event.activatorEvent.target;
            const card =
              target instanceof Element
                ? target.closest('[aria-roledescription="draggable"]')
                : null;
            const grabY =
              pointer && card ? pointer.y - card.getBoundingClientRect().top : 0;
            setDragging({ item, offsetY: Math.max(0, grabY - OVERLAY_GRAB_Y) });
          }}
          onDragCancel={() => setDragging(null)}
          onDragEnd={handleDragEnd}
        >
          {/* Side by side: the text (or the ordered positions) on the left, the
              pool on the right, which is the whole case for dragging — both are
              readable at once and the pool sticks as the passage scrolls, the
              way the task is laid out on paper.

              A container query, not a viewport one: this same block renders
              inside the half-width questions column when the PART carries a
              reading passage too, and a viewport `lg:` would split that column
              again into two unreadable slivers. There is no stacked form of
              this — narrower than `@3xl` is select mode. */}
          <div className="grid items-start gap-4 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] @3xl:gap-6">
            <div className="min-w-0">
              {renderSlots(
                (slotId, content) => (
                  <Slot key={slotId} id={slotId}>
                    {content}
                  </Slot>
                ),
                "drag",
              )}
            </div>

            {/* Pinned to the top of whichever pane scrolls it, and scrolling on
                its own, so a long pool never pushes the passage out of reach.
                `.runner-pool-column` (index.css) caps it to that pane's height —
                the pane publishes it, rather than the pool reconstructing it
                from the viewport and the exam chrome's bars, which would leave
                it overhanging the bottom bar. */}
            <div className="runner-pool-column">
              <PoolArea label={poolLabel} empty={pool.length === 0}>
                {pool.map((item) => (
                  <Draggable key={item.id} item={item} disabled={disabled} />
                ))}
              </PoolArea>
            </div>
          </div>

          {/* Portalled to the body: the overlay is `position: fixed` at viewport
              coordinates, so an ancestor with a transform, filter or
              backdrop-filter re-anchors it and the copy drifts away from the
              cursor. The route entrance animation is such an ancestor. */}
          {createPortal(
            <DragOverlay dropAnimation={null}>
              {dragging ? (
                <div style={{ marginTop: dragging.offsetY }}>
                  <ItemCard item={dragging.item} dragging compact />
                </div>
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      )}
    </div>
  );
}

/** The pool, which is also a drop target — that is how a choice is undone. */
function PoolArea({
  label,
  empty,
  children,
}: {
  label: string;
  empty: boolean;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const { setNodeRef, isOver } = useDroppable({ id: POOL_ID });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "space-y-2 rounded-2xl border-2 border-dashed p-3 transition-colors",
        isOver ? "border-rose-400 bg-rose-50/60" : "border-border bg-muted/30",
      )}
    >
      <p className="text-[11px] font-extrabold text-muted-foreground">
        {label}
        {empty ? (
          <span className="ml-1.5 font-semibold normal-case tracking-normal">
            {t("exercise.renderer.allPlaced", "· all placed — drag one back here to change your mind")}
          </span>
        ) : null}
      </p>
      {children}
    </div>
  );
}

/**
 * The paragraphs as READING MATTER, for select mode. Not a pool: nothing is
 * taken out of it, because the select carries a truncated preview at best and
 * the full text has to stay somewhere the student can get back to.
 */
function ReferenceList({
  label,
  items,
  slotOf,
  nameOf,
}: {
  label: string;
  items: DropItem[];
  slotOf: Map<string, string>;
  nameOf: Map<string, string>;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-3">
      <p className="text-[11px] font-extrabold text-muted-foreground">
        {label}
      </p>
      {items.map((item) => {
        const placedIn = slotOf.get(item.id);
        return (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-2 rounded-xl border-2 bg-card p-2.5 text-left text-sm leading-6 shadow-sm",
              placedIn ? "border-mint-500" : "border-border",
            )}
          >
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-lg text-xs font-extrabold",
                placedIn
                  ? "bg-mint-500 text-white"
                  : "bg-rose-100 text-rose-700",
              )}
            >
              {item.letter}
            </span>
            <span className="min-w-0 text-foreground">
              {item.label}
              {/* Its own line, not trailing the prose: run into the end of a
                  paragraph it reads as part of the sentence. */}
              {placedIn ? (
                <span className="mt-1 block text-xs font-bold text-mint-700">
                  {t("exercise.renderer.placedIn", "· placed in {slot}", { slot: nameOf.get(placedIn) ?? "" })}
                </span>
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// NOTE on the greens here: Leap's palette defines `mint-bg`, `mint-300`,
// `mint-500` and `mint-700` and nothing else, so `mint-400` or `mint-600`
// generates no utility at all. A placed paragraph's `text-white` letter chip
// on such a shade would be white on white, invisible — and it is the one
// confirmation a student on a phone gets that their answer landed.

/** `A · in gap 38 — The main point of interest was how smiling…` */
function optionText(item: DropItem, placedIn: string | null, t: Translate): string {
  const preview =
    item.label.length > OPTION_PREVIEW
      ? `${item.label.slice(0, OPTION_PREVIEW).trimEnd()}…`
      : item.label;
  // The "already placed" note goes BEFORE the preview: a native picker on a
  // phone truncates the line, and a marker at the end is the half that gets cut.
  return placedIn
    ? t("exercise.renderer.optionPlaced", "{letter} · in {slot} — {preview}", { letter: item.letter, slot: placedIn, preview })
    : `${item.letter} — ${preview}`;
}

/**
 * What a filled slot shows: the letter, and — in select mode — the control that
 * fills it.
 *
 * The select is rendered here rather than by the callers because this is the
 * one place both of them already put in their slots, so neither has to learn
 * the pool, the depletion rule or where an answer is written.
 */
export function SlotContent({
  item,
  placeholder,
  onClear,
  disabled,
}: {
  item: DropItem | undefined;
  placeholder: string;
  onClear?: () => void;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const picker = useContext(PickerContext);
  const slotId = useContext(SlotIdContext);

  // A review or a teacher preview is read-only, and a disabled select is a
  // worse way to show a settled answer than the chip below.
  if (picker && slotId && !disabled && !picker.disabled) {
    const name = picker.nameOf.get(slotId) ?? t("exercise.renderer.thisSlot", "this slot");
    return (
      <select
        aria-label={t("exercise.renderer.chooseParagraphFor", "Choose the paragraph for {name}", { name })}
        value={item?.id ?? ""}
        onChange={(event) => picker.choose(slotId, event.target.value || null)}
        className={cn(
          // Kept narrow and truncating: this sits INSIDE a line of prose in a
          // gapped text, and a select as wide as its longest option would break
          // the passage into ribbons.
          "inline-flex h-9 max-w-[12rem] truncate rounded-xl border-2 bg-card px-2 align-middle text-xs font-bold text-foreground",
          item ? "border-mint-500 bg-mint-bg" : "border-dashed border-border",
        )}
      >
        <option value="">{placeholder || t("exercise.renderer.chooseFallback", "Choose…")}</option>
        {picker.items.map((option) => {
          const placedIn = picker.slotOf.get(option.id);
          return (
            <option key={option.id} value={option.id}>
              {optionText(
                option,
                placedIn && placedIn !== slotId
                  ? (picker.nameOf.get(placedIn) ?? null)
                  : null,
                t,
              )}
            </option>
          );
        })}
      </select>
    );
  }

  if (!item) {
    return (
      <span className="inline-flex min-h-9 min-w-[10rem] items-center rounded-xl border-2 border-dashed border-border bg-muted/40 px-3 py-1 text-xs font-bold text-muted-foreground">
        {placeholder}
      </span>
    );
  }
  return (
    <span className="inline-flex min-h-9 items-center gap-2 rounded-xl border-2 border-mint-500 bg-mint-bg px-2 py-1">
      <span className="grid size-5 shrink-0 place-items-center rounded bg-mint-500 text-[10px] font-extrabold text-white">
        {item.letter}
      </span>
      {onClear && !disabled ? (
        <button
          type="button"
          onClick={onClear}
          className={`${touchHitArea} relative text-xs font-bold text-mint-700 underline-offset-2 hover:underline`}
        >
          {t("exercise.renderer.remove", "remove")}
        </button>
      ) : null}
    </span>
  );
}
