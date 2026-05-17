import "./index.css";

export * from "./config/api";

export { default as SignIn } from "./views/SignIn";
export type { SignInViewProps } from "./views/SignIn";
export { default as ResetPassword } from "./views/ResetPassword";
export type { ResetPasswordViewProps } from "./views/ResetPassword";

export { AuthProvider, useAuth } from "./context/AuthContext";
export { default as AppTheme, useColorMode } from "./theme/AppTheme";
export { default as ColorModeSelect } from "./theme/ColorModeSelect";
export { default as ColorModeIconDropdown } from "./theme/ColorModeIconDropdown";

export { default as ForgotPassword } from "./components/ForgotPassword";
export { SitemarkIcon } from "./components/CustomIcons";
export { default as LazyViewFallback } from "./components/LazyViewFallback";
export { default as PatchRecordDialog } from "./components/PatchRecordDialog";
export type { PatchFieldType, PatchFieldOption, PatchFieldConfig } from "./components/PatchRecordDialog";
export { default as PendingChangesBar } from "./components/PendingChangesBar";
export { default as StatusBanner } from "./components/StatusBanner";
export { default as SimpleDataTable } from "./components/SimpleDataTable";
export type { SimpleDataTableColumn, SimpleDataTableSortOrder, SimpleDataTableProps } from "./components/SimpleDataTable";
export { default as FormTableDialog, FormTableRow } from "./components/dialogs/FormTableDialog";
export {
  DetailView,
  DetailHeader,
  DetailBreadcrumbs,
  DetailSummaryGrid,
  DetailSummaryItem,
  DetailCard,
  DetailTextBlock,
  DetailFieldsTable,
  DetailClassLinkValue,
  DetailClassHeaderLabel,
  DetailActionPanel,
  DetailTabs,
  DetailTabbedSection,
  BackgroundDetailViewContext,
} from "./components/layout/DetailLayout";
export { default as ProgressMetricCell } from "./components/cells/ProgressMetricCell";

export * from "./utils/formatters";
export * from "./utils/urlQueryState";
export * from "./utils/userScopes";
export * from "./utils/permissions";
export * from "./utils/conflictErrors";
export * from "./utils/queryCache";
export * from "./utils/openSessionLink";
export * from "./utils/sessionRows";

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

export * from "./components/ui/button";
export * from "./components/ui/card";
export * from "./components/ui/dialog";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/input";
export * from "./components/ui/label";
export * from "./components/ui/searchable-select";
export * from "./components/ui/separator";
export * from "./components/ui/sheet";
export * from "./components/ui/table";
export * from "./components/ui/textarea";
