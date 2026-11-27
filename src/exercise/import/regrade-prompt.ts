import { createContext, useContext } from "react";

import type { RegradeConflict } from "./api";

/** Ask which runs to regrade: the chosen keys ([] saves only), or null to cancel. */
export type RegradePrompt = (conflict: RegradeConflict) => Promise<string[] | null>;

/** Filled by `RegradePromptProvider` (components/teacher/regrade-dialog.tsx). */
export const RegradePromptContext = createContext<RegradePrompt | null>(null);

const cancel: RegradePrompt = async () => null;

/** The prompt the answer key and marks save mutations call; with no provider it cancels. */
export function useRegradePrompt(): RegradePrompt {
  return useContext(RegradePromptContext) ?? cancel;
}
