// `springboardBoot()`: a Vite plugin that puts the boot screen (boot.css,
// boot.js) into an app's index.html. It is a separate file, not part of the
// package's main entry, because it runs in Node inside the app's vite.config.
//
//   import { springboardBoot } from "@springboard-english/springboard-erp-template/vite";
//   plugins: [tailwindcss(), react(), springboardBoot({ label: "HRM" })],
//
// The three files are emitted under content-hashed names in assets/ (so they
// can be cached forever like the rest of the build) and linked as files rather
// than inlined, so a strict CSP needs no exception. In dev they are served from
// this package directly.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const FILES = [
  { name: "boot.css", type: "text/css; charset=utf-8" },
  { name: "boot.js", type: "text/javascript; charset=utf-8" },
  { name: "sitemark.svg", type: "image/svg+xml" },
];

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function markup(label, sitemark) {
  const mark = `<img src="${sitemark}" width="150" alt="">`;
  const eyebrow = label ? `<p class="sbb-eyebrow">${escapeHtml(label)}</p>` : "";
  const skeleton = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `<div class="sbb-b${n}"></div>`).join("");
  return (
    '<div class="sbb-guilloche"></div>' +
    `<div class="sbb-panel">${mark}<div class="sbb-hero">${eyebrow}` +
    '<p class="sbb-title">Springboard<br><span>English</span></p></div></div>' +
    '<div class="sbb-column">' +
    `<div class="sbb-mark-small">${mark}</div>` +
    `<div class="sbb-main"><div class="sbb-card"><div class="sbb-skeleton">${skeleton}</div></div>` +
    '<div class="sbb-guide"></div></div></div>'
  );
}

/**
 * @param {{ label?: string }} [options] `label` is the small caps line above
 *   "Springboard English" in the left panel, e.g. "HRM" or "Learning Portal".
 */
export function springboardBoot(options = {}) {
  const files = FILES.map((file) => {
    const source = readFileSync(new URL(file.name, import.meta.url));
    const hash = createHash("sha256").update(source).digest("hex").slice(0, 8);
    const [stem, ext] = file.name.split(".");
    return { ...file, source, fileName: `assets/sb-${stem}-${hash}.${ext}` };
  });
  const byName = Object.fromEntries(files.map((file) => [file.name, file]));
  let base = "/";

  return {
    name: "springboard-boot",
    configResolved(config) {
      base = config.base;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split("?")[0];
        const file = files.find((f) => path === `${base}${f.fileName}`);
        if (!file) return next();
        res.setHeader("Content-Type", file.type);
        res.end(file.source);
      });
    },
    generateBundle() {
      for (const file of files) {
        this.emitFile({ type: "asset", fileName: file.fileName, source: file.source });
      }
    },
    transformIndexHtml: {
      // After Vite's own processing, which would otherwise try to bundle the
      // script and rewrite these already-final URLs.
      order: "post",
      handler() {
        const url = (name) => `${base}${byName[name].fileName}`;
        return [
          { tag: "link", attrs: { rel: "stylesheet", href: url("boot.css") }, injectTo: "head" },
          { tag: "script", attrs: { src: url("boot.js") }, injectTo: "head" },
          {
            tag: "div",
            attrs: { id: "sb-boot", role: "status", "aria-label": "Loading" },
            children: markup(options.label, url("sitemark.svg")),
            injectTo: "body-prepend",
          },
        ];
      },
    },
  };
}
