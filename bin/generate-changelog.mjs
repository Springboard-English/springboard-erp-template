#!/usr/bin/env node
// Regenerate an app's `src/content/changelog.ts` from its commit history. Run
// from the app's root (npm scripts do).
//
// The changelog users read is the app's own git history, baked into the bundle
// at build time. That is deliberate: these apps carry no version number and the
// API has no release table, so the only description of "what changed" that is
// guaranteed to describe the bundle someone is actually running is the history
// of the commit it was built from. It also means the changelog opens with the
// API down and needs no endpoint of its own.
//
//   sb-generate-changelog [--root <dir>] [--out <file>] [--raw <file>]
//   npm run changelog    # the app's script: regenerate by hand
//   npm run build        # regenerates first, through `prebuild`
//
// --root is the app (default: the working directory); --out and --raw resolve
// against it and default to src/content/changelog.ts and changelog.raw.
//
// This script never fails a build. The generated file is committed, so when git
// cannot be reached it says so and leaves that file exactly as it was. Cloud
// Build's `node:22-slim` image carries no git binary on purpose (pulling the
// full node image costs ~20s a build), so the pipeline writes `changelog.raw`
// in an earlier step using a git image that is already on the worker — see
// the app's cloudbuild.yaml. When that file is present it is used in preference to
// calling git.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { parseArgs } from "node:util";

const { values: args } = parseArgs({
  options: {
    root: { type: "string", default: "." },
    out: { type: "string", default: "src/content/changelog.ts" },
    raw: { type: "string", default: "changelog.raw" },
  },
});
const ROOT = resolve(args.root);
const OUTPUT = resolve(ROOT, args.out);
const RAW_LOG = resolve(ROOT, args.raw);
// Messages name the file as the app sees it.
const SHOWN = relative(ROOT, OUTPUT);

// How far back the dialog can scroll. Two hundred commits is roughly a year of
// this project and about 20 KB in the bundle; the whole history would be
// neither readable nor free.
const LIMIT = 200;

// ASCII unit (0x1f) and record (0x1e) separators. Commit subjects contain every
// punctuation mark a person can type; these two bytes are the only ones they
// reliably do not. Built with `fromCharCode` rather than written literally so
// the file stays free of invisible control characters, and git is asked for the
// same bytes with its own `%x1f` / `%x1e` escapes.
const FIELD = String.fromCharCode(0x1f);
const RECORD = String.fromCharCode(0x1e);
const FORMAT = "%H%x1f%ad%x1f%s%x1e";

function readRawLog() {
  if (existsSync(RAW_LOG)) {
    return readFileSync(RAW_LOG, "utf8");
  }

  try {
    return execFileSync(
      "git",
      ["log", `-n${LIMIT}`, "--no-merges", "--date=short", `--pretty=format:${FORMAT}`],
      { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );
  } catch {
    return null;
  }
}

function parseCommits(rawLog) {
  return rawLog
    .split(RECORD)
    .map((record) => record.trim())
    .filter(Boolean)
    .map((record) => {
      const [sha, date, subject] = record.split(FIELD);
      return { sha: sha?.trim() ?? "", date: date?.trim() ?? "", subject: (subject ?? "").trim() };
    })
    .filter((commit) => /^[0-9a-f]{40}$/.test(commit.sha) && /^\d{4}-\d{2}-\d{2}$/.test(commit.date))
    .slice(0, LIMIT);
}

// Cloud Build hands the workspace a DEPTH-1 clone, so `git log -n200` there
// returns exactly ONE commit. Measured, not guessed: the first deploy of this
// feature published a one-entry changelog over a committed file holding 149. So
// a refresh has to ADD to the committed history rather than replace it — which
// is also what makes the CI step worth having, since the one commit it knows
// about is the deploy's own, and that is the one the committed file cannot
// contain.
//
// Parsing this script's own output back is safe precisely because this script
// wrote it. A line that has been hand-edited into something else is skipped
// rather than fought.
const COMMITTED_ENTRY =
  /^\s*\{ sha: ("(?:[^"\\]|\\.)*"), date: ("(?:[^"\\]|\\.)*"), subject: ("(?:[^"\\]|\\.)*") \},?\s*$/gm;

function readCommittedCommits() {
  if (!existsSync(OUTPUT)) {
    return [];
  }

  const commits = [];
  for (const match of readFileSync(OUTPUT, "utf8").matchAll(COMMITTED_ENTRY)) {
    try {
      commits.push({
        sha: JSON.parse(match[1]),
        date: JSON.parse(match[2]),
        subject: JSON.parse(match[3]),
      });
    } catch {
      // Not a line this script wrote — leave it out rather than guess at it.
    }
  }
  return commits;
}

// Fresh first, then whatever the committed file knows that git did not mention.
// Both lists are newest-first and the fresh ones are the tip, so concatenating
// keeps the order without re-sorting — which would scramble the sequence of
// commits that share a date, since the dates carry no time.
function mergeCommits(fresh, committed) {
  const seen = new Set();
  const merged = [];
  for (const commit of [...fresh, ...committed]) {
    if (seen.has(commit.sha)) continue;
    seen.add(commit.sha);
    merged.push(commit);
  }
  return merged.slice(0, LIMIT);
}

function render(commits) {
  const entries = commits
    .map(
      (commit) =>
        `  { sha: ${JSON.stringify(commit.sha)}, date: ${JSON.stringify(commit.date)}, subject: ${JSON.stringify(commit.subject)} },`,
    )
    .join("\n");

  return `// GENERATED FILE - do not edit by hand.
//
// Written by sb-generate-changelog (springboard-erp-template) from this
// repository's git history, and committed so a build with no git available
// still ships one. Regenerate with \`npm run changelog\`; \`npm run build\` does
// it for you.
import type { ChangelogCommit } from "@springboard-english/springboard-erp-template";

export const CHANGELOG: ChangelogCommit[] = [
${entries}
];
`;
}

const rawLog = readRawLog();
if (!rawLog || !rawLog.trim()) {
  console.warn(
    `generate-changelog: no git history available (no changelog.raw, and \`git log\` failed) — keeping the committed ${SHOWN}.`,
  );
  process.exit(0);
}

const fresh = parseCommits(rawLog);
if (fresh.length === 0) {
  console.warn(
    `generate-changelog: the history read back empty — keeping the committed ${SHOWN}.`,
  );
  process.exit(0);
}

const commits = mergeCommits(fresh, readCommittedCommits());
const next = render(commits);
const current = existsSync(OUTPUT) ? readFileSync(OUTPUT, "utf8") : "";
if (current === next) {
  console.log(`generate-changelog: ${SHOWN} already matches ${commits.length} commits.`);
  process.exit(0);
}

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, next);
console.log(
  `generate-changelog: wrote ${commits.length} commits to ${SHOWN} (${fresh.length} from git).`,
);
