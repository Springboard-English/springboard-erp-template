# Springboard ERP Template

A React + TypeScript component library published as `@springboard-english/springboard-erp-template`, providing shared UI, auth, and data-layer building blocks for Springboard's ERP-style applications (management/detail views, forms, notifications, i18n, theming).

## Stack

- React 19 + TypeScript, built with Vite (library mode) and emitted as an ES module (`dist/index.js` + `dist/exports.d.ts`)
- Tailwind CSS v4 for styling; shadcn/radix-ui primitives for base components
- TanStack Query for data fetching/caching
- react-i18next for i18n (English/Vietnamese messages bundled)
- react-router-dom, jose (JWT), dayjs

Consuming apps import components/hooks from the package entry point and the stylesheet from `@springboard-english/springboard-erp-template/style.css`.

## Repo layout

- `src/exports.ts` — the public API surface; every symbol a consumer can import must be re-exported here. This is the build entry point (`vite.config.ts` `build.lib.entry`).
- `src/index.tsx` — standalone dev entry (`npm run dev`) that mounts `SignIn` for local preview; not part of the published package.
- `src/views/` — full-page views (`SignIn`, `ResetPassword`) exported directly.
- `src/components/` — top-level shared components (e.g. `PatchRecordDialog`, `SimpleDataTable`, `MobileCardList`, `PendingChangesBar`, `StatusBanner`, `ForgotPassword`).
  - `components/ui/` — low-level shadcn/radix-based primitives (button, card, dialog, input, table, etc.)
  - `components/layout/` — `DetailLayout` — the detail-view scaffold (header, summary grid, tabs, action panel). Use `ManagementClassDetails` (in the consuming app) as the reference shape/interaction pattern for any new detail view.
  - `components/management/` — advanced filters panel/toggle for list/management views.
  - `components/dialogs/`, `components/question-builder/` — form dialog and dynamic question-builder building blocks.
  - `components/notifications/`, `components/guides/` — notification UI and in-app user guides.
- `src/context/` — React contexts/providers: `AuthContext`, `I18nContext`, `NotificationContext`, `PendingChangesContext`, `MobileFABContext`.
- `src/api_calls/` — HTTP calls (`fetchWithRefresh` handles token refresh), `UserData`, `notifications`.
- `src/auth/` — token/session storage helpers.
- `src/config/api.ts` — `API_CONFIG` / `configureApi()`; consuming apps set the base URL at startup.
- `src/utils/` — formatters, URL query-state helpers, permissions/scopes, conflict-error handling, detail-view-mode persistence, query cache invalidation.
- `src/theme/` — `AppTheme`, color-mode and locale selectors.
- `src/i18n/messages.ts` — bundled English/Vietnamese message dictionaries.

## Scripts

- `npm run dev` — Vite dev server (previews `SignIn` via `src/index.tsx`)
- `npm run build` — Vite library build + `tsc` declaration emit to `dist/`
- `npm run lint` — ESLint

## Important notes

- **`src/exports.ts` is the contract.** A component/hook not exported there is invisible to consumers, even if implemented.
- Only `react`, `react-dom`, and `react-router-dom` are bundler-externals (peer deps) — everything else is bundled into `dist`.
- All views live under `src/views` and should follow the `ManagementClassDetails` reference shape (see `AGENTS.md`).
- No test suite currently exists; verification is `npm run build` + `npx tsc` (no emit) per `AGENTS.md`.
