// Turning a teacher's raw field input into the optional content values the
// API's registry accepts (app/base/domain/exercise_schema.py).
//
// Kept pure and out of the question card because each of these has a way to be
// wrong that the registry refuses only at save time, partway through an import:
// `EssayContent.min_words` is `gt=0`, so a cleared box stored as 0 is a 400.

/**
 * A minimum word count from a number box, or undefined for "no minimum".
 *
 * Blank, zero, negative and non-numeric all mean no minimum rather than being
 * clamped up to 1: the API refuses 0 (`gt=0`), and inventing a floor of one word
 * would print "Aim for at least 1 words" to a student.
 */
export function minWordsFromInput(raw: string): number | undefined {
  const value = Math.floor(Number(raw));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * A speaking question's longest take from a seconds box, or undefined for no
 * limit. Like the word count, blank or non-positive means none; the API caps it
 * at 900 (`SpeakingContent.max_seconds`), so a larger value is held there.
 */
export function maxSecondsFromInput(raw: string): number | undefined {
  const value = Math.floor(Number(raw));
  return Number.isFinite(value) && value > 0 ? Math.min(value, 900) : undefined;
}

/**
 * `case_sensitive` as the node carries it: `true`, or absent.
 *
 * Never `false`. The key omits the flag when it is off (`draftToAnswerKey`,
 * `nodeToExercisePost`), so writing `false` would make an untouched question
 * look edited to anything comparing the node against the one it was loaded as.
 */
export function caseSensitiveFlag(checked: boolean): true | undefined {
  return checked ? true : undefined;
}
