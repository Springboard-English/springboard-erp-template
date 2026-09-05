import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// A `.d.ts` may not carry the `@/` alias.
//
// tsc writes an import specifier into the declaration verbatim. `@/` is this
// package's own alias for `src/`, and a consumer resolves it against its OWN
// `src/` — so an aliased TYPE import does not fail loudly on the other side, it
// resolves to nothing and the type degrades to `any`.
//
// That is how `CsvColumn<T>` reached five apps as `any`: every
// `csvValue: (row) => …` became an implicit-any error at the call site, in
// files nobody had touched. The package built, the types emitted, and only the
// consumers' tsc complained — about their own code.
//
// Value imports are bundled by vite and never reach a .d.ts, which is why this
// only bites on types, and why it is easy to reintroduce.

const DIST = new URL("../dist", import.meta.url).pathname;

function walk(dir) {
    const out = [];
    for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
            out.push(...walk(path));
        } else if (path.endsWith(".d.ts")) {
            out.push(path);
        }
    }
    return out;
}

const offenders = walk(DIST)
    .map((path) => ({
        path,
        hits: readFileSync(path, "utf8")
            .split("\n")
            .filter((line) => /from\s+["']@\//.test(line)),
    }))
    .filter((file) => file.hits.length > 0);

if (offenders.length > 0) {
    console.error(
        "\nThese declarations import through the `@/` alias, which consumers " +
            "cannot resolve. Use a relative specifier instead:\n",
    );
    for (const { path, hits } of offenders) {
        console.error(`  ${path.replace(DIST, "dist")}`);
        for (const hit of hits) {
            console.error(`      ${hit.trim()}`);
        }
    }
    console.error("");
    process.exit(1);
}

console.log("declarations use portable specifiers ✓");
