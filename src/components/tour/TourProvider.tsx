import {
    Suspense,
    createContext,
    lazy,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { useLocation, useNavigate, type NavigateFunction } from "react-router-dom";
import { isRectInViewport, tourTarget, type TourAnchorOptions } from "./tourAnchor";
import {
    clampStepIndex,
    isScreenStep,
    isTourSuppressed,
    navigationForStep,
    shouldAutoStartTour,
    stepAfterFailure,
    tourAutoStartSettled,
    tourHoldsTheScreen,
    type TourStep,
} from "./tourSteps";
import type { TourHostOptions } from "./TourHost";

// The guided tour's owner. STATE LIVES HERE, NOT IN JOYRIDE: the host is a
// controlled puppet handed the steps and the index, which is what lets replay
// and recovery SET the index (Joyride's `go()` is a no-op in controlled mode)
// and lets the host unmount losing nothing. Mount it around <Routes>, so
// navigating never unmounts it.

// The host is the only module that imports react-joyride, so the library is
// its own chunk, fetched when a tour first starts.
const TourHost = lazy(() => import("./TourHost").then((m) => ({ default: m.TourHost })));

// Below Tailwind's `md`: no header, and the nav is the bottom bar.
const MOBILE_QUERY = "(max-width: 47.99rem)";
// DashboardLayout animates the sidebar's width over 300ms.
const SIDEBAR_SETTLE_MS = 350;
// A Radix sheet closing after Escape.
const SHEET_SETTLE_MS = 350;
// Joyride 3.2.0 checks a step with a `before` hook exactly once, so the wait
// for its element lives here.
const TARGET_WAIT_MS = 12_000;
const TARGET_POLL_MS = 100;
// A new screen slides in and its lists arrive; judge position after that.
const LAYOUT_SETTLE_MS = 400;
// Long enough for the host to re-render a step as centred before Joyride reads it.
const STEP_SWAP_MS = 50;
// How often auto-start re-checks for a dialog that is in its way.
const DIALOG_POLL_MS = 1_000;

interface RunningTour<R extends string> {
    role: R;
    steps: TourStep[];
    index: number;
    failuresInARow: number;
    isMobile: boolean;
    /** Steps whose element was off screen, shown centred instead. */
    centered: number[];
}

/** What `useProductTour` gives the app's replay control and its what's-new note. */
export interface ProductTour {
    /** A tour exists for the signed-in account. */
    available: boolean;
    running: boolean;
    /** A tour is on screen or still due; anything else that opens by itself waits. */
    holdsTheScreen: boolean;
    /** Starts from the first step, wherever the reader is. */
    startTour: () => void;
}

const TourContext = createContext<ProductTour>({
    available: false,
    running: false,
    holdsTheScreen: false,
    startTour: () => {},
});

/** The tour's state and replay control, from the nearest `TourProvider`. */
export function useProductTour(): ProductTour {
    return useContext(TourContext);
}

/** What `onEnd` gets, to tidy up after a tour (leave a sample screen, refresh lists). */
export interface TourEndContext {
    pathname: string;
    navigate: NavigateFunction;
}

export interface TourProviderProps<R extends string> {
    children: ReactNode;
    /** Whose tour runs: null for no tour (guests, the signed out). */
    role: R | null;
    /** The steps for a role on this device, captured once at start. */
    getSteps: (role: R, context: { isMobile: boolean }) => TourStep[];
    /** The signed-in record has loaded, so `seen` can be trusted. */
    infoLoaded: boolean;
    /** The account has seen this role's tour. */
    seen: boolean;
    /**
     * Records the tour as seen; called as a tour starts while `seen` is false.
     * Where the stamp lives is the app's. A rejection is logged and ignored.
     */
    markSeen: (role: R) => Promise<void>;
    /** The screens a tour may open over by itself. */
    isInWorkspace: (role: R, pathname: string) => boolean;
    /** Something of the app's must go first (a dialog, unaccepted terms): auto-start waits. */
    blocked?: boolean;
    /** The localStorage key of the scripts' off switch; read once at mount. */
    suppressedStorageKey: string;
    /** Wait out any open Radix dialog, such as an immediate notification, before auto-starting. */
    waitForOpenDialogs?: boolean;
    /** Misses in a row before the tour gives up on a screen. Defaults to 2. */
    missesBeforeEnd?: number;
    /** How a marked element resolves to its control. */
    anchorOptions?: TourAnchorOptions;
    /** Labels, tooltip classes and fixed anchors for the host. */
    host?: TourHostOptions;
    /** Called as any tour starts, before its first step. */
    onStart?: (role: R) => void;
    /** Called after a tour ends, however it ended. */
    onEnd?: (context: TourEndContext) => void;
    /** Called when the tour ends because a screen never came. */
    onEndedEarly?: () => void;
}

// --- The template's sidebar ---------------------------------------------------
// Its collapsed flag is DashboardLayout state with no prop, so the tour clicks
// the sidebar's own edge toggle, marked `data-sidebar-toggle`.

function sidebar(): HTMLElement | null {
    return document.querySelector<HTMLElement>("aside");
}

function isSidebarCollapsed(): boolean | null {
    const aside = sidebar();
    if (!aside || aside.getBoundingClientRect().width === 0) return null;
    return aside.classList.contains("w-20");
}

function clickSidebarToggle(): boolean {
    const toggle = sidebar()?.querySelector<HTMLButtonElement>("[data-sidebar-toggle]");
    if (!toggle) return false;
    toggle.click();
    return true;
}

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function nextFrame(): Promise<void> {
    return new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
}

/** Storage throws where cookies are blocked; a tour is not worth a crash. */
function readTourSuppressed(key: string): boolean {
    try {
        return isTourSuppressed(window.localStorage.getItem(key));
    } catch {
        return false;
    }
}

/** A Radix modal is open. Nothing outside one can be clicked, the tour included. */
function isModalOpen(): boolean {
    return (
        document.querySelector('[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]') !==
        null
    );
}

/**
 * Closes the mobile menu sheet before a replay starts there: it is a Radix
 * modal and would swallow every click on the tour. One Escape can land on a
 * popover still closing, so check and repeat.
 */
async function closeOpenSheet(): Promise<void> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
        await nextFrame();
        if (!document.querySelector('[data-slot="sheet-content"][data-state="open"]')) return;
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        await wait(SHEET_SETTLE_MS);
    }
}

type AnchorFit = "in-view" | "off-view" | "missing";

/** Waits for the step's element, then says whether it is fully on screen. */
async function waitForAnchor(anchor: string, settle: boolean, options?: TourAnchorOptions): Promise<AnchorFit> {
    const find = tourTarget(anchor, options);
    const deadline = Date.now() + TARGET_WAIT_MS;
    let element = find();
    while (!element && Date.now() < deadline) {
        await wait(TARGET_POLL_MS);
        element = find();
        settle = true;
    }
    if (!element) return "missing";
    if (settle) {
        await wait(LAYOUT_SETTLE_MS);
        element = find();
        if (!element) return "missing";
    }
    return isRectInViewport(element.getBoundingClientRect(), {
        width: window.innerWidth,
        height: window.innerHeight,
    })
        ? "in-view"
        : "off-view";
}

/**
 * Runs an app's guided tour: starts it once by itself for an account that has
 * not seen it (on a workspace screen, with nothing in the way), offers replay
 * through `useProductTour`, walks each step's route, expands the sidebar for a
 * nav step, centres a step whose element is off screen, and skips one that
 * never appears. The steps, the roles and the seen-stamp stay in the app.
 */
export function TourProvider<R extends string>({
    children,
    role,
    getSteps,
    infoLoaded,
    seen,
    markSeen,
    isInWorkspace,
    blocked = false,
    suppressedStorageKey,
    waitForOpenDialogs = false,
    missesBeforeEnd = 2,
    anchorOptions,
    host,
    onStart,
    onEnd,
    onEndedEarly,
}: TourProviderProps<R>) {
    const navigate = useNavigate();
    const location = useLocation();
    // Refs, not closures: Joyride calls `before` long after the render that
    // built the steps, and the app passes inline callbacks.
    const latest = useRef({ navigate, location, getSteps, markSeen, onStart, onEnd, onEndedEarly, anchorOptions, missesBeforeEnd });
    useEffect(() => {
        latest.current = { navigate, location, getSteps, markSeen, onStart, onEnd, onEndedEarly, anchorOptions, missesBeforeEnd };
    });
    const seenRef = useRef(seen);
    seenRef.current = seen;

    // Read once: a script sets it before the app boots.
    const [suppressed] = useState(() => readTourSuppressed(suppressedStorageKey));
    const [autoStarted, setAutoStarted] = useState(false);
    // Between startTour and the first step's commit (a frame or a sheet closing):
    // the screen is held through it, so the what's-new note cannot slip in.
    const [starting, setStarting] = useState(false);

    const [tour, setTour] = useState<RunningTour<R> | null>(null);
    const tourRef = useRef<RunningTour<R> | null>(null);
    const sidebarExpandedByTour = useRef(false);

    const commit = useCallback((next: RunningTour<R> | null) => {
        tourRef.current = next;
        setTour(next);
    }, []);

    const endTour = useCallback(() => {
        if (!tourRef.current) return;
        // The toggle persists, so leaving it open would change their preference.
        if (sidebarExpandedByTour.current) {
            sidebarExpandedByTour.current = false;
            if (isSidebarCollapsed() === false) clickSidebarToggle();
        }
        commit(null);
        const { onEnd: end, location: at, navigate: go } = latest.current;
        end?.({ pathname: at.pathname, navigate: go });
    }, [commit]);

    // Recorded when a tour STARTS: finishing and walking away after one step
    // mean the same thing, and a write at the end is the one a closed tab loses.
    const recordSeen = useCallback(async (forRole: R) => {
        try {
            await latest.current.markSeen(forRole);
        } catch (error) {
            if (import.meta.env.DEV) console.warn("[tour] could not record the tour as seen", error);
        }
    }, []);

    const startTour = useCallback(() => {
        if (!role) return;
        // Decided once; re-deciding on resize would re-index a controlled tour.
        const isMobile = window.matchMedia(MOBILE_QUERY).matches;
        const steps = latest.current.getSteps(role, { isMobile });
        if (steps.length === 0) return;

        sidebarExpandedByTour.current = false;
        latest.current.onStart?.(role);
        // At least a frame first, so the popover the button sat in has closed.
        setStarting(true);
        void closeOpenSheet().then(() => {
            commit({ role, steps, index: 0, failuresInARow: 0, isMobile, centered: [] });
            setStarting(false);
        });
        if (!seenRef.current) void recordSeen(role);
    }, [role, commit, recordSeen]);

    const next = useCallback(() => {
        const current = tourRef.current;
        if (!current) return;
        if (current.index + 1 >= current.steps.length) {
            endTour();
            return;
        }
        commit({ ...current, index: current.index + 1, failuresInARow: 0 });
    }, [commit, endTour]);

    const back = useCallback(() => {
        const current = tourRef.current;
        if (!current) return;
        commit({ ...current, index: clampStepIndex(current.steps, current.index - 1), failuresInARow: 0 });
    }, [commit]);

    const targetMissing = useCallback(
        (failedIndex: number) => {
            const current = tourRef.current;
            if (!current || failedIndex !== current.index) return;
            const failures = current.failuresInARow + 1;
            const to = stepAfterFailure(current.steps, failedIndex, failures, latest.current.missesBeforeEnd);
            if (to === null) {
                latest.current.onEndedEarly?.();
                endTour();
                return;
            }
            commit({ ...current, index: to, failuresInARow: failures });
        },
        [commit, endTour],
    );

    // Joyride waits on this: reach the step's screen, open the sidebar for a
    // nav tab, wait for the element, and centre the step if it is off screen.
    const beforeStep = useCallback(
        async (index: number) => {
            const current = tourRef.current;
            const step = current?.steps[index];
            if (!current || !step) return;

            const to = navigationForStep(current.steps, index, latest.current.location);
            if (to) latest.current.navigate(to, step.state ? { state: step.state } : undefined);
            let moved = Boolean(to);

            if (step.needsSidebar && !current.isMobile && isSidebarCollapsed() === true) {
                if (clickSidebarToggle()) {
                    sidebarExpandedByTour.current = true;
                    moved = true;
                    await wait(SIDEBAR_SETTLE_MS);
                }
            }

            if (isScreenStep(step)) return;
            const fit = await waitForAnchor(step.anchor, moved, latest.current.anchorOptions);
            if (fit === "missing" && !step.centerIfMissing) return;

            const now = tourRef.current;
            if (!now || now.index !== index) return;
            const shouldCenter = fit !== "in-view";
            if (shouldCenter === now.centered.includes(index)) return;
            commit({
                ...now,
                centered: shouldCenter ? [...now.centered, index] : now.centered.filter((i) => i !== index),
            });
            await wait(STEP_SWAP_MS);
        },
        [commit],
    );

    // Signing out mid-tour ends it; there is no one left to show it to.
    useEffect(() => {
        if (!role) endTour();
    }, [role, endTour]);

    const running = tour !== null;
    const hasRole = role !== null;
    const autoStart = shouldAutoStartTour({
        hasRole,
        infoLoaded,
        seen,
        blocked,
        suppressed,
        running,
        inWorkspace: role !== null && isInWorkspace(role, location.pathname),
    });
    const settled = tourAutoStartSettled({ hasRole, infoLoaded, seen, suppressed });

    // Once per load. `autoStarted` is set BEFORE starting, so a failed
    // seen-write cannot re-offer the tour on the next render.
    useEffect(() => {
        if (!autoStart || autoStarted) return;
        if (!waitForOpenDialogs) {
            setAutoStarted(true);
            startTour();
            return;
        }
        // A dialog that opened by itself (an immediate notification) is waited out, not raced.
        let cancelled = false;
        const attempt = () => {
            if (cancelled) return;
            if (isModalOpen()) {
                timer = window.setTimeout(attempt, DIALOG_POLL_MS);
                return;
            }
            setAutoStarted(true);
            startTour();
        };
        let timer = window.setTimeout(attempt, DIALOG_POLL_MS);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [autoStart, autoStarted, startTour, waitForOpenDialogs]);

    const value = useMemo<ProductTour>(
        () => ({
            available: hasRole,
            running,
            holdsTheScreen: starting || tourHoldsTheScreen({ running, autoStarted, settled }),
            startTour,
        }),
        [hasRole, running, starting, autoStarted, settled, startTour],
    );

    return (
        <TourContext.Provider value={value}>
            {children}
            {tour ? (
                <Suspense fallback={null}>
                    <TourHost
                        {...host}
                        steps={tour.steps}
                        index={tour.index}
                        isMobile={tour.isMobile}
                        centered={tour.centered}
                        anchorOptions={anchorOptions}
                        onBefore={beforeStep}
                        onNext={next}
                        onBack={back}
                        onEnd={endTour}
                        onTargetMissing={targetMissing}
                    />
                </Suspense>
            ) : null}
        </TourContext.Provider>
    );
}
