# Exports and their contracts

What an app can import, what each piece needs around it, and the rules that
break quietly when they're missed. `src/exports.ts` is the source of truth. For
how a feature behaves and why, follow the links into `docs/features.md`.

## TL;DR: the contracts that bite

1. **`useServerList` turns off its paged query on a phone.** Below `md`, only
   `list.mobile` fetches, so `list.rows` is `[]` there. Render a
   `MobileCardList` from `list.mobile.*`, or pass `mobile: false` when the list
   has no phone surface (a table in a detail panel). If you skip both, the list
   is blank on phones.
2. **Every table has a phone fallback.** Pair `SimpleDataTable` (`hidden md:block`)
   with `MobileCardList` (`md:hidden`). A table inside a detail tab is the one
   most often missed.
3. **The `MobileFAB` is for Create, and only for Create.** `useMobileFAB(onClick, label)`
   draws the round + button on a phone. The same action in a `PageActionBar`
   gets `desktopOnly: true` so it doesn't show twice. Nothing else goes in the
   FAB.
4. **Report a problem is never wired by hand.** `DashboardLayout`'s
   `reportProblem={{ app }}` draws the desktop header icon, the phone-menu row
   and the refresh nudge. The phone-menu row stays even when an app passes
   `mobileMenu`. Don't put it in `mobileMenu`, the FAB or `headerContent`. With
   `entryPoints: false` the shell draws none of them, and the app opens the form
   itself with `useReportProblem().open`.
5. **`headerContent` and the account panel are desktop-only.** When `mobileMenu`
   is omitted, the phone sheet shows `headerContent`. An app that passes
   `mobileMenu` owns the phone copy of whatever it puts there. `null` means
   "nothing extra".
6. **Pages never scroll on desktop.** A list page is `<PageFrame>` with
   `PageHeader` first and a `fill` table. A record page is `DetailView`, which
   draws its own frame. Don't hand-write a `100dvh` calc.
7. **One pending bar per window.** Forms register with
   `usePendingChangesSource` (or spread `useDetailEditor().pendingBarProps`).
   Ticked-row actions go on the same bar through `actions`. Dialogs save with
   their own button and never stage onto the bar.
8. **Header buttons go in `PageActionBar`.** Pass a list of `PageAction`s; the
   bar folds what doesn't fit into "⋯", and destructive actions always go
   there. Search and filters go in `leading`. A dialog the bar opens is
   controlled (`open`/`onOpenChange`), not a self-triggering one.
9. **Filters apply instantly.** Call `list.resetPage()` from every filter's
   `onChange`. There's no Apply button or draft state.
10. **Errors are typed.** Branch on `ApiError.status`, never on the message
    text. `errorMessage(err, fallback)` gives the text to show.
11. **Five hooks throw outside their provider:** `useAuth`, `useNotifications`,
    `useGlobalStatus`, `usePendingChanges` and `useLiveStudent`. The live-event
    hooks, `useGlobalStatusOptional`, `useMobileFAB` and `useReportProblem` do
    nothing outside theirs.
12. **Don't patch control heights.** `Button` enforces 44px on touch and 36px
    with a mouse. Use the `lib/touchTarget` helpers on a plain `<button>`.
    Inputs stay 16px on phones.

## Entry points

| Import | What it is |
| --- | --- |
| `@springboard-english/springboard-erp-template` | Everything below. React, the shell, auth. |
| `…/core` | Code only: no React, DOM or auth. Transport errors, formatters, cursor paging, CSV, scopes, `runBatch`, `cn`. The build fails if a DOM import gets in. |
| `…/exercise` (+ `…/exercise.css`) | The exercise renderer, runner and live runner (`src/exercise/index.ts`). Used by Leap and app.springboard.vn. |
| `…/feedback` | Formbricks feedback surveys. Opt-in: the root entry never imports it. |
| `…/vite` | `springboardBoot()`, the boot-screen Vite plugin. |
| `…/test-setup` | Vitest setup for consumers. |
| `…/tokens.css`, `…/push-sw.js`, `…/favicon.svg` | Shipped files. Consumers `@source` the whole `dist/` for Tailwind. |
| bins | `sb-register-oidc-scopes`, `sb-stamp-bootstrap`, `sb-rollback`, `sb-generate-changelog`. |

## The provider stack

The order erp-hrm uses, which every app follows:

```tsx
<QueryClientProvider>          // TanStack; several hooks need it
  <I18nProvider>               // useI18n; template strings in en/vi
    <OidcBoot>                 // ABOVE AuthProvider; route OIDC_CONFIG.callbackRoute → <OidcCallback>
      <AuthProvider>           // useAuth (throws without it)
        <LiveEventsProvider>   // optional; useLiveTopic/useLiveEvent no-op without it
          <GlobalStatusProvider>      // useGlobalStatus (throws); add <GlobalStatusQueryBridge/>
            <NotificationProvider>    // useNotifications, NotificationBell (throws)
              <MobileFABProvider>
                <PendingChangesProvider>   // usePendingChanges (throws)
                  <DashboardLayout … />    // brings AppTheme, PullToRefresh, ReportProblem, ConfirmDialogHost
                  <GlobalPendingChangesBar />
                </PendingChangesProvider>
                <MobileFloatingActionButton />  // the app renders it; the layout does not
```

Configure once at boot, before rendering: `configureApi`, `configureOidc`,
`configureAppUrls`, `configureUIPreset` and `configureSessionRenewal`. They are
module config, not providers.

## Shell

| Export | Contract |
| --- | --- |
| `DashboardLayout` | Props: `navItems`, `activeTab`, `onTabSelect`, `brand`, `account`, `headerContent` (desktop only), `mobileMenu` (phone sheet body: omitted shows `headerContent`, `null` shows nothing), `reportProblem`, `navMode` (`sidebar` or `menu`), `home`, `pullToRefresh` (on by default), `sidebarContent`, `classNames`. Nav items take an icon *component* and `hideOnMobile` (moves the item to the sheet, doesn't hide it). Restyle with `classNames`, never with markup. It draws the desktop Refresh, the phone status bar and `ConfirmDialogHost`. [features](features.md#mobile-the-contract-since-200) |
| `AccountPanel`, `AccountExtras`, `ManageAccountLink` | Drawn by the layout from `account`. Desktop rail only, plus the build tag and push toggle in the sheet. |
| `MobileMenuSheet` | The layout's phone sheet. Use it directly only in a shell that isn't `DashboardLayout`. |
| `MobileFABProvider`, `useMobileFAB(onClick \| null, label?)`, `MobileFloatingActionButton` | Create only. Pass `null` to clear it. It clears itself on unmount. Sits above the bottom bar and the safe-area inset. |
| `PageHeader`, `PageActionBar`, `PageAction` | `PageAction`: `id`, `label`, `icon`, `onSelect` or `to`/`state`, `variant`, `disabled`, `overflow`, `desktopOnly`, `data`. [features](features.md#page-header-buttons-pageactionbar-since-615) |
| `PageFrame`, `pageFrameClassName` | `variant="list"` (the default) or `detail`. `scroll="content"` lets the frame scroll when the page can't split into filling regions. Desktop only; phone pages scroll. [features](features.md#pages-fill-the-window-pageframe-the-detailview-frame) |
| `GlobalStatusProvider`, `useGlobalStatus`, `useGlobalStatusOptional`, `GlobalStatusQueryBridge`, `GlobalStatusRetry` | Transient app-wide status. Don't add a second toast library. `StatusBanner` is the in-page banner for a form, which is a different thing. |
| `PullToRefreshProvider`, `usePullToRefresh`, `usePageRefresh` | The layout owns the gesture and refetches active queries. Register a handler only for data outside the query cache. `RefreshButton` is deprecated. |
| `AppTheme`, `useColorMode`, `ColorModeSelect`, `ColorModeIconDropdown`, `LocaleSelect` | The layout already wraps itself in `AppTheme`. |
| `useIsMobile`, `MOBILE_MEDIA_QUERY` | The `md` line in JS. Use CSS first; use this only to choose which component to mount. |
| `BuildTag`, changelog helpers | `BuildTag` wires the changelog. It never calls the backend. [features](features.md#changelog-srccomponentschangelog-since-1200) |
| `TourProvider`, `useProductTour`, `tourTarget`, `createTourAnchors`, … | Joyride loads lazily, so only *types* come from `TourHost`. Anchors go on nav items through `dataAttributes`. [features](features.md#guided-tour-tourprovider-useproducttour) |
| `holdBootScreen`, `dismissBootScreen`, `createVariantReconciler` | Boot screen and per-user builds. [features](features.md#the-boot-screen-springboardboot-since-4140) |

## Lists

| Export | Contract |
| --- | --- |
| `useServerList({ queryKey, fetchPage, scope?, defaultPageSize?, enabled?, keepPreviousPage?, mobile? })` | `queryKey[0]` must be the exact string that mutations invalidate. The hook appends the page size and cursor. Spread `tableProps` onto `SimpleDataTable` and feed `mobile` (`rows`, `loading`, `hasMore`, `loadMore`, `error`, `retry`) to `MobileCardList` with `infiniteScroll`. Only one surface fetches (point 1 above). `scope` remembers the page in sessionStorage. `enabled` is the caller's full gate. Use `keepPreviousPage: true` for new tables. Paging steps one page at a time, with no jump control. |
| `useInfiniteList({ queryKey, fetchPage, initialPageParam?, enabled? })` | A phone or feed list on its own. A changed key resets it. |
| `SimpleDataTable` | `columns`, `rows`, `rowKey`, `fill` (grows to the frame's foot), `selection`, `rowGroups`, `rowDetail`, column `group` and `stickyLeft`. Rows are one height. [features](features.md#row-groups-and-filter-pills-simpledatatable-filterpills-since-530) |
| `MobileCardList`, `CardField` | `rows`, `rowKey`, `renderCard`, `infiniteScroll`/`hasMore`/`onLoadMore`, `error`/`onRetry` (without them a failed page reads as "end of list"), `selection` + `selectMode` (the caller owns a "Select" toggle). |
| `RowSelection` helpers | One `selection` for the table and the cards, compared by `rowKey`. The actions go on the pending bar. [features](features.md#row-selection-simpledatatable-mobilecardlist-since-4300) |
| `SearchField`, `usePersistentSearch`, `AdvancedFiltersPanel`/`Toggle`, `FilterPills`, `TagFilter`, `ExportCsvButton`/`useExportCsvAction`, `MoreActionsMenu` | The toolbar folds itself on a phone (search, Filters, "⋯"). Put them in `PageActionBar`'s `leading`. Filters apply on pick. |
| `viewFilterState` / `urlQueryState` | Filter state that survives leaving a view and coming back, or lives in the URL. |
| `cursorPagination`, `cursorTrail`, `createApiPageFetcher`, `fetchEveryPage`, `toLoadOptions` | Cursor paging and option lookups for `SearchableSelect`. |
| `csvExport` | `csvText` keeps leading zeros in Excel. |
| `Timeline`, `TimelineGroup`, `TimelineEntry` | [features](features.md#timeline-srccomponentstimeline-since-630) |

## Records

| Export | Contract |
| --- | --- |
| `DetailView` | Draws the detail frame. `frame="list"` makes it a background list. `frame={false}` draws no frame (inside a tab or dialog). `scroll="content"`. `BackgroundDetailViewContext` tells it when a list sits behind it. |
| `DetailPendingView` | The loading state. Pass the same `sections` (items, groups, label) so the navigation doesn't jump when the record arrives. |
| `DetailHeader`, `DetailHeaderActions`, `useDetailHeaderSlotActive` | Wrap a section's controls in `DetailHeaderActions`: they lift into the header on desktop and stay in place on a phone. [features](features.md#record-sections-detailsectionshell-since-650) |
| `DetailSectionShell` | Sections as a sidebar (wide) or segmented bar (narrow), sized by the container. `pinnedEnd` holds Details. `pendingCount` is a badge. The section body is `flex min-h-0 flex-1 flex-col gap-4` with a `fill` last card. |
| `DetailTabbedSection`, `DetailTabs` | The older tab form. New multi-section records use the shell. |
| `DetailCard`, `DetailFieldsTable`, `DetailSummaryGrid`, `DetailChip`, `DetailMetaItem`, `DetailActionsMenu`, … | Building blocks. `fill` on the last card. |
| `ResourceLayout`, `ResourceCard`, `FormLayout`, `FormLayoutGroup`, `ResourceField`, `SummaryRow` | A record's Details tab in cards (primary two thirds, secondary one third). Cards never nest. `FormField` is the schema type, not this. [features](features.md#a-records-details-in-cards-resourcelayout-since-680) |
| `useDetailEditor({ query, toForm, buildPatch, patch })` | Spread `pendingBarProps` onto the bar and `outdatedDialogProps` onto `OutdatedDataDialog`, or register `pendingSource`. A refetch never wipes typing. `submit` handles status moves. [features](features.md#editing-a-record-usedetaileditor) |
| `RecordLink`, `RecordChevron` | A row's link to its record. |
| `detailViewMode` helpers, `withReturnUrl`, `getDetailClosePath` | Floating, full and collapsed modes, plus the way back to the list. |

## The pending bar

| Export | Contract |
| --- | --- |
| `PendingChangesProvider`, `usePendingChangesSource(source \| null)`, `usePendingChanges` | Call the source hook every render with the current state, or null. Save saves every source in order. `blocked` is a message, not a flag. [features](features.md#one-bar-per-window-pendingchangesprovider) |
| `GlobalPendingChangesBar` | Render it once, inside the provider. |
| `PendingChangesBar` | Standalone or merged. `actions` replace Save. Build each with `definePendingBarAction` (`confirm.prepare`, `onRun`). [features](features.md#pending-actions-on-the-bar-pendingchangesbar-since-4300) |
| `PendingBarConfirmDialog` | The dialog behind an action's `confirm`. |

## Dialogs and forms

| Export | Contract |
| --- | --- |
| `confirmAction(options)` | Returns a promise of true or false. It needs `ConfirmDialogHost`, which `DashboardLayout` mounts; without the host it returns false. |
| `BaseFormDialog`, `FormTableDialog`, `FormTableSection`, `PatchRecordDialog` | Dialogs save with their own button. [features](features.md#form-dialogs-baseformdialog-formtabledialog) |
| `OutdatedDataDialog` | The conflict on save. Comes from `useDetailEditor`. |
| `useSchemaForm`, `SchemaFields`, `SchemaFormDialog`, `evaluateExpression`, … | Forms described as JSON. [features](features.md#schema-forms-srccomponentsforms-since-4200) |
| `QuestionBuilder`, `QuestionList` | [features](features.md#question-builder-srccomponentsquestion-builder) |

## Data and auth

| Export | Contract |
| --- | --- |
| `fetchWithRefresh`, `fetchWithRetryAfter` | The authed transport for every call. Don't build your own. |
| `ApiError`, `NetworkError`, `throwIfNotOk(res, "Failed to …")`, `toApiError`, `errorMessage` | Check `.status`. |
| `getArrayPayload`, `getSingleObjectPayload`, `parseCursorPage`, … | Read the v2 `{ attributes, objects }` envelope. They never unwrap `{ data }`. [features](features.md#shared-app-helpers) |
| `getUserScopes`, `hasFieldScope`, `assertCanPatchPayload`, … | Scope checks. |
| `conflictErrors`, `queryCache` | Conflict detection and invalidation helpers. |
| `runBatch`, `useBatchJob` | Run one item per request with bounded concurrency. Never send a bulk body. |
| `patchCurrentUserInfo` | Saves to the user's own `info` (widget layouts, tour state). |
| `appUrl`, `configureAppUrls` | Links to other apps from `VITE_<APP>_APP_URL`. |
| `beginSignIn`, `beginSignOut`, `useAuth().logout` | Sign out with `useAuth().logout()`. There's no sign-in view: the API hosts the login page. |

## Notifications, live, push and reporting

| Export | Contract |
| --- | --- |
| `NotificationProvider`, `NotificationBell`, `UserNotificationsView`, `ImmediateNotificationDialog`, `UrgentNotificationBanner`, `NotificationLink` | The bell needs the provider. [features](features.md#notification-centre-notificationbell-since-540) |
| Staff notices (`createNotification`, `managementNotificationsPage`, …) | The calls and helpers are shared. The table and dialogs stay in each app. |
| `LiveEventsProvider`, `useLiveTopic(topic, queryKeys)`, `useLiveEvent(topic, onEvent)` | They return true while the stream is live, so a screen can slow its fallback poll. `null` subscribes to nothing. [features](features.md#live-status-liveeventsprovider-uselivetopic-useliveevent-since-6180) |
| `PushNotificationsToggle`, `usePushNotifications` | It lives in the account config. The service worker has no `fetch` handler. |
| `ReportProblemProvider`, `useReportProblem`, `ReportProblemButton`, `ReportProblemMenuButton`, `ReportDialog` | Through `DashboardLayout.reportProblem` (point 4). `enabled: false` hides it from non-staff. `queue` sends reports to `practice`. The provider and buttons are only for a shell that isn't `DashboardLayout`. [features](features.md#report-a-problem-srccomponentsreport) |

## Charts, widgets and guides

| Export | Contract |
| --- | --- |
| `TrendChart`, `LineChart`, `DonutChart`, `CategoryBars`, `FunnelBars`, `StatTile`, `ScoreDistributionChart`, `ChartLegend`, `useChartPalette` | Dependency-free SVG. The palette's slot order keeps it safe for colour-blind readers. [features](features.md#charts-srccomponentscharts-since-1100) |
| `WidgetBoard` + widget bodies | The app supplies a registry, and each widget fetches its own data. Never rename a widget `id`. [features](features.md#widget-home-srccomponentswidgets-since-4100) |
| `UserGuideView`, `GuideIconButton`, `GuidesSidebarContent`, … | In-app guides. |

## Primitives (`components/ui/*`)

`Button`, `Input`, `Textarea`, `Select`, `SearchableSelect`, `Dialog`, `Sheet`,
`Popover`, `DropdownMenu`, `Tabs`, `Table`, `Card`, `Badge`, `Checkbox`,
`RadioGroup`, `Switch`, `PhoneInput`, `TagInput`, `TagFilter`, `FilterPills`
and the rest. Re-skin them with `configureUIPreset`, never with a fork
([features](features.md#re-skinning-a-primitive-configureuipreset-since-200)).
Heights come from the scale.

## Keeping this current

When a change adds an export, or changes a pairing or a phone and desktop
split, update the row here in the same commit. When a feature needs a
paragraph of reasoning, put it in `features.md` and link to it from here.
