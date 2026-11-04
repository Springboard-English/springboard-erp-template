import type { ExerciseAnswer, SpringboardTest } from "./exercises";

/** A graded attempt as the score summary shows it. */
export type GradedResult = {
  /** Count of auto-gradable nodes answered correctly. */
  correct: number;
  /** Count of auto-gradable nodes in the test. */
  gradable: number;
  /** Earned points across auto-gradable nodes. */
  points: number;
  /** Max earnable points across auto-gradable nodes. */
  maxPoints: number;
  /** Percentage score (0–100) over earnable points. */
  percentage: number;
  /** nodeId -> was it correct (auto-gradable nodes only). */
  correctByNode: Record<string, boolean>;
  /** Answers a teacher has still to mark; while non-zero the score is over what has been marked. */
  pending: number;
};

/** The ids of the paper's questions with no answer, or an empty one, in paper order. */
export function unansweredNodeIds(test: SpringboardTest, answers: Record<string, ExerciseAnswer>): string[] {
  return test.nodes
    .filter((node) => {
      const answer = answers[node.id];
      if (answer === undefined || answer === null || answer === "") return true;
      if (typeof answer === "object") return Object.keys(answer).length === 0;
      return false;
    })
    .map((node) => node.id);
}

/** Marks as the shortest decimal: 1.0000 shows as 1, 2.5000 as 2.5, float noise rounded away. */
export function formatMarks(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0";
  return String(parseFloat(n.toFixed(4)));
}
