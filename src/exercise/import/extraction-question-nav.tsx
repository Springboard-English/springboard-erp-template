import { useMemo } from "react";
import { Plus } from "lucide-react";

import { RailHeader, type RailStatus } from "./rail-header";

import { valueLabel, type Translate } from "./i18n";
import { useStableI18n } from "./i18n";
import { questionTypeLabel } from "../index";
import { cn } from "../../lib/utils";
import type { ExtractedCollection } from "./api";

// The AI-extract review's question navigator — the teacher-side sibling of the
// live-session runner's QuestionNav. A long paper has dozens of questions; a
// card-per-question rail makes the page taller than the viewport and buries the
// one question being checked. This is a COMPACT numbered palette instead: cells
// grouped under their part/section headers, each showing its state (current /
// kept / discarded / still loading) so the teacher sees the whole paper at a
// glance and jumps straight to any question without scrolling a wall of cards.

// One rail row, shared with ai-extract's `RailEntry` shape.
export type NavEntry =
  | { kind: "header"; ref: string; collection: ExtractedCollection }
  | { kind: "item"; id: string; number: number }
  | { kind: "skeleton"; id: string; number: number };

type Cell =
  | { kind: "item"; id: string; number: number }
  | { kind: "skeleton"; id: string; number: number };

type Group = {
  key: string;
  label: string;
  tone: "part" | "section" | "loose";
  cells: Cell[];
  /** The section's compound task ("Gapped text"), when it declares one. */
  task: string | null;
  /**
   * The part/section a question added here should join, or null for the leading
   * "Questions" group (which has no collection of its own — those are
   * standalones, and a new one lands on the first part).
   */
  ref: string | null;
  /** Sections under a part. Always empty on a section and on the loose group. */
  sections: Group[];
};

// Fold the flat rail into groups the palette can render: a header opens a group,
// every question/skeleton after it falls into that group. Questions that arrive
// before any header (a bare standalone) collect in a leading "Questions" group.
function toGroups(entries: NavEntry[], t: Translate): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let currentPart: Group | null = null;
  const make = (
    key: string,
    label: string,
    tone: Group["tone"],
    ref: string | null,
    task: string | null,
  ): Group => ({ key, label, tone, cells: [], ref, task, sections: [] });
  const loose = (): Group => {
    if (current && current.tone === "loose") return current;
    current = make("loose", t("exercise.import.extractNav.questions", "Questions"), "loose", null, null);
    groups.push(current);
    return current;
  };
  for (const entry of entries) {
    if (entry.kind === "header") {
      const isPart = entry.collection.kind === "part";
      current = make(
        entry.ref,
        isPart
          ? entry.collection.title || t("exercise.import.extractNav.part", "Part")
          : entry.collection.instruction || t("exercise.import.extractNav.section", "Section"),
        isPart ? "part" : "section",
        entry.ref,
        // The section's own type. Six of the paper's tasks live here and
        // nowhere else — the questions underneath all say "Multiple choice".
        !isPart && entry.collection.info?.layout
          ? valueLabel(t, questionTypeLabel("mcq", entry.collection.info.layout))
          : null,
      );
      // Sections HANG OFF their part rather than being its sibling, matching
      // TestStructureNav. Flat, a part's "+ Section" would be drawn before the
      // sections it owns, and a section's cells would sit flush against the next
      // section's label — so which run a `+` belonged to would be a guess.
      if (isPart) {
        currentPart = current;
        groups.push(current);
      } else if (currentPart) {
        currentPart.sections.push(current);
      } else {
        groups.push(current);
      }
    } else {
      (current ?? loose()).cells.push(entry);
    }
  }
  // Empty groups are KEPT. A part whose questions all live in its sections has
  // no cells of its own, but it is exactly where a teacher needs to add the
  // question the extractor missed.
  return groups;
}

/** Matches `LABEL_TONE` in test-structure-nav.tsx — see the note there. */
const LABEL_TONE: Record<Group["tone"], string> = {
  part: "font-extrabold text-rose-700",
  section: "line-clamp-2 font-bold text-muted-foreground",
  loose: "font-extrabold text-muted-foreground",
};

export function ExtractionQuestionNav({
  entries,
  status,
  activeId,
  dropped,
  needsAnswer,
  reordering,
  onReorder,
  onSelect,
  onSelectCollection,
  onAdd,
  onAddCollection,
  onAddLoose,
}: {
  entries: NavEntry[];
  /** The import's counts, shown in the rail header. */
  status: RailStatus;
  reordering?: boolean;
  onReorder?: () => void;
  activeId: string | null;
  dropped: Set<string>;
  /** Questions with no answer key — extraction declined to guess one. */
  needsAnswer: Set<string>;
  onSelect: (id: string) => void;
  /**
   * Add a question to a specific part/section — the group's own ref, or null for
   * the leading loose group.
   *
   * Per group rather than one button in the action bar, which would add to
   * whichever question happened to be selected, so where a question landed
   * would depend on invisible state. Here the target is the thing you clicked
   * next to.
   */
  /**
   * Open a part/section in its own right, with no question selected — which is
   * how one that has no questions yet gets named.
   */
  onSelectCollection?: (ref: string) => void;
  onAdd?: (ref: string | null) => void;
  /**
   * Create a new part, or a new section inside `parentRef`.
   *
   * Without it, a run the extractor missed entirely — or a part of the paper it
   * never reached — would have no home: the questions would have to go in
   * somewhere unrelated, or the import be saved and rebuilt by hand.
   */
  onAddCollection?: (kind: "part" | "section", parentRef: string | null) => void;
  /**
   * Add a question that belongs to no collection at all — not a section, and not
   * a part either. Distinct from `onAdd(null)`, which is the loose group's own
   * `+` and means the same thing; this is how the FIRST one gets created, since
   * until then there is no loose group to click.
   */
  onAddLoose?: () => void;
}) {
  const { t } = useStableI18n();
  const groups = useMemo(() => toGroups(entries, t), [entries, t]);
  // Once the loose group is on screen it carries its own `+`, so the footer
  // button below would be a second way to do the identical thing.
  const hasLooseGroup = groups.some((group) => group.tone === "loose");

  return (
    <nav aria-label={t("exercise.import.extractNav.questions", "Questions")}>
      <RailHeader status={status} reordering={reordering} onReorder={onReorder} />

      <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.key} className="space-y-2">
          <GroupHeader group={group} onSelectCollection={onSelectCollection} />
          {group.sections.length > 0 ? (
            <div className="space-y-2">
              {group.sections.map((section) => (
                <div key={section.key} className="space-y-1.5 rounded-xl bg-muted/50 p-2">
                  <GroupHeader
                    group={section}
                    onSelectCollection={onSelectCollection}
                  />
                  <GroupGrid
                    group={section}
                    activeId={activeId}
                    dropped={dropped}
                    needsAnswer={needsAnswer}
                    onSelect={onSelect}
                    onAdd={onAdd}
                  />
                </div>
              ))}
            </div>
          ) : null}
          {/* A part's own questions come after its sections, and its `+` with
              them — same rule as TestStructureNav. */}
          {group.cells.length > 0 || group.sections.length === 0 ? (
            <GroupGrid
              group={group}
              activeId={activeId}
              dropped={dropped}
              needsAnswer={needsAnswer}
              onSelect={onSelect}
              onAdd={onAdd}
            />
          ) : onAdd && group.tone === "part" ? (
            /* A part with sections but no questions of its own. This is the
               only button that puts a question in the PART, outside every
               section — a paper's part often carries a question that belongs to
               no run (a single summary question after two matching tasks).
               Labelled rather than bare, so it reads as what it is instead of
               as a duplicate of the `+`s above it. */
            <button
              type="button"
              onClick={() => onAdd(group.ref)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border min-h-11 md:pointer-fine:min-h-9 py-1.5 text-[10px] font-extrabold text-muted-foreground transition-colors hover:border-rose-300 hover:text-rose-700"
            >
              <Plus className="size-3" />
              {t("exercise.import.extractNav.questionOutsideSections", "Question, outside sections")}
            </button>
          ) : null}
          {onAddCollection && group.tone === "part" && group.ref ? (
            <button
              type="button"
              onClick={() => onAddCollection("section", group.ref)}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border min-h-11 md:pointer-fine:min-h-9 py-1.5 text-[10px] font-extrabold text-muted-foreground transition-colors hover:border-rose-300 hover:text-rose-700"
            >
              <Plus className="size-3" />
              {t("exercise.import.extractNav.section", "Section")}
            </button>
          ) : null}
        </div>
      ))}
      </div>

      {onAddCollection ? (
        <button
          type="button"
          onClick={() => onAddCollection("part", null)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border min-h-11 md:pointer-fine:min-h-9 py-2 text-[11px] font-extrabold text-muted-foreground transition-colors hover:border-rose-300 hover:text-rose-700"
        >
          <Plus className="size-3.5" />
          {t("exercise.import.extractNav.newPart", "New Part")}
        </button>
      ) : null}

      {/* A question belonging to no part and no section. It lands in the leading
          "Questions" group, which only exists once one does — so without this
          button a paper whose parts the extractor found correctly would have no
          way to add one at all. Offered here rather than as a permanently empty group
          at the top of every rail. */}
      {onAddLoose && !hasLooseGroup ? (
        <button
          type="button"
          onClick={onAddLoose}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border min-h-11 md:pointer-fine:min-h-9 py-2 text-[11px] font-extrabold text-muted-foreground transition-colors hover:border-rose-300 hover:text-rose-700"
        >
          <Plus className="size-3.5" />
          {t("exercise.import.extractNav.questionOutsideParts", "Question, outside every part")}
        </button>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-3 text-[11px] font-semibold text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded bg-rose-600" />
          {t("exercise.import.extractNav.legendCurrent", "Current")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded border-2 border-butter-300 bg-butter-bg" />
          {t("exercise.import.extractNav.legendNeedsAnswer", "Needs an answer")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded bg-muted" />
          {t("exercise.import.extractNav.legendDiscarded", "Discarded")}
        </span>
      </div>
    </nav>
  );
}

/** Matches `GroupHeader` in test-structure-nav.tsx. */
function GroupHeader({
  group,
  onSelectCollection,
}: {
  group: Group;
  onSelectCollection?: (ref: string) => void;
}) {
  return (
    <div className="space-y-1 px-0.5">
      {onSelectCollection && group.ref ? (
        <button
          type="button"
          onClick={() => onSelectCollection(group.ref!)}
          title={group.label}
          className={cn(
            "block w-full text-left text-[11px] leading-tight underline-offset-2 hover:underline",
            LABEL_TONE[group.tone],
          )}
        >
          {group.label}
        </button>
      ) : (
        <p className={cn("text-[11px] leading-tight", LABEL_TONE[group.tone])}>
          {group.label}
        </p>
      )}
      {group.task ? (
        <span className="inline-block rounded-full bg-lav-bg px-2 py-0.5 text-[10px] font-extrabold text-lav-700">
          {group.task}
        </span>
      ) : null}
    </div>
  );
}

/** The group's numbered cells, and the `+` that adds one more to it. */
function GroupGrid({
  group,
  activeId,
  dropped,
  needsAnswer,
  onSelect,
  onAdd,
}: {
  group: Group;
  activeId: string | null;
  dropped: Set<string>;
  needsAnswer: Set<string>;
  onSelect: (id: string) => void;
  onAdd?: (ref: string | null) => void;
}) {
  const { t } = useStableI18n();
  return (
    <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-5 xl:grid-cols-6">
      {group.cells.map((cell) => {
        if (cell.kind === "skeleton") {
          return (
            <span
              key={cell.id}
              title={t("exercise.import.extractNav.stillReading", "Still reading this question…")}
              className="grid aspect-square animate-pulse place-items-center rounded-xl border-2 border-dashed border-border bg-background text-xs font-extrabold text-ink-300"
            >
              {cell.number}
            </span>
          );
        }
        const isActive = cell.id === activeId;
        const isDropped = dropped.has(cell.id);
        // A question with no answer is the work left before this import can be
        // saved at all, so it reads differently from a plain one.
        const needs = !isDropped && needsAnswer.has(cell.id);
        return (
          <button
            key={cell.id}
            type="button"
            onClick={() => onSelect(cell.id)}
            aria-current={isActive ? "true" : undefined}
            title={
              isDropped
                ? t("exercise.import.extractNav.cellDiscarded", "Question {n} — discarded", { n: cell.number })
                : needs
                  ? t("exercise.import.extractNav.cellNeedsAnswer", "Question {n} — needs an answer", {
                      n: cell.number,
                    })
                  : t("exercise.import.extractNav.cell", "Question {n}", { n: cell.number })
            }
            className={cn(
              "grid aspect-square place-items-center rounded-xl border-2 text-xs font-extrabold transition-all duration-150 ease-bounce hover:-translate-y-0.5",
              isActive
                ? "border-rose-400 bg-rose-600 text-white shadow-md ring-2 ring-rose-200"
                : isDropped
                  ? "border-transparent bg-muted text-ink-300 line-through hover:border-rose-200"
                  : needs
                    ? "border-butter-300 bg-butter-bg text-ink-700 hover:border-butter-700"
                    : "border-border bg-card text-foreground hover:border-rose-300",
            )}
          >
            {cell.number}
          </button>
        );
      })}
      {/* Last cell in the group, so it reads as "and one more here" and sits
          exactly where the new question will appear. */}
      {onAdd ? (
        <button
          type="button"
          onClick={() => onAdd(group.ref)}
          title={t("exercise.import.extractNav.addTo", "Add a question to {label}", { label: group.label })}
          aria-label={t("exercise.import.extractNav.addTo", "Add a question to {label}", { label: group.label })}
          className="grid aspect-square place-items-center rounded-xl border-2 border-dashed border-border bg-background text-muted-foreground transition-all duration-150 ease-bounce hover:-translate-y-0.5 hover:border-rose-300 hover:text-rose-700"
        >
          <Plus className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
