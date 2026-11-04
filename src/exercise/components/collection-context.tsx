import { useState, type ReactNode } from "react";
import { BookOpen, ChevronDown, Eye, EyeOff } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import type { Translate } from "../i18n";
import { useExerciseTourAnchor } from "../lib/tour-anchors";
import { useScrollPane } from "../lib/use-scroll-pane";
import type { CollectionStub } from "../types";
import { AnnotatablePassage } from "./annotatable-passage";
import { PassageText } from "./passage-text";

// The part/section title lines for a stub, for surfaces that show the heading
// somewhere other than inside the question flow (the runner puts it in the top
// bar). `part` is the paper-level label, `section` the run's instruction.
export function collectionHeading(stub: CollectionStub | null | undefined, t: Translate): {
  part: string | null;
  section: string | null;
} {
  const part = stub?.kind === "part" ? stub : stub?.parent ?? null;
  const section = stub?.kind === "section" ? stub : null;
  return {
    part: part ? part.title || t("exercise.renderer.part", "Part") : null,
    section: section?.instruction || section?.title || null,
  };
}

// The part/section context a question sits in: "Part 2" + its instruction, the
// section's header line, and the shared passage the question is judged against.
// Wraps the question wherever one is shown (runner, preview, review) using the
// collection stub the API embeds per exercise — the stub is student-safe by
// construction, so this is the same component for both roles.
//
// It takes the question as `children` rather than rendering above it because the
// passage and the question are read *together*: stacked, a reading passage
// pushes the question it asks about off-screen, so answering means scrolling up
// and down for every one of a section's questions. Side by side, both stay in
// view and only the passage column scrolls.
//
// `hideHeader` suppresses the part/section header bar — the runner lifts that
// into the top bar, so rendering it here too would duplicate it.
export function CollectionContext({
  stub,
  children,
  hideHeader,
  hidePassage,
  preferPartPassage,
  enableAnnotations,
}: {
  stub: CollectionStub | null | undefined;
  children?: ReactNode;
  hideHeader?: boolean;
  // Suppress the passage panel entirely.
  hidePassage?: boolean;
  // Show ONLY the part's (reading) passage beside the question, ignoring the
  // section's own text. A summary-completion section has both: the part's
  // reading passage (side-by-side reference) AND the section's summary (which is
  // rendered as the cloze itself), so the cloze passes this to keep the reading
  // passage on the left while it owns the summary.
  preferPartPassage?: boolean;
  // Let the student highlight and take notes on the side-by-side passage.
  enableAnnotations?: boolean;
}) {
  const { t } = useI18n();
  const passageAnchor = useExerciseTourAnchor("passage");
  const [showPassage, setShowPassage] = useState(true);
  const [showHeading, setShowHeading] = useState(true);
  // The questions column is its own scroll pane in the side-by-side layout, so
  // it publishes its height for the drag pool that pins inside it.
  const questionsRef = useScrollPane<HTMLDivElement>();

  // A section's part carries the paper-level header; the passage may sit on
  // either level (a paper can pin one passage over several sections).
  const part = stub?.kind === "part" ? stub : stub?.parent;
  const section = stub?.kind === "section" ? stub : null;
  const passageHolder = hidePassage
    ? null
    : preferPartPassage
      ? part?.passage?.length
        ? part
        : null
      : section?.passage?.length
        ? section
        : part?.passage?.length
          ? part
          : null;

  const hasHeader =
    !hideHeader && Boolean(part?.title || part?.instruction || section?.instruction);

  // A word-formation section's shared word box, shown once for the whole run of
  // blank questions. Reference only — the student types the word (each blank is
  // a gap-filling question), so nothing here is interactive or depleting.
  const wordBank = section?.info?.word_bank ?? null;
  const wordBankPanel =
    wordBank && wordBank.length ? (
      <div className="mb-4 shrink-0 rounded-2xl border border-dashed bg-muted/30 px-4 py-3">
        <p className="mb-2 text-[11px] font-extrabold text-muted-foreground">
          {t("exercise.renderer.wordBank", "Word bank")}
        </p>
        <div className="flex flex-wrap gap-2">
          {wordBank.map((word) => (
            <span
              key={word}
              className="rounded-full border-2 bg-card px-3 py-1 text-sm font-extrabold text-ink-700 shadow-sm"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    ) : null;

  // No context at all — render the question exactly as if this wrapper weren't
  // here, so a standalone question is never boxed in an empty layout.
  if (!stub || (!hasHeader && !passageHolder && !wordBankPanel)) {
    return <>{children}</>;
  }

  const header = hasHeader ? (
    // `top-0`, not an offset under the top bar: the bar is not overlapping
    // chrome the content scrolls beneath — the shell is a fixed viewport and this
    // sits inside the content pane, which starts below it (see StudentShell).
    <div className="sticky top-0 z-10 mb-4 shrink-0 rounded-2xl border bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/50">
      <button
        type="button"
        onClick={() => setShowHeading((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left"
      >
        <span className="min-w-0 truncate text-[11px] font-extrabold text-rose-700">
          {part?.title || section?.instruction || part?.instruction}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            !showHeading && "-rotate-90",
          )}
        />
      </button>
      {showHeading ? (
        <div className="border-t px-4 py-3">
          {part?.instruction ? (
            <p className="text-xs font-semibold leading-5 text-muted-foreground">
              {part.instruction}
            </p>
          ) : null}
          {section?.instruction ? (
            <p
              className={cn(
                "text-xs font-bold leading-5 text-foreground",
                part?.instruction && "mt-1.5 border-t pt-1.5",
              )}
            >
              {section.instruction}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  ) : null;

  if (!passageHolder?.passage?.length) {
    return (
      <>
        {header}
        {wordBankPanel}
        {children}
      </>
    );
  }

  // `{gap}` is the renderer's contract, not something to show a reader — this
  // is the prose path (no inputs), so each token draws as a printed blank, and
  // the teacher's markup draws as styling (PassageText).
  //
  // `whitespace-pre-wrap` because a passage paragraph is not always one run of
  // prose: a labelled section ("A\nThe first thing to note...") or a set-out
  // list carries its own line breaks, and collapsing them would run the label
  // into the text and turn a formatted extract into a wall.
  const paragraphs = passageHolder.passage.map((paragraph) => (
    <p
      key={paragraph}
      className="mt-3 whitespace-pre-wrap text-[14.5px] leading-7 text-muted-foreground first:mt-0"
    >
      <PassageText text={paragraph} />
    </p>
  ));

  // Teacher exercise-detail passes no children — the question renders in its own
  // card elsewhere, so here the passage is a plain stacked card.
  if (!children) {
    return (
      <div className="mb-4">
        {header}
        {wordBankPanel}
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5 text-sm font-bold text-foreground">
            <BookOpen className="size-4" />
            {passageHolder.passage_title || t("exercise.renderer.passage", "Passage")}
          </div>
          <div className="max-h-72 overflow-y-auto p-5">{paragraphs}</div>
        </div>
      </div>
    );
  }

  // Side by side (the runner): the passage is a chrome-less column that fills
  // the left half of the content pane and never scrolls out of view — only its
  // own body scrolls. Below lg it falls back to a capped, hideable block stacked
  // above the question.
  //
  // The column takes its height from the grid, which takes what the shell's
  // fixed viewport left it (`.runner-passage-column`, index.css), not from a
  // `100dvh` calculation, which would be wrong whenever something sits above it
  // (the preview's banner) and cut the passage's last lines off under the
  // bottom bar.
  const passageColumn = (
    <div {...passageAnchor} className="runner-passage-column">
      {/* A card, so the passage reads as its own panel beside the questions. */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b bg-muted/30 px-4 py-2.5">
          <p className="flex min-w-0 items-center gap-2 text-sm font-bold text-foreground">
            <BookOpen className="size-4 shrink-0" />
            <span className="truncate">{passageHolder.passage_title || t("exercise.renderer.passage", "Passage")}</span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowPassage((current) => !current)}
          >
            {showPassage ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            {showPassage ? t("exercise.renderer.hide", "Hide") : t("exercise.renderer.show", "Show")}
          </Button>
        </div>
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto p-5",
            "max-lg:max-h-80",
            !showPassage && "hidden lg:block",
          )}
        >
          <AnnotatablePassage
            paragraphs={passageHolder.passage}
            enable={enableAnnotations}
            scopeKey={`p:${passageHolder.appsheet_key}`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {header}
      {wordBankPanel}
      {/* `lg:min-h-0 lg:flex-1`: at the side-by-side breakpoint the content pane
          is a flex column, so this takes the height left below anything above it
          — a header, a word bank, the preview's banner — and the two columns
          scroll within that rather than past the bottom bar. */}
      <div className="grid items-start gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:items-stretch lg:gap-8">
        {passageColumn}
        <div
          ref={questionsRef}
          data-runner-scroll
          className="runner-questions-column min-w-0 pb-8"
        >
          {children}
        </div>
      </div>
    </>
  );
}
