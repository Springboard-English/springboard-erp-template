// Where a guided-tour step points. Elements are marked `data-tour="<name>"`,
// and each app keeps every name in one map so the markup and its step list can
// never disagree on spelling; `createTourAnchors(map)` types the helpers to it.
//
// A step never targets the selector string. The template puts a nav item's
// `dataAttributes` on its tab in the desktop sidebar, the mobile bottom bar and
// the menu sheet, so a marked tab exists more than once and only one copy is on
// screen; `tourTarget` picks that copy. A match is lifted to the control around
// it, so a marked wrapper spotlights the whole control.

/** The anchor of a step that sits centred on the screen rather than on an element. */
export const TOUR_SCREEN = "screen";

/** What a match is lifted to by default when the marked element is only a wrapper. */
export const TOUR_ANCHOR_LIFT_SELECTOR = "button, a, [role='button']";

/** How a marked element resolves to the one a step spotlights. */
export interface TourAnchorOptions {
    /** The controls a box-less mark is lifted to. Defaults to `TOUR_ANCHOR_LIFT_SELECTOR`. */
    liftSelector?: string;
    /**
     * Also look INSIDE a box-less mark for the first visible control, e.g. a
     * header span around a template button that takes no data attributes.
     */
    searchInside?: boolean;
}

type RectLike = { width: number; height: number };
type BoxLike = { top: number; left: number; bottom: number; right: number };

/** Anything `pickAnchor` can judge: an element, or a stand-in in a test. */
export interface TourAnchorCandidate<T> {
    getBoundingClientRect(): RectLike;
    closest(selector: string): (T & { getBoundingClientRect(): RectLike }) | null;
    querySelectorAll?(selector: string): Iterable<T & { getBoundingClientRect(): RectLike }>;
}

/** On screen, in the only sense the tour needs: it has a box to point at. */
export function isAnchorVisible(rect: RectLike): boolean {
    return rect.width > 0 && rect.height > 0;
}

/**
 * Whether the whole box is inside the viewport as scrolled now. The tour never
 * scrolls, so a box that fails this gets a centred step instead. `tolerance`
 * absorbs sub-pixel edges.
 */
export function isRectInViewport(
    rect: BoxLike,
    viewport: { width: number; height: number },
    tolerance = 1,
): boolean {
    return (
        rect.top >= -tolerance &&
        rect.left >= -tolerance &&
        rect.bottom <= viewport.height + tolerance &&
        rect.right <= viewport.width + tolerance
    );
}

/**
 * The first candidate, in DOM order, with a real box, or null. Each is lifted
 * to the control around it first, so a wrapped icon resolves to its tab; with
 * `searchInside` a box-less one also resolves to the first visible control
 * inside it. Pure, so it is tested without a DOM.
 */
export function pickAnchor<T extends TourAnchorCandidate<T>>(
    candidates: Iterable<T>,
    options: TourAnchorOptions = {},
): T | null {
    const lift = options.liftSelector ?? TOUR_ANCHOR_LIFT_SELECTOR;
    for (const candidate of candidates) {
        const around = candidate.closest(lift);
        if (around && isAnchorVisible(around.getBoundingClientRect())) return around;
        if (isAnchorVisible(candidate.getBoundingClientRect())) return candidate;
        if (options.searchInside && candidate.querySelectorAll) {
            for (const inside of candidate.querySelectorAll(lift)) {
                if (isAnchorVisible(inside.getBoundingClientRect())) return inside;
            }
        }
    }
    return null;
}

/** The CSS selector for every element marked with `name`. */
export function tourAnchorSelector(name: string): string {
    return `[data-tour="${name}"]`;
}

/** A Joyride `target`: a function, re-evaluated on every poll while a screen loads. */
export function tourTarget(
    name: string,
    options: TourAnchorOptions = {},
): () => HTMLElement | null {
    return () => {
        if (typeof document === "undefined") return null;
        const matches = document.querySelectorAll<HTMLElement>(tourAnchorSelector(name));
        return pickAnchor<HTMLElement>(matches, options);
    };
}

/** The anchor helpers typed to one app's map of names. */
export interface TourAnchors<N extends string> {
    /** Whether `name` is a declared anchor. For the step-list tests. */
    isTourAnchorName: (name: string) => name is N;
    /** Spread onto the element a step points at. */
    tourAnchorProps: (name: N) => { "data-tour": N };
    tourAnchorSelector: (name: N) => string;
    tourTarget: (name: N) => () => HTMLElement | null;
    options: TourAnchorOptions;
}

/** Binds the anchor helpers to an app's `{ key: "name" }` map and its lift options. */
export function createTourAnchors<const M extends Record<string, string>>(
    anchors: M,
    options: TourAnchorOptions = {},
): TourAnchors<M[keyof M]> {
    type N = M[keyof M];
    const names: ReadonlySet<string> = new Set(Object.values(anchors));
    return {
        isTourAnchorName: (name: string): name is N => names.has(name),
        tourAnchorProps: (name: N) => ({ "data-tour": name }),
        tourAnchorSelector: (name: N) => tourAnchorSelector(name),
        tourTarget: (name: N) => tourTarget(name, options),
        options,
    };
}
