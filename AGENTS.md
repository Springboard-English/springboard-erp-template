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

The `release: published` event triggers `.github/workflows/publish-gpr.yml`, which runs `npm ci` → `npm run build` → `npx tsc` → `npm publish` to GitHub Packages. Keep the tag name and `package.json` version in sync.

**Consumers are bumped by hand, deliberately.** The pipeline used to end by
dispatching a `template-published` event to `erp-crm`, `erp-hrm` and
`lms.springboard.vn`, where an `update-template.yml` opened a version-bump PR.
That step and all three receiving workflows were **deleted in 1.11.0**: the
dispatch had never worked in its life (`DISPATCH_TOKEN` was never set, so every
release since the chain was written failed on that step and left a red run on a
release that had in fact published cleanly), and we do not want a PR per
dependency bump anyway. In a consumer, take a new template with:

```bash
npm install @springboard-english/springboard-erp-template@latest
```

then commit `package.json` and `package-lock.json` with the change that needs it.

## Charts (`src/components/charts/`, since 1.10.0)

`TrendChart`, `FunnelBars`, `CategoryBars`, `DonutChart`, `StatTile` and
`ChartLegend`. Built for erp-hrm's recruitment overview; erp-crm's dashboard
chart is meant to move onto them next (see that repo's `AGENTS.md`).

**Dependency-free SVG and CSS, deliberately.** `vite.config.ts` externalises only
`react`, `react-dom` and `react-router-dom`, so anything added to `dependencies`
is bundled into `dist/index.js` and ships to lms, erp-crm and erp-hrm whether
they render a chart or not. A ~100 KB charting library for a handful of charts in
one tab is not that trade. Keep it that way.

**Colours are literal values in `palette.ts`, not CSS custom properties.** None of
the three consumers imports this package's stylesheet — each keeps its own copy
of the theme CSS — so a `--chart-*` token defined here would simply not exist in
erp-hrm. `useChartPalette()` resolves light/dark by reading the `dark` class and
`data-theme` off `<html>` (what `AppTheme` writes) through a `MutationObserver`,
so it works with or without that provider.

**The palette was validated, not chosen by eye**, against this theme's own card
surfaces — light `#ffffff`, dark `#181b1f`. Two results are load-bearing:

- The **categorical slot order is the colour-vision-safety mechanism.** Reordering
  it breaks adjacent-pair separation. A 7th series folds into "Other"; it never
  gets a generated hue.
- The **outcome stack is accepted → in progress → declined.** Green beside red
  fails outright (ΔE 4.1 deutan). Putting blue between them takes the worst
  adjacent pair to ΔE 23.8 light / 25.7 dark. Anything that reorders those three
  segments silently reintroduces the failure, so `TrendChart`'s `series` prop and
  `FunnelBars`' internal order both assume it.

Three light-mode slots sit below 3:1 against white. That is allowed only because
every component here also prints its values as text — do not add one that draws
bare colour with no labels.

Re-run the validator if you change a hex.

**`ScoreDistributionChart` (since 1.16.0) takes its colour from the caller**, and
is the one chart here that does. Leap consumes it too, and Leap's design system
forbids raw hex in components — so `color` accepts any CSS colour string and Leap
passes `var(--rose-500)`. Two consequences:

- **The fill is set through the `style` prop, never the `fill` attribute.**
  `var()` does not resolve in an SVG presentation attribute, so `fill={color}` —
  which is what `TrendChart` does with its own palette hexes — would render
  nothing for a token-passing consumer. The comment at that line says so; do not
  "simplify" it back.
- **Its bins come from the API**, not from scores binned in the browser. The
  tooltip reports the same percentile the rest of the platform reports, and
  computing it a second time client-side is how two screens end up disagreeing
  about where a student stands. `GET /v2/tests/{id}/summary` and
  `GET /v2/live-sessions/{id}/results` both return the shape it takes.

It follows the "no bare colour" rule the same way the others do: each column
prints its count, and the highlighted-bin variant ships a legend.
