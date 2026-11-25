// The live paper as parts: which to open, which to preload, and the questions
// the runner has, from the parts map (GET …/parts) and the parts opened so far.

import { isTimedPart, type RunPart, type SessionExercise } from "./api";

/**
 * Whether a part may be opened without the student asking: untimed parts, and
 * timed ones already opened (a reload). Opening a timed part starts its clock,
 * so a fresh one waits for the student at its gate.
 */
export function opensItself(part: RunPart): boolean {
  return !isTimedPart(part) || Boolean(part.opened_at);
}

/**
 * The parts to have open: every part up to the one the student is on, plus the
 * next (preloaded), each only if it opens itself or the student opened it.
 * `current` is the index of the part on screen.
 */
export function partsToOpen(parts: RunPart[], current: number, askedFor: ReadonlySet<string>): string[] {
  return parts
    .slice(0, Math.max(0, current) + 2)
    .filter((part) => opensItself(part) || askedFor.has(part.part_key))
    .map((part) => part.part_key);
}

/** What the runner shows: the opened parts' questions, and the timed part waiting at its gate. */
export interface PaperState {
  /** Questions of the opened parts up to the first part that isn't open, in paper order. */
  exercises: SessionExercise[];
  /** The timed part after them that waits for the student, if that is what stops the paper. */
  gate: RunPart | null;
  /** Whether a part after the loaded ones is still loading (not a gate). */
  more: boolean;
}

/**
 * The paper so far. It stops at the first part not yet open, so the questions
 * stay in order: a preloaded part after a closed timed part waits behind its gate.
 */
export function paperState(parts: RunPart[], opened: ReadonlyMap<string, SessionExercise[]>): PaperState {
  const exercises: SessionExercise[] = [];
  for (const part of parts) {
    const questions = opened.get(part.part_key);
    if (!questions) {
      return { exercises, gate: opensItself(part) ? null : part, more: opensItself(part) };
    }
    exercises.push(...[...questions].sort((a, b) => a.order - b.order));
  }
  return { exercises, gate: null, more: false };
}

/** The index of the part a question sits in, from the map; -1 when it is in none. */
export function partIndexOf(parts: RunPart[], testExerciseKey: string | undefined): number {
  if (!testExerciseKey) return -1;
  return parts.findIndex((part) => part.questions.some((q) => q.exercise_key === testExerciseKey));
}
