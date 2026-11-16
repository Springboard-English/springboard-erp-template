import { createContext, useContext, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { ChevronDown, ImagePlus, Loader2, Pencil, Plus, X } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useI18n } from "../../context/I18nContext";
import { fieldHeight } from "../../lib/touchTarget";
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
  /**
   * A speaking topic pool's topics, by section key, and where a change to them
   * goes. Null while the host doesn't have them; omitted, the pool's speaking
   * question says the topics are set in the section's settings.
   */
  topicPrompts?: (sectionKey: string) => TopicPromptsEdit | null;
}

/** A topic pool's topics as the editor shows them, and their setter. */
export interface TopicPromptsEdit {
  prompts: string[];
  onChange: (prompts: string[]) => void;
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
  multiline = false,
  spanProps,
}: {
  value: string;
  /** Omitted outside edit mode, which prints the text. */
  onChange?: ((value: string) => void) | null;
  placeholder?: string;
  label: string;
  className?: string;
  /** Kept for callers; the span is always inline now. */
  inline?: boolean;
  /** Enter starts a new paragraph (a blank line) instead of being ignored. */
  multiline?: boolean;
  /** Extra handlers for the span (a cloze's drops and word picks). */
  spanProps?: HTMLAttributes<HTMLSpanElement>;
}) {
  if (!onChange) return <>{value}</>;
  return (
    <InlineEditable
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      label={label}
      className={className}
      multiline={multiline}
      spanProps={spanProps}
    />
  );
}

/** The editable span behind `EditableText`: plain text in, plain text out. */
function InlineEditable({
  value,
  onChange,
  placeholder,
  label,
  className,
  multiline = false,
  spanProps,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
  multiline?: boolean;
  spanProps?: HTMLAttributes<HTMLSpanElement>;
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
      {...spanProps}
      ref={ref}
      role="textbox"
      tabIndex={0}
      aria-label={label}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      data-placeholder={placeholder ?? label}
      onInput={(event) => onChange(event.currentTarget.textContent ?? "")}
      // Inside a choice row or a draggable piece, a click or drag would also act on it.
      onClick={(event) => {
        spanProps?.onClick?.(event);
        stop(event);
      }}
      onPointerDown={stop}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key !== "Enter") return;
        event.preventDefault();
        // A new paragraph is a blank line in the stored text.
        if (multiline) document.execCommand("insertText", false, "\n\n");
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

/**
 * An add control drawn as one more row of the list it adds to: the same shape
 * and size as its rows, a dashed outline, a "+" where the row's letter or
 * number sits. `className` gives the row's own shape (radius, padding, text).
 */
export function AddRow({
  label,
  onClick,
  className,
  chipClassName,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  /** The "+" chip's shape, matching the rows' letter chip. */
  chipClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 border-2 border-dashed border-border bg-transparent text-left font-semibold text-muted-foreground transition-colors hover:border-rose-300 hover:text-foreground",
        className ?? "rounded-xl p-2.5 text-sm",
      )}
    >
      <span className={cn("grid shrink-0 place-items-center bg-muted text-ink-700", chipClassName ?? "size-5 rounded")}>
        <Plus className="size-3.5" />
      </span>
      {label}
    </button>
  );
}

/** "Add option" as the last row of a pooled section's list, in edit mode only. */
export function PoolAddOption({ className, chipClassName }: { className?: string; chipClassName?: string }) {
  const { t } = useI18n();
  const pool = usePoolEdit();
  if (!pool) return null;
  return (
    <AddRow
      className={className}
      chipClassName={chipClassName}
      label={t("exercise.edit.addOption", "Add option")}
      onClick={() => {
        let n = pool.options.length + 1;
        while (pool.options.some((option) => option.id === `opt-${n}`)) n += 1;
        pool.write([...pool.options, { id: `opt-${n}`, label: "" }]);
      }}
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
              className="min-h-32 text-base leading-7"
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
            <p className="whitespace-pre-wrap pr-10 text-base leading-7 text-muted-foreground">
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

// The type, skill and marks controls share one look: the field style of the
// type's searchable list (height, border, text size and weight), so the three
// read as one stack of the same kind of control.
const META_FIELD = cn(
  fieldHeight,
  "flex w-full min-w-0 items-center rounded-md border border-input bg-background px-3 text-base font-normal text-foreground shadow-xs md:text-sm",
);

/**
 * A question's type, skill and marks where its card prints them, editable in
 * edit mode: the type is a searchable list with a line on each (only while the
 * host allows a retype, else the same field read-only), the skill a select, the
 * marks a number. All three use one field style.
 */
export function QuestionMetaControls({ node, stacked = false }: { node: ExerciseNode; stacked?: boolean }) {
  const { t } = useI18n();
  const editor = useExerciseEditor();
  if (!editor) return null;
  const meta = editor.questionMeta?.(node) ?? { points: node.points ?? null };
  const typeId = `question-type-${node.id}`;
  const width = stacked ? "w-44" : "w-52";
  return (
    // Stacked on a card, so the three take a narrow column and the question keeps its width.
    <span className={cn("inline-flex gap-1.5", stacked ? "flex-col items-stretch" : "flex-wrap items-center")}>
      {meta.retype ? (
        <SearchableSelect
          id={typeId}
          value={node.type}
          className={width}
          options={questionTypeSchema.options.map((type) => ({
            value: type,
            label: valueLabel(t, QUESTION_TYPE_LABELS[type]),
            description: valueLabel(t, QUESTION_TYPE_DESCRIPTIONS[type]),
          }))}
          onValueChange={(next) => (next && next !== node.type ? meta.retype?.(next as QuestionType) : undefined)}
        />
      ) : (
        <span
          className={cn(META_FIELD, width, "cursor-default bg-muted/50")}
          title={t("exercise.edit.typeFixed", "A saved question keeps its type. Add a new question for another type.")}
        >
          <span className="truncate">{valueLabel(t, QUESTION_TYPE_LABELS[node.type])}</span>
        </span>
      )}
      <span className={cn("relative", width)}>
        <select
          aria-label={t("exercise.edit.skill", "Skill")}
          value={node.skillTag}
          onChange={(event) => editor.onNodeChange(node.id, { ...node, skillTag: event.target.value as SkillTag })}
          className={cn(META_FIELD, "cursor-pointer appearance-none pr-9 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring")}
        >
          {skillTagSchema.options.map((skill) => (
            <option key={skill} value={skill}>
              {valueLabel(t, SKILL_LABELS[skill])}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
      </span>
      <label
        className={cn(
          META_FIELD,
          width,
          "gap-1 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring",
          !meta.onPointsChange && "bg-muted/50",
        )}
      >
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
          className="w-0 min-w-0 flex-1 bg-transparent outline-none disabled:cursor-default"
        />
        <span className="text-muted-foreground">{t("exercise.edit.points", "pts")}</span>
      </label>
    </span>
  );
}

/**
 * A question's settings, anchored to its number on a section page where no
 * card holds them: type, skill and marks, the host's tools (its settings
 * button, keep or discard) and any action the caller adds. Closes on a press
 * outside or Escape.
 */
export function QuestionMenu({
  node,
  onClose,
  extra,
}: {
  node: ExerciseNode;
  onClose: () => void;
  extra?: ReactNode;
}) {
  const editor = useExerciseEditor();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    const onKey = (event: KeyboardEvent) => (event.key === "Escape" ? onClose() : undefined);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  if (!editor) return null;
  return (
    <div
      ref={ref}
      role="dialog"
      onClick={(event) => event.stopPropagation()}
      className="absolute left-0 top-full z-30 mt-2 flex w-60 flex-col gap-2 rounded-2xl border bg-card p-3 text-left text-sm leading-normal shadow-xl"
    >
      <QuestionMetaControls node={node} stacked />
      <div className="flex flex-wrap items-center gap-1.5">{editor.questionTools?.(node)}</div>
      {extra}
    </div>
  );
}
