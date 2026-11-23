// The guided tour's pure rules: what a step is, where to go before one, what a
// missing element does, and when a tour may open by itself. The provider uses
// these; each app keeps its own step lists, roles and seen-stamp storage.

import type { ReactNode } from "react";
import { TOUR_SCREEN } from "./tourAnchor";

export type TourPlacement = "top" | "bottom" | "left" | "right" | "center";

/** One step, already in the reader's language. Captured once at tour start. */
export interface TourStep {
    /** Unique within the tour. */
    id: string;
    /** Where the step is read: a pathname, plus a query string where screens differ by one. */
    route: string;
    /** Router state sent with the route; a step carrying it always navigates, even to the same path. */
    state?: Record<string, unknown>;
    /** A `data-tour` name, or `TOUR_SCREEN` for a centred step. */
    anchor: string;
    title: ReactNode;
    body: ReactNode;
    placement?: TourPlacement;
    /** A nav tab: the tour expands a collapsed desktop sidebar before showing it. */
    needsSidebar?: boolean;
    /** Shown centred when its element never appears, instead of skipped. */
    centerIfMissing?: boolean;
}

/** Whether a step is centred on the screen by design. */
export function isScreenStep(step: Pick<TourStep, "anchor">): boolean {
    return step.anchor === TOUR_SCREEN;
}

/** A location in the form steps store routes in: pathname plus query string. */
export function locationKey(location: { pathname: string; search: string }): string {
    const search = location.search === "?" ? "" : location.search;
    return `${location.pathname}${search}`;
}

/**
 * Where to go before showing `index`, or null when already there. Compares the
 * query string too. A step that carries router state always navigates: the
 * state is what the screen reads.
 */
export function navigationForStep(
    steps: readonly TourStep[],
    index: number,
    location: { pathname: string; search: string },
): string | null {
    const step = steps[index];
    if (!step) return null;
    if (step.state) return step.route;
    return locationKey(location) === step.route ? null : step.route;
}

/**
 * Where to go after a step's element never appeared, or null to end. A miss is
 * normal (a scope the account lacks hides a panel), so the tour skips on; a run
 * of `missesBeforeEnd` means the screen itself never came, and the tour ends.
 */
export function stepAfterFailure(
    steps: readonly TourStep[],
    failedIndex: number,
    failuresInARow: number,
    missesBeforeEnd: number,
): number | null {
    if (failuresInARow >= missesBeforeEnd) return null;
    return failedIndex + 1 < steps.length ? failedIndex + 1 : null;
}

/** `index` held inside the step list. */
export function clampStepIndex(steps: readonly TourStep[], index: number): number {
    if (steps.length === 0) return 0;
    return Math.min(Math.max(0, Math.trunc(index)), steps.length - 1);
}

/** Whether an account's `info` carries the given tour's seen-stamp (a non-empty string). */
export function hasSeenTour(info: Record<string, unknown> | null | undefined, key: string): boolean {
    const value = info?.[key];
    return typeof value === "string" && value.trim().length > 0;
}

/** Reads the scripts' stored off switch. Anything but an explicit "on" means not suppressed. */
export function isTourSuppressed(storedValue: string | null | undefined): boolean {
    return storedValue === "1" || storedValue === "true";
}

/** What decides whether a tour opens by itself now. */
export interface TourAutoStartInput {
    /** Whether a tour exists for the signed-in account. */
    hasRole: boolean;
    /** The signed-in record has loaded; never decide on a pending read. */
    infoLoaded: boolean;
    /** The account has seen this tour. */
    seen: boolean;
    /** Something of the app's must go first: a dialog on screen, terms not yet accepted. */
    blocked: boolean;
    /** This browser opted out. */
    suppressed: boolean;
    /** A tour is already running. */
    running: boolean;
    /** The reader is on a screen the tour may open over. */
    inWorkspace: boolean;
}

/** Every clause is a reason not to start; yes only when none applies. */
export function shouldAutoStartTour(input: TourAutoStartInput): boolean {
    if (!input.hasRole || !input.infoLoaded) return false;
    if (input.blocked || input.seen || input.suppressed || input.running) return false;
    return input.inWorkspace;
}

/**
 * True only when nothing could bring the tour back this load: no role, an
 * opted-out browser, or an account that has seen it. Not the negation of
 * `shouldAutoStartTour`, which also goes false for reasons that pass.
 */
export function tourAutoStartSettled(
    input: Pick<TourAutoStartInput, "hasRole" | "infoLoaded" | "seen" | "suppressed">,
): boolean {
    if (!input.hasRole || input.suppressed) return true;
    return input.infoLoaded && input.seen;
}

/**
 * Whether anything else that opens by itself (the what's-new note) must wait:
 * while a tour runs, and while one is still due this load.
 */
export function tourHoldsTheScreen(input: {
    running: boolean;
    /** A tour already opened by itself this load. */
    autoStarted: boolean;
    settled: boolean;
}): boolean {
    if (input.running) return true;
    return !input.autoStarted && !input.settled;
}
