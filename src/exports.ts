import "./index.css";

export { configureApi, API_CONFIG } from "./config/api";

// Signing in through Ory Hydra — authorization code + PKCE. **There is no
// `SignIn` view**: the API hosts the one login page, as the
// OIDC bridge in front of Hydra, and it is the only thing that ever sees a
// password or a Google credential. An app mounts `OidcBoot` above
// `AuthProvider`, routes `OIDC_CONFIG.callbackRoute` at `OidcCallback`, and
// signs out with `useAuth().logout()`.
export { default as OidcBoot } from "./auth/oidc/OidcBoot";
export type { OidcBootProps } from "./auth/oidc/OidcBoot";
export { default as OidcCallback } from "./auth/oidc/OidcCallback";
export type { OidcCallbackProps } from "./auth/oidc/OidcCallback";
export { dismissBootScreen, holdBootScreen, isBootScreenShowing } from "./boot/bootScreen";
export { configureOidc, OIDC_CONFIG } from "./auth/oidc/config";
export {
  beginSignIn,
  beginSignOut,
  clearAuthRetries,
  completeSignIn,
  endSession,
  hasOidcSession,
  markSigningOut,
  OidcAuthError,
  refreshSession,
  retryAuthorization,
} from "./auth/oidc/client";
export {
  markLogoutToSignInTransition,
  consumeLogoutToSignInTransition,
} from "./auth/transitionStorage";

export { default as ResetPassword } from "./views/ResetPassword";
export type { ResetPasswordViewProps } from "./views/ResetPassword";

export { AuthProvider, useAuth } from "./context/AuthContext";
export { I18nProvider, useI18n } from "./context/I18nContext";
export { ENGLISH_MESSAGES, VIETNAMESE_MESSAGES } from "./i18n/messages";
export type { TemplateMessages } from "./context/I18nContext";
export type { TemplateI18nKey } from "./i18n/messages";
export {
  PendingChangesProvider,
  usePendingChanges,
} from "./context/PendingChangesContext";
export type {
  PendingChangesContextValue,
  PendingSectionRegistration,
  PendingChangeItem as PendingChangesContextItem,
} from "./context/PendingChangesContext";
export { default as AppTheme, useColorMode } from "./theme/AppTheme";
export { default as ColorModeSelect } from "./theme/ColorModeSelect";
export { default as ColorModeIconDropdown } from "./theme/ColorModeIconDropdown";
export { default as LocaleSelect } from "./theme/LocaleSelect";

export { SitemarkIcon, LogoIcon } from "./components/CustomIcons";
export { default as LazyViewFallback } from "./components/LazyViewFallback";
export type { LazyViewFallbackProps } from "./components/LazyViewFallback";
export { lazyWithPreload, usePreloadOnIdle } from "./utils/lazyWithPreload";
export type { PreloadableComponent } from "./utils/lazyWithPreload";
export { default as MultiSelectDropdown } from "./components/MultiSelectDropdown";
export type { MultiSelectDropdownProps } from "./components/MultiSelectDropdown";
export { default as PatchRecordDialog } from "./components/PatchRecordDialog";
export type { PatchFieldType, PatchFieldOption, PatchFieldConfig } from "./components/PatchRecordDialog";
export { default as PendingChangesBar } from "./components/PendingChangesBar";
export type { PendingChangesBarProps, PendingChangeItem } from "./components/PendingChangesBar";
export {
  PENDING_CHANGES_BAR_DEFAULT_SAVE_LABEL,
  PENDING_CHANGES_BAR_DEFAULT_CANCEL_LABEL,
  PENDING_CHANGES_BAR_DEFAULT_VIEW_UNSAVED_LABEL,
  PENDING_CHANGES_BAR_DEFAULT_PENDING_KEY_LABEL,
  PENDING_CHANGES_BAR_DEFAULT_PENDING_VALUE_LABEL,
  PENDING_CHANGES_BAR_DEFAULT_EXPAND_MAX_HEIGHT,
  PENDING_CHANGES_BAR_DEFAULT_SPRING_CONFIG,
  PENDING_CHANGES_BAR_DEFAULT_BAR_TRANSITION_MS,
  PENDING_CHANGES_BAR_DEFAULT_CHEVRON_TRANSITION_MS,
} from "./components/PendingChangesBar";
export { default as StatusBanner } from "./components/StatusBanner";
export { default as BuildTag } from "./components/BuildTag";
export type { BuildTagProps } from "./components/BuildTag";
export { default as ManageAccountLink } from "./components/ManageAccountLink";
export { default as UserAvatar, userInitials } from "./components/UserAvatar";
export type { UserAvatarProps } from "./components/UserAvatar";
export type { ManageAccountLinkProps } from "./components/ManageAccountLink";
export { ACCOUNTS_PROFILE_URL } from "./config/accounts";
// The changelog. `BuildTag` already wires all of it together — pass it the
// generated commit list and, optionally, a what's-new note — so an app only
// reaches for these directly to render the history somewhere else, or to test
// the parsing without a DOM.
export { default as ChangelogDialog } from "./components/changelog/ChangelogDialog";
export type { ChangelogDialogProps } from "./components/changelog/ChangelogDialog";
export { default as WhatsNewNote } from "./components/changelog/WhatsNewNote";
export type { WhatsNewNoteProps } from "./components/changelog/WhatsNewNote";
export {
  buildChangelog,
  changelogNoteId,
  countInternalChanges,
  parseCommitSubject,
  parseWhatsNewNote,
  readSeenNoteId,
  toChangelogChange,
  writeSeenNoteId,
} from "./components/changelog/changelog";
export type {
  ChangelogChange,
  ChangelogChangeKind,
  ChangelogCommit,
  ChangelogDay,
} from "./components/changelog/types";
export { default as DashboardLayout } from "./components/layout/DashboardLayout";
export type { DashboardLayoutProps, DashboardNavItem, DashboardLayoutClassNames } from "./components/layout/DashboardLayout";
export { default as AppHeader } from "./components/layout/AppHeader";
export type { AppHeaderProps } from "./components/layout/AppHeader";
export { default as SimpleDataTable } from "./components/SimpleDataTable";
export type { SimpleDataTableColumn, SimpleDataTableSortOrder, SimpleDataTableProps, SimpleDataTableClassNames } from "./components/SimpleDataTable";
export { default as MobileCardList, CardField } from "./components/MobileCardList";
export type { MobileCardListProps } from "./components/MobileCardList";
export { default as MobileBottomBar } from "./components/MobileBottomBar";
export type { MobileBottomBarItem, MobileBottomBarProps } from "./components/MobileBottomBar";
export { default as MobileMenuSheet } from "./components/layout/MobileMenuSheet";
export type { MobileMenuSheetProps } from "./components/layout/MobileMenuSheet";
export { default as useIsMobile, MOBILE_MEDIA_QUERY } from "./hooks/useIsMobile";
// One server-paged list: the desktop table's props, the phone's infinite list,
// and a cursor trail so Next costs one request and reopening a saved page costs
// one rather than re-walking every page before it.
export { default as useServerList } from "./hooks/useServerList";
export type { UseServerListOptions, ServerList } from "./hooks/useServerList";
export { default as useInfiniteList } from "./hooks/useInfiniteList";
export type {
  InfiniteList,
  InfiniteListPage,
  UseInfiniteListOptions,
} from "./hooks/useInfiniteList";
export {
  buildGuides,
  GuideIconButton,
  GuideMenuButton,
  GuidesSidebarContent,
  parseGuide,
  UserGuideView,
} from "./components/guides/UserGuide";
export type {
  GuideIconButtonProps,
  GuideMenuButtonProps,
  GuideRecord,
  GuideSection,
  GuidesSidebarContentProps,
  RawGuides,
  UserGuideViewProps,
} from "./components/guides/UserGuide";
export { default as BaseFormDialog } from "./components/dialogs/BaseFormDialog";
export { default as FormTableDialog, FormTableRow } from "./components/dialogs/FormTableDialog";
export type { FormTableDialogTab } from "./components/dialogs/FormTableDialog";
export { default as FormTableSection } from "./components/dialogs/FormTableSection";

// Schema forms: a form described as JSON (stored on a row or declared in code),
// rendered, validated and output by one hook and two components.
export * from "./components/forms/schema";
export { evaluateExpression, checkExpression, ExpressionError } from "./components/forms/expression";
export type { ExprValue, ExprScope } from "./components/forms/expression";
export { formatMoney, parseMoney, parseNumber, vietnameseAmountWords } from "./components/forms/formatting";
export {
    computeFormValues,
    emptyFieldValue,
    emptyListRow,
    initialFormValues,
    isFieldVisible,
    missingFormFields,
    outputFormValues,
} from "./components/forms/schemaValues";
export type { FormOutputMode, MissingField } from "./components/forms/schemaValues";
export { inferJinjaSchema } from "./components/forms/jinjaSchema";
export { useSchemaForm } from "./components/forms/useSchemaForm";
export type { FormLookupSource, FormLookups, SchemaForm, UseSchemaFormOptions } from "./components/forms/useSchemaForm";
export { SchemaFields } from "./components/forms/SchemaFields";
export type { SchemaFieldsProps } from "./components/forms/SchemaFields";
export { SchemaFormDialog } from "./components/forms/SchemaFormDialog";
export type { SchemaFormDialogProps, SchemaFormTab } from "./components/forms/SchemaFormDialog";
export { default as QuestionBuilder } from "./components/question-builder/QuestionBuilder";
export type { QuestionBuilderProps } from "./components/question-builder/QuestionBuilder";
export { default as QuestionList } from "./components/question-builder/QuestionList";
export type {
  QuestionBuilderOption,
  QuestionBuilderQuestion,
  QuestionBuilderSectionNavItem,
  QuestionBuilderSection,
  QuestionBuilderInputQuestion,
  QuestionBuilderTextareaQuestion,
  QuestionBuilderSelectQuestion,
  QuestionBuilderReadonlyQuestion,
  QuestionBuilderRadioGroupQuestion,
  QuestionBuilderCheckboxGroupQuestion,
  QuestionBuilderCustomQuestion,
} from "./components/question-builder/types";
export {
  DetailView,
  DetailHeader,
  DetailBreadcrumbs,
  DetailChip,
  DetailMetaItem,
  DetailActionsMenu,
  DetailSummaryGrid,
  DetailSummaryItem,
  DetailCard,
  DetailTextBlock,
  DetailFieldsTable,
  type DetailFieldsTableRow,
  DetailClassLinkValue,
  DetailClassHeaderLabel,
  DetailActionPanel,
  DetailTabs,
  DetailTabbedSection,
  DetailPendingView,
  DetailPulse,
  BackgroundDetailViewContext,
} from "./components/layout/DetailLayout";
export type {
  DetailTabsClassNames,
  DetailTabItem,
  DetailChipTone,
  DetailMenuAction,
} from "./components/layout/DetailLayout";
export { default as ProgressMetricCell } from "./components/cells/ProgressMetricCell";
export { default as AdvancedFiltersPanel } from "./components/management/AdvancedFiltersPanel";
export type { AdvancedFiltersPanelProps } from "./components/management/AdvancedFiltersPanel";
export { default as AdvancedFiltersToggle } from "./components/management/AdvancedFiltersToggle";
export { default as ExportCsvButton } from "./components/management/ExportCsvButton";
export type { AdvancedFiltersToggleProps } from "./components/management/AdvancedFiltersToggle";

export * from "./utils/formatters";
export * from "./utils/phone";
export * from "./utils/urlQueryState";
// Filter state that survives leaving and returning to a view.
export * from "./utils/viewFilterState";
export * from "./utils/queryCache";
// Paging a cursor-paginated list. `cursorPagination` walks cursors to reach an
// offset. `cursorTrail` remembers the cursors already walked, so Previous, and
// coming back to a saved page, cost one request instead of re-walking from the
// beginning.
export * from "./utils/cursorPagination";
export * from "./utils/cursorTrail";
// CSV export. `csvText` wraps an identifier as `="…"` so Excel keeps the
// leading zero on a CITAD bank code or an account number.
export * from "./utils/csvExport";
export * from "./utils/userScopes";
export * from "./utils/permissions";
export * from "./utils/conflictErrors";

export {
  DETAIL_HIDDEN_COLLAPSED_VALUE,
  writeDetailViewMode,
  readStoredDetailViewMode,
  resolveDetailViewMode,
  stripDetailViewModeFromPath,
  toDetailReturnUrl,
  getDetailReturnLocation,
  useResolvedDetailViewMode,
  useDetailViewMode,
} from "./utils/detailViewMode";
export type {
  DetailViewModeState,
  DetailViewCollapsedState,
} from "./utils/detailViewMode";

export * from "./components/ui/avatar";
export * from "./components/ui/badge";
export * from "./components/ui/button";
export * from "./components/ui/card";
export * from "./components/ui/checkbox";
export * from "./components/ui/dialog";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/input";
export * from "./components/ui/phone-input";
export * from "./components/ui/label";
export * from "./components/ui/popover";
export * from "./components/ui/progress";
export * from "./components/ui/radio-group";
export * from "./components/ui/scroll-area";
export * from "./components/ui/searchable-select";
export * from "./components/ui/select";
export * from "./components/ui/separator";
export * from "./components/ui/sheet";
export * from "./components/ui/switch";
export * from "./components/ui/table";
export * from "./components/ui/tabs";
// Tags on a resource: TagInput authors them, TagFilter narrows a list by them.
// `normalizeTag`/`normalizeTags` are exported alongside because they have to
// match the API's `normalize_tags` — callers building a query string need the
// same canonical form the chips show.
export * from "./components/ui/tag-filter";
export * from "./components/ui/tag-input";
export * from "./components/ui/textarea";

// How an app re-skins the shared primitives without forking them: a layer of
// Tailwind classes merged between the built-in variant classes and the caller's
// `className`. Registered once at boot like `configureApi`; see
// `config/uiPreset` for why tokens alone are not enough.
export { configureUIPreset, getUIPreset, uiPresetClass } from "./config/uiPreset";
export type { UIPreset, UIPresetSlot, UIPresetSlotArgs } from "./config/uiPreset";

// Transient app-wide status. `GlobalStatusQueryBridge` wires TanStack Query
// errors into it; `DashboardLayout` renders the status below `md`, where the
// desktop header that normally carries it is hidden.
export {
  GlobalStatusProvider,
  useGlobalStatus,
  useGlobalStatusOptional,
} from "./context/GlobalStatusContext";
export type { GlobalStatus, GlobalStatusTone } from "./context/GlobalStatusContext";
export { default as GlobalStatusQueryBridge } from "./components/GlobalStatusQueryBridge";

export { NotificationProvider, useNotifications } from "./context/NotificationContext";
export type { NotificationContextValue } from "./context/NotificationContext";
export {
  MobileFABProvider,
  useMobileFABContext,
  useMobileFAB,
  MobileFloatingActionButton,
} from "./context/MobileFABContext";
export type {
  MobileFABConfig,
  MobileFABContextValue,
  MobileFloatingActionButtonProps,
} from "./context/MobileFABContext";
export type {
  UserNotification,
  NotificationPriority,
  NotificationPriorityKind,
} from "./api_calls/notifications";
export {
  fetchUserNotifications,
  getNotificationPriorityKind,
  isImmediateNotification,
  isInformativeNotification,
  isUrgentNotification,
  markNotificationRead,
  shouldMarkNotificationReadOnView,
} from "./api_calls/notifications";
export { default as NotificationBell } from "./components/notifications/NotificationBell";
export { default as PushNotificationsToggle } from "./components/notifications/PushNotificationsToggle";
export type { PushNotificationsToggleProps } from "./components/notifications/PushNotificationsToggle";
export { usePushNotifications, usePushSetupNeeded } from "./hooks/usePushNotifications";
export type {
    PushNotificationsState,
    PushSetupState,
    UsePushNotificationsOptions,
} from "./hooks/usePushNotifications";
export {
    fetchPushPublicKey,
    isAppleMobile,
    isPushUnavailableError,
    pushSupport,
    registerPushDevice,
    removePushDevice,
    sendTestPush,
    urlBase64ToUint8Array,
} from "./api_calls/pushNotifications";
export type {
    PushApp,
    PushDevice,
    PushEnvironment,
    PushSupport,
} from "./api_calls/pushNotifications";
export { default as NotificationCenter } from "./components/notifications/NotificationCenter";
export { default as ImmediateNotificationDialog } from "./components/notifications/ImmediateNotificationDialog";
export { default as UrgentNotificationBanner } from "./components/notifications/UrgentNotificationBanner";

export { default as TrendChart } from "./components/charts/TrendChart";
export type { TrendPoint, TrendSeries } from "./components/charts/TrendChart";
export { default as FunnelBars } from "./components/charts/FunnelBars";
export type { FunnelStage } from "./components/charts/FunnelBars";
export { default as CategoryBars } from "./components/charts/CategoryBars";
export type { CategoryDatum } from "./components/charts/CategoryBars";
export { default as DonutChart } from "./components/charts/DonutChart";
export { default as StatTile } from "./components/charts/StatTile";
export { default as ScoreDistributionChart } from "./components/charts/ScoreDistributionChart";
export type {
  ScoreDistributionBin,
  ScoreDistributionChartProps,
} from "./components/charts/ScoreDistributionChart";
export { default as ChartLegend } from "./components/charts/ChartLegend";
export type { ChartLegendItem } from "./components/charts/ChartLegend";
export { getChartPalette, useChartPalette } from "./components/charts/palette";
export type { ChartColorMode, ChartPalette } from "./components/charts/palette";

// The widget home: a board of user-arranged widgets saved in the user's own
// `info`. The template draws the board, gallery and edit mode; an app supplies
// a registry of `WidgetDefinition`s (each fetching its own data) and defaults.
export { default as WidgetBoard } from "./components/widgets/WidgetBoard";
export type { WidgetBoardProps } from "./components/widgets/WidgetBoard";
export { default as useWidgetLayout } from "./components/widgets/useWidgetLayout";
export type { UseWidgetLayoutOptions, WidgetLayoutState } from "./components/widgets/useWidgetLayout";
export {
  WidgetEmpty,
  WidgetError,
  WidgetList,
  WidgetQueryState,
  WidgetSkeleton,
  WidgetStat,
} from "./components/widgets/WidgetBodies";
export type { WidgetListRow, WidgetQueryLike } from "./components/widgets/WidgetBodies";
export {
  availableWidgets,
  isWidgetAvailable,
  normaliseLayout,
} from "./components/widgets/layout";
export { isWidgetStack, WIDGET_SIZES } from "./components/widgets/types";
export type {
  AnyWidgetDefinition,
  WidgetDefaults,
  WidgetDefinition,
  WidgetItem,
  WidgetLayout,
  WidgetLayoutEntry,
  WidgetRegistry,
  WidgetRenderProps,
  WidgetSize,
  WidgetStack,
  WidgetStackChild,
} from "./components/widgets/types";
export { patchCurrentUserInfo } from "./api_calls/UserData";

// The authed transport, shared so that how auth travels is decided once for
// every app.
export {
  fetchWithRefresh,
  fetchWithRetryAfter,
  refreshAccessToken,
  configureSessionRenewal,
  AUTH_SESSION_EXPIRED_EVENT,
} from "./api_calls/fetchWithRefresh";
export {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  getAccessTokenExpiry,
} from "./auth/accessToken";

// Why a request failed, rather than that it did. `NetworkError` arrives on its
// own — every request already goes through the transport above, so a dead
// server names the endpoint instead of saying "Failed to fetch". `ApiError`
// needs the call site: `await throwIfNotOk(response, "Failed to fetch tests")`
// throws "Failed to fetch tests: <status> <statusText>" with the API's own
// explanation following the status.
export {
  ApiError,
  NetworkError,
  throwIfNotOk,
  toApiError,
} from "./api_calls/apiErrors";
