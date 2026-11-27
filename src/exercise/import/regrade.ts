import { ApiErrorWithPayload } from "../live/api";
import type { RegradeConflict, RegradeDue } from "./api";
import { formatDueDate } from "../index";
import type { Translate } from "./i18n";

// The pure half of regrading a run after an answer key or marks change.
//
// An answer is marked once, when it is sent. Saving a changed key or mark over
// answers already auto-marked is refused with a 409 that lists the runs it
// would leave out of date; the teacher picks which to regrade and the save is
// sent again with `force`. A run can also be regraded on its own from its
// results. The API does the marking in a background task.

/** The 409 an answer key or marks save is refused with, or null for any other error. */
export function regradeConflictOf(error: unknown): RegradeConflict | null {
  if (!(error instanceof ApiErrorWithPayload) || error.status !== 409) return null;
  const payload = error.payload as Partial<RegradeConflict> | null | undefined;
  return Array.isArray(payload?.sessions) ? (payload as RegradeConflict) : null;
}

/** Thrown when the teacher cancels the regrade dialog: the edit stays unsaved. */
export class RegradeCancelled extends Error {
  constructor() {
    super("Regrade cancelled");
    this.name = "RegradeCancelled";
  }
}

/** Whether a save failed because the teacher cancelled, which needs no error message. */
export function isRegradeCancelled(error: unknown): boolean {
  return error instanceof RegradeCancelled;
}

/** The out-of-date questions as 1-based numbers in screen order, each once. */
export function dueQuestionNumbers(due: RegradeDue[] | undefined): number[] {
  return [...new Set((due ?? []).map((item) => item.order + 1))].sort((a, b) => a - b);
}

/** "4", "4 and 12", "4, 7 and 12": question numbers as a sentence lists them. */
export function joinNumbers(numbers: number[], t: Translate): string {
  if (numbers.length <= 1) return numbers.join("");
  return t("exercise.import.regrade.andList", "{list} and {last}", {
    list: numbers.slice(0, -1).join(", "),
    last: numbers[numbers.length - 1],
  });
}

/** The out-of-date notice for a run's results, or null when nothing is out of date. */
export function regradeDueNotice(due: RegradeDue[] | undefined, t: Translate): string | null {
  const numbers = dueQuestionNumbers(due);
  if (numbers.length === 0) return null;
  const vars = { questions: joinNumbers(numbers, t) };
  return numbers.length === 1
    ? t(
        "exercise.import.regrade.dueOne",
        "The answer key or marks for question {questions} changed after these answers were marked. Grades may change if you regrade.",
        vars,
      )
    : t(
        "exercise.import.regrade.dueMany",
        "The answer key or marks for questions {questions} changed after these answers were marked. Grades may change if you regrade.",
        vars,
      );
}

/** "Regraded by Hải An on 8 Nov 2026, 18:40, 37 answers changed", from a run's last regrade. */
export function lastRegradeLine(
  last: { requested_by_name: string | null; completed_at: string; answers_changed: number } | null | undefined,
  t: Translate,
): string | null {
  if (!last) return null;
  const vars = {
    name: last.requested_by_name ?? t("exercise.import.regrade.someone", "a teacher"),
    when: formatDueDate(last.completed_at) ?? "",
    n: last.answers_changed,
  };
  return last.answers_changed === 1
    ? t("exercise.import.regrade.lastOne", "Regraded by {name} on {when}, 1 answer changed", vars)
    : t("exercise.import.regrade.lastMany", "Regraded by {name} on {when}, {n} answers changed", vars);
}

/** The dialog's opening line: how many marked answers in how many runs a save reaches. */
export function conflictSummary(conflict: RegradeConflict, t: Translate): string {
  const vars = {
    answers: conflict.sessions.reduce((sum, session) => sum + session.answers, 0),
    sessions: conflict.sessions.length,
  };
  if (conflict.sessions.length !== 1)
    return t("exercise.import.regrade.summaryMany", "This change affects {answers} marked answers in {sessions} sessions.", vars);
  return vars.answers === 1
    ? t("exercise.import.regrade.summaryOneAnswer", "This change affects 1 marked answer in 1 session.")
    : t("exercise.import.regrade.summaryOne", "This change affects {answers} marked answers in 1 session.", vars);
}

/** A run's line in the dialog: how many of its answers are marked. */
export function sessionAnswersLabel(answers: number, t: Translate): string {
  return answers === 1
    ? t("exercise.import.regrade.sessionAnswer", "1 marked answer")
    : t("exercise.import.regrade.sessionAnswers", "{n} marked answers", { n: answers });
}
