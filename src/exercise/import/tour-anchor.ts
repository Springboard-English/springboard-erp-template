// Where a guided-tour step points, and how it finds that element on screen.
//
// Design: knowledge/011-guided-tour.md, "Anchoring". Elements are marked with a
// `data-tour="<name>"` attribute, and every name lives in TOUR_ANCHORS below so
// the markup and the step list can never disagree about spelling.
//
// A step never targets the selector string directly. The template puts a nav
// item's `dataAttributes` on its tab in the desktop sidebar, the mobile bottom
// bar and the menu sheet, so a marked tab exists more than once in the DOM and
// only one copy is on screen. A plain `querySelector` returns whichever comes
// first — on a phone, the hidden sidebar copy — and the tour would draw its
// tooltip against a zero-size box. `tourTarget` instead picks the first copy
// that is actually on screen.
//
// A mark on a wrapper with no box of its own (`display: contents`) is first
// lifted to the button or link around it, so the spotlight covers the control.

import type { ExerciseTourAnchors } from "../index";

export const TOUR_ANCHORS = {
  // Teacher chrome. The nav ones are on the tabs; see the note above.
  navLibrary: "nav-library",
  navAiImport: "nav-ai-import",
  navChallenges: "nav-challenges",
  headerGuides: "header-guides",
  sidebarAccount: "sidebar-account",
  // Teacher screens. The dashboard mark is on the Challenges HEADING, not the
  // section: the section runs past the bottom of any screen, and the tour never
  // scrolls.
  dashboardChallenges: "teacher-dashboard-challenges",
  libraryAiImport: "teacher-library-ai-import",
  challengesActions: "teacher-challenges-actions",
  // The AI import, walked as a practice import on the bundled sample. The
  // runner's question list and Next are the student runner's own marks below.
  importSource: "import-source",
  importSteps: "import-steps",
  importChoose: "import-choose",
  importReadAs: "import-read-as",
  importDiscard: "import-discard",
  importAnswerKey: "import-answer-key",
  importSave: "import-save",
  // Student dashboard.
  studentJoin: "student-join",
  // Student runner screens. These marks sit in components the LIVE runner shares
  // with the practice paper (StudentShell, PaginationBar, QuestionNav,
  // HighlighterButton, NotesButton, CollectionContext, ReviewSubmit, WaitingRoom,
  // SubmissionConfirmation, AttemptResultView, RecordingBar), so they are present during a
  // real sitting too. That is harmless — an attribute, on a route where the tour
  // never starts — and it is what lets the practice paper draw the real screens.
  runnerWaiting: "runner-waiting",
  runnerTimer: "runner-timer",
  runnerPassage: "runner-passage",
  runnerQuestionList: "runner-question-list",
  runnerHighlight: "runner-highlight",
  runnerNotes: "runner-notes",
  runnerNext: "runner-next",
  runnerRecording: "runner-recording",
  runnerReviewSummary: "runner-review-summary",
  runnerSubmitted: "runner-submitted",
  runnerScore: "runner-score",
  // Only on the practice paper's own review bar (screens/student/tour-paper.tsx).
  paperSubmit: "paper-submit",
} as const;

export type TourAnchorName = (typeof TOUR_ANCHORS)[keyof typeof TOUR_ANCHORS];

/** The anchors the template's runner components carry, through `ExerciseTourAnchorsProvider`. */
export const EXERCISE_TOUR_ANCHORS: ExerciseTourAnchors = {
  passage: TOUR_ANCHORS.runnerPassage,
  highlight: TOUR_ANCHORS.runnerHighlight,
  recording: TOUR_ANCHORS.runnerRecording,
  questionList: TOUR_ANCHORS.runnerQuestionList,
  notes: TOUR_ANCHORS.runnerNotes,
  next: TOUR_ANCHORS.runnerNext,
};

const ANCHOR_NAMES: ReadonlySet<string> = new Set(Object.values(TOUR_ANCHORS));

/** Whether `name` is a declared anchor. For the step-list tests. */
export function isTourAnchorName(name: string): name is TourAnchorName {
  return ANCHOR_NAMES.has(name);
}

/** Spread onto the element a step points at. */
export function tourAnchorProps(name: TourAnchorName): { "data-tour": TourAnchorName } {
  return { "data-tour": name };
}

export function tourAnchorSelector(name: TourAnchorName): string {
  return `[data-tour="${name}"]`;
}

/** What a match is lifted to when the marked element is only a wrapper. */
export const TOUR_ANCHOR_LIFT_SELECTOR = "button, a, [role='button']";

type RectLike = { width: number; height: number };

interface AnchorCandidate<T> {
  getBoundingClientRect(): RectLike;
  closest(selector: string): (T & { getBoundingClientRect(): RectLike }) | null;
}

/** On screen, in the only sense the tour needs: it has a box to point at. */
export function isAnchorVisible(rect: RectLike): boolean {
  return rect.width > 0 && rect.height > 0;
}

type BoxLike = { top: number; left: number; bottom: number; right: number };

/**
 * Whether the whole box sits inside the viewport as it is scrolled right now.
 *
 * The tour never scrolls, so this is the test for "can this step point at it".
 * A box that is not fully in view gets a centred step instead. `tolerance`
 * absorbs sub-pixel edges, so a nav bar flush with the bottom still counts.
 */
export function isRectInViewport(
  rect: BoxLike,
  viewport: { width: number; height: number },
  tolerance = 1,
): boolean {
  return (
    rect.top >= -tolerance &&
    rect.left >= -tolerance &&
    rect.bottom <= viewport.height + tolerance &&
    rect.right <= viewport.width + tolerance
  );
}

/**
 * The element a step should point at, out of every match for its anchor, or
 * null when none is on screen.
 *
 * Candidates are taken in DOM order. Each is lifted to its enclosing control
 * first, so a wrapped icon resolves to its tab; a candidate with no enclosing
 * control stands for itself. The first result with a real box wins, which is
 * what skips the hidden copy of a nav icon.
 *
 * Pure over anything with a rect and `closest`, so it is tested without a DOM.
 */
export function pickAnchor<T extends AnchorCandidate<T>>(
  candidates: Iterable<T>,
): T | null {
  for (const candidate of candidates) {
    const lifted = candidate.closest(TOUR_ANCHOR_LIFT_SELECTOR);
    if (lifted && isAnchorVisible(lifted.getBoundingClientRect())) return lifted;
    if (isAnchorVisible(candidate.getBoundingClientRect())) return candidate;
  }
  return null;
}

/**
 * A Joyride `target` for the anchor: a function, so it is re-evaluated on each
 * of Joyride's polls while a screen is still loading, never a selector string.
 */
export function tourTarget(name: TourAnchorName): () => HTMLElement | null {
  return () => {
    if (typeof document === "undefined") return null;
    const matches = document.querySelectorAll<HTMLElement>(tourAnchorSelector(name));
    return pickAnchor<HTMLElement>(matches);
  };
}
