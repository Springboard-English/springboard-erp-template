import { describe, expect, it } from "vitest";

import type {
  SessionSkillAccuracy,
  SkillScore,
} from "./api";
import type { Translate } from "./i18n";
import {
  classSkillRows as classSkillRowsIn,
  participantLayoutRows,
  participantSkillRows as participantSkillRowsIn,
  participantTypeRows,
} from "./skill-breakdown";

const t: Translate = (_k, f = "", v = {}) => f.replace(/\{(\w+)\}/g, (_, n) => String(v[n]));
const participantSkillRows = (rows: SkillScore[] | undefined) => participantSkillRowsIn(rows, t);
const classSkillRows = (rows: SessionSkillAccuracy[] | undefined) => classSkillRowsIn(rows, t);

// The test owns its data. These are the server's rows as the API sends them —
// note the Decimal fields arrive as strings on the wire, which is why the
// participant rows go through Number() before any arithmetic.

function score(overrides: Partial<SkillScore> & { skill: SkillScore["skill"] }): SkillScore {
  return {
    question_count: 2,
    answered: 2,
    correct: 1,
    points: 2,
    max_points: 4,
    marked_points: 4,
    pending: 0,
    ...overrides,
  };
}

function accuracy(
  overrides: Partial<SessionSkillAccuracy> & { skill: SessionSkillAccuracy["skill"] },
): SessionSkillAccuracy {
  return {
    question_count: 1,
    max_points: 2,
    answered: 4,
    correct: 3,
    points: 6,
    pending: 0,
    ...overrides,
  };
}

describe("participantSkillRows", () => {
  it("labels each skill and prints points out of the skill's total", () => {
    const [row] = participantSkillRows([score({ skill: "vocab-grammar" })]);
    expect(row.label).toBe("Vocabulary & Grammar");
    expect(row.value).toBe("2/4 points");
    expect(row.percentage).toBe(50);
    expect(row.provisional).toBe(false);
    expect(row.note).toBeUndefined();
  });

  it("survives the API's decimal strings", () => {
    const [row] = participantSkillRows([
      score({
        skill: "reading",
        points: "3.0000" as unknown as number,
        max_points: "4.0000" as unknown as number,
        marked_points: "4.0000" as unknown as number,
      }),
    ]);
    expect(row.value).toBe("3/4 points");
    expect(row.percentage).toBe(75);
  });

  it("divides a provisional skill by what has been marked, and says so", () => {
    // Two writing tasks: one marked 5/5, one essay still with the teacher.
    const [row] = participantSkillRows([
      score({
        skill: "writing",
        points: 5,
        max_points: 15,
        marked_points: 5,
        pending: 1,
      }),
    ]);
    expect(row.percentage).toBe(100);
    expect(row.provisional).toBe(true);
    expect(row.note).toBe("1 answer still to mark");
    // The figure still says what the skill is out of.
    expect(row.value).toBe("5/15 points");
  });

  it("prints no percentage for a skill that is nothing but unmarked work", () => {
    const [row] = participantSkillRows([
      score({ skill: "writing", points: 0, max_points: 10, marked_points: 0, pending: 1 }),
    ]);
    expect(row.percentage).toBeNull();
    expect(row.provisional).toBe(true);
  });

  it("draws nothing for an API that does not send the breakdown", () => {
    expect(participantSkillRows(undefined)).toEqual([]);
    expect(participantSkillRows([])).toEqual([]);
  });
});

describe("classSkillRows", () => {
  it("reports accuracy over the answers given", () => {
    const [row] = classSkillRows([accuracy({ skill: "listening" })]);
    expect(row.label).toBe("Listening");
    expect(row.value).toBe("3/4 correct");
    expect(row.percentage).toBe(75);
    expect(row.provisional).toBe(false);
  });

  it("leaves unmarked answers out of the denominator", () => {
    // Four answers, two of them essays nobody has read: 1 right of the 2 graded.
    const [row] = classSkillRows([
      accuracy({ skill: "writing", answered: 4, correct: 1, pending: 2 }),
    ]);
    expect(row.percentage).toBe(50);
    expect(row.provisional).toBe(true);
    expect(row.note).toBe("2 to mark");
  });

  it("prints no percentage when nothing has been answered or graded", () => {
    const [nobody, allPending] = classSkillRows([
      accuracy({ skill: "reading", answered: 0, correct: 0 }),
      accuracy({ skill: "writing", answered: 3, correct: 0, pending: 3 }),
    ]);
    expect(nobody.percentage).toBeNull();
    expect(allPending.percentage).toBeNull();
  });

  it("draws nothing for an API that does not send the breakdown", () => {
    expect(classSkillRows(undefined)).toEqual([]);
  });
});

describe("participantTypeRows and participantLayoutRows", () => {
  it("names a row by skill and type, keyed so two skills' types never collide", () => {
    const rows = participantTypeRows(
      [
        { ...score({ skill: "reading" }), type: "mcq" },
        { ...score({ skill: "listening" }), type: "mcq" },
      ],
      t,
    );
    expect(rows.map((row) => [row.key, row.label, row.percentage])).toEqual([
      ["reading|mcq", "Reading · Multiple choice", 50],
      ["listening|mcq", "Listening · Multiple choice", 50],
    ]);
  });

  it("names a task row by its task, and a row with none by its type", () => {
    const rows = participantLayoutRows(
      [
        { ...score({ skill: "reading" }), type: "mcq", layout: "gapped-text" },
        { ...score({ skill: "reading" }), type: "mcq", layout: "" },
        { ...score({ skill: "reading" }), type: "mcq", layout: null },
      ],
      t,
    );
    expect(rows.map((row) => row.label)).toEqual([
      "Reading · Gapped text",
      "Reading · Multiple choice",
      "Reading · Multiple choice",
    ]);
    expect(new Set(rows.map((row) => row.key)).size).toBe(3);
  });

  it("draws nothing for an API that does not send them", () => {
    expect(participantTypeRows(undefined, t)).toEqual([]);
    expect(participantLayoutRows(undefined, t)).toEqual([]);
  });
});
