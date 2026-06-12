export declare const DETAIL_HIDDEN_COLLAPSED_VALUE = "2";
export type DetailViewCollapsedState = "0" | "1" | "2";
export type DetailViewModeState = {
    floating: boolean;
    collapsed: DetailViewCollapsedState;
};
type DetailViewModeInput = {
    floating?: boolean;
    collapsed?: unknown;
};
type DetailViewModeHookOptions = {
    enabled?: boolean;
    pathname?: string;
};
type DetailReturnLocation = {
    pathname: string;
    search: string;
    hash: string;
};
export declare function stripDetailViewModeFromPath(pathnameWithSearch: string): string;
export declare function readStoredDetailViewMode(pathname: string): DetailViewModeState | null;
export declare function writeDetailViewMode(pathname: string, mode: DetailViewModeInput): DetailViewModeState;
export declare function resolveDetailViewMode(pathname: string): DetailViewModeState;
export declare function toDetailReturnUrl(pathnameWithSearch: string): string;
export declare function getDetailReturnLocation(pathnameWithSearch: string): DetailReturnLocation | null;
export declare function useResolvedDetailViewMode(options?: DetailViewModeHookOptions): DetailViewModeState;
export declare function useDetailViewMode(options?: DetailViewModeHookOptions): {
    isCollapsed: boolean;
    hiddenCollapsed: boolean;
    setMode: (nextMode: DetailViewModeInput) => void;
    floating: boolean;
    collapsed: DetailViewCollapsedState;
};
export {};
