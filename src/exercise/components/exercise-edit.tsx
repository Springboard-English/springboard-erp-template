import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { GripVertical, ImagePlus, Loader2, Pencil, Plus, X } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../context/I18nContext";
import { touchHitArea } from "../../lib/touchTarget";
import { cn } from "../../lib/utils";
import {
  QUESTION_TYPE_DESCRIPTIONS,
  QUESTION_TYPE_LABELS,
  SKILL_LABELS,
  questionTypeSchema,
  skillTagSchema,
  type ExerciseNode,
  type QuestionType,
  type SkillTag,
} from "../lib/exercises";
import { SearchableSelect } from "../../components/ui/searchable-select";
import { valueLabel } from "../i18n";
import { gapOntoWord, gapPieces, moveGap } from "../lib/gap-move";
import { joinPassage, splitPassage } from "../lib/passage";
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
  /** What of a question's type and marks may change here; see `QuestionMeta`. */
  questionMeta?: (node: ExerciseNode) => QuestionMeta;
  /**
   * Stores a picture for an option and answers its key and a URL to show it.
   * Without it, options offer no picture controls.
   */
  uploadOptionImage?: (file: File) => Promise<{ image_key: string; url: string }>;
}

/** A question's type and marks as the host lets them change. */
export interface QuestionMeta {
  /** Swaps the question for a blank of another type; omitted keeps the type. */
  retype?: (type: QuestionType) => void;
  /** The marks shown on the question: a test's own, or the library default. */
  points: number | null;
  onPointsChange?: (points: number) => void;
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
 * mode the same words as an editable span that flows and wraps exactly like
 * the printed sentence, so editing keeps the student's line layout.
 */
export function EditableText({
  value,
  onChange,
  placeholder,
  label,
  className,
}: {
  value: string;
  /** Omitted outside edit mode, which prints the text. */
  onChange?: ((value: string) => void) | null;
  placeholder?: string;
  label: string;
  className?: string;
  /** Kept for callers; the span is always inline now. */
  inline?: boolean;
}) {
  if (!onChange) return <>{value}</>;
  return <InlineEditable value={value} onChange={onChange} placeholder={placeholder} label={label} className={className} />;
}

/** The editable span behind `EditableText`: plain text in, plain text out. */
function InlineEditable({
  value,
  onChange,
  placeholder,
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Written only when the text differs, so typing never moves the caret.
  useEffect(() => {
    const element = ref.current;
    if (element && element.textContent !== value) element.textContent = value;
  }, [value]);
  const stop = (event: { stopPropagation: () => void }) => event.stopPropagation();
  return (
    <span
      ref={ref}
      role="textbox"
      tabIndex={0}
      aria-label={label}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      data-placeholder={placeholder ?? label}
      onInput={(event) => onChange(event.currentTarget.textContent ?? "")}
      // Inside a choice row or a draggable piece, a click or drag would also act on it.
      onClick={stop}
      onPointerDown={stop}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === "Enter") event.preventDefault();
      }}
      className={cn(
        "rounded-sm decoration-ink-300 decoration-dashed underline-offset-4 outline-none [text-decoration-line:underline] hover:decoration-rose-400 focus:bg-rose-50 focus:decoration-rose-500",
        "empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
        className,
      )}
    />
  );
}

/** One choice as an option list stores it. */
export interface EditableOption {
  id: string;
  label: string;
  image_key?: string;
  image_url?: string;
}

/** A pooled section's one option list and how to change it for every question. */
export interface PoolEdit {
  options: EditableOption[];
  write: (next: EditableOption[]) => void;
}

const PoolEditContext = createContext<PoolEdit | null>(null);

/**
 * Makes the option list of a pooled section (gapped text, matching, jumbled,
 * "choose several") editable where the student's renderer prints it. Each
 * question stores a copy, so every change goes to all of them; a removed
 * option clears the key of a question that pointed at it.
 */
export function PoolEditProvider({ nodes, children }: { nodes: ExerciseNode[]; children: ReactNode }) {
  const editor = useExerciseEditor();
  const first = nodes.find((node) => node.type === "mcq");
  if (!editor || !first || first.type !== "mcq") return <>{children}</>;
  const value: PoolEdit = {
    options: first.content.options as EditableOption[],
    write: (next) => {
      const ids = new Set(next.map((option) => option.id));
      for (const node of nodes) {
        if (node.type !== "mcq") continue;
        const keep = node.content.correct_option_id && ids.has(node.content.correct_option_id);
        editor.onNodeChange(node.id, {
          ...node,
          content: {
            ...node.content,
            options: next.map((option) => ({ ...option })),
            correct_option_id: keep ? node.content.correct_option_id : "",
          },
        } as ExerciseNode);
      }
    },
  };
  return <PoolEditContext.Provider value={value}>{children}</PoolEditContext.Provider>;
}

/** The pooled section's options in edit mode, else null. */
export function usePoolEdit(): PoolEdit | null {
  return useContext(PoolEditContext);
}

/**
 * One pooled option's label where a renderer prints it: the printed label for a
 * student, and in edit mode the label typed in place with its picture and
 * remove controls beside it.
 */
export function PoolOptionLabel({ id, label, letter }: { id: string; label: string; letter: string }) {
  const { t } = useI18n();
  const pool = usePoolEdit();
  if (!pool) return <>{label}</>;
  const option = pool.options.find((candidate) => candidate.id === id);
  if (!option) return <>{label}</>;
  const replace = (next: EditableOption) => pool.write(pool.options.map((other) => (other.id === id ? next : other)));
  return (
    <>
      <EditableText
        value={option.label}
        label={t("exercise.renderer.optionAria", "Option {letter}", { letter })}
        onChange={(next) => replace({ ...option, label: next })}
      />
      <span className="ml-1 inline-flex align-middle">
        <OptionImageControls option={option} letter={letter} onChange={replace} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label={t("exercise.edit.removeOption", "Remove option {letter}", { letter })}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            pool.write(pool.options.filter((other) => other.id !== id));
          }}
        >
          <X className="size-4" />
        </Button>
      </span>
    </>
  );
}

/** "Add option" at the end of a pooled section's list, in edit mode only. */
export function PoolAddOption({ className }: { className?: string }) {
  const { t } = useI18n();
  const pool = usePoolEdit();
  if (!pool) return null;
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={() => {
        let n = pool.options.length + 1;
        while (pool.options.some((option) => option.id === `opt-${n}`)) n += 1;
        pool.write([...pool.options, { id: `opt-${n}`, label: "" }]);
      }}
    >
      <Plus className="size-4" />
      {t("exercise.edit.addOption", "Add option")}
    </Button>
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
  // A blank picked to take another word: the next word clicked becomes its answer.
  const [armed, setArmed] = useState<number | null>(null);
  if (!editor) return null;
  const text = joinPassage(passage);
  const takeWord = (gap: number, wordPiece: number) => {
    const node = nodes[gap];
    if (!node) return;
    const content = node.content as { accepted_answers?: string[] };
    const result = gapOntoWord(text, gap, wordPiece, content.accepted_answers?.[0] ?? "");
    if (!result) return;
    const order = result.order.map((old) => nodes[old]?.id).filter((id): id is string => Boolean(id));
    editor.onBlanksMove(collectionKey, splitPassage(result.text) ?? [result.text], order);
    editor.onNodeChange(node.id, {
      ...node,
      content: { ...node.content, accepted_answers: [result.word, ...(content.accepted_answers ?? []).slice(1)] },
    } as ExerciseNode);
    setArmed(null);
  };
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
        {armed !== null
          ? t("exercise.edit.pickWord", "Click the word that blank {n} should be. Its old answer goes back into the text.", { n: numbers[armed] ?? armed + 1 })
          : t("exercise.edit.dragBlanks", "Drag a numbered blank before another word to move it, or click a blank and then a word to make that word its answer. Arrow keys move the focused blank.")}
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
                onClick={() => (armed !== null ? takeWord(armed, at) : undefined)}
                className={cn(
                  "rounded-sm",
                  over === at && "shadow-[inset_3px_0_0_var(--color-rose-500)] bg-rose-50",
                  armed !== null && "cursor-pointer hover:bg-rose-100",
                )}
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
              onClick={() => {
                if (node) editor.onSelect(node.id);
                setArmed((current) => (current === piece.index ? null : piece.index));
              }}
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
 * A question's type, skill and marks where its card prints them, editable in
 * edit mode: the type is a searchable list with a line on each (only while the
 * host allows a retype), the skill a select, the marks a number.
 */
export function QuestionMetaControls({ node }: { node: ExerciseNode }) {
  const { t } = useI18n();
  const editor = useExerciseEditor();
  if (!editor) return null;
  const meta = editor.questionMeta?.(node) ?? { points: node.points ?? null };
  const typeId = `question-type-${node.id}`;
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {meta.retype ? (
        <SearchableSelect
          id={typeId}
          value={node.type}
          className="h-8 w-52 text-xs"
          options={questionTypeSchema.options.map((type) => ({
            value: type,
            label: valueLabel(t, QUESTION_TYPE_LABELS[type]),
            description: valueLabel(t, QUESTION_TYPE_DESCRIPTIONS[type]),
          }))}
          onValueChange={(next) => (next && next !== node.type ? meta.retype?.(next as QuestionType) : undefined)}
        />
      ) : (
        <span
          className="rounded-full border bg-muted px-2.5 py-1 text-[11px] font-bold text-muted-foreground"
          title={t("exercise.edit.typeFixed", "A saved question keeps its type. Add a new question for another type.")}
        >
          {valueLabel(t, QUESTION_TYPE_LABELS[node.type])}
        </span>
      )}
      <select
        aria-label={t("exercise.edit.skill", "Skill")}
        value={node.skillTag}
        onChange={(event) => editor.onNodeChange(node.id, { ...node, skillTag: event.target.value as SkillTag })}
        className="h-8 rounded-full border bg-card px-2.5 text-xs font-bold text-foreground"
      >
        {skillTagSchema.options.map((skill) => (
          <option key={skill} value={skill}>
            {valueLabel(t, SKILL_LABELS[skill])}
          </option>
        ))}
      </select>
      <label className="inline-flex h-8 items-center gap-1 rounded-full border bg-card px-2.5 text-xs font-bold text-foreground">
        <input
          type="number"
          min={0}
          step={0.25}
          aria-label={t("exercise.edit.marks", "Marks")}
          value={meta.points ?? 0}
          disabled={!meta.onPointsChange}
          onChange={(event) => {
            const value = Number.parseFloat(event.target.value);
            meta.onPointsChange?.(Number.isFinite(value) && value >= 0 ? value : 0);
          }}
          className="w-12 bg-transparent text-right outline-none"
        />
        {t("exercise.edit.points", "pts")}
      </label>
    </span>
  );
}
