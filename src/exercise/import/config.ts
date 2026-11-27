// Where the AI import sends people, and the page shell it renders in, set once
// by the app at boot with `configureImport`, as `configureLiveRunner` does for
// the runner. The routes are the app's own; the import only builds them.

/** What a save makes: whole tests, or loose questions for the library. */
export type ImportMode = "tests" | "exercises";
export const IMPORT_MODE_PARAM = "mode";

/** The practice import a guided tour walks, by the view it opens on. */
export const TOUR_IMPORT_PARAM = "tour";
export const TOUR_IMPORT_VIEWS = ["source", "choose", "review", "save"] as const;
export type TourImportView = (typeof TOUR_IMPORT_VIEWS)[number];

/** The app's routes and save target, read by the import screens. */
export interface ImportOptions {
  /** The authoring home: where "back" from the import goes. */
  homeRoute: string;
  /** The question library. */
  exercisesRoute: string;
  /** A new question in the library. */
  exerciseNewRoute: string;
  /** The parts (passages) library. */
  partsRoute: string;
  /** One test's page. */
  testRoute: (testKey: string) => string;
  /** `academics.test.app` a saved test is made for: `leap`, or `practice` for app.springboard.vn. */
  testApp: "leap" | "practice";
  /** Whether the screen offers "Add questions to the library" at all; the app saves tests only. */
  libraryMode: boolean;
}

const options: ImportOptions = {
  homeRoute: "/teacher",
  exercisesRoute: "/teacher/exercises",
  exerciseNewRoute: "/teacher/exercises/new",
  partsRoute: "/teacher/parts",
  testRoute: (key) => `/teacher/tests/${encodeURIComponent(key)}`,
  testApp: "leap",
  libraryMode: true,
};

/** Set the import's routes and save target before it renders. */
export function configureImport(next: Partial<ImportOptions>): void {
  Object.assign(options, next);
}

/** The import's current settings. */
export function importOptions(): Readonly<ImportOptions> {
  return options;
}


/** The mode a URL asks for; absent or unknown reads as `"tests"`, and so does any mode the app turned off. */
export function importModeFromParams(params: URLSearchParams): ImportMode {
  return options.libraryMode && params.get(IMPORT_MODE_PARAM) === "exercises" ? "exercises" : "tests";
}

/** The tour view a URL asks for, or null. */
export function tourImportViewFromParams(params: URLSearchParams): TourImportView | null {
  const view = params.get(TOUR_IMPORT_PARAM);
  return (TOUR_IMPORT_VIEWS as readonly string[]).includes(view ?? "") ? (view as TourImportView) : null;
}

/** One test's page in the app. */
export function teacherTestRoute(testKey: string): string {
  return options.testRoute(testKey);
}
