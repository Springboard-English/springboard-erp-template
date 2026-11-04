import { createContext, useContext, type ReactNode } from "react";

/** The runner elements a guided tour can point at. */
export type ExerciseAnchorSlot =
  | "passage"
  | "highlight"
  | "recording"
  | "questionList"
  | "notes"
  | "next";

/** An app's `data-tour` name for each slot it tours; a slot left out is not marked. */
export type ExerciseTourAnchors = Partial<Record<ExerciseAnchorSlot, string>>;

// A context, not props: the marked elements sit several components below the page that knows the names.
const ExerciseTourAnchorsContext = createContext<ExerciseTourAnchors>({});

/** Marks the runner's elements with the app's guided-tour anchor names. */
export function ExerciseTourAnchorsProvider({
  anchors,
  children,
}: {
  anchors: ExerciseTourAnchors;
  children: ReactNode;
}) {
  return <ExerciseTourAnchorsContext.Provider value={anchors}>{children}</ExerciseTourAnchorsContext.Provider>;
}

/** The `data-tour` attribute to spread onto a slot's element; empty when the app tours none. */
export function useExerciseTourAnchor(slot: ExerciseAnchorSlot): { "data-tour"?: string } {
  const name = useContext(ExerciseTourAnchorsContext)[slot];
  return name ? { "data-tour": name } : {};
}
