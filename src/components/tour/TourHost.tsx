import { useMemo } from "react";
import {
    ACTIONS,
    EVENTS,
    Joyride,
    ORIGIN,
    type EventData,
    type Step,
    type TooltipRenderProps,
} from "react-joyride";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { touchHitArea } from "../../lib/touchTarget";
import { cn } from "../../lib/utils";
import { tourTarget, type TourAnchorOptions } from "./tourAnchor";
import { isScreenStep, type TourStep } from "./tourSteps";

// The only module that imports react-joyride; TourProvider lazy-loads it, so
// the library is its own chunk and costs nothing until someone takes a tour.
// Joyride runs CONTROLLED, and its events come back as intents. Deliberate:
//
// - ESCAPE ENDS THE TOUR. Joyride's Escape only closes the step, so a keyboard
//   CLOSE is treated as the end. The e2e scripts rely on one Escape.
// - A BACKDROP CLICK DOES NOTHING: scripts click at fixed points to clear other
//   overlays, and a stray click should not move the tour.
// - THE HIGHLIGHTED CONTROL CANNOT BE CLICKED: it is a real control (a nav tab,
//   Submit), and a click would leave the screen the tour is on.

// Above the header (50) and every template overlay (60); below an app's
// must-win dialog (70), such as Leap's terms or the what's-new note.
const TOUR_Z_INDEX = 65;
// A step's screen may still be downloading its chunk; Joyride's default is 1s.
const TARGET_WAIT_MS = 12_000;
const BEFORE_TIMEOUT_MS = 15_000;
// With scrolling off a step near the bottom has no room below its element;
// shifting on the cross axis lets the tooltip overlap it rather than leave the window.
const FLOATING_OPTIONS = { shiftOptions: { crossAxis: true, padding: 12 } };

/** The tooltip's words, in the reader's language. */
export interface TourLabels {
    /** The "2 of 9" line. */
    progress: (current: number, total: number) => string;
    /** The ✕ button's accessible name. */
    close: string;
    skip: string;
    back: string;
    /** The primary button's text, and its accessible name. */
    next: string;
    nextStep: string;
    done: string;
    finish: string;
}

/** Class overrides for the tooltip, for an app with its own type scale. */
export interface TourTooltipClassNames {
    tooltip?: string;
    progress?: string;
    title?: string;
    body?: string;
}

/** How the host draws steps; every field has a default. */
export interface TourHostOptions {
    labels?: Partial<TourLabels>;
    classNames?: TourTooltipClassNames;
    /** Anchors inside `position: fixed` chrome (the header), which Joyride must position against the window. */
    fixedAnchors?: readonly string[];
    /** Anchors starting with this are nav tabs, fixed on a phone (the bottom bar). Defaults to "nav-". */
    navAnchorPrefix?: string;
}

export const DEFAULT_TOUR_LABELS: TourLabels = {
    progress: (current, total) => `${current} of ${total}`,
    close: "Skip tour",
    skip: "Skip tour",
    back: "Back",
    next: "Next",
    nextStep: "Next step",
    done: "Done",
    finish: "Finish tour",
};

function tooltipComponent(labels: TourLabels, classNames: TourTooltipClassNames) {
    /** The tour's tooltip card: progress, ✕, title, body, Skip / Back / Next. */
    return function TourTooltip({
        backProps,
        closeProps,
        primaryProps,
        skipProps,
        tooltipProps,
        step,
        index,
        size,
        isLastStep,
    }: TooltipRenderProps) {
        const primaryName = isLastStep ? labels.finish : labels.nextStep;
        return (
            <div
                {...tooltipProps}
                className={cn(
                    "w-[min(24rem,calc(100vw-2rem))] rounded-2xl border bg-popover p-5 text-left text-popover-foreground shadow-2xl",
                    classNames.tooltip,
                )}
            >
                <div className="flex items-start justify-between gap-3">
                    <p className={cn("text-[11px] font-semibold text-primary", classNames.progress)}>
                        {labels.progress(index + 1, size)}
                    </p>
                    <button
                        {...closeProps}
                        // After the spread: a name a script can tell apart from every other close.
                        aria-label={labels.close}
                        title={labels.close}
                        className={`${touchHitArea} relative -m-1 grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground`}
                    >
                        <X className="size-4" />
                    </button>
                </div>
                {step.title ? (
                    <h2 className={cn("mt-1 text-base font-semibold leading-snug", classNames.title)}>
                        {step.title}
                    </h2>
                ) : null}
                <div className={cn("mt-2 text-sm leading-relaxed text-muted-foreground", classNames.body)}>
                    {step.content}
                </div>
                <div className="mt-5 flex items-center justify-between gap-2">
                    {isLastStep ? (
                        <span />
                    ) : (
                        <Button {...skipProps} aria-label={labels.skip} title={labels.skip} variant="ghost" size="sm">
                            {labels.skip}
                        </Button>
                    )}
                    <div className="flex items-center gap-2">
                        {index > 0 ? (
                            <Button {...backProps} aria-label={labels.back} title={labels.back} variant="outline" size="sm">
                                {labels.back}
                            </Button>
                        ) : null}
                        <Button
                            {...primaryProps}
                            // After the spread: tables and the runner have their own "Next" buttons.
                            aria-label={primaryName}
                            title={primaryName}
                            size="sm"
                        >
                            {isLastStep ? labels.done : labels.next}
                        </Button>
                    </div>
                </div>
            </div>
        );
    };
}

export interface TourHostProps extends TourHostOptions {
    steps: readonly TourStep[];
    index: number;
    isMobile: boolean;
    /** Steps shown centred because their element was off screen. */
    centered: readonly number[];
    anchorOptions?: TourAnchorOptions;
    onBefore: (index: number) => Promise<void>;
    onNext: () => void;
    onBack: () => void;
    onEnd: () => void;
    onTargetMissing: (index: number) => void;
}

/** Draws the running tour with Joyride and reports the reader's intents to `TourProvider`. */
export function TourHost({
    steps,
    index,
    isMobile,
    centered,
    anchorOptions,
    labels,
    classNames,
    fixedAnchors,
    navAnchorPrefix = "nav-",
    onBefore,
    onNext,
    onBack,
    onEnd,
    onTargetMissing,
}: TourHostProps) {
    const Tooltip = useMemo(
        () => tooltipComponent({ ...DEFAULT_TOUR_LABELS, ...labels }, classNames ?? {}),
        [labels, classNames],
    );

    // Rebuilt only when a step switches to centred, which Joyride takes
    // without resetting the tour.
    const joyrideSteps = useMemo<Step[]>(() => {
        const centeredSet = new Set(centered);
        const fixed = new Set(fixedAnchors ?? []);
        return steps.map((step, stepIndex) => {
            const isCentered = isScreenStep(step) || centeredSet.has(stepIndex);
            const inFixedChrome =
                fixed.has(step.anchor) || (isMobile && step.anchor.startsWith(navAnchorPrefix));
            return {
                id: step.id,
                target: isCentered ? "body" : tourTarget(step.anchor, anchorOptions),
                placement: isCentered ? "center" : step.placement,
                title: step.title,
                content: step.body,
                isFixed: inFixedChrome && !isCentered,
                before: () => onBefore(stepIndex),
            };
        });
    }, [steps, isMobile, centered, fixedAnchors, navAnchorPrefix, anchorOptions, onBefore]);

    const handleEvent = (data: EventData) => {
        switch (data.type) {
            case EVENTS.STEP_AFTER:
                if (data.action === ACTIONS.PREV) onBack();
                else if (data.action === ACTIONS.SKIP) onEnd();
                else if (data.action === ACTIONS.CLOSE) {
                    // Escape: end the tour. Any other close advances, as Joyride means it.
                    if (data.origin === ORIGIN.KEYBOARD) onEnd();
                    else onNext();
                } else if (data.action === ACTIONS.NEXT) onNext();
                return;
            case EVENTS.TARGET_NOT_FOUND:
                if (import.meta.env.DEV) {
                    console.warn(`[tour] no element for step "${steps[data.index]?.id}"`);
                }
                onTargetMissing(data.index);
                return;
            case EVENTS.TOUR_END:
                onEnd();
                return;
            default:
                return;
        }
    };

    return (
        <Joyride
            steps={joyrideSteps}
            stepIndex={index}
            // Never `run` an empty list: react-joyride issue 1211, such a tour never starts.
            run={joyrideSteps.length > 0}
            continuous
            onEvent={handleEvent}
            tooltipComponent={Tooltip}
            loaderComponent={null}
            floatingOptions={FLOATING_OPTIONS}
            options={{
                // THE TOUR NEVER SCROLLS; an off-screen element gets a centred step.
                skipScroll: true,
                zIndex: TOUR_Z_INDEX,
                targetWaitTimeout: TARGET_WAIT_MS,
                beforeTimeout: BEFORE_TIMEOUT_MS,
                dismissKeyAction: "close",
                closeButtonAction: "skip",
                overlayClickAction: false,
                blockTargetInteraction: true,
                skipBeacon: true,
                spotlightPadding: 8,
                spotlightRadius: 16,
                overlayColor: "rgba(15, 23, 42, 0.55)",
                // Custom properties, not hex: Joyride writes inline styles, and a
                // literal white stays white in dark mode.
                arrowColor: "var(--popover)",
                backgroundColor: "var(--popover)",
            }}
        />
    );
}

export default TourHost;
