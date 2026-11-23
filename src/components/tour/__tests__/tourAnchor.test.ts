import { describe, expect, it } from "vitest";

import {
    TOUR_ANCHOR_LIFT_SELECTOR,
    createTourAnchors,
    isAnchorVisible,
    isRectInViewport,
    pickAnchor,
    tourTarget,
} from "../tourAnchor";

// A stand-in for an element: a named box, the control it sits inside, and the controls inside it.
type Fake = {
    name: string;
    getBoundingClientRect(): { width: number; height: number };
    closest(selector: string): Fake | null;
    querySelectorAll(selector: string): Fake[];
};

const LMS_LIFT = "button, a, input, [role='button']";

function fake(
    name: string,
    width: number,
    height: number,
    parent: Fake | null = null,
    children: Fake[] = [],
    lift = TOUR_ANCHOR_LIFT_SELECTOR,
): Fake {
    return {
        name,
        getBoundingClientRect: () => ({ width, height }),
        closest: (selector) => {
            expect(selector).toBe(lift);
            return parent;
        },
        querySelectorAll: (selector) => {
            expect(selector).toBe(lift);
            return children;
        },
    };
}

const ANCHORS = { navSessions: "nav-sessions", headerGuides: "header-guides" } as const;

describe("createTourAnchors", () => {
    const anchors = createTourAnchors(ANCHORS);

    it("round-trips through the props, the selector and the name check", () => {
        expect(anchors.tourAnchorProps(ANCHORS.navSessions)).toEqual({ "data-tour": "nav-sessions" });
        expect(anchors.tourAnchorSelector(ANCHORS.navSessions)).toBe('[data-tour="nav-sessions"]');
        expect(anchors.isTourAnchorName("nav-sessions")).toBe(true);
    });

    it("rejects a name nobody declared", () => {
        expect(anchors.isTourAnchorName("nav-sesions")).toBe(false);
    });
});

describe("isRectInViewport", () => {
    const laptop = { width: 1280, height: 720 };

    it.each([
        ["a header button", { top: 6, left: 1200, bottom: 42, right: 1270 }],
        ["a bottom nav tab flush with the edge", { top: 664, left: 0, bottom: 720, right: 80 }],
        ["a sub-pixel overhang", { top: -0.5, left: 0, bottom: 720.4, right: 1280 }],
    ])("keeps %s", (_label, rect) => {
        expect(isRectInViewport(rect, laptop)).toBe(true);
    });

    it.each([
        ["something below the fold", { top: 1135, left: 300, bottom: 1512, right: 1400 }],
        ["something scrolled above the top", { top: -80, left: 0, bottom: -20, right: 200 }],
        ["something off the right edge", { top: 10, left: 1250, bottom: 40, right: 1320 }],
    ])("rejects %s", (_label, rect) => {
        expect(isRectInViewport(rect, laptop)).toBe(false);
    });
});

describe("isAnchorVisible", () => {
    it.each([
        [{ width: 44, height: 44 }, true],
        [{ width: 0, height: 44 }, false],
        [{ width: 44, height: 0 }, false],
    ])("%j is %s", (rect, visible) => {
        expect(isAnchorVisible(rect)).toBe(visible);
    });
});

describe("pickAnchor", () => {
    // The template renders one icon in the sidebar and the bottom bar; on a
    // phone the sidebar copy comes first and is hidden.
    it("skips the hidden copy of a nav icon for the visible one", () => {
        const sidebarIcon = fake("sidebar icon", 0, 0, fake("sidebar tab", 0, 0));
        const bottomIcon = fake("bottom-bar icon", 0, 0, fake("bottom-bar tab", 64, 64));
        expect(pickAnchor([sidebarIcon, bottomIcon])?.name).toBe("bottom-bar tab");
    });

    it("takes the sidebar tab on a desktop", () => {
        const sidebarIcon = fake("sidebar icon", 0, 0, fake("sidebar tab", 72, 44));
        const bottomIcon = fake("bottom-bar icon", 0, 0, fake("bottom-bar tab", 0, 0));
        expect(pickAnchor([sidebarIcon, bottomIcon])?.name).toBe("sidebar tab");
    });

    it("does not look inside a box-less wrapper by default", () => {
        const wrapper = fake("header span", 0, 0, null, [fake("bell button", 36, 36)]);
        expect(pickAnchor([wrapper])).toBeNull();
    });

    describe("with searchInside and a custom lift", () => {
        const options = { searchInside: true, liftSelector: LMS_LIFT };
        const f = (name: string, w: number, h: number, parent: Fake | null = null, children: Fake[] = []) =>
            fake(name, w, h, parent, children, LMS_LIFT);

        // A header mark wraps a template button that takes no data attributes.
        it("descends from a box-less wrapper to the control inside it", () => {
            const wrapper = f("header span", 0, 0, null, [f("bell button", 36, 36)]);
            expect(pickAnchor([wrapper], options)?.name).toBe("bell button");
        });

        // The notifications bell renders a hidden button before the visible one.
        it("passes over a hidden control inside the wrapper for a visible one", () => {
            const wrapper = f("header span", 0, 0, null, [f("hidden toggle", 0, 0), f("bell button", 36, 36)]);
            expect(pickAnchor([wrapper], options)?.name).toBe("bell button");
        });

        it("prefers the control around a mark to one inside it", () => {
            const wrapper = f("icon span", 0, 0, f("tab", 72, 44), [f("inner", 10, 10)]);
            expect(pickAnchor([wrapper], options)?.name).toBe("tab");
        });
    });

    it("uses a visible element that has no control around it", () => {
        expect(pickAnchor([fake("heading", 800, 32)])?.name).toBe("heading");
    });

    it("is null when nothing is on screen", () => {
        expect(pickAnchor([])).toBeNull();
        expect(pickAnchor([fake("a", 0, 0), fake("b", 0, 0, fake("tab", 0, 0))])).toBeNull();
    });
});

describe("tourTarget", () => {
    // jsdom lays nothing out, so every rect is 0x0: the target must wait, not
    // point at a zero-size box.
    it("is null for a marked element with no box", () => {
        document.body.innerHTML = '<button><span data-tour="nav-sessions"></span></button>';
        expect(tourTarget("nav-sessions")()).toBeNull();
        expect(createTourAnchors(ANCHORS, { searchInside: true }).tourTarget(ANCHORS.navSessions)()).toBeNull();
        document.body.innerHTML = "";
    });
});
