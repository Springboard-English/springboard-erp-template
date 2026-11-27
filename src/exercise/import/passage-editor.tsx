import { useLayoutEffect, useRef, useState } from "react";
import { Bold, Italic, Plus, Underline } from "lucide-react";
import { Textarea } from "../../exports";

import { useStableI18n } from "./i18n";
import {
  countGapTokens,
  joinPassage,
  splitPassage,
  insertText,
  MARKUP_MARKERS,
  toggleMarkup,
  type TextEdit,
} from "../index";
import { cn } from "../../lib/utils";

// A passage box with the stored encoding done FOR the teacher: B / I / U write
// the markers `parseMarkup` reads, "Insert blank" writes the `{gap}` token a
// cloze places its answer boxes by, and the footer counts the paragraphs and
// blanks the text will become — rather than a hint asking them to type it.
//
// Not a <label>: a <button> is labelable, so a label around the toolbar would
// forward every click on its caption to the Bold button.

const GAP = "{gap}";

function sameParagraphs(a: string, b: string): boolean {
  return joinPassage(splitPassage(a)) === joinPassage(splitPassage(b));
}

export function PassageEditor({
  label,
  value,
  onChange,
  placeholder,
  rows = 10,
  blanks = false,
  markup = true,
  note,
  disabled = false,
  className,
}: {
  /**
   * Offer B / I / U. Off for an error hunt: its offsets index the RAW text, so
   * the clickable passage prints the markers rather than styling them.
   */
  markup?: boolean;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  /** Offer "Insert blank" — a cloze or gapped-text passage. Shown anyway once a blank exists. */
  blanks?: boolean;
  /** A line under the box saying what this passage is for. */
  note?: string;
  disabled?: boolean;
  className?: string;
}) {
  const { t } = useStableI18n();
  const ref = useRef<HTMLTextAreaElement>(null);
  const restore = useRef<TextEdit | null>(null);

  // The RAW text is shown while it means the same paragraphs as `value`. A
  // parent that stores paragraphs hands back the text re-joined, which has
  // already lost the blank line Enter just made, so a new paragraph could never
  // be typed; a change from outside (a discard, a refetch) still shows.
  const [raw, setRaw] = useState(value);
  const shown = sameParagraphs(raw, value) ? raw : value;
  const change = (text: string) => {
    setRaw(text);
    onChange(text);
  };

  // The new text arrives through the parent, so the selection is put back once
  // it has rendered — otherwise every button press drops the cursor at the end.
  useLayoutEffect(() => {
    const edit = restore.current;
    const box = ref.current;
    if (!edit || !box || box.value !== edit.text) return;
    restore.current = null;
    box.focus();
    box.setSelectionRange(edit.selectionStart, edit.selectionEnd);
  }, [shown]);

  const apply = (make: (text: string, start: number, end: number) => TextEdit) => {
    const box = ref.current;
    if (!box) return;
    const edit = make(box.value, box.selectionStart, box.selectionEnd);
    restore.current = edit;
    change(edit.text);
  };

  const paragraphs = splitPassage(shown)?.length ?? 0;
  const gaps = countGapTokens(shown);
  const showBlanks = blanks || gaps > 0;

  const tools = [
    {
      icon: Bold,
      name: t("exercise.import.passageEditor.bold", "Bold"),
      title: t("exercise.import.passageEditor.boldTitle", "Bold the selected words"),
      marker: MARKUP_MARKERS.bold,
    },
    {
      icon: Italic,
      name: t("exercise.import.passageEditor.italic", "Italic"),
      title: t("exercise.import.passageEditor.italicTitle", "Italic the selected words"),
      marker: MARKUP_MARKERS.italic,
    },
    {
      icon: Underline,
      name: t("exercise.import.passageEditor.underline", "Underline"),
      title: t("exercise.import.passageEditor.underlineTitle", "Underline the selected words"),
      marker: MARKUP_MARKERS.underline,
    },
  ];

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {label ? (
          <span className="text-[11px] font-extrabold text-muted-foreground">
            {label}
          </span>
        ) : (
          <span />
        )}
        {disabled ? null : (
          <div
            className="flex items-center gap-1"
            role="toolbar"
            aria-label={t("exercise.import.passageEditor.toolbar", "Passage formatting")}
          >
            {(markup ? tools : []).map(({ icon: Icon, name, title, marker }) => (
              <button
                key={name}
                type="button"
                title={title}
                aria-label={name}
                className="grid size-11 place-items-center rounded-lg border md:pointer-fine:size-9 bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
                // Keep the textarea's selection: a click would move focus first.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => apply((text, s, e) => toggleMarkup(text, s, e, marker))}
              >
                <Icon className="size-3.5" />
              </button>
            ))}
            {showBlanks ? (
              <button
                type="button"
                title={t("exercise.import.passageEditor.insertBlankTitle", "Put an answer box where the cursor is")}
                className="ml-1 inline-flex h-11 items-center md:pointer-fine:h-9 gap-1 rounded-lg border border-dashed bg-background px-2 text-[11px] font-extrabold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => apply((text, s, e) => insertText(text, s, e, GAP))}
              >
                <Plus className="size-3" />
                {t("exercise.import.passageEditor.insertBlank", "Insert Blank")}
              </button>
            ) : null}
          </div>
        )}
      </div>
      <Textarea
        ref={ref}
        value={shown}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder ?? t("exercise.import.passageEditor.placeholder", "Paste the reading text here.")}
        className="font-normal"
        onChange={(event) => change(event.target.value)}
      />
      <p className="text-xs font-semibold text-muted-foreground">
        <span className="font-extrabold text-foreground">
          {paragraphs === 1
            ? t("exercise.import.passageEditor.paragraphOne", "1 paragraph")
            : t("exercise.import.passageEditor.paragraphOther", "{n} paragraphs", { n: paragraphs })}
          {showBlanks
            ? ` · ${
                gaps === 1
                  ? t("exercise.import.passageEditor.blankOne", "1 blank")
                  : t("exercise.import.passageEditor.blankOther", "{n} blanks", { n: gaps })
              }`
            : ""}
        </span>
        {" — "}
        {showBlanks
          ? t(
              "exercise.import.passageEditor.hintBlanks",
              "press Enter twice to start a new paragraph; each {gap} is an answer box, matched to the questions in order.",
              // The token itself, shown literally.
              { gap: GAP },
            )
          : t("exercise.import.passageEditor.hint", "press Enter twice to start a new paragraph.")}
        {note ? ` ${note}` : ""}
      </p>
    </div>
  );
}
