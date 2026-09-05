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

## Re-skinning a primitive (`configureUIPreset`, since 2.0.0)

**Do not fork a primitive to restyle it.** Every fork in this suite drifted, and
each one lost a fix rather than gaining one: Leap's forked `Input` had dropped
the 16px mobile rule (so every field zoomed on iOS) and its forked `Dialog` had
dropped `max-h-[calc(100vh-1rem)]` (so a tall dialog overflowed with no way to
reach the buttons). Both came back for free on adopting the shared versions.

Register a `UIPreset` at boot instead, next to `configureApi`:

```ts
configureApi({ baseUrl: API_CONFIG.baseURL });
configureUIPreset(LEAP_UI_PRESET);
```

It is module config, not a provider, because a preset is decided once and never
changes — nothing needs to re-render when it is set, and the primitives stay
plain functions of their props. Contrast `AppTheme`, which *is* a provider
because a user toggles colour mode at runtime and subscribers must re-render.

A slot is a class string, or a function when classes vary by variant/size. The
primitive merges three layers in order — **built-in variant classes → preset →
the caller's `className`** — and because `cn` is tailwind-merge, each later
layer wins only on the utilities it actually conflicts with (`rounded-full`
replaces `rounded-md`; `ease-bounce` just composes). The component's API is
untouched: same props, same refs, same `asChild`, no wrapper.

Slots today: `button`, `input`, `textarea`, `card`, `dialogContent`,
`sheetContent` (receives the open edge as `variant`), `tableHead`, `tableRow`.
Add a slot rather than a fork when a new one is needed. With no preset
registered, `uiPresetClass` returns `undefined` and `cn` drops it, so apps
without one are unaffected.

Put **only** what differs in a preset. `leap.springboard.vn/src/theme/ui-preset.ts`
is the worked example, including a note on what it deliberately omits and why.

## Mobile (the contract, since 2.0.0)

Every app in the suite is one shell and one set of primitives. These are the
rules that keep it that way; a per-app copy of any of them is the bug.

- **The breakpoint is `md` (768px).** That is the line the shell already uses —
  the sidebar is `md:block`, the header is `md:flex`, the bottom bar is
  `md:hidden`. Do not introduce a second one. `useIsMobile()` is its JS
  complement (`max-width: 767px`) and agrees with it by construction.
- **Prefer CSS to JS for showing and hiding.** `md:hidden` / `hidden md:block`
  need no JS and do not flash on first paint. Reach for `useIsMobile()` only
  when the decision is which component to *mount*, or when a layout mode has to
  be suppressed outright (see `DetailLayout`'s floating panel).
- **44px is the control size.** `Button` `size="default"`, `Input`,
  `SearchableSelect` and `TagInput` are all `h-11`. The `sm`/`xs` rungs exist
  for dense desktop chrome — toolbars, inline row actions — and are not the size
  to reach for on anything a finger uses.
- **16px is the minimum font size for a text input.** `Input`/`Textarea` are
  `text-base md:text-sm` for exactly this reason: iOS Safari auto-zooms any
  focused field under 16px, and the zoom is hard to escape inside a scroll-locked
  layout. Never override the mobile step down.
- **A table needs a card fallback.** Pair `SimpleDataTable`
  (`hidden md:block`) with `MobileCardList` (`md:hidden`). A table left to
  scroll horizontally is usable but poor; a table inside a *detail tab* is the
  case most often missed.
- **Nothing fixed to the bottom without a safe-area inset.** Use
  `env(safe-area-inset-bottom)`, as `MobileBottomBar` and the mobile FAB do, or
  the control lands under the iOS home indicator. Every `index.html` carries
  `viewport-fit=cover`, which is what makes `env()` resolve at all — do not drop
  it.
- **Use `dvh`, not `vh`.** `100vh` overflows behind mobile browser chrome.
- **Anything an app puts in `sidebarFooter` or `headerContent` is desktop-only.**
  Both are gated above `md`. `DashboardLayout` surfaces them in `MobileMenuSheet`
  by default, and `mobileMenu` replaces that body — an app that overrides it owns
  putting account and sign-out somewhere reachable.
- **Nav items flagged `hideOnMobile` are not hidden, they are moved.** They drop
  off the bottom bar and appear in the menu sheet's overflow grid.
- **Transient status goes through `GlobalStatusProvider`, not a second toast
  library.** `useGlobalStatus()` to set it, `GlobalStatusQueryBridge` to feed
  TanStack Query errors in. `DashboardLayout` renders it below `md` itself,
  because apps put it in the desktop-only header and it was invisible on a
  phone. Use `useGlobalStatusOptional()` in chrome that must render with or
  without a provider. `StatusBanner` is a different thing — an in-flow banner
  for a form or a page, not app-wide feedback.

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

## Changelog (`src/components/changelog/`, since 1.20.0)

`BuildTag` is the whole feature's front door. Given `changelog` it turns the
commit sha it already printed into a button that opens `ChangelogDialog`; given
`note` it shows a `WhatsNewNote` above itself once. Consumers pass both and
nothing else:

```tsx
<BuildTag commit={__COMMIT_HASH__} hidden={collapsed}
          changelog={CHANGELOG} note={whatsNew} noteStorageKey="springboard:lms:whats-new" />
```

**The history is a build artifact, not an API.** Each app's
`scripts/generate-changelog.mjs` runs `git log` and writes
`src/content/changelog.ts`, which is committed and imported into the bundle. So
the history a user reads is exactly the history of the bundle they are running,
there is nothing to fetch, and it works with the API down. Nothing here calls
the backend, and it must stay that way — the apps have no version number and no
release table to ask.

**Author names are not carried.** The generator emits sha, date and subject
only. Teachers see this panel.

**Kinds are told apart by weight, not hue** — solid primary, outlined primary,
neutral, muted. Consumers do not import this package's stylesheet (each keeps
its own theme copy) and Leap forbids raw colour in components, so a literal
`emerald-500` here would be both off-brand and against that rule. The label
carries the meaning; the colour only ranks it.

**A commit subject with no `type(scope):` prefix is normal**, not a parse
failure — Leap's history is written as plain sentences. `parseCommitSubject`
files those as `improvement`. `chore`/`ci`/`docs`/`deps` are `internal` and the
dialog folds them away behind a toggle.

**The what's-new note is keyed by its own content**, hashed — there is no
version to key it on. Rewriting `whats-new.md` shows it once to everyone;
fixing a typo in it shows it again. It is dismissed by *any* click, does not
take focus when it appears, and stays anchored (via an `sr-only` element) even
when the tag itself is hidden by a collapsed sidebar.

`WhatsNewNote` renders markdown through the guides' `SectionMarkdown`, so it
inherits the same lazy-import boundary — keep it that way, or
`scripts/check-node-safe.mjs` will fail the build.
