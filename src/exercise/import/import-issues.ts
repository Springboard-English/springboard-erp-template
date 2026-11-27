// What an AI import lost on the way: sections the extractor failed on, ones it
// returned short, and questions the review itself could not parse. The import
// screen shows these beside a Retry, so nothing goes missing without a word.

/** How one detected unit's extract call came out. */
export interface UnitOutcome {
  status: "pending" | "done" | "failed";
  /** Questions detection counted in the unit. */
  expected: number;
  /** Questions the API returned. */
  received: number;
  /** Of those, the ones the review could parse and show. */
  parsed: number;
  /** The server's reason, when the call failed with one. */
  error?: string;
}

/** One unit that came back with less than detection promised. */
export interface ImportIssue {
  ref: string;
  /** `failed`: nothing read; `short`: fewer than expected came back or parsed. */
  kind: "failed" | "short";
  expected: number;
  /** Questions now in the review from this unit. */
  read: number;
  /** Questions the API returned that the review could not show: always our bug. */
  unparsed: number;
  error?: string;
}

/** Questions read so far, against the number detection expected. */
export interface QuestionTally {
  read: number;
  expected: number;
}

/**
 * The units that lost questions, in the order given (the paper's reading
 * order). A pending unit is not an issue yet.
 */
export function importIssues(order: string[], outcomes: Record<string, UnitOutcome | undefined>): ImportIssue[] {
  const issues: ImportIssue[] = [];
  for (const ref of order) {
    const outcome = outcomes[ref];
    if (!outcome || outcome.status === "pending") continue;
    const unparsed = Math.max(0, outcome.received - outcome.parsed);
    if (outcome.status === "failed" || outcome.parsed === 0) {
      issues.push({ ref, kind: "failed", expected: outcome.expected, read: 0, unparsed, error: outcome.error });
    } else if (outcome.parsed < outcome.expected || unparsed > 0) {
      issues.push({ ref, kind: "short", expected: outcome.expected, read: outcome.parsed, unparsed, error: outcome.error });
    }
  }
  return issues;
}

/** Questions read across every unit, against those detected. */
export function questionTally(outcomes: Record<string, UnitOutcome | undefined>): QuestionTally {
  let read = 0;
  let expected = 0;
  for (const outcome of Object.values(outcomes)) {
    if (!outcome) continue;
    read += outcome.parsed;
    expected += outcome.expected;
  }
  return { read, expected };
}
