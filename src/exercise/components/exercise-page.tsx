import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { rootBank } from "../lib/collection-info";
import { pageLayout, type RunPage } from "../lib/exercise-pages";
import type { ExerciseAnswer, ExerciseNode } from "../lib/exercises";
import { showMatchingLegend } from "../lib/matching-legend";
import type { CollectionStub } from "../types";
import { CollectionContext } from "./collection-context";
import { PassageText } from "./passage-text";
import { ClozeSection, type ClozeNode } from "./cloze-section";
import {
  GappedTextSection,
  type GappedChoiceNode,
} from "./gapped-text-section";
import {
  ErrorHuntSection,
  type ErrorHuntNode,
} from "./error-hunt-section";
import {
  JumbledParagraphs,
  type JumbledNode,
} from "./jumbled-paragraphs";
import {
  MatchingButtons,
  type MatchingNode,
} from "./matching-buttons";
import {
  MultiSelectSection,
  type MultiSelectNode,
} from "./multi-select-section";
import { ExerciseRenderer } from "./exercise-renderer";
import { PageRecordings } from "./page-recordings";
import { HighlightScope } from "./highlighter";

// ONE screen of the student-facing activity, and the single source of truth for
// what a student sees on it.
//
// The student runner and the teacher's preview both render through here, so a
// teacher signs off on exactly the activity the student gets; only the things
// that genuinely differ (where the answers go, the timer,
// the fullscreen lock, proctoring) stay on the screens themselves.
//
// The page shapes and the grouping rule are in `lib/exercise-pages.ts`, pure and
// tested; this is only their presentation.

/**
 * The section's own words, in full, at the top of the questions column.
 *
 * Both callers lift the heading into the top bar, which holds the instruction to
 * ONE truncated line — and a paper puts the rules a student is marked by there:
 * "NO MORE THAN TWO WORDS", "Write T, F or NG". This shows them in full.
 *
 * `ownsText` is for a layout that draws the section's passage itself (cloze,
 * gapped text, error hunt, jumbled): the side column then holds the PART's
 * passage, so the section's passage title would otherwise show nowhere. `showPassage` is
 * for the one of those whose component does not draw the passage at all.
 */
function SectionLead({
  stub,
  ownsText = false,
  showPassage = false,
}: {
  stub: CollectionStub | null;
  ownsText?: boolean;
  showPassage?: boolean;
}) {
  const section = stub?.kind === "section" ? stub : null;
  const instruction = section?.instruction?.trim() ?? "";
  const title = ownsText ? (section?.passage_title?.trim() ?? "") : "";
  const paragraphs = showPassage ? (section?.passage ?? []) : [];
  if (!instruction && !title && paragraphs.length === 0) return null;
  return (
    <div className="mb-5 space-y-3">
      {instruction ? (
        <p className="whitespace-pre-wrap text-sm font-bold leading-6 text-foreground">
          {instruction}
        </p>
      ) : null}
      {title || paragraphs.length ? (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          {title ? (
            <p className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5 text-sm font-bold text-foreground">
              <BookOpen className="size-4 shrink-0" />
              {title}
            </p>
          ) : null}
          {paragraphs.length ? (
            <div className="p-5">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="mt-3 whitespace-pre-wrap text-[14.5px] leading-7 text-muted-foreground first:mt-0"
                >
                  <PassageText text={paragraph} />
                </p>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

interface ExercisePageProps {
  page: RunPage;
  /** The whole test's nodes; the page indexes into them. */
  nodes: ExerciseNode[];
  answers: Record<string, ExerciseAnswer>;
  onChange: (nodeId: string, value: ExerciseAnswer) => void;
  /** Let the student highlight and take notes on the side-by-side passage. */
  enableAnnotations?: boolean;
}

/**
 * One page: the recordings over it (nothing where no deck is hosted, or none
 * covers the page), then its body. `shrink-0` so the status line keeps its
 * height above a side-by-side page's two scrollers.
 */
export function ExercisePage(props: ExercisePageProps) {
  const nodeIds = props.page.nodeIndices.map((i) => props.nodes[i]?.id).filter(Boolean);
  return (
    <>
      <PageRecordings nodeIds={nodeIds} className="mb-4 shrink-0" />
      <PageBody {...props} />
    </>
  );
}

/**
 * The page's body: its part/section context wrapping whichever of the three
 * presentations it needs.
 *
 * `hideHeader` because both callers lift the part/section heading into the top
 * bar (`RunnerHeading`); rendering it here too would duplicate it.
 */
function PageBody({ page, nodes, answers, onChange, enableAnnotations }: ExercisePageProps) {
  const { t } = useI18n();
  const pageNodes = page.nodeIndices.map((i) => nodes[i]).filter(Boolean);
  const numbers = page.nodeIndices.map((i) => i + 1);
  const layout = pageLayout(page, nodes);
  // The questions column is highlightable too — instructions, labels, prompts.
  // Its highlights are saved per page, named by the page's first question: React
  // reuses text nodes across pages of the same layout, so a range kept across
  // the turn would land on the next page's words.
  const scoped = (body: ReactNode) => (
    <HighlightScope enable={enableAnnotations} scopeKey={`q:${pageNodes[0]?.id ?? ""}`}>
      {body}
    </HighlightScope>
  );

  if (layout.kind === "cloze") {
    return (
      // Section summary is the cloze; the part reading passage (if any) stays in
      // the side-by-side column, untouched.
      <CollectionContext
        stub={page.stub}
        hideHeader
        preferPartPassage
        enableAnnotations={enableAnnotations}
      >
        {scoped(
          <>
            <SectionLead stub={page.stub} ownsText />
            <ClozeSection
              passage={page.stub?.passage ?? null}
              nodes={pageNodes as ClozeNode[]}
              numbers={numbers}
              answers={answers}
              onChange={onChange}
              rootBank={rootBank(page.stub?.info)}
            />
          </>,
        )}
      </CollectionContext>
    );
  }

  if (layout.kind === "error-hunt") {
    return (
      // `preferPartPassage`: the hunt draws the section's own passage itself
      // (that IS the exercise), so only a part-level reading passage belongs in
      // the side column.
      <CollectionContext
        stub={page.stub}
        hideHeader
        preferPartPassage
        enableAnnotations={enableAnnotations}
      >
        {scoped(
          <>
            <SectionLead stub={page.stub} ownsText />
            <ErrorHuntSection
              passage={page.stub?.passage ?? null}
              nodes={pageNodes as ErrorHuntNode[]}
              numbers={numbers}
              answers={answers}
              onChange={onChange}
            />
          </>,
        )}
      </CollectionContext>
    );
  }

  if (layout.kind === "gapped-text") {
    return (
      <CollectionContext
        stub={page.stub}
        hideHeader
        preferPartPassage
        enableAnnotations={enableAnnotations}
      >
        {scoped(
          <>
            <SectionLead stub={page.stub} ownsText />
            <GappedTextSection
              passage={page.stub?.passage ?? null}
              nodes={pageNodes as GappedChoiceNode[]}
              numbers={numbers}
              answers={answers}
              onChange={onChange}
            />
          </>,
        )}
      </CollectionContext>
    );
  }

  if (layout.kind === "multi-select") {
    return (
      <CollectionContext stub={page.stub} hideHeader enableAnnotations={enableAnnotations}>
        {scoped(
          <>
            <SectionLead stub={page.stub} />
            <MultiSelectSection
              nodes={pageNodes as MultiSelectNode[]}
              answers={answers}
              onChange={onChange}
            />
          </>,
        )}
      </CollectionContext>
    );
  }

  if (layout.kind === "multiple-matching") {
    return (
      <CollectionContext stub={page.stub} hideHeader enableAnnotations={enableAnnotations}>
        {scoped(
          <>
            <SectionLead stub={page.stub} />
            <MatchingButtons
              nodes={pageNodes as MatchingNode[]}
              numbers={numbers}
              answers={answers}
              onChange={onChange}
              // Dropped only when the passage IS the lettered list — the labels
              // are bare letters. Headings under a passage need it; see
              // matching-legend.
              showLegend={showMatchingLegend(
                (pageNodes[0] as MatchingNode | undefined)?.content.options ?? [],
                layout.hasPassage,
              )}
            />
          </>,
        )}
      </CollectionContext>
    );
  }

  if (layout.kind === "jumbled-paragraph") {
    return (
      <CollectionContext
        stub={page.stub}
        hideHeader
        preferPartPassage
        enableAnnotations={enableAnnotations}
      >
        {/* A jumbled section's OWN text — an opening paragraph the paper keeps
            in place as the example — shows here: the component draws
            only the pieces, and the side column holds the part's passage. */}
        {scoped(
          <>
            <SectionLead stub={page.stub} ownsText showPassage />
            <JumbledParagraphs
              nodes={pageNodes as JumbledNode[]}
              numbers={numbers}
              answers={answers}
              onChange={onChange}
            />
          </>,
        )}
      </CollectionContext>
    );
  }

  return (
    <CollectionContext stub={page.stub} hideHeader enableAnnotations={enableAnnotations}>
      {scoped(
        <>
          <SectionLead stub={page.stub} />
          <div className="space-y-6">
            {pageNodes.map((node, k) => (
              <div key={node.id}>
                {/* A section shows many questions at once, so each carries its
                    own number; a single-question page needs no label. */}
                {pageNodes.length > 1 ? (
                  <p className="mb-2 text-xs font-extrabold text-muted-foreground">
                    {t("exercise.renderer.questionNo", "Question {n}", { n: numbers[k] })}
                  </p>
                ) : null}
                <ExerciseRenderer
                  node={node}
                  mode="practice"
                  value={answers[node.id]}
                  onChange={(value) => onChange(node.id, value)}
                  rootBank={rootBank(page.stub?.info)}
                />
              </div>
            ))}
          </div>
        </>,
      )}
    </CollectionContext>
  );
}
