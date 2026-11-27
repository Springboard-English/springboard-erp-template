import type { ReactNode } from "react";
import { TOUR_ANCHORS, tourAnchorProps } from "./tour-anchor";
import { AlertTriangle, Sparkles } from "lucide-react";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  touchHitArea,
} from "../../exports";
import type { CollectionLayout, DetectedSectionSpec, DetectStructure } from "./api";
import { valueLabel } from "./i18n";
import { useStableI18n } from "./i18n";
import { skillLabel } from "../index";
import { cn } from "../../lib/utils";
import {
  chosenQuestionCount,
  detectedTask,
  detectedUnitRefs,
  missingPassage,
  type DetectedTask,
} from "./detect-selection";
import {
  ERROR_HUNT_LABEL,
  QUESTION_TYPE_LABELS,
  questionTypeLabel,
  SECTION_LAYOUTS,
  sectionTaskLabel,
  type QuestionType,
} from "../index";

// The tasks a section can be re-read as, each as one select value.
const TASK_VALUES: string[] = [
  ...(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((type) => `type:${type}`),
  ...SECTION_LAYOUTS.map((layout) => `layout:${layout}`),
  "hunt",
];

/** A task as its select value. */
function taskValue(task: DetectedTask): string {
  return task.kind === "type" ? `type:${task.type}` : task.kind === "layout" ? `layout:${task.layout}` : "hunt";
}

/** A select value back as a task. */
function valueTask(value: string): DetectedTask {
  if (value === "hunt") return { kind: "hunt" };
  const [kind, name] = value.split(":");
  return kind === "layout" ? { kind: "layout", layout: name as CollectionLayout } : { kind: "type", type: name as QuestionType };
}

// The step between detecting a paper and extracting it: everything the detector
// found, as a checklist, so a teacher who wants one exercise out of a paper
// extracts that one rather than the whole thing and discarding the rest in the
// review. Detection is one call; extraction is one call per unit, so what is
// left unticked here is never sent to the model at all.
export function DetectedUnitPicker({
  structure,
  chosen,
  onChange,
  onBack,
  onExtract,
  onRetype,
  hideActions = false,
}: {
  structure: DetectStructure;
  chosen: ReadonlySet<string>;
  onChange: (chosen: Set<string>) => void;
  /** A section re-typed before it is read: the only fix for a wrong detection short of starting over. */
  onRetype?: (ref: string, task: DetectedTask) => void;
  onBack: () => void;
  onExtract: () => void;
  /** Back and Import live in the host's bar (the import's runner frame). */
  hideActions?: boolean;
}) {
  const { t } = useStableI18n();
  const allRefs = detectedUnitRefs(structure);
  const count = chosenQuestionCount(structure, chosen);

  // Each unit's question numbers on the paper, counted through in order (Q9–18).
  const ranges = new Map<string, string>();
  let nextNumber = 1;
  for (const part of structure.parts) {
    for (const section of part.sections) {
      const count = Math.max(1, section.question_count);
      const last = nextNumber + count - 1;
      ranges.set(section.ref, count === 1 ? `Q${nextNumber}` : `Q${nextNumber}–${last}`);
      nextNumber = last + 1;
    }
  }

  const setMany = (refs: string[], on: boolean) => {
    const next = new Set(chosen);
    for (const ref of refs) {
      if (on) next.add(ref);
      else next.delete(ref);
    }
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div {...tourAnchorProps(TOUR_ANCHORS.importChoose)}>
          <h2 className="text-lg font-extrabold text-foreground">
            {t("exercise.import.detectPicker.title", "Choose what to import")}
          </h2>
          <p className="text-xs font-semibold text-muted-foreground">
            {t(
              "exercise.import.detectPicker.description",
              "Only what you tick is read in full. Untick the rest to import a single exercise.",
            )}
          </p>
        </div>
        <div className="flex gap-3 text-xs font-bold">
          <button type="button" className={`${touchHitArea} relative text-rose-700 hover:underline`} onClick={() => setMany(allRefs, true)}>
            {t("exercise.import.detectPicker.selectAll", "Select all")}
          </button>
          <button type="button" className={`${touchHitArea} relative text-rose-700 hover:underline`} onClick={() => setMany(allRefs, false)}>
            {t("exercise.import.detectPicker.clear", "Clear")}
          </button>
        </div>
      </div>

      {/* One bordered list: a sticky header per part, then a row per section,
          each named by how it starts on the paper rather than by its instruction,
          which is near-identical from one section to the next. */}
      <div className="overflow-clip rounded-2xl border bg-card">
        {structure.parts.map((part, index) => {
          const refs = part.sections.map((section) => section.ref);
          const ticked = refs.filter((ref) => chosen.has(ref)).length;
          const questionTotal = part.sections.reduce((n, section) => n + section.question_count, 0);
          return (
            <section key={part.ref} aria-label={part.title || t("exercise.import.detectPicker.partNumber", "Part {n}", { n: index + 1 })}>
              <label
                className={cn(
                  "sticky top-0 z-[1] flex min-h-11 cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 bg-muted px-4 py-2",
                  index > 0 && "border-t",
                )}
              >
                <input
                  type="checkbox"
                  className="size-[18px] shrink-0 accent-lav-500"
                  checked={ticked === refs.length}
                  // Some but not all: the native half-ticked state, which has no
                  // attribute and can only be set on the element.
                  ref={(el) => {
                    if (el) el.indeterminate = ticked > 0 && ticked < refs.length;
                  }}
                  onChange={(event) => setMany(refs, event.target.checked)}
                />
                <span className="shrink-0 text-sm font-extrabold text-foreground">
                  {part.title || t("exercise.import.detectPicker.partNumber", "Part {n}", { n: index + 1 })}
                </span>
                {/* A part has no skill of its own: it shows each skill its sections were tagged with. */}
                <span className="flex shrink-0 flex-wrap gap-1">
                  {[...new Set(part.sections.map((s) => s.skill))].map((skill) => (
                    <SkillChip key={skill} label={skillLabel(skill, t)} />
                  ))}
                </span>
                {/* One line: it is a model-written field, and detection has been
                    seen to put its own reasoning in it. */}
                {part.passage_title ? (
                  <span className="min-w-0 truncate text-xs font-semibold text-muted-foreground max-md:hidden">
                    · “{part.passage_title}”
                  </span>
                ) : null}
                <span className="ml-auto shrink-0 text-xs font-semibold text-muted-foreground">
                  {t("exercise.import.detectPicker.partMeta", "{n} of {total} · {q} Qs", { n: ticked, total: refs.length, q: questionTotal })}
                </span>
              </label>

              <ul>
                {part.sections.map((section) => (
                  <UnitRow
                    key={section.ref}
                    checked={chosen.has(section.ref)}
                    onChange={(on) => setMany([section.ref], on)}
                    quote={firstLine(section.questions_excerpt) || firstLine(section.instruction)}
                    range={ranges.get(section.ref) ?? ""}
                    skill={skillLabel(section.skill, t)}
                    type={valueLabel(t, questionTypeLabel(section.question_type, (section.layout || null) as CollectionLayout | null))}
                    count={
                      section.question_count === 1
                        ? t("exercise.import.detectPicker.questionOne", "1 question")
                        : t("exercise.import.detectPicker.questionOther", "{n} questions", { n: section.question_count })
                    }
                    // Said only of a part that needs one: a grammar or listening part has no reading text to lose.
                    noPassage={
                      missingPassage(part, section)
                        ? t("exercise.import.detectPicker.missingPassage", "Its reading text wasn’t found. Add a note saying where the passage is and read the paper again, or add the passage in the review.")
                        : null
                    }
                    task={(compact) =>
                      onRetype ? (
                        <TaskSelect section={section} compact={compact} onChange={(task) => onRetype(section.ref, task)} />
                      ) : null
                    }
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {hideActions ? null : (
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>
          {t("exercise.import.detectPicker.back", "Back")}
        </Button>
        <Button className="flex-1" disabled={count === 0} onClick={onExtract}>
          <Sparkles className="size-4" />
          {count === 0
            ? t("exercise.import.detectPicker.chooseSomething", "Choose Something to Import")
            : count === 1
              ? t("exercise.import.detectPicker.importOne", "Import 1 Question")
              : t("exercise.import.detectPicker.importOther", "Import {n} Questions", { n: count })}
        </Button>
      </div>
      )}
    </div>
  );
}

/** A section's task as a select: what it will be read as. */
function TaskSelect({
  section,
  onChange,
  compact = false,
}: {
  section: DetectedSectionSpec;
  onChange: (task: DetectedTask) => void;
  /** The phone's meta line: the type itself as a link-like trigger, not a boxed field. */
  compact?: boolean;
}) {
  const { t } = useStableI18n();
  return (
    <Select value={taskValue(detectedTask(section))} onValueChange={(value) => onChange(valueTask(value))}>
      <SelectTrigger
        {...tourAnchorProps(TOUR_ANCHORS.importReadAs)}
        size="sm"
        aria-label={t("exercise.import.detectPicker.readAs", "Read as")}
        className={
          compact
            ? "h-9 min-w-0 gap-0.5 border-0 bg-transparent px-1 text-xs font-bold text-mint-700 shadow-none"
            : "w-[200px] px-3 text-[13px] font-semibold"
        }
      >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TASK_VALUES.map((value) => {
            const task = valueTask(value);
            return (
              <SelectItem key={value} value={value}>
                {valueLabel(
                  t,
                  task.kind === "type"
                    ? QUESTION_TYPE_LABELS[task.type]
                    : task.kind === "layout"
                      ? sectionTaskLabel(task.layout)
                      : ERROR_HUNT_LABEL,
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
  );
}

/** A skill tag as a small chip. */
function SkillChip({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap rounded-full border border-lav-300 bg-lav-bg px-2 py-px text-[11px] font-bold text-lav-700">{label}</span>
  );
}

/** The first line of a model-written excerpt, trimmed. */
function firstLine(text: string | null | undefined): string {
  return (text ?? "").trim().split("\n")[0]?.trim() ?? "";
}

/** "No passage" as a small amber badge; the full explanation is its title. */
function NoPassageBadge({ detail }: { detail: string }) {
  const { t } = useStableI18n();
  return (
    <span title={detail} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-butter-bg px-2 py-px text-[11px] font-bold text-butter-700">
      <AlertTriangle className="size-3" aria-hidden />
      {t("exercise.import.detectPicker.noPassage", "No passage found")}
      <span className="sr-only">: {detail}</span>
    </span>
  );
}

/**
 * One section: its tick, a quote of how it starts on
 * the paper, then "Q9–18 · Gap filling · 10 questions". The skill chip is
 * pinned so it lines up on every row: from `md` in a fixed column left of the
 * Read as select, on a phone at the right end of the meta line, where the
 * type itself is the select.
 */
function UnitRow({
  checked,
  onChange,
  quote,
  range,
  type,
  count,
  skill,
  noPassage = null,
  task,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  quote: string;
  range: string;
  type: string;
  count: string;
  /** The skill the AI tagged the unit with. */
  skill: string;
  /** Why its reading text is missing, when it is. */
  noPassage?: string | null;
  /** The Read as select, full (`false`) or as the phone's inline type (`true`). */
  task?: (compact: boolean) => ReactNode;
}) {
  const phoneTask = task?.(true) ?? null;
  return (
    <li className="flex items-center gap-4 border-t px-4 py-2.5 first:border-t-0">
      <div className="min-w-0 flex-1">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-[3px] size-[18px] shrink-0 accent-lav-500"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
          />
          <span className="min-w-0 flex-1">
            <span
              className={cn(
                "block text-[15px] leading-[21px] font-semibold md:truncate max-md:line-clamp-2",
                checked ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {quote ? `“${quote}”` : type}
            </span>
            {/* From `md` the meta line is plain text; the controls sit at the row's right. */}
            <span className="mt-0.5 block truncate text-xs font-semibold text-muted-foreground max-md:hidden">
              {range} · {type} · {count}
            </span>
          </span>
        </label>
        {/* A phone's meta line: the range, the type as the select, any warning, the chip pinned right. */}
        <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 pl-[30px] text-xs font-semibold text-muted-foreground md:hidden">
          <span className="shrink-0">{range}</span>
          <span aria-hidden>·</span>
          {phoneTask ?? <span className="truncate">{type}</span>}
          {noPassage ? <NoPassageBadge detail={noPassage} /> : null}
          <span className="ml-auto shrink-0">
            <SkillChip label={skill} />
          </span>
        </div>
      </div>
      {/* Outside the label, so choosing a task doesn't tick the row. */}
      <div className="flex shrink-0 items-center gap-3 max-md:hidden">
        {noPassage ? <NoPassageBadge detail={noPassage} /> : null}
        {/* Wide enough for the longest skill ("Vocabulary & Grammar"). */}
        <span className="flex w-[156px] justify-start">
          <SkillChip label={skill} />
        </span>
        {task?.(false) ?? <span className="w-[200px]" aria-hidden />}
      </div>
    </li>
  );
}
