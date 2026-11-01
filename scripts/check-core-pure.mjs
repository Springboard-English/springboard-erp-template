import { readFileSync } from "node:fs";

// `/core` is code only. If an import appears here, a shared chunk has been
// pulled in behind it — and with it React, the DOM, or the access token module,
// which is the state the entry split must never duplicate.
//
// Run: node scripts/check-core-pure.mjs   (wired into `npm run build`)
const source = readFileSync(new URL("../dist/core.js", import.meta.url), "utf8");
const imports = source.match(/^\s*import\b.*$/gm) ?? [];

if (imports.length > 0) {
  console.error(`dist/core.js must not import anything:\n  ${imports.join("\n  ")}`);
  process.exit(1);
}

console.log("core entry has no imports ✓");
