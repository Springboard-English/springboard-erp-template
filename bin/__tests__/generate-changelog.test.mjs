import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/** Runs `sb-generate-changelog` against an app root holding a raw log, as CI does. */

const SCRIPT = resolve(__dirname, "../generate-changelog.mjs");
const FIELD = String.fromCharCode(0x1f);
const RECORD = String.fromCharCode(0x1e);
const sha = (c) => c.repeat(40);
const raw = (commits) => commits.map((c) => [c.sha, c.date, c.subject].join(FIELD) + RECORD).join("");

function run(root, args = []) {
    return execFileSync("node", [SCRIPT, "--root", root, ...args], { encoding: "utf8", stdio: "pipe" });
}

describe("sb-generate-changelog", () => {
    it("writes the raw log into src/content/changelog.ts, then adds to it", () => {
        const root = mkdtempSync(join(tmpdir(), "sb-changelog-"));
        writeFileSync(join(root, "changelog.raw"), raw([{ sha: sha("b"), date: "2026-01-02", subject: 'feat: "two"' }]));
        run(root);
        const out = join(root, "src/content/changelog.ts");
        const first = readFileSync(out, "utf8");
        expect(first).toContain('{ sha: "' + sha("b") + '", date: "2026-01-02", subject: "feat: \\"two\\"" },');
        expect(first).toContain('import type { ChangelogCommit } from "@springboard-english/springboard-erp-template";');

        // A depth-1 clone knows only the tip: the committed history is kept below it.
        writeFileSync(join(root, "changelog.raw"), raw([{ sha: sha("c"), date: "2026-01-03", subject: "fix: three" }]));
        expect(run(root)).toContain("wrote 2 commits to src/content/changelog.ts (1 from git)");
        const second = readFileSync(out, "utf8");
        expect(second.indexOf(sha("c"))).toBeLessThan(second.indexOf(sha("b")));

        expect(run(root)).toContain("already matches 2 commits");
    });

    it("keeps the committed file when the log is empty", () => {
        const root = mkdtempSync(join(tmpdir(), "sb-changelog-"));
        writeFileSync(join(root, "log.raw"), "not a log");
        const out = execFileSync(
            "node",
            [SCRIPT, "--root", root, "--raw", "log.raw", "--out", "changes.ts"],
            { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
        );
        expect(out).toBe("");
        expect(() => readFileSync(join(root, "changes.ts"))).toThrow();
    });
});
