import { useCallback, useEffect, useMemo, useState } from "react";

export const DETAIL_HIDDEN_COLLAPSED_VALUE = "2";
const RETURN_URL_QUERY_KEY = "returnUrl";

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

const DETAIL_VIEW_MODE_MEMORY_PREFIX = "ui.detailViewMode";
const DETAIL_VIEW_MODE_LATEST_MEMORY_KEY = `${DETAIL_VIEW_MODE_MEMORY_PREFIX}:latest`;
const DETAIL_VIEW_MODE_CHANGE_EVENT = "detail-view-mode-change";
const DEFAULT_DETAIL_VIEW_MODE: DetailViewModeState = {
    floating: false,
    collapsed: "0",
};
const inMemoryDetailViewModes = new Map<string, DetailViewModeState>();

function usePathname(): string {
    const [pathname, setPathname] = useState(() =>
        typeof window === "undefined" ? "/" : window.location.pathname,
    );

    useEffect(() => {
        const handler = () => setPathname(window.location.pathname);
        window.addEventListener("popstate", handler);
        return () => window.removeEventListener("popstate", handler);
    }, []);

    return pathname;
}

function normalizePathname(pathname: string): string {
    if (!pathname) {
        return "/";
    }

    return pathname.length > 1 && pathname.endsWith("/")
        ? pathname.slice(0, -1)
        : pathname;
}

function normalizeCollapsedState(value: unknown): DetailViewCollapsedState {
    return value === "1" || value === DETAIL_HIDDEN_COLLAPSED_VALUE
        ? value
        : "0";
}

function normalizeMode(input: DetailViewModeInput): DetailViewModeState {
    const floating = input.floating === true;

    return {
        floating,
        collapsed: floating ? normalizeCollapsedState(input.collapsed) : "0",
    };
}

function detailViewModesEqual(
    first: DetailViewModeState | null,
    second: DetailViewModeState,
): boolean {
    return (
        first?.floating === second.floating &&
        first.collapsed === second.collapsed
    );
}

function getDetailViewModeScopePath(pathname: string): string {
    const normalized = normalizePathname(pathname);
    const segments = normalized.split("/").filter(Boolean);

    if (segments[0] !== "management") {
        return normalized;
    }

    if (segments[1] === "classes" && segments[2]) {
        const classChildType = segments[3];
        const classChildKey = segments[4];
        if (
            classChildKey &&
            (classChildType === "schedules" ||
                classChildType === "sessions" ||
                classChildType === "tests" ||
                classChildType === "feedbacks")
        ) {
            return `/management/classes/${segments[2]}/${classChildType}/${classChildKey}`;
        }

        return `/management/classes/${segments[2]}`;
    }

    if (
        (segments[1] === "schedules" ||
            segments[1] === "sessions" ||
            segments[1] === "tests" ||
            segments[1] === "feedbacks") &&
        segments[2]
    ) {
        return `/management/${segments[1]}/${segments[2]}`;
    }

    return normalized;
}

function readModeFromKey(key: string): DetailViewModeState | null {
    return inMemoryDetailViewModes.get(key) ?? null;
}

function notifyDetailViewModeChange() {
    if (typeof window === "undefined") {
        return;
    }

    window.dispatchEvent(new Event(DETAIL_VIEW_MODE_CHANGE_EVENT));
}

type DetailReturnLocation = {
    pathname: string;
    search: string;
    hash: string;
};

function toRouteUrl(rawUrl: string): URL | null {
    const normalized = rawUrl.trim();
    if (!normalized) {
        return null;
    }

    const baseUrl =
        typeof window === "undefined"
            ? "http://localhost"
            : window.location.origin;

    try {
        return new URL(normalized, baseUrl);
    } catch {
        return null;
    }
}

function stripDetailViewModeFromPathInternal(
    pathnameWithSearch: string,
    nestedDepth: number,
): string {
    const parsed = toRouteUrl(pathnameWithSearch);
    if (!parsed) {
        return pathnameWithSearch;
    }

    const returnUrl = parsed.searchParams.get(RETURN_URL_QUERY_KEY)?.trim();
    if (returnUrl && nestedDepth > 0) {
        parsed.searchParams.set(
            RETURN_URL_QUERY_KEY,
            stripDetailViewModeFromPathInternal(returnUrl, nestedDepth - 1),
        );
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

export function stripDetailViewModeFromPath(pathnameWithSearch: string): string {
    return stripDetailViewModeFromPathInternal(pathnameWithSearch, 3);
}

export function readStoredDetailViewMode(
    pathname: string,
): DetailViewModeState | null {
    return (
        readModeFromKey(
            `${DETAIL_VIEW_MODE_MEMORY_PREFIX}:${getDetailViewModeScopePath(pathname)}`,
        ) ?? readModeFromKey(DETAIL_VIEW_MODE_LATEST_MEMORY_KEY)
    );
}

export function writeDetailViewMode(
    pathname: string,
    mode: DetailViewModeInput,
): DetailViewModeState {
    const nextMode = normalizeMode(mode);
    const scopedKey = `${DETAIL_VIEW_MODE_MEMORY_PREFIX}:${getDetailViewModeScopePath(pathname)}`;
    const scopedModeChanged = !detailViewModesEqual(
        readModeFromKey(scopedKey),
        nextMode,
    );
    const latestModeChanged = !detailViewModesEqual(
        readModeFromKey(DETAIL_VIEW_MODE_LATEST_MEMORY_KEY),
        nextMode,
    );

    inMemoryDetailViewModes.set(scopedKey, nextMode);
    inMemoryDetailViewModes.set(DETAIL_VIEW_MODE_LATEST_MEMORY_KEY, nextMode);

    if (scopedModeChanged || latestModeChanged) {
        notifyDetailViewModeChange();
    }

    return nextMode;
}

export function resolveDetailViewMode(
    pathname: string,
): DetailViewModeState {
    return readStoredDetailViewMode(pathname) ?? DEFAULT_DETAIL_VIEW_MODE;
}

export function toDetailReturnUrl(pathnameWithSearch: string): string {
    return stripDetailViewModeFromPath(pathnameWithSearch);
}

export function getDetailReturnLocation(
    pathnameWithSearch: string,
): DetailReturnLocation | null {
    const parsed = toRouteUrl(toDetailReturnUrl(pathnameWithSearch));
    if (!parsed) {
        return null;
    }

    return {
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
    };
}

export function useResolvedDetailViewMode(
    options: DetailViewModeHookOptions = {},
): DetailViewModeState {
    const currentPathname = usePathname();
    const enabled = options.enabled ?? true;
    const pathname = options.pathname ?? currentPathname;
    const [modeVersion, setModeVersion] = useState(0);

    useEffect(() => {
        if (!enabled || typeof window === "undefined") {
            return;
        }

        const updateModeVersion = () => {
            setModeVersion((currentVersion) => currentVersion + 1);
        };

        window.addEventListener(
            DETAIL_VIEW_MODE_CHANGE_EVENT,
            updateModeVersion,
        );

        return () => {
            window.removeEventListener(
                DETAIL_VIEW_MODE_CHANGE_EVENT,
                updateModeVersion,
            );
        };
    }, [enabled]);

    return useMemo(() => {
        if (!enabled) {
            return DEFAULT_DETAIL_VIEW_MODE;
        }

        return resolveDetailViewMode(pathname);
    }, [enabled, pathname, modeVersion]);
}

export function useDetailViewMode(options: DetailViewModeHookOptions = {}) {
    const currentPathname = usePathname();
    const enabled = options.enabled ?? true;
    const pathname = options.pathname ?? currentPathname;
    const resolvedMode = useResolvedDetailViewMode({
        enabled,
        pathname,
    });
    const [mode, setModeState] = useState<DetailViewModeState>(resolvedMode);

    useEffect(() => {
        setModeState((currentMode) =>
            detailViewModesEqual(currentMode, resolvedMode)
                ? currentMode
                : resolvedMode,
        );
    }, [resolvedMode]);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        if (!detailViewModesEqual(readStoredDetailViewMode(pathname), mode)) {
            writeDetailViewMode(pathname, mode);
        }
    }, [enabled, pathname, mode]);

    const setMode = useCallback(
        (nextMode: DetailViewModeInput) => {
            if (!enabled) {
                return;
            }

            setModeState(writeDetailViewMode(pathname, nextMode));
        },
        [enabled, pathname],
    );

    return {
        ...mode,
        isCollapsed: mode.collapsed !== "0",
        hiddenCollapsed: mode.collapsed === DETAIL_HIDDEN_COLLAPSED_VALUE,
        setMode,
    };
}
