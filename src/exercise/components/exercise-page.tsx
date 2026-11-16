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
import { TopicPoolProvider } from "./topic-pool";
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
import { EditableText, PoolEditProvider, useExerciseEditor } from "./exercise-edit";
import { answerFromKey, keyFromAnswer } from "../lib/answer-key-bridge";
import { joinPassage, typedParagraphs } from "../lib/passage";

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
 * The section's passage title and its own text, at the top of the questions
 * column, where the layout leaves them nowhere else. The instruction lives in
 * the runner heading's drop-down (the top bar shows its first line).
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
  const { t } = useI18n();
  const editor = useExerciseEditor();
  const section = stub?.kind === "section" ? stub : null;
  const title = ownsText ? (section?.passage_title?.trim() ?? "") : "";
  const paragraphs = showPassage ? (section?.passage ?? []) : [];
  // The section's instruction is not repeated here: it is read (and, in the
  // editor, edited) in the runner heading's drop-down, which shows its first line.
  if (!title && paragraphs.length === 0) return null;
  // In the editor the text is typed into where the student reads it.
  const editText =
    editor && section
      ? (value: string) => editor.onPassageChange(section.appsheet_key, typedParagraphs(value))
      : null;
  return (
    <div className="mb-5 space-y-3">
      {title || paragraphs.length ? (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          {title ? (
            <p className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2.5 text-sm font-bold text-foreground">
              <BookOpen className="size-4 shrink-0" />
              {title}
            </p>
          ) : null}
          {paragraphs.length && editText ? (
            <p className="whitespace-pre-wrap p-5 text-[14.5px] leading-7 text-muted-foreground">
              <EditableText
                value={joinPassage(paragraphs)}
                multiline
                label={t("exercise.edit.passageText", "Passage text")}
                onChange={editText}
              />
            </p>
          ) : paragraphs.length ? (
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
function PageBody(props: ExercisePageProps) {
  const editor = useExerciseEditor();
  return editor ? <EditPageBody {...props} /> : <AnswerPageBody {...props} />;
}

/**
 * The page in edit mode: the student's own page, answered with each
 * question's key. Answering sets the key and question text edits in place in
 * the renderers, the section's own text included: it is typed into where the
 * student reads it, between the gaps, blanks and marked mistakes.
 */
function EditPageBody(props: ExercisePageProps) {
  const editor = useExerciseEditor();
  const { page, nodes } = props;
  const pageNodes = page.nodeIndices.map((i) => nodes[i]).filter(Boolean);
  const layout = pageLayout(page, nodes);
  const section = page.stub?.kind === "section" ? page.stub : null;
  const huntText = layout.kind === "error-hunt" ? joinPassage(section?.passage ?? []) : null;
  const pooled = layout.kind === "multi-select";
  if (!editor) return null;

  // "Choose several" hands every question the group's whole selection.
  const keyed = pageNodes.map((node) => answerFromKey(node));
  const answers: Record<string, ExerciseAnswer> = {};
  pageNodes.forEach((node, k) => {
    answers[node.id] = pooled ? keyed.filter((id): id is string => typeof id === "string") : keyed[k];
  });
  const onChange = (nodeId: string, value: ExerciseAnswer) => {
    editor.onSelect(nodeId);
    if (pooled) {
      const picked = Array.isArray(value) ? value : [];
      pageNodes.forEach((node, k) => editor.onNodeChange(node.id, keyFromAnswer(node, picked[k] ?? "")));
      return;
    }
    const node = pageNodes.find((candidate) => candidate.id === nodeId);
    if (node) editor.onNodeChange(nodeId, keyFromAnswer(node, value, huntText));
  };

  // Sections whose questions all draw from one lettered list.
  const pooledLayout =
    layout.kind === "gapped-text" ||
    layout.kind === "multiple-matching" ||
    layout.kind === "jumbled-paragraph" ||
    layout.kind === "multi-select";

  return (
    // A pooled section's option list is edited where the student's task prints
    // it, and its "Add option" sits at the end of that list.
    <PoolEditProvider nodes={pooledLayout ? pageNodes : []}>
      <AnswerPageBody {...props} answers={answers} onChange={onChange} enableAnnotations={false} />
    </PoolEditProvider>
  );
}

function AnswerPageBody({ page, nodes, answers, onChange, enableAnnotations }: ExercisePageProps) {
  const { t } = useI18n();
  const editor = useExerciseEditor();
  const pageNodes = page.nodeIndices.map((i) => nodes[i]).filter(Boolean);
  const numbers = page.nodeIndices.map((i) => i + 1);
  const layout = pageLayout(page, nodes);
  // In the editor, the section's key: its own text is typed into in place.
  const editKey = editor && page.stub?.kind === "section" ? page.stub.appsheet_key : undefined;
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
              editKey={editKey}
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
              editKey={editKey}
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
      // `hidePassage`: the task is the passage with its gaps beside the pool,
      // and takes the page's whole width; a reading passage beside it would
      // squeeze it out of dragging.
      <CollectionContext stub={page.stub} hideHeader hidePassage enableAnnotations={enableAnnotations}>
        {scoped(
          <>
            <SectionLead stub={page.stub} ownsText />
            <GappedTextSection
              onTextChange={
                editor && editKey ? (text) => editor.onPassageChange(editKey, typedParagraphs(text)) : undefined
              }
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
      // The pieces and their pool take the page's whole width, as a gapped text's do.
      <CollectionContext stub={page.stub} hideHeader hidePassage enableAnnotations={enableAnnotations}>
        {/* A jumbled section's OWN text — an opening paragraph the paper keeps
            in place as the example — shows here: the component draws only
            the pieces. */}
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

  // A speaking topic pool's question shows its topic (or, editing, the pool's list).
  const poolKey = page.stub?.kind === "section" && page.stub.info?.layout === "topic-pool" ? page.stub.appsheet_key : null;
  return (
    <CollectionContext stub={page.stub} hideHeader enableAnnotations={enableAnnotations}>
      {scoped(
        <TopicPoolProvider sectionKey={poolKey}>
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
        </TopicPoolProvider>,
      )}
    </CollectionContext>
  );
}
