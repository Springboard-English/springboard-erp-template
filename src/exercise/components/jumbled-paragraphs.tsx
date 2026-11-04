import {
  ParagraphDrop,
  SlotContent,
  type DropItem,
} from "./paragraph-drop";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { ExerciseAnswer, ExerciseNode } from "../lib/exercises";
import { optionLetters } from "../lib/option-letters";

// Jumbled paragraphs: a text cut into pieces and shuffled, which the student
// drags back into order.
//
// Deliberately NOT a new exercise type. It is the same shape as a gapped text —
// assign N lettered items to N depleting slots — so it is a SECTION of `mcq`
// with `layout: "jumbled-paragraph"`, where question *i* is "what goes in
// position i" and its options are the paragraphs. That means no new content
// model, no new answer shape, no new grading branch, and per-position marks
// rather than all-or-nothing on the whole ordering: a student who gets four of
// six positions right scores four.
//
// The pool and drag behaviour are shared with the gapped text; only the slots
// differ (an ordered list rather than holes inside a passage).
export type JumbledNode = Extract<ExerciseNode, { type: "mcq" }>;

export function JumbledParagraphs({
  nodes,
  numbers,
  answers,
  onChange,
  mode = "practice",
}: {
  nodes: JumbledNode[];
  /** 1-based question number per node — the position in the finished text. */
  numbers: number[];
  answers: Record<string, ExerciseAnswer>;
  onChange: (nodeId: string, value: ExerciseAnswer) => void;
  mode?: "practice" | "result";
}) {
  const { t } = useI18n();
  // Every position offers the same paragraphs, so take the pool from the first.
  const options = nodes[0]?.content.options ?? [];
  const letters = optionLetters(options);
  const items: DropItem[] = options.map((option, index) => ({
    id: option.id,
    letter: letters[index],
    label: option.label,
  }));
  const itemById = new Map(items.map((item) => [item.id, item]));

  const assignment: Record<string, string | undefined> = {};
  for (const node of nodes) {
    const raw = answers[node.id];
    if (typeof raw === "string" && raw) assignment[node.id] = raw;
  }

  const assign = (slotId: string, itemId: string | null, previousSlotId?: string) => {
    // A paragraph occupies one position only — vacate the old one first.
    if (previousSlotId && previousSlotId !== slotId) onChange(previousSlotId, null);
    onChange(slotId, itemId);
  };

  return (
    <ParagraphDrop
      items={items}
      slots={nodes.map((node) => node.id)}
      slotNames={numbers.map((number) => t("exercise.renderer.positionName", "position {n}", { n: number }))}
      assignment={assignment}
      onAssign={assign}
      disabled={mode !== "practice"}
      poolLabel={t("exercise.renderer.poolDragOrder", "Paragraphs · drag them into the right order")}
      selectPoolLabel={t("exercise.renderer.poolChoosePosition", "Paragraphs · choose one at each position")}
      renderSlots={(slot, dropMode) => {
        // Only where a select is genuinely rendered — a read-only review is
        // still the chip and the dashed box, whichever presentation it is in.
        const picking = dropMode === "select" && mode === "practice";
        return (
        <ol className="space-y-2">
          {nodes.map((node, index) => {
            const item = itemById.get(assignment[node.id] ?? "");
            return (
              <li key={node.id}>
                {slot(
                  node.id,
                  <div className="flex items-start gap-3 rounded-2xl border-2 border-border bg-card p-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-muted text-sm font-extrabold text-ink-700">
                      {numbers[index]}
                    </span>
                    {item || picking ? (
                      // Filled positions show the paragraph in full: the order
                      // only reads as right or wrong if you can read the text.
                      //
                      // An EMPTY position still renders the control in select
                      // mode — the select is what fills it, and the wide dashed
                      // box below is a drop target, which there is nothing to
                      // drop into here.
                      // Stacked while picking: a select and a whole paragraph
                      // side by side in a phone's width leaves the text as a
                      // two-word ribbon down the page.
                      <div
                        className={cn(
                          "flex min-w-0 flex-1 gap-2",
                          picking ? "flex-col items-start" : "items-start",
                        )}
                      >
                        <SlotContent
                          item={item}
                          placeholder={picking ? t("exercise.renderer.choosePlaceholder", "choose…") : ""}
                          disabled={mode !== "practice"}
                          onClear={() => onChange(node.id, null)}
                        />
                        {item ? (
                          <span className="min-w-0 text-sm leading-6 text-foreground">
                            {item.label}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="flex min-h-9 flex-1 items-center rounded-xl border-2 border-dashed border-border bg-muted/40 px-3 text-xs font-bold text-muted-foreground">
                        {t("exercise.renderer.dropHere", "drop the paragraph that goes here")}
                      </span>
                    )}
                  </div>,
                )}
              </li>
            );
          })}
        </ol>
        );
      }}
    />
  );
}
