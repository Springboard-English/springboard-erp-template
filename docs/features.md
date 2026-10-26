# Features

How the template's features behave and why they were built that way. The
working rules are in `AGENTS.md`; releasing is in `docs/releasing.md`.

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
- **Two control heights, and the scale enforces them — you do not.** Every
  control is 44px on a phone or any touch screen (iPads included, through
  `pointer-coarse`) and 36px on a desktop with a mouse (`md:pointer-fine:`).
  Every `Button` size shares those heights; `sm` and `xs` change only padding and
  type, and `lg` is the one taller rung. `Input`, `SearchableSelect`,
  `TagFilter` and `TagInput` match. **Never patch a height at a call site.**
- **The floor is a minimum, so nothing can undercut it.** `Button` carries
  `buttonTarget` (`min-h-11 min-w-11 md:pointer-fine:min-h-9 md:pointer-fine:min-w-9`);
  a caller's `h-8` or a preset's `h-9` cannot shrink it, because `min-height`
  beats `height`. The only way under it is an explicit `min-h-0 min-w-0`, kept
  for inline icons and text links inside a sentence, which take
  `touchHitArea` instead.
- **Plain `<button>`s use the exported helpers** from `lib/touchTarget.ts`:
  `buttonTarget` for anything drawn as a button (pill, segmented toggle, pager
  arrow), `touchTargetHeight` for full-width rows and menu items (44px on touch
  only), `fieldHeight` for a field-like trigger, and `touchHitArea` for a small
  icon that must keep its look (an invisible tap area of at least 44px on touch;
  the element must be `relative` or `absolute` and not use `after:`).
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

## Widget home (`src/components/widgets/`, since 4.10.0)

A phone-style home page: `WidgetBoard` draws the grid, the gallery, edit mode
(remove, resize, drag or menu reorder, stacks) and per-widget error boundaries.
An app passes a `registry` of `WidgetDefinition`s and a `defaults(user)`.

- **The split follows the rule above.** The template owns everything generic,
  including writing the user's own `info` (`patchCurrentUserInfo`). Each
  widget's `render` belongs to the app and fetches its own data — no resource
  call lives here.
- **The layout is stored in `user.info[storageKey]`, not localStorage.**
  `logout()` runs `localStorage.clear()`, and a home should follow the user to
  another device. A user who never customises stores nothing and keeps getting
  the app's current defaults; saving a layout equal to the defaults stores `null`.
- **Order, not coordinates.** The layout is a list packed with
  `grid-flow-row-dense`, so one saved layout fits four columns and two.
- **Fixed rows, snapped heights.** Rows are a fixed 8.5rem, unlimited in
  number. Each frame measures its header and content and spans the whole rows
  they need (`widgetRowSpan`, at least two for L), so edges line up across
  columns and nothing is clipped. A widget keeps itself short by paging.
- **`normaliseLayout` repairs, it does not reject.** Unknown widgets, lost
  scopes and unsupported sizes are dropped or reset one at a time. Never rename
  a widget `id`: it is what users' saved layouts point at.
- **dnd-kit is bundled and lazy.** It loads only in edit mode
  (`WidgetSortableGrid`). It is not `external` because no app shares its context.
- **Consumers must `@source` the whole `dist/` directory.** `dist/index.js` is
  a re-export stub, and the classes live in the chunks next to it.

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

## The logo (`SitemarkIcon`, `LogoIcon`, `favicon.svg`, since 4.13.0)

This package holds the only copy of the logo the five apps use. An app imports
`SitemarkIcon` (the horizontal badge) or `LogoIcon` (the square lockup) rather
than keeping its own image, so a logo change is one release here and a version
bump everywhere else.

- **The favicon ships as `dist/favicon.svg`** (from `public/`). An app links it
  from its `index.html` as
  `/node_modules/@springboard-english/springboard-erp-template/dist/favicon.svg`.
  Vite copies that file into the build under a hashed name and rewrites the
  link. The package name on its own (`@springboard-english/.../favicon.svg`) is
  left untouched by Vite and 404s in production.
- **The API still keeps its own raster logo** (`assets/logo.jpg` for the PDF
  letterhead, `assets/sitemark.png` for the sign-in page): it is Python and
  cannot read this package. Change them together.
- Emails keep a PNG on the LMS bucket, because email clients do not render SVG.
- `sitemark.svg` lives in `public/`, not `src/assets/`, because the boot screen
  ships it as a file too; `SitemarkIcon` still inlines it.

## The boot screen (`springboardBoot()`, since 4.14.0)

The hop from the accounts site's consent card into an app reads as one scene:
the app's first paint is the same backdrop with the same card in the same
place, and `DashboardLayout` lifts it away as the side nav slides in.

- **An app opts in with one line in `vite.config`:**
  `springboardBoot({ label: "HRM" })` from
  `@springboard-english/springboard-erp-template/vite` (`public/vite-boot.mjs`,
  plain Node, not part of the main entry). It writes `#sb-boot` into
  index.html and links `boot.css` / `boot.js` as hashed files, never inline, so
  a strict CSP needs no exception.
- **Who takes it down:** `DashboardLayout` on mount (animated, once);
  `OidcCallback` holds it while it exchanges the code and drops it on an error;
  `boot.js` fades it ~1.5s after the app renders anything while no one holds it,
  for pages that are neither. `LazyViewFallback` holds it while mounted, so a
  lazy chunk or an auth check that outlasts the failsafe never fades the card
  onto a spinner; give it `fullScreen` where it stands in for a whole page.
  `holdBootScreen` / `dismissBootScreen` are exported for an app page that
  needs the same.
- **No "Signing you in…" text.** Under the boot screen `OidcCallback` renders
  nothing; without one it shows the full-screen `LazyViewFallback`, with
  `pendingLabel` as its screen-reader label.
- **Keep it in step with accounts.springboard.vn**: `boot.css` copies its
  CardShell geometry and the template's colour tokens. Accounts loads the
  boot screen too: `boot.js` sets the guilloche variables its CardShell
  reads, and CardShell takes the screen down as it mounts on the same pixels.
  Measure both cards after changing either: they must sit on the same pixels.

## Occasions (since 4.17.0)

20/10 (Women's Day) and 20/11 (Teachers' Day), whole day in ICT, redraw the
backgrounds: `boot.js` swaps the guilloche's message, wave shape and colours
(`data-sb-occasion` on `<html>`, styled in `boot.css`), and `DashboardLayout`
draws `OccasionBackdrop` behind every page (flowers; trees). The dates live in
`utils/occasion.ts` and again in `boot.js`, which runs before the app (and
draws accounts' sign-in backdrop too); change both.
`?sb-occasion=womens-day` previews one.

## Schema forms (`src/components/forms/`, since 4.20.0)

A form described as JSON (`FormSchema`: sections and fields) instead of a
dialog's hand-written state. `useSchemaForm(schema, { initial, lookups })` holds
the values; `SchemaFields` renders sections as grids (one column on a phone);
`SchemaFormDialog` adds tabs from `section.tab`, the caller's `extraTabs`, a ✓
per complete tab and the "Still needed" list, and calls `onSubmit` only when
nothing required is missing.

- **Thirteen field types:** text, longText, number, money, date, datetime,
  month, checkbox, choice, lookup, tags, list, formula. A `list` is a grid of
  rows on desktop and a card per row on a phone, with optional `totals`.
- **Formulas and `showIf` are expressions** (`expression.ts`), parsed here and
  never `eval`ed, so a schema stored on a row stays data: arithmetic,
  comparisons, `if`, `sum(list.column)`, `round`, `min`, `max`, `words`
  (Vietnamese amount in words). Formulas re-run until nothing changes, so
  order in the schema does not matter.
- **`lookup` sources come from the app** (`lookups={{ employee: { load, get } }}`):
  the package stays domain-free. `fills` copies keys of the record `get` returns
  into other fields.
- **`output("typed")`** keeps numbers for an API body; **`output("print")`**
  formats them as a printed document shows them (`1.200.000`).
- `parseFormSchema` reads untrusted JSON (a row's `info.form`), dropping what it
  does not understand; `inferJinjaSchema` reads a form off a Jinja page's names.
- `FormTableDialog` is unchanged; dialogs move over one at a time.

## Push notifications (`PushNotificationsToggle`, since 4.9.0)

`<PushNotificationsToggle app="lms" serviceWorkerUrl="/sw.js" />` in an app's
account panel turns Web Push on for that browser. The API decides what is sent
(the `web_push` channel in `springboard_cloud-api`); this package only
registers, removes and tests the device (`api_calls/pushNotifications.ts`,
`hooks/usePushNotifications.ts`).

- **It renders nothing where push cannot be offered**: a server without VAPID
  keys (the routes answer 503) or a browser with no Push API that installing
  would not fix. On an iPhone or iPad in Safari it shows the two Add to Home
  Screen steps instead, because iOS only exposes the Push API to a Home Screen
  app. Mount it unconditionally.
- **The service worker ships as `dist/push-sw.js`** (from `public/`, exported as
  `@springboard-english/springboard-erp-template/push-sw.js`). Each app copies
  it into its build output as `sw.js` and serves it `Cache-Control: no-cache` —
  never with the immutable header its hashed assets get, or a worker can never
  be updated.
- **The worker has no `fetch` handler and caches nothing**, on purpose: each
  app's release is its `index.html`, and a worker that cached it would keep
  serving an old release after a deploy or a rollback. Do not add one.
- Its notification icon is `icons/icon-192.png` relative to the worker's scope,
  so each app ships that file beside its manifest.
- **On mount the hook re-registers an existing subscription.** Registration is
  idempotent on the endpoint, and re-sending repairs a server row lost after a
  410 and moves a shared device to whoever is signed in now.
