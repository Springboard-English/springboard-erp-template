import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { LayoutGrid, PanelLeftClose } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "../../components/ui/button";
import { useI18n } from "../../context/I18nContext";
import useIsMobile from "../../hooks/useIsMobile";
import { cn } from "../../lib/utils";
import type { ExerciseAnswer, SpringboardTest } from "../lib/exercises";
import { unansweredNodeIds } from "../lib/grading";
import { useExerciseTourAnchor } from "../lib/tour-anchors";
import { navGroups, type NavGroup } from "../lib/question-nav-groups";
import type { CollectionStub } from "../types";
import { collectionHeading } from "../components/collection-context";

/**
 * What a filled chip means. `answers` (the default): a student's answer, with
 * the legend Current / Answered / Blank. `keys`: the editor's answer key, read
 * from the same `answers` map (pass `answerFromKey` per node), with the legend
 * Current / Key set / No key.
 */
export type QuestionNavStates = "answers" | "keys";

/** The list itself, shared by the docked column, the side panel and the phone sheet. */
export interface QuestionNavPanelProps {
  test: SpringboardTest;
  answers: Record<string, ExerciseAnswer>;
  currentIndex: number;
  onJump: (index: number) => void;
  /** Each question's part/section, so the numbers sit under their headings. */
  collectionByNode?: Map<string, CollectionStub | null>;
  /** Controls at the foot of the panel (the editor's new question, section and part). */
  actions?: ReactNode;
  states?: QuestionNavStates;
  /**
   * Turns on drag (and Space + arrow keys) to reorder questions inside their
   * run. Called with the run's collection key (`null` outside any part or
   * section) and the run's node ids in their new order.
   */
  onReorder?: (collectionKey: string | null, orderedNodeIds: string[]) => void;
  /** Shows a Hide button in the docked column's header. */
  onHide?: () => void;
  /** A column in the layout from `md` up (hidden below it) instead of overlay content. */
  docked?: boolean;
  /** Leaves out the "Questions" heading, for a host that titles its own dialog. */
  untitled?: boolean;
}

interface NavChipProps {
  number: number;
  title: string;
  isCurrent: boolean;
  isDone: boolean;
  states: QuestionNavStates;
  onClick: () => void;
}

/** One question's number in the list, coloured by its state; `drag` makes it a sortable item. */
function NavChip({
  number,
  title,
  isCurrent,
  isDone,
  states,
  onClick,
  drag,
}: NavChipProps & { drag?: ReturnType<typeof useSortable> }) {
  return (
    <button
      ref={drag?.setNodeRef}
      type="button"
      onClick={onClick}
      title={title}
      aria-current={isCurrent ? "true" : undefined}
      style={drag ? { transform: CSS.Transform.toString(drag.transform), transition: drag.transition } : undefined}
      {...(drag ? { ...drag.attributes, ...drag.listeners } : {})}
      className={cn(
        "grid aspect-square place-items-center rounded-xl text-sm font-extrabold transition-all duration-150 ease-bounce hover:-translate-y-0.5",
        drag && "cursor-grab touch-manipulation active:cursor-grabbing",
        drag?.isDragging && "relative z-10 shadow-lg",
        isCurrent
          ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-300"
          : isDone
            // Half-strength `mint-300`: `mint-100` does not exist, so a hover on
            // it would do nothing, and the full rung crowds the `mint-700` number.
            ? "bg-mint-bg text-mint-700 hover:bg-mint-300/50"
            : states === "keys"
              // A question with no key can't be marked: a warning, not just empty.
              ? "border-2 border-dashed border-butter-700/50 bg-butter-bg/40 text-butter-700 hover:border-butter-700"
              : "border-2 border-dashed border-border bg-background text-muted-foreground hover:border-rose-200",
      )}
    >
      {number}
    </button>
  );
}

/** A `NavChip` that drags inside its run's sortable context. */
function SortableNavChip({ id, ...props }: NavChipProps & { id: string }) {
  const drag = useSortable({ id });
  return <NavChip {...props} drag={drag} />;
}

/** One part/section run of chips, in its own sortable context so a drag stays inside it. */
function NavRun({
  group,
  test,
  unanswered,
  currentIndex,
  states,
  grid,
  onJump,
  onReorder,
}: {
  group: NavGroup;
  test: SpringboardTest;
  unanswered: Set<string>;
  currentIndex: number;
  states: QuestionNavStates;
  grid: string;
  onJump: (index: number) => void;
  onReorder?: QuestionNavPanelProps["onReorder"];
}) {
  const { t } = useI18n();
  const ids = group.indices.map((index) => test.nodes[index].id);
  const sortable = Boolean(onReorder) && ids.length > 1;
  // A drag ends with a click on the chip it moved; that click is not a jump.
  const dragged = useRef(false);
  const sensors = useSensors(
    // A mouse drags after a short move, so a click still jumps.
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // A finger drags after a hold, so a swipe still scrolls the list.
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 6 } }),
    // Space picks up and drops; Enter stays the chip's jump.
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space", "Enter"] },
    }),
  );
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    dragged.current = true;
    window.setTimeout(() => (dragged.current = false), 0);
    if (!over || active.id === over.id || !onReorder) return;
    const next = arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
    onReorder(group.key || null, next);
  };
  const chips = group.indices.map((index) => {
    const node = test.nodes[index];
    const props: NavChipProps = {
      number: index + 1,
      title: node.title || t("exercise.questionNav.questionNo", "Question {n}", { n: index + 1 }),
      isCurrent: index === currentIndex,
      isDone: !unanswered.has(node.id),
      states,
      onClick: () => (dragged.current ? undefined : onJump(index)),
    };
    return sortable ? <SortableNavChip key={node.id} id={node.id} {...props} /> : <NavChip key={node.id} {...props} />;
  });
  if (!sortable) return <div className={grid}>{chips}</div>;
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      accessibility={{
        screenReaderInstructions: {
          draggable: t(
            "exercise.questionNav.reorderHint",
            "To move a question, press Space, use the arrow keys, then press Space again to drop it.",
          ),
        },
      }}
    >
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <div className={grid}>{chips}</div>
      </SortableContext>
    </DndContext>
  );
}

/**
 * The paper's question numbers under their part and section, each marked
 * current, done or blank (answers or keys, per `states`), with a legend and
 * the host's `actions` at the foot. `docked` draws it as a layout column from
 * `md` up, scrolling on its own; otherwise it is the content of the overlay
 * panel or phone sheet. With `onReorder`, chips drag within their run.
 */
export function QuestionNavPanel({
  test,
  answers,
  currentIndex,
  onJump,
  collectionByNode,
  actions,
  states = "answers",
  onReorder,
  onHide,
  docked = false,
  untitled = false,
}: QuestionNavPanelProps) {
  const { t } = useI18n();
  const groups = useMemo(() => navGroups(test.nodes, collectionByNode), [test.nodes, collectionByNode]);
  const unanswered = useMemo(() => new Set(unansweredNodeIds(test, answers)), [test, answers]);
  const listRef = useRef<HTMLDivElement>(null);
  // Keep the current question in view as the runner moves through a long paper.
  useEffect(() => {
    listRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView?.({ block: "nearest" });
  }, [currentIndex]);
  const doneLabel = states === "keys" ? t("exercise.questionNav.keySet", "Key set") : t("exercise.questionNav.answered", "Answered");
  const blankLabel = states === "keys" ? t("exercise.questionNav.noKey", "No key") : t("exercise.questionNav.blank", "Blank");
  // As many 44px chips (36px with a mouse) as the width holds, each capped so a
  // wide dialog doesn't stretch them into tiles.
  const grid =
    "grid grid-cols-[repeat(auto-fill,minmax(2.75rem,3rem))] gap-1.5 md:pointer-fine:grid-cols-[repeat(auto-fill,minmax(2.25rem,2.75rem))]";
  const title = t("exercise.questionNav.title", "Questions");

  const list = (
    <div className="space-y-4">
      {groups.map((group) => {
        const heading = collectionHeading(group.section ?? group.part, t);
        return (
          <div key={`${group.key}:${group.indices[0]}`} className="space-y-2">
            {group.part ? (
              <p className="text-[11px] font-extrabold text-rose-700">{collectionHeading(group.part, t).part}</p>
            ) : null}
            {group.section && heading.section ? (
              <p className="line-clamp-2 text-xs font-bold text-muted-foreground">{heading.section}</p>
            ) : null}
            <NavRun
              group={group}
              test={test}
              unanswered={unanswered}
              currentIndex={currentIndex}
              states={states}
              grid={grid}
              onJump={onJump}
              onReorder={onReorder}
            />
          </div>
        );
      })}
    </div>
  );
  const legend = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-semibold text-muted-foreground">
      <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded bg-rose-600" />{t("exercise.questionNav.current", "Current")}</span>
      <span className="inline-flex items-center gap-1.5"><span className="size-3 rounded bg-mint-bg" />{doneLabel}</span>
      <span className="inline-flex items-center gap-1.5">
        <span className={cn("size-3 rounded border-2 border-dashed", states === "keys" ? "border-butter-700/50 bg-butter-bg/40" : "border-border")} />
        {blankLabel}
      </span>
    </div>
  );

  if (!docked) {
    return (
      <div ref={listRef}>
        {untitled ? null : <p className="mb-3 text-sm font-extrabold text-foreground">{title}</p>}
        {list}
        <div className="mt-4 border-t pt-3">{legend}</div>
        {actions ? <div className="mt-3 flex flex-col gap-2 border-t pt-3">{actions}</div> : null}
      </div>
    );
  }
  return (
    <aside
      aria-label={title}
      // About a quarter of the screen, within bounds a chip grid and a heading can live with.
      className="hidden w-[clamp(15rem,24vw,22rem)] shrink-0 flex-col border-r bg-card md:flex"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 px-4 pt-3 pb-2">
        <p className="text-sm font-extrabold text-foreground">{title}</p>
        {onHide ? (
          <Button variant="ghost" size="sm" onClick={onHide}>
            <PanelLeftClose className="size-4" />
            {t("exercise.questionNav.hide", "Hide")}
          </Button>
        ) : null}
      </div>
      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{list}</div>
      <div className="shrink-0 space-y-3 border-t px-4 py-3">
        {legend}
        {actions ? <div className="flex flex-col gap-2">{actions}</div> : null}
      </div>
    </aside>
  );
}

/**
 * The question navigator's toggle for the runner's bottom bar: the position
 * and the done count. It opens the list as a side panel (a bottom sheet on a
 * phone, per the mobile contract). With `dock`, the host draws
 * `QuestionNavPanel docked` in its layout while `dock.shown`; from `md` up the
 * toggle then shows or hides that column instead, and the phone keeps the
 * sheet. `open` is CONTROLLED by the bottom bar — see NotesButton for why.
 */
export function QuestionNav({
  test,
  answers,
  currentIndex,
  onJump,
  open,
  onOpenChange,
  collectionByNode,
  actions,
  states = "answers",
  onReorder,
  dock,
}: {
  /** Each question's part/section, so the numbers sit under their headings. */
  collectionByNode?: Map<string, CollectionStub | null>;
  /** Extra controls under the numbers (the editor's new question, section and part). */
  actions?: ReactNode;
  test: SpringboardTest;
  answers: Record<string, ExerciseAnswer>;
  currentIndex: number;
  onJump: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  states?: QuestionNavStates;
  /** As on `QuestionNavPanel`, for the overlay panel and the sheet. */
  onReorder?: QuestionNavPanelProps["onReorder"];
  /**
   * The docked column's visibility from `md` up. Without `onShownChange` the
   * column can't be hidden and the toggle only reports the position there.
   */
  dock?: { shown: boolean; onShownChange?: (shown: boolean) => void };
}) {
  const { t } = useI18n();
  const anchor = useExerciseTourAnchor("questionList");
  const isMobile = useIsMobile();
  const setOpen = onOpenChange;
  // The panel closes on Escape and on its backdrop.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => (event.key === "Escape" ? setOpen(false) : undefined);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const unanswered = useMemo(
    () => new Set(unansweredNodeIds(test, answers)),
    [test, answers],
  );
  const answeredCount = test.nodes.length - unanswered.size;
  // Zero-pad + monospace the counts so the toggle keeps a constant width and
  // doesn't nudge the bottom bar as you move between questions.
  const width = String(test.nodes.length).length;
  const pad = (n: number) => String(n).padStart(width, "0");

  // A one-question test needs no navigator (pagination handles it), unless it has actions.
  if (test.nodes.length < 2 && !actions) return null;

  // From `md` up a docked navigator lives in the layout, not in an overlay.
  const docked = Boolean(dock) && !isMobile;
  const expanded = docked ? Boolean(dock?.shown) : open;
  const toggle = () => (docked ? dock?.onShownChange?.(!dock.shown) : setOpen(!open));

  return (
    <div className="relative">
      {open
        ? // Portalled so a transformed footer can't trap it, with a backdrop
          // that closes it. A docked navigator keeps it to phones.
          createPortal(
            <>
              <button
                type="button"
                aria-label={t("exercise.questionNav.close", "Close")}
                className={cn("fixed inset-0 z-[59] cursor-default bg-black/30", dock && "md:hidden")}
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-label={t("exercise.questionNav.title", "Questions")}
                className={cn(
                  "fixed z-[60] flex flex-col overflow-y-auto border-border bg-card shadow-xl",
                  // A bottom sheet on a phone, a side panel from `md` up.
                  "inset-x-0 bottom-0 max-h-[80dvh] rounded-t-3xl border-t-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
                  "md:inset-x-auto md:inset-y-0 md:left-0 md:max-h-none md:w-[min(90vw,24rem)] md:rounded-none md:border-r-2 md:border-t-0 md:pt-[max(1rem,env(safe-area-inset-top))]",
                  dock && "md:hidden",
                )}
              >
                <QuestionNavPanel
                  test={test}
                  answers={answers}
                  currentIndex={currentIndex}
                  onJump={(index) => {
                    onJump(index);
                    setOpen(false);
                  }}
                  collectionByNode={collectionByNode}
                  actions={actions}
                  states={states}
                  onReorder={onReorder}
                />
              </div>
            </>,
            document.body,
          )
        : null}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        // Docked, the toggle is the way back to a hidden list; say so on hover.
        title={
          docked && dock?.onShownChange
            ? dock.shown
              ? t("exercise.questionNav.hideList", "Hide questions")
              : t("exercise.questionNav.showList", "Show questions")
            : undefined
        }
        {...anchor}
        className={cn(
          // Compact below `sm`: the full "Question 001 / 104 · 040 done" would
          // push Next off an iPhone's screen (see PaginationBar).
          "relative z-10 inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full border-2 px-2.5 py-1.5 text-xs font-bold transition-colors sm:gap-2 sm:px-3.5 md:pointer-fine:min-h-9",
          expanded ? "border-rose-400 bg-rose-50 text-rose-700" : "border-border bg-card text-foreground hover:border-rose-200",
        )}
      >
        <LayoutGrid className="size-4" />
        <span>
          <span className="hidden sm:inline">{t("exercise.questionNav.question", "Question")} </span>
          <span className="font-mono tabular-nums">{pad(currentIndex + 1)}</span>
          {" / "}
          <span className="font-mono tabular-nums">{pad(test.nodes.length)}</span>
        </span>
        <span className="hidden text-muted-foreground sm:inline">
          · <span className="font-mono tabular-nums">{pad(answeredCount)}</span>{" "}
          {states === "keys" ? t("exercise.questionNav.keyed", "with keys") : t("exercise.questionNav.done", "done")}
        </span>
      </button>
    </div>
  );
}
