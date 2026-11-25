import { describe, expect, it } from "vitest";

import type { SessionParticipantResult } from "./api";
import {
  attemptDuration,
  averageCompletion,
  finishedCount,
  formatDuration,
  formatMarks,
  formatScore,
  provisionalScore,
  resultsCsv,
  scorePercentage,
  formatPercentile,
} from "./results";

function participant(
  overrides: Partial<SessionParticipantResult> & { participant_key: string },
): SessionParticipantResult {
  return {
    display_name: "Student",
    // Null for a class student; only a guest on a public link carries one.
    guest_email: null,
    answered: 0,
    correct: 0,
    points: 0,
    risk_score: 0,
    current_index: null,
    online: false,
    finished_at: null,
    joined_at: null,
    started_at: null,
    percentile: null,
    ...overrides,
  };
}

describe("formatScore", () => {
  it("prints the API's Decimal string in points, to one place", () => {
    expect(formatScore("73.3750000000000000000000000")).toBe("73.4");
    expect(formatScore("6.5000")).toBe("6.5");
    expect(formatScore("8")).toBe("8");
    expect(formatScore(3.333)).toBe("3.3");
  });

  it("has nothing to print for an empty room", () => {
    expect(formatScore(null)).toBe("—");
    expect(formatScore(undefined)).toBe("—");
    expect(formatScore("")).toBe("—");
  });
});

describe("averageCompletion", () => {
  it("averages progress through the question list", () => {
    const rows = [
      participant({ participant_key: "a", answered: 4 }),
      participant({ participant_key: "b", answered: 0 }),
    ];
    expect(averageCompletion(rows, 4)).toBe(50);
  });

  it("clamps a participant who answered more than the question count", () => {
    // Questions can be unlinked from a test after a session has run.
    const rows = [participant({ participant_key: "a", answered: 8 })];
    expect(averageCompletion(rows, 4)).toBe(100);
  });
});

describe("finishedCount", () => {
  it("counts only participants who pressed submit", () => {
    const rows = [
      participant({ participant_key: "a", finished_at: "2026-07-22T10:00:00Z" }),
      participant({ participant_key: "b", answered: 6 }), // answered, never submitted
    ];
    expect(finishedCount(rows)).toBe(1);
  });
});

describe("scorePercentage", () => {
  it("rounds to whole percent and guards a zero denominator", () => {
    expect(scorePercentage(2, 3)).toBe(67);
    expect(scorePercentage(1, 0)).toBe(0);
  });
});

describe("resultsCsv", () => {
  it("quotes names containing a comma", () => {
    const csv = resultsCsv(
      [
        participant({
          participant_key: "a",
          display_name: "Nguyen, An",
          points: 5,
          correct: 1,
          answered: 2,
        }),
      ],
      10,
      4,
    );
    const [header, row] = csv.split("\n");
    expect(header.startsWith("Student,Score %")).toBe(true);
    // Then Started, Submitted and Time taken: this attempt has neither end, so
    // two empties and the dash the screen shows. Then pending, email and risk.
    expect(row).toBe('"Nguyen, An",50,,1,5,10,2,4,,,—,0,,0');
  });

  it("exports the screen's figures: trimmed marks and the provisional score", () => {
    const csv = resultsCsv(
      [
        participant({
          participant_key: "a",
          // Numeric(12,4) arrives as a string at runtime.
          points: "6.0000" as unknown as number,
          pending: 1,
          marked_points: 8,
          guest_email: "an@example.com",
          risk_score: 2.5,
        }),
      ],
      16,
      4,
    );
    const row = csv.split("\n")[1].split(",");
    // 6 of the 8 marked points, not 6 of 16: the essay is not a zero yet.
    expect(row[1]).toBe("75");
    expect(row[4]).toBe("6");
    expect(row[5]).toBe("16");
    expect(row.slice(-3)).toEqual(["1", "an@example.com", "2.5"]);
  });
});

describe("formatPercentile", () => {
  it("prints a 0..1 fraction as a whole percentage", () => {
    expect(formatPercentile(0.83)).toBe("83%");
    expect(formatPercentile(1)).toBe("100%");
    expect(formatPercentile(0)).toBe("0%");
  });

  it("reads the Decimal string the API actually sends", () => {
    expect(formatPercentile("1")).toBe("100%");
    expect(formatPercentile("0.6667")).toBe("67%");
    expect(formatPercentile("0")).toBe("0%");
    expect(formatPercentile("")).toBe("—");
  });

  it("has no number to print before anyone is ranked", () => {
    expect(formatPercentile(null)).toBe("—");
    expect(formatPercentile(undefined)).toBe("—");
  });

  it("clamps rather than printing an impossible percentile", () => {
    expect(formatPercentile(1.4)).toBe("100%");
    expect(formatPercentile(-0.2)).toBe("0%");
  });
});

describe("formatMarks", () => {
  // Points are Numeric(12,4) on the API and JSON has no decimal type, so they
  // arrive as STRINGS. Arithmetic coerces fine, but printed raw every score
  // would render "3.0000/16 points".
  it("prints the string the API sends as a mark a teacher would write", () => {
    expect(formatMarks("3.0000")).toBe("3");
    expect(formatMarks("0.0000")).toBe("0");
    expect(formatMarks("16")).toBe("16");
  });

  it("keeps a partial mark, which is what the four decimals are for", () => {
    expect(formatMarks("2.5000")).toBe("2.5");
    expect(formatMarks("0.3300")).toBe("0.33");
  });

  it("treats a missing mark as zero rather than NaN", () => {
    expect(formatMarks(null)).toBe("0");
    expect(formatMarks(undefined)).toBe("0");
    expect(formatMarks("not a number")).toBe("0");
  });
});

describe("provisionalScore", () => {
  // A 30-mark paper: 20 marks of auto-graded questions all correct, plus a
  // 10-mark essay nobody has marked.
  it("divides by what has been marked, not by the paper's total", () => {
    const { percentage, provisional } = provisionalScore(20, 30, 1, 20);
    // 67% would be the honest-looking lie: it scores the unread essay as zero,
    // so a student who wrote a good one cannot tell that from a bad one.
    expect(percentage).toBe(100);
    expect(provisional).toBe(true);
  });

  it("is the plain score once nothing is pending", () => {
    const { percentage, provisional } = provisionalScore(27, 30, 0, 30);
    expect(percentage).toBe(90);
    expect(provisional).toBe(false);
  });

  it("does not divide by zero when nothing has been marked yet", () => {
    // Every question on the paper is written, and the teacher has read none.
    expect(provisionalScore(0, 30, 3, 0).percentage).toBe(0);
  });
});

describe("attemptDuration", () => {
  it("measures the paper, not the wait", () => {
    const took = attemptDuration({
      started_at: "2026-08-28T09:05:00Z",
      finished_at: "2026-08-28T09:43:00Z",
    });
    expect(took).toBe(38 * 60 * 1000);
  });

  it("refuses to guess when either end is missing", () => {
    // The whole point of the API's started_at: joined_at is always populated
    // and is the LOBBY, so a fallback would bill the register to every student
    // and bill whoever arrived earliest the most.
    expect(
      attemptDuration({ started_at: null, finished_at: "2026-08-28T09:43:00Z" }),
    ).toBeNull();
    expect(
      attemptDuration({ started_at: "2026-08-28T09:05:00Z", finished_at: null }),
    ).toBeNull();
    expect(attemptDuration({ started_at: null, finished_at: null })).toBeNull();
  });

  it("treats an impossible span as unknown", () => {
    // Nothing should write one, but the two ends come from different writes,
    // and "-3 min" on a report a teacher may show a student is worse than "—".
    expect(
      attemptDuration({
        started_at: "2026-08-28T09:43:00Z",
        finished_at: "2026-08-28T09:05:00Z",
      }),
    ).toBeNull();
    expect(
      attemptDuration({ started_at: "not a date", finished_at: "also not" }),
    ).toBeNull();
  });
});

describe("formatDuration", () => {
  it("leads with minutes, the unit an exam is set in", () => {
    expect(formatDuration(38 * 60 * 1000)).toBe("38 min");
  });

  it("drops to seconds below a minute rather than saying 0 min", () => {
    expect(formatDuration(45 * 1000)).toBe("45s");
  });

  it("pads the minutes past an hour so a column stays readable", () => {
    // 1h 4m and 1h 40m are one glance apart unpadded.
    expect(formatDuration(64 * 60 * 1000)).toBe("1h 04m");
    expect(formatDuration(100 * 60 * 1000)).toBe("1h 40m");
  });

  it("renders an unknown duration as a dash", () => {
    expect(formatDuration(null)).toBe("—");
  });
});

describe("resultsCsv", () => {
  it("carries the time taken, and both ends of it", () => {
    const csv = resultsCsv(
      [
        participant({
          participant_key: "a",
          started_at: "2026-08-28T09:05:00Z",
          finished_at: "2026-08-28T09:43:00Z",
        }),
      ],
      10,
      4,
    );
    const [header, row] = csv.split("\n");
    const columns = header.split(",");
    expect(columns).toContain("Time taken");
    // Both timestamps ride along, so a teacher can redo the arithmetic.
    expect(row.split(",")[columns.indexOf("Started")]).toBe(
      "2026-08-28T09:05:00Z",
    );
    expect(row.split(",")[columns.indexOf("Time taken")]).toBe("38 min");
  });

  it("leaves the duration blank-ish when the attempt never finished", () => {
    const csv = resultsCsv(
      [participant({ participant_key: "a", started_at: "2026-08-28T09:05:00Z" })],
      10,
      4,
    );
    const [header, row] = csv.split("\n");
    const columns = header.split(",");
    expect(row.split(",")[columns.indexOf("Time taken")]).toBe("—");
  });

  it("carries the percentile as a plain number for the spreadsheet", () => {
    const csv = resultsCsv(
      [participant({ participant_key: "a", points: 8, percentile: 0.75 })],
      10,
      4,
    );
    const [header, row] = csv.split("\n");
    expect(header.split(",")).toContain("Percentile");
    expect(row.split(",")[2]).toBe("75");
  });
});
