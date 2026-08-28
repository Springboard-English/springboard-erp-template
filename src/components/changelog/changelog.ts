import type {
  ChangelogChange,
  ChangelogChangeKind,
  ChangelogCommit,
  ChangelogDay,
} from "./types";

// Pure logic, no DOM and no React: this module is imported by the package
// barrel, and an app's node-side test has to be able to reach `buildChangelog`
// without pulling a renderer in behind it. See scripts/check-node-safe.mjs.

/**
 * Conventional-commit type -> the kind we show it as.
 *
 * Anything not listed is an `improvement`, which is also what an unprefixed
 * subject gets. `chore`, `deps`, `ci` and friends are `internal`: true, but not
 * what someone opening release notes came to read, so the dialog folds them
 * away behind a toggle.
 */
const KIND_BY_COMMIT_TYPE: Record<string, ChangelogChangeKind> = {
  feat: "feature",
  feature: "feature",
  fix: "fix",
  hotfix: "fix",
  bugfix: "fix",
  perf: "improvement",
  refactor: "improvement",
  style: "improvement",
  ui: "improvement",
  revert: "fix",
  chore: "internal",
  deps: "internal",
  build: "internal",
  ci: "internal",
  docs: "internal",
  test: "internal",
  tests: "internal",
};

const CONVENTIONAL_SUBJECT = /^([a-zA-Z]+)(?:\(([^)]*)\))?(!)?:\s*(.+)$/;

export function parseCommitSubject(subject: string): {
  kind: ChangelogChangeKind;
  scope: string | null;
  summary: string;
} {
  const trimmed = subject.trim();
  const match = trimmed.match(CONVENTIONAL_SUBJECT);
  if (!match) {
    return { kind: "improvement", scope: null, summary: trimmed };
  }

  const [, type, scope, breaking, summary] = match;
  const kind = KIND_BY_COMMIT_TYPE[type.toLowerCase()] ?? "improvement";

  return {
    // A `!` marks a breaking change; it is never internal housekeeping,
    // whatever prefix it wears.
    kind: breaking ? "feature" : kind,
    scope: scope?.trim() ? scope.trim() : null,
    summary: summary.trim(),
  };
}

export function toChangelogChange(commit: ChangelogCommit): ChangelogChange {
  const { kind, scope, summary } = parseCommitSubject(commit.subject);
  return {
    sha: commit.sha,
    shortSha: commit.sha.slice(0, 7),
    date: commit.date,
    kind,
    scope,
    summary,
  };
}

/**
 * Group a flat commit list into days, newest first.
 *
 * Order within a day is left as the generator produced it (`git log` order,
 * newest first) rather than re-sorted: commits on the same date carry no time
 * here, and re-sorting by anything else would scramble a day's sequence.
 */
export function buildChangelog(
  commits: readonly ChangelogCommit[],
  options?: { includeInternal?: boolean },
): ChangelogDay[] {
  const includeInternal = options?.includeInternal ?? true;
  const days: ChangelogDay[] = [];
  const byDate = new Map<string, ChangelogDay>();

  for (const commit of commits) {
    const change = toChangelogChange(commit);
    if (!includeInternal && change.kind === "internal") continue;

    let day = byDate.get(change.date);
    if (!day) {
      day = { date: change.date, changes: [] };
      byDate.set(change.date, day);
      days.push(day);
    }
    day.changes.push(change);
  }

  return days.sort((left, right) => right.date.localeCompare(left.date));
}

export function countInternalChanges(commits: readonly ChangelogCommit[]): number {
  return commits.reduce(
    (total, commit) => (parseCommitSubject(commit.subject).kind === "internal" ? total + 1 : total),
    0,
  );
}

/**
 * Split a what's-new note into its heading and body.
 *
 * The note is authored as markdown, like a guide, so it is natural to start it
 * with `# Something changed`. Rendering that as an H1 inside a small popover
 * looks wrong, so the first `# ` line becomes the note's title and the rest
 * stays markdown.
 */
export function parseWhatsNewNote(markdown: string): { title: string | null; body: string } {
  const trimmed = markdown.trim();
  const firstH1 = trimmed.match(/^#\s+(.+)$/m);
  if (!firstH1) {
    return { title: null, body: trimmed };
  }

  return {
    title: firstH1[1].trim(),
    body: trimmed.replace(/^#\s+.+$/m, "").trim(),
  };
}

/**
 * Identity of a what's-new note, derived from its own text.
 *
 * There is no version number to key it on — the apps are deployed continuously
 * and none of them carries one — so the note's content *is* its identity:
 * rewrite `whats-new.md` and everyone sees the new note once, edit a typo and
 * they see it again. That is the intended trade; a note nobody re-reads is
 * worth less than one that occasionally repeats.
 */
export function changelogNoteId(markdown: string): string {
  const normalized = markdown.trim();
  if (!normalized) return "";

  // djb2. Not a checksum — just enough to tell two notes apart in a storage key.
  let hash = 5381;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = ((hash << 5) + hash + normalized.charCodeAt(index)) | 0;
  }
  return (hash >>> 0).toString(36);
}

/**
 * Storage is best-effort throughout: Safari in private mode throws on
 * `localStorage` access, and a release note is never worth taking a screen down
 * for. Failing to read shows the note again; failing to write shows it once
 * more next load.
 */
export function readSeenNoteId(storageKey: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function writeSeenNoteId(storageKey: string, noteId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, noteId);
  } catch {
    /* ignore — see above */
  }
}
