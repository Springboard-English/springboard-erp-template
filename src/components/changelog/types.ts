/**
 * The shape each app's generated changelog file has to produce.
 *
 * Deliberately three plain fields: the generator is a `git log` format string
 * (see `scripts/generate-changelog.mjs` in any consumer), and every field it
 * emits has to survive being written into a checked-in file. Author names are
 * *not* carried — the history is shown to teachers and staff, and an internal
 * name against a line of release notes is nobody's business but the team's.
 */
export type ChangelogCommit = {
  /** Full 40-char sha. Shortened for display; kept whole so it can be looked up. */
  sha: string;
  /** Commit date as `YYYY-MM-DD`, already in the repo's local time. */
  date: string;
  /** First line of the commit message. */
  subject: string;
};

/**
 * How a change is labelled in the dialog. Derived from the conventional-commit
 * prefix when there is one — half this platform's commits are written as plain
 * sentences ("don't tell a class challenge it times each attempt"), so an
 * unprefixed subject is a first-class case, not a parse failure.
 */
export type ChangelogChangeKind = "feature" | "fix" | "improvement" | "internal";

export type ChangelogChange = {
  sha: string;
  shortSha: string;
  date: string;
  kind: ChangelogChangeKind;
  /** Conventional-commit scope (`fix(sign-in):` -> `sign-in`), when present. */
  scope: string | null;
  /** The subject with its `type(scope):` prefix stripped. */
  summary: string;
};

/** One day's worth of changes, newest day first. */
export type ChangelogDay = {
  date: string;
  changes: ChangelogChange[];
};
