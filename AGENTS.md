# AGENTS.md

React + TypeScript component library (`@springboard-english/springboard-erp-template`) providing shared UI, auth, and data building blocks for Springboard's ERP apps. Built with Vite (library mode) + Tailwind v4; see `README.md` for full stack/repo details.

## Layout

- `src/exports.ts` — public API surface and build entry; anything consumers import must be re-exported here.
- `src/views/` — full pages. `src/components/` — shared components (`ui/` primitives, `layout/` detail scaffolds, `management/`, `dialogs/`, `question-builder/`, `notifications/`, `guides/`).
- `src/context/`, `src/api_calls/`, `src/auth/`, `src/config/`, `src/utils/`, `src/theme/`, `src/i18n/`.

## Rules

- Reuse existing components before writing view-specific solutions; alter shared components rather than patching per view.
- Solve shared mobile behavior in shared components, not per-view patches. Avoid horizontal scroll for core detail/form content when a stacked mobile layout works.
- Be explicit; ask clarifying questions rather than guessing.
- After any implementation, verify with both `npm run build` and `npx tsc` (no emit).
- Remember: a component not exported from `src/exports.ts` is invisible to consumers.

## Releasing

Releases are automated — **do not `npm publish` by hand.** The flow is driven by git tags:

1. Bump `version` in `package.json` (the published version is read from here) and commit it.
2. Create and push a matching tag, e.g. `git tag v1.8.0 && git push origin v1.8.0`.
3. Publish a GitHub Release for that tag (e.g. `gh release create v1.8.0 --generate-notes`, or the Releases UI). Publishing the release is what fires the pipeline — a pushed tag on its own does not.

The `release: published` event triggers `.github/workflows/publish-gpr.yml`, which runs `npm ci` → `npm run build` → `npx tsc` → `npm publish` to GitHub Packages, then dispatches a `template-published` event (with the release tag as the version) to the consumer repos (`erp-crm`, `erp-hrm`, `lms.springboard.vn`) so they can bump their dependency. Keep the tag name and `package.json` version in sync.
