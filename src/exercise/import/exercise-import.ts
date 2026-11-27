import { type ExerciseNode, withoutImageUrls } from "../index";
import type { AuthoredExercise } from "./api";

// Map an SPA ExerciseNode to a create-Exercise payload, splitting the correct
// answer out of `content` into `answer_key`. The backend never sends
// `answer_key` to students, so the answer must not remain inside `content`
// (which the student-safe endpoint does return). Human-graded types get a null
// key. answer_key shapes mirror the backend grader (app/base/domain/grading.py).
//
// `source` records how the exercise got here — "import" for the AI extraction
// path, "manual" for the New exercise form.
export function nodeToExercisePost(
  node: ExerciseNode,
  source: "import" | "manual" = "import",
): Omit<Partial<AuthoredExercise>, "collection" | "collection_order"> {
  const base = {
    type: node.type,
    skill: node.skillTag,
    title: node.title,
    instruction: node.instruction,
    points: node.points,
    source,
  };

  switch (node.type) {
    case "mcq": {
      // `select_count` is key, not content. The API counts a "choose N" group's
      // cap itself; a stored value is only carried so a save can't wipe it.
      const { correct_option_id, select_count, ...content } = node.content;
      return {
        ...base,
        content: withoutImageUrls(content),
        answer_key: { correct_option_id, ...(select_count ? { select_count } : {}) },
      };
    }
    case "reading-full-test": {
      const { correct_option_id, ...content } = node.content;
      return { ...base, content: withoutImageUrls(content), answer_key: { correct_option_id } };
    }
    case "gap-filling":
    case "short-answer":
    case "rewriting": {
      const { accepted_answers, case_sensitive, ...rest } = node.content;
      // Only a gap carries a root; short-answer has no such field to split.
      const { root, ...content } = "root" in rest ? rest : { ...rest, root: undefined };
      return {
        ...base,
        content,
        answer_key: {
          accepted_answers,
          ...(case_sensitive ? { case_sensitive } : {}),
          ...(root ? { root } : {}),
        },
      };
    }
    case "error-correction": {
      // The location (error / error_offset) and the fix (accepted_answers) are
      // the key; only `sentence` / `placeholder` / `explanation` stay in content.
      const {
        error,
        error_offset,
        accepted_answers,
        case_sensitive,
        partial_credit,
        ...content
      } = node.content;
      return {
        ...base,
        content,
        answer_key: {
          error,
          error_offset,
          accepted_answers,
          ...(case_sensitive ? { case_sensitive } : {}),
          ...(partial_credit ? { partial_credit } : {}),
        },
      };
    }
    case "true-false-not-given": {
      const { answer, ...content } = node.content;
      return {
        ...base,
        content,
        answer_key: answer !== undefined ? { answer } : null,
      };
    }
    case "essay":
    case "speaking":
      return { ...base, content: node.content, answer_key: null };
  }
}
