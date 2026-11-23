#!/usr/bin/env node
// Writes an app's live root index.html: the template's bootstrap with the app's
// names and its release map filled in. Run from the app's root.
//
//   sb-stamp-bootstrap --control <sha> [--variants <file>] [--boot <release.html>] [--out <file>]
//   sb-stamp-bootstrap --control <sha> --from <live.html> [--out <file>]
//
// `--variants` (default bootstrap/variants.json) stamps the committed map into
// the bootstrap template — the CI path. `--from` re-stamps an already-live root
// and keeps its variants and boot screen, changing only control — the rollback
// path. `--boot` copies a build's boot screen (the template's springboardBoot)
// into the root, so it paints before any release is fetched and its
// DOMContentLoaded failsafe still fires.
//
// The app's id, name and base path come from `springboardBootstrap` in its
// package.json (see lib/bootstrap-config.mjs); `--app`, `--name`,
// `--failure-name`, `--base` and `--description` override them. `--template`
// swaps in another bootstrap file.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { readBootstrapConfig } from "./lib/bootstrap-config.mjs";

const PACKAGE = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SHA = /^[0-9a-f]{40}$/;
const NAME = /^[a-z0-9-]+$/;
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

function fail(message) {
  console.error(`stamp-bootstrap: ${message}`);
  process.exit(1);
}

const { values } = parseArgs({
  options: {
    control: { type: "string" },
    variants: { type: "string" },
    from: { type: "string" },
    boot: { type: "string" },
    out: { type: "string", default: "dist-root/index.html" },
    root: { type: "string", default: "." },
    template: { type: "string" },
    app: { type: "string" },
    name: { type: "string" },
    "failure-name": { type: "string" },
    base: { type: "string" },
    description: { type: "string" },
  },
});

if (!values.control || !SHA.test(values.control)) {
  fail("--control must be a full 40-character commit sha");
}
if (values.from && values.variants) {
  fail("--from keeps the live variants; pass one of --from or --variants");
}
if (values.from && values.boot) {
  fail("--from keeps the live boot screen; pass one of --from or --boot");
}

const ROOT = resolve(values.root);
let config;
try {
  config = readBootstrapConfig(ROOT, {
    app: values.app,
    name: values.name,
    failureName: values["failure-name"],
    base: values.base,
    description: values.description,
  });
} catch (error) {
  fail(error.message);
}

// The whole data element, whether it still holds the placeholder or a stamped map.
const SLOT = new RegExp(
  `(<script type="application\\/json" id="${config.app}-releases">)([\\s\\S]*?)(<\\/script>)`,
  "g",
);
// What springboardBoot injects: a stylesheet and a script in <head>, a div before #root.
const ASSETS = escapeRegExp(`${config.base}/assets/`);
const BOOT_CSS = new RegExp(`<link rel="stylesheet" href="${ASSETS}sb-boot-[0-9a-f]+\\.css">`, "g");
const BOOT_JS = new RegExp(`<script src="${ASSETS}sb-boot-[0-9a-f]+\\.js"><\\/script>`, "g");
const BOOT_DIV = /<div id="sb-boot"[\s\S]*?(?=\s*<div id="root")/g;

/** The bootstrap template with this app's names written in; a live root passes through as is. */
function fillNames(html) {
  const meta = config.description
    ? `<meta name="description" content="${config.description}" />`
    : "";
  const filled = html
    .replace(/^[ \t]*<!-- %HEAD% -->\n/m, () => (meta ? `    ${meta}\n` : ""))
    .replaceAll("%APP%", () => config.app)
    .replaceAll("%NAME%", () => config.name)
    .replaceAll("%FAILURE_NAME%", () => config.failureName)
    .replaceAll("%BASE%", () => config.base);
  const left = filled.match(/%[A-Z_]+%/);
  if (left) fail(`the bootstrap template has a placeholder nothing fills: ${left[0]}`);
  return filled;
}

const templatePath = values.from ?? resolve(values.template ?? resolve(PACKAGE, "bootstrap/index.html"));
const raw = readFileSync(templatePath, "utf8");
const template = values.from ? raw : fillNames(raw);
const slots = [...template.matchAll(SLOT)];
if (slots.length !== 1) fail(`${templatePath} must hold exactly one ${config.app}-releases slot`);

let variants;
if (values.from) {
  try {
    variants = JSON.parse(slots[0][2]).variants;
  } catch {
    fail(`${templatePath} has no readable release map to keep`);
  }
} else {
  variants = JSON.parse(
    readFileSync(values.variants ?? resolve(ROOT, "bootstrap/variants.json"), "utf8"),
  );
}

if (!variants || typeof variants !== "object" || Array.isArray(variants)) {
  fail("variants must be an object of name → sha");
}
for (const [name, sha] of Object.entries(variants)) {
  // Names and shas are inlined into a <script>; this is also what keeps them inert there.
  if (!NAME.test(name)) fail(`variant name "${name}" must match ${NAME}`);
  if (name === "control") fail('"control" is reserved for the live build');
  if (typeof sha !== "string" || !SHA.test(sha)) fail(`variant "${name}" needs a full commit sha`);
}

const releases = JSON.stringify({ control: values.control, variants });
let stamped = template.replace(SLOT, (_, open, _old, close) => `${open}${releases}${close}`);

if (values.boot) {
  const build = readFileSync(values.boot, "utf8");
  const one = (pattern, what) => {
    const found = build.match(pattern) ?? [];
    if (found.length !== 1) fail(`${values.boot} must hold exactly one ${what}`);
    return found[0];
  };
  const head = `${one(BOOT_CSS, "boot stylesheet")}\n    ${one(BOOT_JS, "boot script")}`;
  const body = one(BOOT_DIV, "#sb-boot before #root");
  if (!stamped.includes("<!-- __BOOT_HEAD__ -->") || !stamped.includes("<!-- __BOOT_BODY__ -->")) {
    fail(`${templatePath} has no boot markers to fill`);
  }
  // Functions, so a `$` in the markup is never read as a replacement pattern.
  stamped = stamped
    .replace("<!-- __BOOT_HEAD__ -->", () => head)
    .replace("<!-- __BOOT_BODY__ -->", () => body);
}

const out = resolve(values.out);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, stamped);
console.log(`stamp-bootstrap: wrote ${out} — ${releases}`);
