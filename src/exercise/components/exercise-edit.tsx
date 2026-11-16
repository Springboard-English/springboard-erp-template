import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { GripVertical, ImagePlus, Loader2, Pencil, Plus, X } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../context/I18nContext";
import { touchHitArea } from "../../lib/touchTarget";
import { cn } from "../../lib/utils";
import type { ExerciseNode } from "../lib/exercises";
import { gapPieces, moveGap } from "../lib/gap-move";
import { joinPassage, splitPassage } from "../lib/passage";
import { optionLetters } from "../lib/option-letters";
import { PassageText } from "./passage-text";

// Edit mode for the runner page.
//
// A teacher edits a paper on the screen a student sits it on. When an
// `ExerciseEditProvider` wraps `ExercisePage`, the page draws the same student
// renderers, answered with the question's key: answering one sets its key
// (see `lib/answer-key-bridge.ts`), its text edits in place (`EditableText`),
// passages edit by paragraph and cloze blanks can be dragged between words.
// Nothing here saves: every change goes to the host, which holds the drafts
// and the pending-changes bar.

/** What the host supplies to put the runner page in edit mode. */
export interface ExerciseEditor {
  /** The question being edited, highlighted wherever the page shows it. */
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  /** A question changed: its text, or its key from an answer given on it. */
  onNodeChange: (nodeId: string, node: ExerciseNode) => void;
  /** A collection's passage changed: its key and every paragraph. */
  onPassageChange: (collectionKey: string, passage: string[]) => void;
  /**
   * A cloze blank moved. The section's new passage, and its questions' ids in
   * their new order, which is the order of the `{gap}` tokens.
   */
  onBlanksMove: (collectionKey: string, passage: string[], order: string[]) => void;
  /** The host's controls beside a question's marks (its settings button). */
  questionTools?: (node: ExerciseNode) => ReactNode;
  /**
   * Stores a picture for an option and answers its key and a URL to show it.
   * Without it, options offer no picture controls.
   */
  uploadOptionImage?: (file: File) => Promise<{ image_key: string; url: string }>;
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
 * A setter for a question's content fields in edit mode, or null outside it.
 * Renderers use it to make their text editable in place.
 */
export function useNodeEdit(node: ExerciseNode): ((patch: Record<string, unknown>) => void) | null {
  const editor = useExerciseEditor();
  if (!editor) return null;
  return (patch) =>
    editor.onNodeChange(node.id, { ...node, content: { ...node.content, ...patch } } as ExerciseNode);
}

/**
 * A piece of a question's printed text: plain text for a student, and in edit
 * mode the same text as a borderless field that grows with it, so a teacher
 * types where the words are printed.
 */
export function EditableText({
  value,
  onChange,
  placeholder,
  label,
  className,
  inline = false,
}: {
  value: string;
  /** Omitted outside edit mode, which prints the text. */
  onChange?: ((value: string) => void) | null;
  placeholder?: string;
  label: string;
  className?: string;
  /** Inside a sentence (the words either side of a blank). */
  inline?: boolean;
}) {
  if (!onChange) return <>{value}</>;
  return (
    <textarea
      value={value}
      rows={1}
      aria-label={label}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      // Inside a choice row a click would also pick the row.
      onClick={(event) => event.stopPropagation()}
      className={cn(
        "field-sizing-content resize-none rounded-md border border-dashed border-ink-300 bg-transparent px-1 align-baseline font-[inherit] text-[length:inherit] leading-[inherit] text-[inherit] outline-none hover:border-rose-300 focus:border-solid focus:border-rose-400",
        inline ? "inline-block min-w-12 max-w-full align-middle" : "block w-full",
        className,
      )}
    />
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

/** A question's `prompt`, printed, or editable in place in edit mode. */
export function EditablePrompt({ node }: { node: ExerciseNode & { content: { prompt: string } } }) {
  const { t } = useI18n();
  const edit = useNodeEdit(node);
  return (
    <EditableText
      value={node.content.prompt}
      onChange={edit && ((next) => edit({ prompt: next }))}
      label={t("exercise.edit.prompt", "Question")}
    />
  );
}

/** One choice as an option list stores it. */
interface EditableOption {
  id: string;
  label: string;
  image_key?: string;
  image_url?: string;
}

/**
 * Add, replace or remove an option's picture in edit mode. The file goes to
 * the host's `uploadOptionImage` as soon as it is picked; the option changes
 * through `onChange` like any other edit, so it saves with the question.
 */
export function OptionImageControls({
  option,
  letter,
  onChange,
}: {
  option: EditableOption;
  letter: string;
  onChange: (option: EditableOption) => void;
}) {
  const { t } = useI18n();
  const editor = useExerciseEditor();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const upload = editor?.uploadOptionImage;
  if (!upload) return null;
  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setFailed(null);
    try {
      const image = await upload(file);
      onChange({ ...option, image_key: image.image_key, image_url: image.url });
    } catch (error) {
      setFailed(error instanceof Error ? error.message : t("exercise.edit.imageFailed", "The picture couldn’t be uploaded."));
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  return (
    <span className="inline-flex shrink-0 items-center gap-1" onClick={(event) => event.stopPropagation()}>
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => void pick(event.target.files?.[0])}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={busy}
        aria-label={
          option.image_url
            ? t("exercise.edit.replaceImage", "Replace option {letter}'s picture", { letter })
            : t("exercise.edit.addImage", "Add a picture to option {letter}", { letter })
        }
        onClick={() => input.current?.click()}
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
      </Button>
      {option.image_url ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("exercise.edit.removeImage", "Remove option {letter}'s picture", { letter })}
          onClick={() => onChange({ id: option.id, label: option.label })}
        >
          <X className="size-4" />
        </Button>
      ) : null}
      {failed ? <span className="text-xs font-bold text-error">{failed}</span> : null}
    </span>
  );
}

/**
 * The one lettered list a pooled section draws from (gapped text, matching,
 * jumbled paragraphs, "choose several"), edited once for every question in it.
 * Each question stores a copy, so every change goes to all of them; a removed
 * option clears the key of a question that pointed at it.
 */
export function PoolOptionsEditor({ nodes }: { nodes: ExerciseNode[] }) {
  const { t } = useI18n();
  const editor = useExerciseEditor();
  const first = nodes.find((node) => node.type === "mcq");
  if (!editor || !first || first.type !== "mcq") return null;
  const options = first.content.options as EditableOption[];
  const letters = optionLetters(options);
  const write = (next: EditableOption[]) => {
    const ids = new Set(next.map((option) => option.id));
    for (const node of nodes) {
      if (node.type !== "mcq") continue;
      const keep = node.content.correct_option_id && ids.has(node.content.correct_option_id);
      editor.onNodeChange(node.id, {
        ...node,
        content: { ...node.content, options: next.map((option) => ({ ...option })), correct_option_id: keep ? node.content.correct_option_id : "" },
      } as ExerciseNode);
    }
  };
  return (
    <div className="space-y-2 rounded-2xl border bg-card p-4 shadow-sm">
      <p className="text-[11px] font-extrabold text-muted-foreground">
        {t("exercise.edit.poolOptions", "The options every question in this section draws from")}
      </p>
      {options.map((option, index) => (
        <div key={option.id} className="flex items-start gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-muted text-[13px] font-extrabold text-ink-700">
            {letters[index]}
          </span>
          <EditableText
            value={option.label}
            label={t("exercise.renderer.optionAria", "Option {letter}", { letter: letters[index] })}
            onChange={(label) => write(options.map((other) => (other.id === option.id ? { ...other, label } : other)))}
            className="text-sm font-semibold leading-6"
          />
          <OptionImageControls
            option={option}
            letter={letters[index]}
            onChange={(next) => write(options.map((other) => (other.id === option.id ? next : other)))}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("exercise.edit.removeOption", "Remove option {letter}", { letter: letters[index] })}
            onClick={() => write(options.filter((other) => other.id !== option.id))}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          let n = options.length + 1;
          while (options.some((option) => option.id === `opt-${n}`)) n += 1;
          write([...options, { id: `opt-${n}`, label: "" }]);
        }}
      >
        <Plus className="size-4" />
        {t("exercise.edit.addOption", "Add option")}
      </Button>
    </div>
  );
}
