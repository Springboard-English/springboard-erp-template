import { createContext, useContext, useState, type ReactNode } from "react";
import { GripVertical, Pencil } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../context/I18nContext";
import { touchHitArea } from "../../lib/touchTarget";
import { cn } from "../../lib/utils";
import { wordAt } from "../lib/error-correction";
import { huntMarks, markFromParagraph } from "../lib/error-hunt";
import type { ExerciseNode } from "../lib/exercises";
import { gapPieces, moveGap } from "../lib/gap-move";
import { joinPassage, splitPassage } from "../lib/passage";
import { ClickableSentence, type HighlightRun } from "./clickable-sentence";
import { PassageText } from "./passage-text";

// Edit mode for the runner page.
//
// A teacher edits a paper on the same screen a student sits it on. When an
// `ExerciseEditProvider` wraps `ExercisePage`, the page keeps its layout but
// swaps what a student would answer for what a teacher edits: passage
// paragraphs open in place, cloze blanks drag between words, an error hunt's
// words mark the selected question's mistake, and each question renders the
// host's own editor (`renderQuestion`). Nothing here saves: every change goes
// to the host, which holds the drafts and the pending-changes bar.

/** What the host supplies to put the runner page in edit mode. */
export interface ExerciseEditor {
  /** The question being edited, highlighted wherever the page shows it. */
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  /** A collection's passage changed: its key and every paragraph. */
  onPassageChange: (collectionKey: string, passage: string[]) => void;
  /**
   * A cloze blank moved. The section's new passage, and its questions' ids in
   * their new order, which is the order of the `{gap}` tokens.
   */
  onBlanksMove: (collectionKey: string, passage: string[], order: string[]) => void;
  /** An error hunt word was picked as a question's mistake, in the joined passage. */
  onHuntMark: (nodeId: string, mark: { error: string; error_offset: number; sentence: string }) => void;
  /** The host's editor for one question, drawn where the student's question would be. */
  renderQuestion: (node: ExerciseNode, number: number) => ReactNode;
}

const EditContext = createContext<ExerciseEditor | null>(null);

/** Put every `ExercisePage` below in edit mode. */
export function ExerciseEditProvider({ editor, children }: { editor: ExerciseEditor; children: ReactNode }) {
  return <EditContext.Provider value={editor}>{children}</EditContext.Provider>;
}

/** The editor when the page is in edit mode, else null. */
export function useExerciseEditor(): ExerciseEditor | null {
  return useContext(EditContext);
}

/**
 * One question's slot in edit mode: the host's editor, framed and selectable.
 * Focus or a press anywhere inside selects it, so the passage can show which
 * blank or mistake belongs to the question being worked on.
 */
export function EditableQuestion({ node, number }: { node: ExerciseNode; number: number }) {
  const editor = useExerciseEditor();
  if (!editor) return null;
  const selected = editor.selectedId === node.id;
  return (
    <div
      data-question-id={node.id}
      onFocusCapture={() => (selected ? undefined : editor.onSelect(node.id))}
      onPointerDownCapture={() => (selected ? undefined : editor.onSelect(node.id))}
      className={cn(
        "scroll-mt-4 rounded-2xl transition-shadow",
        selected && "ring-2 ring-rose-400 ring-offset-2 ring-offset-background",
      )}
    >
      {editor.renderQuestion(node, number)}
    </div>
  );
}

/**
 * A passage, each paragraph editable in place. `{gap}` tokens show as written,
 * so a teacher editing a cloze can see and keep them; prose views print blanks.
 */
export function EditablePassage({
  collectionKey,
  paragraphs,
  className,
}: {
  collectionKey: string;
  paragraphs: string[];
  className?: string;
}) {
  const { t } = useI18n();
  const editor = useExerciseEditor();
  const [editing, setEditing] = useState<number | null>(null);
  if (!editor) return null;
  const change = (index: number, value: string) => {
    const next = [...paragraphs];
    next[index] = value;
    editor.onPassageChange(collectionKey, next);
  };
  const remove = (index: number) => {
    editor.onPassageChange(
      collectionKey,
      paragraphs.filter((_, at) => at !== index),
    );
    setEditing(null);
  };
  return (
    <div className={cn("space-y-3", className)}>
      {paragraphs.map((paragraph, index) =>
        editing === index ? (
          <div key={index} className="space-y-2 rounded-xl border-2 border-dashed border-teal-300 p-2">
            <Textarea
              autoFocus
              aria-label={t("exercise.edit.paragraph", "Paragraph {n}", { n: index + 1 })}
              value={paragraph}
              onChange={(event) => change(index, event.target.value)}
              className="min-h-32 text-[14.5px] leading-7"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button variant="ghost" size="sm" className="text-error" onClick={() => remove(index)}>
                {t("exercise.edit.removeParagraph", "Remove paragraph")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(null)}>
                {t("exercise.edit.done", "Done")}
              </Button>
            </div>
          </div>
        ) : (
          <div key={index} className="group relative rounded-xl border border-dashed border-transparent p-1 hover:border-border">
            <p className="whitespace-pre-wrap pr-10 text-[14.5px] leading-7 text-muted-foreground">
              <PassageText text={paragraph} />
            </p>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("exercise.edit.editParagraph", "Edit paragraph {n}", { n: index + 1 })}
              onClick={() => setEditing(index)}
              className="absolute right-0 top-0 size-8 opacity-60 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        ),
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          editor.onPassageChange(collectionKey, [...paragraphs, ""]);
          setEditing(paragraphs.length);
        }}
      >
        {t("exercise.edit.addParagraph", "Add paragraph")}
      </Button>
    </div>
  );
}

/**
 * A cloze section's passage with its blanks as chips a teacher drags between
 * words. Each chip is a `{gap}` token; dropping it before a word moves the token,
 * and the section's questions follow the new token order. Arrow keys on a chip
 * move it one word, so the move works without a pointer.
 */
export function ClozeBlanksEditor({
  collectionKey,
  passage,
  nodes,
  numbers,
}: {
  collectionKey: string;
  passage: string[];
  nodes: ExerciseNode[];
  numbers: number[];
}) {
  const { t } = useI18n();
  const editor = useExerciseEditor();
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  if (!editor) return null;
  const text = joinPassage(passage);
  const pieces = gapPieces(text);
  const words = pieces.map((piece, at) => (piece.kind === "word" ? at : -1)).filter((at) => at >= 0);

  const move = (gap: number, beforeWord: number) => {
    const result = moveGap(text, gap, beforeWord);
    if (!result) return;
    const order = result.order.map((old) => nodes[old]?.id).filter((id): id is string => Boolean(id));
    editor.onBlanksMove(collectionKey, splitPassage(result.text) ?? [result.text], order);
    const movedTo = result.order.indexOf(gap);
    if (nodes[gap]) editor.onSelect(nodes[gap].id);
    return movedTo;
  };

  // The word before which a blank sits, one word left or right of where it is.
  const nudge = (pieceAt: number, gap: number, direction: -1 | 1) => {
    const nextWordAfter = words.find((at) => at > pieceAt);
    const position = nextWordAfter === undefined ? words.length : words.indexOf(nextWordAfter);
    const target = words[position + direction];
    if (target !== undefined) move(gap, target);
  };

  return (
    <div className="rounded-2xl border bg-card p-5 text-[15px] leading-[2.6] text-foreground shadow-sm sm:p-7">
      <p className="mb-2 text-[11px] font-extrabold leading-5 text-muted-foreground">
        {t("exercise.edit.dragBlanks", "Drag a numbered blank before another word to move it. Arrow keys move the focused blank.")}
      </p>
      <div className="whitespace-pre-wrap">
        {pieces.map((piece, at) => {
          if (piece.kind === "space") return <span key={at}>{piece.text}</span>;
          if (piece.kind === "word") {
            return (
              <span
                key={at}
                onDragOver={(event) => {
                  if (dragging === null) return;
                  event.preventDefault();
                  setOver(at);
                }}
                onDragLeave={() => setOver((current) => (current === at ? null : current))}
                onDrop={(event) => {
                  event.preventDefault();
                  if (dragging !== null) move(dragging, at);
                  setDragging(null);
                  setOver(null);
                }}
                className={cn("rounded-sm", over === at && "shadow-[inset_3px_0_0_var(--color-rose-500)] bg-rose-50")}
              >
                {piece.text}
              </span>
            );
          }
          const node = nodes[piece.index];
          const selected = node && editor.selectedId === node.id;
          return (
            <button
              key={at}
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", String(piece.index));
                event.dataTransfer.effectAllowed = "move";
                setDragging(piece.index);
              }}
              onDragEnd={() => {
                setDragging(null);
                setOver(null);
              }}
              onClick={() => node && editor.onSelect(node.id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  nudge(at, piece.index, event.key === "ArrowLeft" ? -1 : 1);
                }
              }}
              aria-label={t("exercise.edit.blank", "Blank {n}, drag to move", { n: numbers[piece.index] ?? piece.index + 1 })}
              className={cn(
                touchHitArea,
                "mx-0.5 inline-flex h-8 cursor-grab items-center gap-1 rounded-md border-2 px-2 align-middle text-xs font-extrabold active:cursor-grabbing",
                selected ? "border-rose-500 bg-rose-100 text-rose-700" : "border-dashed border-ink-300 bg-muted text-ink-700",
                node ? "" : "border-error text-error",
              )}
            >
              <GripVertical className="size-3.5" aria-hidden />
              {numbers[piece.index] ?? "?"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * An error hunt's passage in edit mode: clicking a word marks it as the
 * selected question's mistake. Every question's mistake shows with its number.
 */
export function HuntMarksEditor({
  passage,
  nodes,
  numbers,
}: {
  passage: string[];
  nodes: Array<Extract<ExerciseNode, { type: "error-correction" }>>;
  numbers: number[];
}) {
  const { t } = useI18n();
  const editor = useExerciseEditor();
  if (!editor) return null;
  const text = joinPassage(passage);
  const { marks } = huntMarks(text, nodes.map((node) => node.content));
  const selectedIndex = nodes.findIndex((node) => node.id === editor.selectedId);
  const runs: HighlightRun[] = marks.map((mark) => ({
    span: mark.span,
    className:
      mark.index === selectedIndex
        ? "bg-rose-100 font-extrabold text-rose-700 ring-2 ring-rose-400"
        : "bg-lav-bg font-extrabold text-lav-700",
  }));
  const labels = new Map(marks.map((mark) => [mark.paragraphOffset, String(numbers[mark.index] ?? "")]));
  const pick = (offset: number) => {
    const node = nodes[selectedIndex];
    if (!node) return;
    const word = wordAt(text, offset);
    if (!word) return;
    const mark = markFromParagraph(text, { start: offset, end: offset + word.length });
    if (!mark) return;
    editor.onHuntMark(node.id, { error: mark.error, error_offset: mark.paragraphOffset, sentence: mark.sentence });
  };
  return (
    <div className="rounded-2xl border-2 bg-card p-4 shadow-sm sm:p-5">
      <p className="mb-3 text-[11px] font-extrabold text-muted-foreground">
        {selectedIndex >= 0
          ? t("exercise.edit.huntPick", "Click the word that is question {n}'s mistake", { n: numbers[selectedIndex] })
          : t("exercise.edit.huntSelect", "Select a question to mark its mistake")}
      </p>
      <ClickableSentence
        sentence={text}
        selected={null}
        disabled={selectedIndex < 0}
        onSelect={pick}
        className="text-[15px] leading-8"
        wordBadge={(offset) => labels.get(offset)}
        runs={runs}
      />
    </div>
  );
}
