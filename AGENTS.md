# AGENTS.md

React + TypeScript component library (`@springboard-english/springboard-erp-template`,
Vite library mode + Tailwind v4) shared by lms, leap, erp-hrm, erp-crm, erp-ops and
accounts. Short working rules. How each feature behaves is in `docs/features.md`;
releasing is in `docs/releasing.md`.

## Layout

- `src/exports.ts` is the public surface and build entry. A component not
  re-exported there is invisible to consumers.
- `src/views/` holds full pages; `src/components/` the shared components (`ui/`
  primitives, `layout/` detail scaffolds, `charts/`, `widgets/`, `changelog/`, …).
- `src/context/`, `src/api_calls/`, `src/auth/`, `src/config/`, `src/utils/`,
  `src/theme/`, `src/i18n/`. `public/` ships as files in `dist/` (favicon,
  `push-sw.js`, `vite-boot.mjs`, boot assets).
- Only `react`, `react-dom` and `react-router-dom` are external; every other
  dependency is bundled into every app.

## Do

- **Reuse first.** Alter a shared component rather than patching it per view or
  writing a view-specific one. A new component, hook or view mode needs a reason
  the existing one can't serve.
- **Keep the package domain-free.** It holds UI, the shell, theming, i18n, its
  own sign-in and generic utilities. An app's resource calls, endpoint map,
  routes and domain types stay in the app. Test: would a fifth app with a
  different domain want this?
- **Code shape.** A function whose return type nests two levels gets a named
  `interface` or `type`. The rule is for return types only; arguments and local
  values may stay bare. Every function and component has a doc comment of 100
  words or fewer saying what it does. Reasoning goes in a comment on the line it
  explains. No dates or history in code; those go in the commit message.
- **Re-skin with a `UIPreset`, never a fork.** Register it with
  `configureUIPreset` at boot; add a slot when a new one is needed. Put only
  what differs in a preset.
- **Follow the mobile contract.** One breakpoint, `md`. CSS before
  `useIsMobile()`. `Button` sizes already clamp to 44px below `md`, so never
  patch a height at a call site. Inputs stay 16px on mobile. Every table has a
  `MobileCardList` fallback. Bottom-fixed UI uses the safe-area inset; use `dvh`,
  not `vh`. Transient status goes through `GlobalStatusProvider`.
- **Release in three steps:** bump `version` and push a matching `v<x.y.z>` tag,
  publish a GitHub Release for it (that fires the publish workflow), then bump
  the lockfile in each consumer with
  `npm install @springboard-english/springboard-erp-template@latest`.
- **Verify before calling it done:** `npm run build` (also runs the node-safe and
  d.ts checks), `npx tsc`, `npm test`, and the change in a consumer app running
  against the build.

## Don't

- Don't `npm publish` by hand, and don't expect a pushed tag alone to publish.
- Don't add a runtime dependency lightly; it ships to every app. Charts stay
  dependency-free SVG.
- Don't branch on an error's message text. A status check reads
  `ApiError.status`.
- Don't put a control only in `sidebarFooter` or `headerContent`; both are
  desktop-only, and an app that overrides `mobileMenu` owns the mobile copy.
- Don't call the backend from the changelog, or add a `fetch` handler to the
  push service worker.
- Don't rename a widget `id`; saved layouts point at it.
- Don't verify a UI change in a repro harness page; use a real app.

## Memory

- `main` deploys nothing. Only a published GitHub Release publishes to GitHub
  Packages; consumers move only when their lockfile is bumped.
- A feature branch with no PR yet is kept as one amended commit and pushed with
  `--force-with-lease`. Once a PR is open, add new commits and stop amending or
  force-pushing. Never force-push `main` or `production`.
- Consumers don't import this package's stylesheet; chart colours are literal
  hexes in `palette.ts`, and their slot order is the colour-vision safety.
- Consumers must `@source` the whole `dist/` directory; `dist/index.js` is a
  re-export stub.
- A `UIPreset` height replaces the 44px mobile clamp; keep the `md:` split.
- Occasion dates live in `utils/occasion.ts`, `boot.js` and accounts'
  `guilloche.js`; change all three.
- The logo also lives in the API as rasters; change them together.
