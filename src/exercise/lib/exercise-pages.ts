import type { CollectionStub } from "../types";
import type { ExerciseNode } from "./exercises";
import { GAP_TOKEN_SOURCE } from "./gap-token";

// How the student-facing activity is broken into screens, and how each screen
// draws. Pure, and shared by the live runner and the teacher preview, so the
// teacher previews exactly the pages the student gets. `ExercisePage`
// (components/exercise/exercise-page.tsx) renders what these describe.

/** One task of a paired-matching page: its section and the nodes it holds. */
export type PageTask = { stub: CollectionStub; nodeIndices: number[] };

/**
 * One page: the collection it belongs to, and which nodes it holds.
 *
 * `tasks` is set only on a paired-matching page (see `pairMatchingTasks`):
 * `stub` is then the first task's section and `nodeIndices` every task's.
 */
export type RunPage = {
  stub: CollectionStub | null;
  nodeIndices: number[];
  tasks?: PageTask[];
};

export interface BuildPagesOptions {
  /**
   * Put a listening part's two matching tasks over the same speakers on one
   * page. On by default; an editor that attaches settings to `page.stub`
   * turns it off so each task keeps its own page.
   */
  pairMatching?: boolean;
}

/**
 * Group nodes into pages. `nodeIndices` point into `nodes`.
 *
 * A section — a run of questions sharing one passage — is ONE page: passage on
 * the left, its questions stacked on the right, so answering doesn't mean
 * scrolling back to the passage per question. Everything else is one question
 * per page.
 *
 * Section questions are contiguous in paper order (the invariant `reorder.ts`
 * protects), so a page extends while the section key matches the one it opened
 * with. A section split by a reorder would page as two, which is why that
 * invariant is enforced rather than assumed.
 */
export function buildPages(
  nodes: ExerciseNode[],
  collectionByNode: Map<string, CollectionStub | null>,
  { pairMatching = true }: BuildPagesOptions = {},
): RunPage[] {
  const pages = sectionPages(nodes, collectionByNode);
  return pairMatching ? pairMatchingTasks(pages, nodes) : pages;
}

/** One page per section run, one per other question: the grouping rule above. */
function sectionPages(
  nodes: ExerciseNode[],
  collectionByNode: Map<string, CollectionStub | null>,
): RunPage[] {
  const pages: RunPage[] = [];
  nodes.forEach((node, index) => {
    const stub = collectionByNode.get(node.id) ?? null;
    // Only a section groups; a standalone question (no collection, or one that
    // sits directly under a part) is its own page.
    const sectionKey = stub?.kind === "section" ? stub.appsheet_key : null;
    const last = pages[pages.length - 1];
    const lastKey =
      last && last.stub?.kind === "section" ? last.stub.appsheet_key : null;
    if (sectionKey && sectionKey === lastKey) {
      last.nodeIndices.push(index);
    } else {
      pages.push({ stub, nodeIndices: [index] });
    }
  });
  return pages;
}

// A two-task listening matching ("TASK ONE: why each speaker goes to the gym,
// TASK TWO: what each thinks about fitness", one hearing for both) imports as
// two multiple-matching sections under one part, each with its own A-H pool.
// Paged one section per screen, the student would flip between tasks while the
// recording plays, so consecutive sections like that share one page instead.
//
// The test is deliberately narrow: same part, both multiple matching, and the
// same items in the same order (Speaker 1-5 twice). Two matching sections that
// match different things — a reading part's "which section A-E" after a
// "which writer" — stay on their own pages.
/** Merges consecutive pairable matching pages into one page with `tasks`. */
function pairMatchingTasks(pages: RunPage[], nodes: ExerciseNode[]): RunPage[] {
  const out: RunPage[] = [];
  for (const page of pages) {
    const last = out[out.length - 1];
    if (last && pairable(last, page, nodes)) {
      const tasks = last.tasks ?? [taskOf(last)];
      out[out.length - 1] = {
        stub: last.stub,
        nodeIndices: [...last.nodeIndices, ...page.nodeIndices],
        tasks: [...tasks, taskOf(page)],
      };
    } else {
      out.push(page);
    }
  }
  return out;
}

/** A single-section page as one task. */
function taskOf(page: RunPage): PageTask {
  return { stub: page.stub as CollectionStub, nodeIndices: page.nodeIndices };
}

/** A multiple-matching page's normalised item prompts, or null for any other page. */
function matchingPrompts(page: RunPage, nodes: ExerciseNode[]): string[] | null {
  const stub = page.stub;
  if (stub?.kind !== "section" || stub.info?.layout !== "multiple-matching") return null;
  const prompts: string[] = [];
  for (const index of page.nodeIndices) {
    const node = nodes[index];
    if (node?.type !== "mcq") return null;
    prompts.push(node.content.prompt.trim().toLowerCase());
  }
  return prompts;
}

/** Whether `page` joins `last`: same part, both matching, the same items in order. */
function pairable(last: RunPage, page: RunPage, nodes: ExerciseNode[]): boolean {
  // A merged page compares against its first task; every task has its items.
  const head = last.tasks ? { stub: last.tasks[0].stub, nodeIndices: last.tasks[0].nodeIndices } : last;
  const parentKey = head.stub?.parent?.appsheet_key;
  if (!parentKey || page.stub?.parent?.appsheet_key !== parentKey) return false;
  const a = matchingPrompts(head, nodes);
  const b = matchingPrompts(page, nodes);
  return Boolean(a && b && a.length > 0 && a.length === b.length && a.every((p, i) => p === b[i]));
}

// A cloze is a HOLE IN A PRINTED TEXT, so only `gap-filling` qualifies — the
// same test the API's extraction prompt uses to choose the type.
//
// `short-answer` and `rewriting` are not: both are questions that stand on
// their own — a short answer has no blank anywhere ("What does the writer say
// about X?"), and a rewriting item is a whole sentence to redo. Woven into
// ClozeSection they would lose their card and, with no section passage to
// anchor into (a SAQ run is judged against the PART's reading passage), print
// the entire run as one paragraph of stems with inputs between them. They page
// as `questions`: one framed question each.
const GAP_FAMILY = new Set<ExerciseNode["type"]>(["gap-filling"]);

export interface PageLayout {
  /**
   * - `cloze` — a `gap-filling` section WITH ITS OWN PASSAGE, as one inline
   *   cloze paragraph anchored by each question's before/after.
   * - `gapped-text` — removed paragraphs dragged back into their gaps from a
   *   depleting lettered pool.
   * - `jumbled-paragraph` — the same interaction, with ordered slots instead
   *   of gaps in a passage.
   * - `multi-select` — "choose TWO/THREE": N questions merged into one
   *   checkbox group, one mark per correct answer.
   * - `multiple-matching` — the legend once plus a row of A-J buttons per item;
   *   labels may repeat, nothing depletes.
   * - `paired-matching` — two or more matching tasks over the same items,
   *   one column each (the page's `tasks`).
   * - `error-hunt` — the whole passage with a numbered correction row per
   *   mistake.
   * - `questions` — the plain stack.
   */
  kind:
    | "cloze"
    | "gapped-text"
    | "jumbled-paragraph"
    | "multi-select"
    | "multiple-matching"
    | "paired-matching"
    | "error-hunt"
    | "questions";
  /** A passage panel will render, so the shell should go wide. */
  hasPassage: boolean;
}

/** How a page draws, and whether it needs the wide two-column shell. */
export function pageLayout(page: RunPage, nodes: ExerciseNode[]): PageLayout {
  const stub = page.stub;
  const pageNodes = page.nodeIndices.map((i) => nodes[i]).filter(Boolean);
  const isSection = stub?.kind === "section";

  const allChoice = pageNodes.length > 0 && pageNodes.every((n) => n.type === "mcq");

  // A CLOZE IS A PASSAGE WITH HOLES IN IT, so it needs a passage. That is the
  // discriminator, not the question type: a run of independent gap-fill
  // sentences ("Complete each sentence with the correct form") is a section of
  // `gap-filling` with no shared text, and routing it to `ClozeSection` would
  // hit that component's no-passage fallback — which reconstructs each sentence
  // from its before/after and renders the whole run inside ONE <div> as inline
  // spans, so ten separate sentences would print as a single run-on paragraph.
  //
  // `layout: "cloze"` says so explicitly where the paper does have one shared
  // text, so the intent is declared rather than inferred — and correctable in
  // the review, like every other section task. The passage check stays as the
  // safety net: a section CLAIMING to be a cloze with nothing to weave into
  // still falls back to a readable stack rather than a paragraph of fragments.
  const sectionPassage = isSection ? stub.passage : null;
  const hasOwnPassage = Boolean(sectionPassage?.length);
  // A guided cloze is a run of mcq INSIDE one passage — each blank prints its
  // own options. It draws as a cloze (the blanks are selects) rather than as a
  // stack of MCQ cards, which would separate every blank from the passage it
  // has to be read in.
  //
  // The layout is not the only way to know. An import from before the layout
  // existed, or one whose layout the API dropped, leaves an all-mcq section with
  // none — which would fall back to cards with empty prompts beside a passage
  // of identical blanks, nothing saying which blank a card is about. A passage
  // holding exactly one `{gap}` per question is a guided cloze by construction,
  // so that counts too. Only with NO layout: every other mcq layout names its
  // own presentation (a gapped text carries `{gap}` tokens as well).
  const sectionLayout = isSection ? stub.info?.layout : undefined;
  const gapCount =
    (sectionPassage ?? []).join("\n").match(new RegExp(GAP_TOKEN_SOURCE, "g"))?.length ?? 0;
  const isGuidedCloze =
    isSection &&
    allChoice &&
    hasOwnPassage &&
    (sectionLayout === "guided-cloze" ||
      (!sectionLayout && gapCount === pageNodes.length));
  const isCloze =
    isGuidedCloze ||
    (isSection &&
      hasOwnPassage &&
      pageNodes.length > 0 &&
      pageNodes.every((n) => GAP_FAMILY.has(n.type)));
  const isGappedText = isSection && stub.info?.layout === "gapped-text" && allChoice;
  const isJumbled =
    isSection && stub.info?.layout === "jumbled-paragraph" && allChoice;
  const isMatching =
    isSection && stub.info?.layout === "multiple-matching" && allChoice;
  // Only `buildPages` sets `tasks`, and only on matching sections.
  const isPaired = isMatching && (page.tasks?.length ?? 0) > 1;
  const isMultiSelect =
    isSection && stub.info?.layout === "multi-select" && allChoice;
  // Needs the passage: without one there is nothing to hunt in, and the
  // per-question cards are the only thing that can be drawn.
  const isErrorHunt =
    isSection &&
    Boolean(stub.passage?.length) &&
    pageNodes.length > 0 &&
    pageNodes.every((n) => n.type === "error-correction");

  // The reading passage the section hangs off (on the part). For a cloze section
  // this stays in the side-by-side column while the cloze owns the section
  // summary; for other pages it's the usual passage, on the section or its part.
  const partPassage = isSection
    ? stub.parent?.passage
    : stub?.kind === "part"
      ? stub.passage
      : null;
  const hasPassage = isCloze
    ? Boolean(partPassage?.length)
    : Boolean(stub && (stub.passage?.length || stub.parent?.passage?.length));

  return {
    kind: isGappedText
      ? "gapped-text"
      : isJumbled
        ? "jumbled-paragraph"
        : isMultiSelect
          ? "multi-select"
          : isPaired
            ? "paired-matching"
          : isMatching
            ? "multiple-matching"
          : isErrorHunt
        ? "error-hunt"
        : isCloze
          ? "cloze"
          : "questions",
    // An error hunt owns its passage (it renders it itself, clickable), so the
    // shell must not ALSO put it in a side column; only the part's can go there.
    // The drag layouts draw their own two columns (text, then the pool), so
    // no passage column sits beside them. A gapped text's text is a shared
    // passage in the same card as a reading passage, so it gets the same wide
    // shell; jumbled pieces have no passage and stay narrow.
    hasPassage: isGappedText
      ? hasOwnPassage
      : isJumbled
        ? false
        : isErrorHunt
        ? Boolean(stub.parent?.passage?.length)
        : hasPassage,
  };
}
