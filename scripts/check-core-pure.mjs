import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `/core` is code only. Walks everything `dist/core.js` loads and fails on React,
// the router, the query client, or a chunk holding the access token: that module
// state must stay single, and a pure import must not drag the app shell along.
//
// Run: node scripts/check-core-pure.mjs   (wired into `npm run build`)
const DIST = fileURLToPath(new URL("../dist", import.meta.url));
const IMPORT = /(?:^|[\s;}])(?:import|export)\s*(?:[^"';]*?\bfrom\s*)?["']([^"']+)["']/g;
const FORBIDDEN_PACKAGE = /^(react|react-dom|react-router-dom|@tanstack\/react-query)(\/|$)/;

/** Every import in a file, chunk or package. */
function importsOf(path) {
  return [...readFileSync(path, "utf8").matchAll(IMPORT)].map((match) => match[1]);
}

const seen = new Set();
const queue = [join(DIST, "core.js")];
const problems = [];

while (queue.length > 0) {
  const path = queue.pop();
  if (seen.has(path)) continue;
  seen.add(path);
  // Names are minified, so the transport is found by the header it writes.
  if (readFileSync(path, "utf8").includes("Bearer ")) {
    problems.push(`${path} holds the auth transport`);
  }
  for (const specifier of importsOf(path)) {
    if (specifier.startsWith(".")) {
      queue.push(join(dirname(path), specifier));
    } else if (FORBIDDEN_PACKAGE.test(specifier)) {
      problems.push(`${path} imports ${specifier}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`dist/core.js must stay code only:\n  ${problems.join("\n  ")}`);
  process.exit(1);
}

console.log(`core entry is code only (${seen.size} files) ✓`);
