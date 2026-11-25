import type {
  SessionSkillAccuracy,
  SkillScore,
} from "./api";
import { valueLabel, type Translate } from "./i18n";
import { SKILL_LABELS, type SkillTag } from "../lib/exercises";
import { formatMarks, provisionalScore } from "./results";

// The per-skill bars, as rows to draw.
//
// NOTHING here groups or sums. The API folds `by_skill` on every read that
// carries it (a participant's result, a teacher's attempt view, the class
// results), using the same pricing helpers as the headline figures, so the rows
// add up to the number beside them by construction. Grouping again here from
// the per-question items would be a second implementation of "what is this
// question worth", and the two would disagree the first time a per-test mark
// override or an unmarked essay came through. These functions only turn the
// server's rows into a label, a figure and a percentage.
//
// Both accept `undefined` and answer `[]`: the SPA ships behind its own release
// gate and can meet an API that does not send `by_skill` yet, and a missing
// breakdown should draw nothing rather than crash the score screen.

export type SkillBarRow = {
  skill: SkillTag;
  label: string;
  /** The figure printed beside the bar: "8/10 points", "12/15 correct". */
  value: string;
  /** 0–100, or null when there is nothing yet to divide by. */
  percentage: number | null;
  /** Something in this skill is still with the teacher. */
  provisional: boolean;
  note?: string;
};

/** A skill's display name in the reader's language. */
export function skillLabel(skill: SkillTag, t: Translate): string {
  return valueLabel(t, SKILL_LABELS[skill] ?? skill);
}

/** "3 answers still to mark", or nothing when none are waiting. */
function pendingNote(pending: number, t: Translate): string | undefined {
  if (pending <= 0) return undefined;
  return pending === 1
    ? t("exercise.live.results.pendingAnswerOne", "1 answer still to mark")
    : t("exercise.live.results.pendingAnswerOther", "{n} answers still to mark", { n: pending });
}

/** A participant's score on one group of questions, as the API folds it. */
export interface GroupScore {
  points: number | string;
  max_points: number | string;
  marked_points: number | string;
  pending: number;
}

/** One score drawn as a figure and a percentage. */
export interface ScoreCell {
  /** "8/10 points". */
  value: string;
  /** The two figures behind `value`, trimmed ("8", "10"), for an export. */
  points: string;
  maxPoints: string;
  /** 0–100, or null when there is nothing yet to divide by. */
  percentage: number | null;
  /** Something here is still with the teacher. */
  provisional: boolean;
  note?: string;
}

/**
 * Points earned out of points available, under the same provisional rule as
 * the headline score (`provisionalScore`): while an answer in the group is
 * unmarked, the percentage is over what HAS been marked and the cell says so.
 * A group that is nothing but an unmarked essay reads "—" rather than 0%.
 */
export function scoreCell(row: GroupScore, t: Translate): ScoreCell {
  const points = Number(row.points);
  const maxPoints = Number(row.max_points);
  const markedPoints = Number(row.marked_points);
  const { percentage, provisional } = provisionalScore(points, maxPoints, row.pending, markedPoints);
  const denominator = provisional ? markedPoints : maxPoints;
  return {
    value: t("exercise.live.results.skillPoints", "{points}/{max} points", {
      points: formatMarks(row.points),
      max: formatMarks(row.max_points),
    }),
    points: formatMarks(row.points),
    maxPoints: formatMarks(row.max_points),
    percentage: denominator > 0 ? percentage : null,
    provisional,
    note: pendingNote(row.pending, t),
  };
}

/** One participant's per-skill rows, each a `scoreCell` with its label. */
export function participantSkillRows(
  bySkill: SkillScore[] | undefined,
  t: Translate,
): SkillBarRow[] {
  return (bySkill ?? []).map((row) => ({
    skill: row.skill,
    label: skillLabel(row.skill, t),
    ...scoreCell(row, t),
  }));
}

/**
 * The class's rows: ACCURACY, matching the results screen's per-question tab
 * — how many of the answers given were right — not a mean score.
 *
 * Answers nobody has marked are left out of the denominator, exactly as the
 * per-question table refuses to print a red 0% on an essay nobody has read.
 * A skill with nothing graded yet reads "—".
 */
export function classSkillRows(
  bySkill: SessionSkillAccuracy[] | undefined,
  t: Translate,
): SkillBarRow[] {
  return (bySkill ?? []).map((row) => {
    const pending = row.pending ?? 0;
    const graded = row.answered - pending;
    return {
      skill: row.skill,
      label: skillLabel(row.skill, t),
      value: t("exercise.live.results.skillCorrect", "{correct}/{answered} correct", {
        correct: row.correct,
        answered: row.answered,
      }),
      percentage: graded > 0 ? Math.round((row.correct / graded) * 100) : null,
      provisional: pending > 0,
      note: pending > 0 ? t("exercise.live.results.pendingToMark", "{n} to mark", { n: pending }) : undefined,
    };
  });
}
