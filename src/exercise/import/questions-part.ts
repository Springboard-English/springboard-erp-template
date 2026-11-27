// Every question on a test sits in a part. A question written for the test on
// its own, rather than for a part or section, goes in the test's "Questions"
// part, made and linked the first time one is needed.

import {
  createCollection,
  linkCollectionToTest,
  listTestExercises,
  patchExercise,
  patchTestExercise,
  type AuthoredExercise,
  type TestExerciseLink,
} from "./api";
import { partKeyOf } from "./library-question";

/** The title of the part a test's loose questions go in, as the API names it. */
export const QUESTIONS_PART_TITLE = "Questions";

/** The test's "Questions" part among its questions' parts, or null when it has none yet. */
export function findQuestionsPart(links: TestExerciseLink[]): string | null {
  for (const link of links) {
    const stub = link.exercise?.collection;
    const partKey = partKeyOf(stub);
    const part = stub?.kind === "part" ? stub : stub?.parent;
    if (partKey && part?.title?.trim() === QUESTIONS_PART_TITLE) return partKey;
  }
  return null;
}

/**
 * The key of the test's "Questions" part: the one already on it, else a new
 * part made and linked to the test. A question then joins it by its
 * `collection_key`, which puts it on the test's paper.
 */
export async function ensureQuestionsPart(testKey: string, links: TestExerciseLink[]): Promise<string> {
  const existing = findQuestionsPart(links);
  if (existing) return existing;
  const part = await createCollection({ kind: "part", title: QUESTIONS_PART_TITLE, source: "manual" });
  await linkCollectionToTest(testKey, part.appsheet_key);
  return part.appsheet_key;
}

/**
 * Put a standalone library question on a test. Every question on a test sits
 * in a part, so it joins the test's "Questions" part (made and linked the first
 * time), which puts it on the paper; a mark typed for this test is then set
 * on the new link.
 */
export async function addQuestionToTest(
  testKey: string,
  exercise: AuthoredExercise,
  points?: number,
): Promise<TestExerciseLink> {
  const partKey = await ensureQuestionsPart(testKey, await listTestExercises(testKey));
  await patchExercise(exercise.appsheet_key, { edited_at: exercise.edited_at, collection_key: partKey });
  const link = (await listTestExercises(testKey)).find(
    (row) => row.exercise_key.toLowerCase() === exercise.appsheet_key.toLowerCase(),
  );
  if (!link) throw new Error("The question joined the test's part but isn't on its paper yet.");
  return points === undefined ? link : patchTestExercise(testKey, link.exercise_key, { edited_at: link.edited_at, points });
}
