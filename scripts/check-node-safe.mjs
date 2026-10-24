// Post-build check: the package must be importable from plain Node.
//
// Apps call this package from modules that have nothing to do with a browser —
// DTO mappers, query clients, vitest suites running in the `node` environment.
// `react-markdown` reaches `decode-named-character-reference`, whose *browser*
// build decodes HTML entities with the DOM — `document.createElement('i')` at
// module scope — and a bundler building for the browser resolves that build. A
// static import of it makes Node throw "document is not defined" during import.
//
// The renderer is behind a dynamic import, which keeps that out of the import
// graph. One static `import ReactMarkdown from "react-markdown"` in any module
// the barrel re-exports puts it straight back, hence a check on every build.
//
// Deliberately NO DOM stub here. Stubbing `document` would make this pass while
// the real failure — an app's Node-side test — still failed.
//
// Run: node scripts/check-node-safe.mjs   (wired into `npm run build`)
try {
  const pkg = await import("../dist/index.js");

  // A representative import, so this fails if the entry point stops exporting
  // the things apps actually reach for.
  const expected = [
    "fetchWithRefresh",
    "getAccessToken",
    "OidcBoot",
    "UserGuideView",
  ];
  const missing = expected.filter((name) => typeof pkg[name] === "undefined");
  if (missing.length > 0) {
    console.error(`dist/index.js is missing expected exports: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log("package imports cleanly in Node ✓");
} catch (error) {
  console.error(
    "dist/index.js cannot be imported from Node:\n  " +
      String(error) +
      "\n\nSomething the barrel re-exports now touches the DOM while being imported.\n" +
      "Find the static import that pulls it in and put it behind a dynamic one,\n" +
      "the way components/guides/UserGuide.tsx loads SectionMarkdown.",
  );
  process.exit(1);
}
