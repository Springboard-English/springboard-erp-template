import {
  ParagraphDrop,
  SlotContent,
  type DropItem,
} from "./paragraph-drop";
import { useI18n } from "../../context/I18nContext";
import { splitPassageOnGaps } from "../lib/gap-token";
import type { ExerciseAnswer, ExerciseNode } from "../lib/exercises";
import { optionLetters } from "../lib/option-letters";

// A gapped-text section: a passage with whole paragraphs removed, refilled from
// a lettered pool by DRAGGING each paragraph into its gap.
//
// The task on paper is spatial — you put the paragraph in the hole — so the
// passage is the interface: gaps sit inline where they belong, and the pool
// depletes as they fill. A table of dropdowns beside the passage would make the
// student hold "gap 3 is the one after the bit about funding" in their head.
//
// Each gap is one `mcq` question whose options are the shared pool (identical
// on every question) and whose answer is the chosen paragraph's option id. The
// drag
// machinery is shared with jumbled paragraphs — see `paragraph-drop.tsx`.
export type GappedChoiceNode = Extract<ExerciseNode, { type: "mcq" }>;

export function GappedTextSection({
  passage,
  nodes,
  numbers,
  answers,
  onChange,
  mode = "practice",
}: {
  /** The passage with its gap markers. */
  passage: string[] | null;
  nodes: GappedChoiceNode[];
  /** 1-based question number per node. */
  numbers: number[];
  answers: Record<string, ExerciseAnswer>;
  onChange: (nodeId: string, value: ExerciseAnswer) => void;
  mode?: "practice" | "result";
}) {
  const { t } = useI18n();
  // The pool is shared; take it from the first gap. Letters are the paper's own
  // where the ids carry them — see `optionLetters`.
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
    // Moving a paragraph must EMPTY the gap it came from, or the pool stops
    // depleting and the same paragraph fills two gaps.
    if (previousSlotId && previousSlotId !== slotId) onChange(previousSlotId, null);
    onChange(slotId, itemId);
  };

  const text = (passage ?? []).join("\n\n");
  // A gapped text is marked with whatever the PAPER printed — a bare number on
  // its own line, "[37]", a ruled line — not the `{gap}` token a cloze carries,
  // because the section prompt asks for the passage "with its numbered gaps
  // marked" verbatim. Splitting on the token alone would match nothing, so every
  // passage would take the fallback below with the gaps piled up under the text.
  // `splitPassageOnGaps` tries each marker style and accepts only the one that
  // accounts for exactly this section's gaps. When none does — an import with no
  // markers at all — the fallback still stands: the passage, then a numbered
  // slot per gap. Draggable either way, just without the text woven around them.
  const chunks = text ? splitPassageOnGaps(text, nodes.length) : null;

  // `placeholder` doubles as the select's empty option in select mode, so the
  // instruction has to match the control the student is actually looking at.
  const gapSlot = (index: number, placeholder: string) => (
    <span className="mx-1 inline-flex items-center gap-1.5 align-middle">
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-rose-100 text-[10px] font-extrabold text-rose-700">
        {numbers[index]}
      </span>
      <SlotContent
        item={itemById.get(assignment[nodes[index].id] ?? "")}
        placeholder={placeholder}
        disabled={mode !== "practice"}
        onClear={() => onChange(nodes[index].id, null)}
      />
    </span>
  );

  return (
    <ParagraphDrop
      items={items}
      slots={nodes.map((node) => node.id)}
      slotNames={numbers.map((number) => t("exercise.renderer.gapName", "gap {n}", { n: number }))}
      assignment={assignment}
      onAssign={assign}
      disabled={mode !== "practice"}
      poolLabel={t("exercise.renderer.poolDragGap", "Paragraphs · drag each one into its gap")}
      selectPoolLabel={t("exercise.renderer.poolChooseGap", "Paragraphs · choose one at each gap")}
      renderSlots={(slot, dropMode) => {
        // Only where a select is genuinely rendered — a read-only review keeps
        // the chip and its old wording, whichever presentation it is in.
        const placeholder =
          dropMode === "select" && mode === "practice"
            ? t("exercise.renderer.choosePlaceholder", "choose…")
            : t("exercise.renderer.dropParagraph", "drop a paragraph");
        return (
          <div className="rounded-2xl border bg-card p-5 text-[15px] leading-8 text-foreground shadow-sm sm:p-6">
            {chunks ? (
              chunks.map((chunk, index) => (
                <span key={index}>
                  <span className="whitespace-pre-wrap">{chunk}</span>
                  {index < nodes.length
                    ? slot(nodes[index].id, gapSlot(index, placeholder))
                    : null}
                </span>
              ))
            ) : (
              <div className="space-y-3">
                {text ? (
                  <p className="whitespace-pre-wrap text-muted-foreground">{text}</p>
                ) : null}
                {nodes.map((node, index) => (
                  <div key={node.id}>{slot(node.id, gapSlot(index, placeholder))}</div>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
