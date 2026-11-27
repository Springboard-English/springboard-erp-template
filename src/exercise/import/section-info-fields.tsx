import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  touchHitArea,
} from "../../exports";

import type { CollectionInfo, CollectionLayout } from "./api";
import {
  addBankWords,
  layoutMismatch,
  showsWordBank,
  withLayout,
  withWordBank,
  ERROR_HUNT,
  SECTION_LAYOUTS,
  sectionTask,
  sectionTaskLabel,
} from "../index";
import { valueLabel } from "./i18n";
import { useStableI18n } from "./i18n";

// A section's task (`info.layout`) and its shared word box (`info.word_bank`),
// the two things `info` holds — shared by the AI review, a saved test's
// Questions tab and part detail, so the three cannot drift.
//
// The layout is what makes six of a paper's most distinctive tasks what they are
// (a gapped text, a multiple matching, a "choose TWO"…): the questions underneath
// are plain mcq or gap-filling either way. The collection PATCH takes `info`, so a
// misdetected layout or a typo in a word box can be fixed after saving; it
// REPLACES the blob, which is why both fields here emit a whole new `info`
// (lib/collection-info).

// Radix Select has no value for "none", so the empty choice needs a sentinel.
const NO_LAYOUT = "__none__";

export function SectionLayoutField({
  info,
  onChange,
  questionTypes = [],
  hunt = false,
  onHuntChange,
  disabled = false,
}: {
  info: CollectionInfo | null | undefined;
  onChange: (info: CollectionInfo | null) => void;
  /** The section's question types, to warn when the task can't draw them. */
  questionTypes?: string[];
  /**
   * An error hunt chosen for a section with no questions yet. It stores no
   * layout (see `ERROR_HUNT`), so the screen that adds questions holds it.
   */
  hunt?: boolean;
  /** Offered only where the screen can pin new questions to error correction. */
  onHuntChange?: (hunt: boolean) => void;
  disabled?: boolean;
}) {
  const { t } = useStableI18n();
  const layout = info?.layout ?? null;
  const derived = sectionTask(layout, questionTypes);
  const task = layout ?? (hunt ? ERROR_HUNT : derived);
  const mismatch = layoutMismatch(task, questionTypes, t);
  // Choosing it can only mean something where new questions can be pinned, or
  // where the questions already make the section one.
  const huntOffered = Boolean(onHuntChange) || derived === ERROR_HUNT;
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">
          {t("exercise.import.sectionInfo.task", "Task")}
        </span>
        <Select
          value={task ?? NO_LAYOUT}
          disabled={disabled}
          onValueChange={(next) => {
            onHuntChange?.(next === ERROR_HUNT);
            const nextLayout =
              next === NO_LAYOUT || next === ERROR_HUNT ? null : (next as CollectionLayout);
            onChange(withLayout(info, nextLayout));
          }}
        >
          <SelectTrigger size="sm" className="w-[240px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_LAYOUT}>{t("exercise.import.sectionInfo.plainRun", "Plain run of questions")}</SelectItem>
            {SECTION_LAYOUTS.map((option) => (
              <SelectItem key={option} value={option}>
                {valueLabel(t, sectionTaskLabel(option))}
              </SelectItem>
            ))}
            {huntOffered ? (
              <SelectItem value={ERROR_HUNT}>{valueLabel(t, sectionTaskLabel(ERROR_HUNT))}</SelectItem>
            ) : null}
          </SelectContent>
        </Select>
      </div>
      {task === ERROR_HUNT && !mismatch ? (
        <p className="text-xs font-semibold text-muted-foreground">
          {t(
            "exercise.import.sectionInfo.huntHint",
            "Paste the passage with its mistakes still in it, then add one question per mistake and click the wrong word in the passage.",
          )}
        </p>
      ) : null}
      {mismatch ? (
        <p className="text-xs font-bold text-butter-700">{mismatch}</p>
      ) : null}
    </div>
  );
}

// The box of words a banked cloze or a word-formation run draws from, edited as
// chips in the order the paper prints them. An entry can itself contain a space
// ("look after"), so Enter or a comma adds a word, and a pasted box is split on
// commas and line breaks (`addBankWords`).
export function SectionWordBankField({
  info,
  onChange,
  show = false,
  disabled = false,
}: {
  info: CollectionInfo | null | undefined;
  onChange: (info: CollectionInfo | null) => void;
  /** Offer the box even when the task doesn't call for one (any gap section). */
  show?: boolean;
  disabled?: boolean;
}) {
  const { t } = useStableI18n();
  const words = info?.word_bank ?? [];
  const [typed, setTyped] = useState("");

  if (!show && !showsWordBank(info)) return null;

  const commit = (text: string) => {
    setTyped("");
    const next = addBankWords(words, text);
    if (next.length !== words.length) onChange(withWordBank(info, next));
  };
  const remove = (index: number) =>
    onChange(withWordBank(info, words.filter((_, i) => i !== index)));

  return (
    <div className="space-y-1.5 rounded-2xl border border-dashed bg-muted/30 p-3">
      <p className="text-sm font-medium text-foreground">
        {t("exercise.import.sectionInfo.wordBank", "Word bank")}
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
          {t("exercise.import.sectionInfo.wordBankHint", "shown above every blank in this section")}
        </span>
      </p>
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border bg-background px-2 py-1.5">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-flex items-center gap-1 rounded-full bg-lav-bg px-2.5 py-0.5 text-xs font-bold text-lav-700"
          >
            {word}
            {disabled ? null : (
              <button
                type="button"
                aria-label={t("exercise.import.sectionInfo.removeWord", "Remove {word}", { word })}
                className={`${touchHitArea} relative text-lav-700/70 hover:text-lav-700`}
                onClick={() => remove(index)}
              >
                <X className="size-3" />
              </button>
            )}
          </span>
        ))}
        <input
          value={typed}
          disabled={disabled}
          aria-label={t("exercise.import.sectionInfo.addWord", "Add a word to the bank")}
          placeholder={
            words.length
              ? t("exercise.import.sectionInfo.addAnother", "Add another word…")
              : t("exercise.import.sectionInfo.typeWord", "Type a word and press Enter")
          }
          className="min-w-[10rem] flex-1 bg-transparent px-1 py-0.5 text-base font-semibold outline-none placeholder:font-normal placeholder:text-muted-foreground md:text-sm"
          onChange={(event) => setTyped(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commit(typed);
            } else if (event.key === "Backspace" && !typed && words.length) {
              event.preventDefault();
              remove(words.length - 1);
            }
          }}
          onPaste={(event) => {
            const text = event.clipboardData.getData("text");
            if (!/[,\n]/.test(text)) return;
            event.preventDefault();
            commit(typed + text);
          }}
          onBlur={() => commit(typed)}
        />
      </div>
    </div>
  );
}

/**
 * A speaking topic pool's prompts, one box each: every attempt is given one at
 * random. Shown only on a `topic-pool` section. An empty box is dropped when
 * saved, since the API refuses a blank prompt.
 */
export function SectionPromptsField({
  prompts,
  onChange,
  disabled = false,
}: {
  prompts: string[] | null | undefined;
  onChange: (prompts: string[]) => void;
  disabled?: boolean;
}) {
  const { t } = useStableI18n();
  const list = prompts ?? [];
  const set = (index: number, text: string) =>
    onChange(list.map((prompt, i) => (i === index ? text : prompt)));
  return (
    <div className="space-y-2 rounded-2xl border border-dashed bg-muted/30 p-3">
      <p className="text-sm font-medium text-foreground">
        {t("exercise.import.sectionInfo.prompts", "Topic prompts")}
        <span className="ml-1.5 text-xs font-normal text-muted-foreground">
          {t("exercise.import.sectionInfo.promptsHint", "each student is given one at random")}
        </span>
      </p>
      {list.map((prompt, index) => (
        <div key={index} className="flex items-start gap-2">
          <Textarea
            value={prompt}
            disabled={disabled}
            aria-label={t("exercise.import.sectionInfo.promptN", "Prompt {n}", { n: index + 1 })}
            className="min-h-14 flex-1 bg-background"
            onChange={(event) => set(index, event.target.value)}
          />
          {disabled ? null : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("exercise.import.sectionInfo.removePrompt", "Remove prompt {n}", { n: index + 1 })}
              onClick={() => onChange(list.filter((_, i) => i !== index))}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      ))}
      {disabled ? null : (
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...list, ""])}>
          <Plus className="size-4" />
          {t("exercise.import.sectionInfo.addPrompt", "Add Prompt")}
        </Button>
      )}
    </div>
  );
}

/** A pool's prompts as the API takes them: trimmed, blanks dropped, null when none are left. */
export function cleanPrompts(prompts: string[] | null | undefined): string[] | null {
  const kept = (prompts ?? []).map((prompt) => prompt.trim()).filter(Boolean);
  return kept.length ? kept : null;
}
