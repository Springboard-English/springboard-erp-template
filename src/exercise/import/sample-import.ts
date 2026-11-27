// The practice import the teacher guided tour walks through.
//
// The second sample-data file in this repo, by the same named exception as
// `sample-paper.ts` (AGENTS.md, "Don't add sample data"). It exists because the
// alternative, touring a real import, sends a paper to the AI and can write
// tests and questions into the teacher's library.
//
// Rules for this file, all of which the exception depends on:
// - Only the AI import screen reads it, and only while its URL carries the
//   tour parameter (`teacherTourImportRoute`). No real import falls back to it.
// - It is never sent to the API: the practice import answers detection and
//   every section from here, and its save writes nothing.
// - It is what the two calls would answer, typed as their responses, so the
//   real screens draw it. One section prints no key on purpose, so the tour can
//   show what an unanswered question looks like.
//
// `sample-import.test.ts` checks every question against the real node mapper,
// so a change to the schema fails there rather than drawing a blank.

import type {
  DetectStructure,
  ExtractedExercise,
  SectionExtract,
} from "./api";

/** What the practice import shows as pasted into its Source step. */
export const SAMPLE_IMPORT_TEXT = [
  "UNIT 7 REVIEW",
  "",
  "I. READING",
  "Read the passage about a night market and answer the questions.",
  "",
  "The Friday Night Market",
  "Every Friday evening, the car park behind Lan's school turns into a night market…",
  "",
  "Questions 1–4. Do the statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.",
  "…",
].join("\n");

const PASSAGE = [
  "Every Friday evening, the car park behind Lan's school turns into a night market. By six o'clock, more than forty stalls have opened, selling everything from grilled corn to second-hand books.",
  "The market began twelve years ago, when three families started selling food from the backs of their vans. Today it is run by a small committee of volunteers, who decide which stalls can join each season.",
  "Lan's favourite stall belongs to Mr Hoà, who repairs old radios. He says most of his customers are not interested in the radios at all; they come to listen to his stories about the city in the 1980s.",
  "Not everyone is happy with the market. Some neighbours complain about the noise, and last year the committee agreed to close every stall by ten o'clock.",
];

/** One extracted question, before it is placed in its section. */
type SampleItem = Pick<ExtractedExercise, "type" | "content" | "answer_key">;

/** A detected section and the questions its extract call answers. */
interface SampleSection {
  part: string;
  ref: string;
  type: ExtractedExercise["type"];
  skill: ExtractedExercise["skill"];
  points: string;
  instruction: string;
  items: SampleItem[];
}

/** A multiple-choice question; `correct` indexes `options`. */
function mcq(prompt: string, options: string[], correct: number): SampleItem {
  return {
    type: "mcq",
    content: { prompt, options: options.map((label, i) => ({ id: "abcd"[i], label })) },
    answer_key: { correct_option_id: "abcd"[correct] },
  };
}

/** A True / False / Not Given statement. */
function tfng(statement: string, answer: "true" | "false" | "not-given"): SampleItem {
  return { type: "true-false-not-given", content: { statement }, answer_key: { answer } };
}

/** A word-formation gap whose paper printed no key. */
function unkeyedGap(before: string, after: string): SampleItem {
  return { type: "gap-filling", content: { before, after, placeholder: "Type your answer" }, answer_key: null };
}

const PARTS = [
  {
    ref: "p1",
    title: "I. READING",
    instruction: "Read the passage about a night market and answer the questions.",
    passage_title: "The Friday Night Market",
    passage_excerpt: PASSAGE.join("\n\n"),
  },
  { ref: "p2", title: "II. VOCABULARY AND GRAMMAR", instruction: "", passage_title: "", passage_excerpt: "" },
  { ref: "p3", title: "III. WRITING", instruction: "", passage_title: "", passage_excerpt: "" },
];

const SECTIONS: SampleSection[] = [
  {
    part: "p1",
    ref: "s1",
    type: "true-false-not-given",
    skill: "reading",
    points: "1",
    instruction: "Questions 1–4. Do the statements agree with the information in the passage? Write TRUE, FALSE or NOT GIVEN.",
    items: [
      tfng("The night market opens on Friday evenings.", "true"),
      tfng("The market was started by the school.", "false"),
      tfng("Volunteers choose which stalls can join.", "true"),
      tfng("Mr Hoà sells more radios than any other stall.", "not-given"),
    ],
  },
  {
    part: "p1",
    ref: "s2",
    type: "mcq",
    skill: "reading",
    points: "1",
    instruction: "Questions 5–7. Choose the correct letter, A, B, C or D.",
    items: [
      mcq("Why do most people visit Mr Hoà's stall?", ["To buy a radio", "To have a radio repaired", "To hear his stories", "To sell old books"], 2),
      mcq("What did the committee decide last year?", ["To move the market", "To close the stalls earlier", "To add more stalls", "To charge the stallholders"], 1),
      mcq("The word \"they\" in paragraph 3 refers to", ["the radios", "his customers", "the stories", "the volunteers"], 1),
    ],
  },
  {
    part: "p2",
    ref: "s3",
    type: "mcq",
    skill: "vocab-grammar",
    points: "0.5",
    instruction: "Questions 8–11. Choose the word or phrase that best completes each sentence.",
    items: [
      mcq("If it ___ tomorrow, we will cancel the trip.", ["rains", "will rain", "rained", "would rain"], 0),
      mcq("She has lived in Hà Nội ___ 2019.", ["for", "since", "from", "in"], 1),
      mcq("The book ___ by millions of readers so far.", ["has read", "was reading", "has been read", "reads"], 2),
      mcq("I'm not used to ___ up so early.", ["get", "getting", "got", "be getting"], 1),
    ],
  },
  {
    part: "p2",
    ref: "s4",
    type: "gap-filling",
    skill: "vocab-grammar",
    points: "0.5",
    instruction: "Questions 12–15. Give the correct form of the word in brackets.",
    items: [
      unkeyedGap("The volunteers worked very", "(CARE) to keep the market clean."),
      unkeyedGap("The noise from the market was a real", "(ANNOY) to the neighbours."),
      unkeyedGap("Mr Hoà is a very", "(TALK) man."),
      unkeyedGap("The market has become more", "(POPULARITY) every year."),
    ],
  },
  {
    part: "p3",
    ref: "s5",
    type: "essay",
    skill: "writing",
    points: "2",
    instruction: "Question 16. Write about 120 words.",
    items: [
      {
        type: "essay",
        content: {
          prompt: "Write a short email to a friend inviting them to a market in your town. Say what they can buy there and why you like it.",
          placeholder: "Write your answer",
          min_words: 100,
        },
        answer_key: null,
      },
    ],
  },
];

/** The first line of a section's first question, as detection quotes it. */
function firstQuestionLine(section: SampleSection, number: number): string {
  const content = section.items[0].content as { prompt?: string; statement?: string; before?: string; after?: string };
  const text = content.statement ?? content.prompt ?? `${content.before ?? ""} ___ ${content.after ?? ""}`;
  return `${number}. ${text}`;
}

/** What detection answers for the practice paper. */
export const SAMPLE_IMPORT_STRUCTURE: DetectStructure = (() => {
  let number = 1;
  return {
    parts: PARTS.map((part) => ({
      ...part,
      sections: SECTIONS.filter((section) => section.part === part.ref).map((section) => {
        const spec = {
          ref: section.ref,
          parent_ref: part.ref,
          instruction: section.instruction,
          question_type: section.type,
          skill: section.skill,
          passage_title: "",
          passage_excerpt: "",
          choices_excerpt: "",
          questions_excerpt: firstQuestionLine(section, number),
          question_count: section.items.length,
          points: section.points,
          layout: "",
        };
        number += section.items.length;
        return spec;
      }),
    })),
  };
})();

/** What one section's extract call answers for the practice paper. */
export function sampleSectionExtract(ref: string): SectionExtract {
  const section = SECTIONS.find((candidate) => candidate.ref === ref);
  if (!section) return { ref, parent_ref: "", passage: null, info: null, exercises: [] };
  return {
    ref: section.ref,
    parent_ref: section.part,
    passage: null,
    info: null,
    exercises: section.items.map((item, index) => ({
      ...item,
      skill: section.skill,
      title: null,
      instruction: null,
      points: section.points,
      collection_ref: section.ref,
      collection_order: index,
    })),
  };
}
