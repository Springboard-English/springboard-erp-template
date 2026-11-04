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
