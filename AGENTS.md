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
