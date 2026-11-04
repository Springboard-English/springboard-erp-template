// The `/exercise` entry: the exercise model, the paper shapes and the pure
// helpers the paper renderer is built on, shared by the apps that run papers
// (Leap, app.springboard.vn). Opt-in: nothing in the root entry imports it, so
// an app that never runs a paper never bundles it or needs `zod`.

export * from "./types";
export * from "./i18n";
export * from "./messages";

export * from "./lib/attempt-answer";
export * from "./lib/collection-info";
export * from "./lib/error-correction";
export * from "./lib/error-hunt";
export * from "./lib/exam-field";
export * from "./lib/exercise-pages";
export * from "./lib/exercises";
export * from "./lib/gap-token";
export * from "./lib/matching-legend";
export * from "./lib/media-file";
export * from "./lib/media-window";
export * from "./lib/option-images";
export * from "./lib/option-letters";
export * from "./lib/passage";
export * from "./lib/passage-markup";
export * from "./lib/prompt-scale";
export * from "./lib/question-summary";
export * from "./lib/recording-deck";
export * from "./lib/section-type";
export * from "./lib/api-error";
export * from "./lib/grading";
export * from "./lib/keyboard";
export * from "./lib/media-playback";
export * from "./lib/tour-anchors";
export * from "./lib/use-dismiss-outside";
export * from "./lib/use-scroll-pane";

// The renderers. Their colours are the Leap theme's tokens, so an app using them carries that theme.
export * from "./components/annotatable-passage";
export * from "./components/answer-value";
export * from "./components/category-pill";
export * from "./components/clickable-sentence";
export * from "./components/cloze-section";
export * from "./components/collection-context";
export * from "./components/error-correction";
export * from "./components/error-hunt-section";
export * from "./components/essay-response";
export * from "./components/exercise-page";
export * from "./components/exercise-renderer";
export * from "./components/explanation";
export * from "./components/frame";
export * from "./components/gapped-text-section";
export * from "./components/highlighter";
export * from "./components/inline-blank";
export * from "./components/jumbled-paragraphs";
export * from "./components/matching-buttons";
export * from "./components/mcq-choice-group";
export * from "./components/multi-select-section";
export * from "./components/option-image";
export * from "./components/page-recordings";
export * from "./components/paragraph-drop";
export * from "./components/passage-text";
export * from "./components/recording-deck";
export * from "./components/root-pick";
export * from "./components/short-answer";
export * from "./components/split-view";
export * from "./components/true-false";

// The runner chrome around a paper.
export * from "./runner/answer-receipt";
export * from "./runner/exit-confirm-dialog";
export * from "./runner/notes-button";
export * from "./runner/pagination-bar";
export * from "./runner/question-nav";
export * from "./runner/review-checklist";
export * from "./runner/score-summary";
export * from "./runner/section-nav";
export * from "./runner/submit-confirm-dialog";
