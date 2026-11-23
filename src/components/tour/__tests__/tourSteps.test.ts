import { describe, expect, it } from "vitest";

import { TOUR_SCREEN } from "../tourAnchor";
import {
    clampStepIndex,
    hasSeenTour,
    isTourSuppressed,
    locationKey,
    navigationForStep,
    shouldAutoStartTour,
    stepAfterFailure,
    tourAutoStartSettled,
    tourHoldsTheScreen,
    type TourAutoStartInput,
    type TourStep,
} from "../tourSteps";

const step = (id: string, route: string, extra: Partial<TourStep> = {}): TourStep => ({
    id,
    route,
    anchor: TOUR_SCREEN,
    title: id,
    body: id,
    ...extra,
});

const STEPS = [
    step("welcome", "/"),
    step("paper", "/student/tour-paper?view=run"),
    step("week", "/classes/1", { state: { period: "this-week" } }),
];

describe("navigationForStep", () => {
    it("stays when already on the step's route, query string included", () => {
        expect(navigationForStep(STEPS, 0, { pathname: "/", search: "" })).toBeNull();
        expect(navigationForStep(STEPS, 1, { pathname: "/student/tour-paper", search: "?view=run" })).toBeNull();
    });

    it("moves when the query string differs", () => {
        expect(navigationForStep(STEPS, 1, { pathname: "/student/tour-paper", search: "?view=review" })).toBe(
            "/student/tour-paper?view=run",
        );
    });

    it("always navigates a step that carries router state", () => {
        expect(navigationForStep(STEPS, 2, { pathname: "/classes/1", search: "" })).toBe("/classes/1");
    });

    it("is null past the end", () => {
        expect(navigationForStep(STEPS, 9, { pathname: "/", search: "" })).toBeNull();
    });

    it("reads a bare ? as no query", () => {
        expect(locationKey({ pathname: "/a", search: "?" })).toBe("/a");
    });
});

describe("stepAfterFailure", () => {
    it("skips to the next step until the misses run out", () => {
        expect(stepAfterFailure(STEPS, 0, 1, 2)).toBe(1);
        expect(stepAfterFailure(STEPS, 1, 2, 2)).toBeNull();
        expect(stepAfterFailure(STEPS, 1, 2, 3)).toBe(2);
    });

    it("ends after the last step", () => {
        expect(stepAfterFailure(STEPS, 2, 1, 3)).toBeNull();
    });
});

describe("clampStepIndex", () => {
    it("holds an index inside the list", () => {
        expect(clampStepIndex(STEPS, -1)).toBe(0);
        expect(clampStepIndex(STEPS, 7)).toBe(2);
        expect(clampStepIndex([], 3)).toBe(0);
    });
});

describe("seen and suppressed", () => {
    it("treats only a non-empty string as seen", () => {
        expect(hasSeenTour({ k: "2026-01-01T00:00:00Z" }, "k")).toBe(true);
        expect(hasSeenTour({ k: " " }, "k")).toBe(false);
        expect(hasSeenTour({ k: true }, "k")).toBe(false);
        expect(hasSeenTour(null, "k")).toBe(false);
    });

    it.each([
        ["1", true],
        ["true", true],
        ["0", false],
        [null, false],
    ])("%s suppresses: %s", (value, expected) => {
        expect(isTourSuppressed(value)).toBe(expected);
    });
});

describe("auto-start", () => {
    const ready: TourAutoStartInput = {
        hasRole: true,
        infoLoaded: true,
        seen: false,
        blocked: false,
        suppressed: false,
        running: false,
        inWorkspace: true,
    };

    it("starts for an unseen account on a workspace screen", () => {
        expect(shouldAutoStartTour(ready)).toBe(true);
    });

    it.each(["hasRole", "infoLoaded", "inWorkspace"] as const)("waits without %s", (key) => {
        expect(shouldAutoStartTour({ ...ready, [key]: false })).toBe(false);
    });

    it.each(["seen", "blocked", "suppressed", "running"] as const)("waits while %s", (key) => {
        expect(shouldAutoStartTour({ ...ready, [key]: true })).toBe(false);
    });

    it("is settled only when nothing could bring it back", () => {
        expect(tourAutoStartSettled({ ...ready, hasRole: false })).toBe(true);
        expect(tourAutoStartSettled({ ...ready, suppressed: true })).toBe(true);
        expect(tourAutoStartSettled({ ...ready, seen: true })).toBe(true);
        expect(tourAutoStartSettled({ ...ready, seen: true, infoLoaded: false })).toBe(false);
        expect(tourAutoStartSettled(ready)).toBe(false);
    });

    it("holds the screen while running or still due", () => {
        expect(tourHoldsTheScreen({ running: true, autoStarted: true, settled: true })).toBe(true);
        expect(tourHoldsTheScreen({ running: false, autoStarted: false, settled: false })).toBe(true);
        expect(tourHoldsTheScreen({ running: false, autoStarted: true, settled: false })).toBe(false);
        expect(tourHoldsTheScreen({ running: false, autoStarted: false, settled: true })).toBe(false);
    });
});
