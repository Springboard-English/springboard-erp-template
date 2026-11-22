import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TOUR_SCREEN } from "../tourAnchor";
import type { TourHostProps } from "../TourHost";
import { TourProvider, useProductTour, type TourProviderProps } from "../TourProvider";
import type { TourStep } from "../tourSteps";

/**
 * The provider owns the tour's state; Joyride is mocked out, since jsdom lays
 * nothing out. The stand-in host shows the step and calls the intents.
 */

const hostProps = vi.hoisted(() => ({ current: null as TourHostProps | null }));
vi.mock("../TourHost", () => ({
    TourHost: (props: TourHostProps) => {
        hostProps.current = props;
        return <p data-testid="step">{props.steps[props.index]?.id}</p>;
    },
}));

const STEPS: TourStep[] = [
    { id: "welcome", route: "/home", anchor: TOUR_SCREEN, title: "Hi", body: "Welcome" },
    { id: "classes", route: "/classes", anchor: TOUR_SCREEN, title: "Classes", body: "Your classes" },
];

function Where() {
    return <span data-testid="path">{useLocation().pathname}</span>;
}

function Replay() {
    const tour = useProductTour();
    return (
        <button type="button" onClick={tour.startTour} data-holds={String(tour.holdsTheScreen)}>
            replay {String(tour.available)}
        </button>
    );
}

type Props = Partial<TourProviderProps<"student">>;

function renderTour(props: Props = {}, path = "/home") {
    const all: TourProviderProps<"student"> = {
        role: "student",
        getSteps: () => STEPS,
        infoLoaded: true,
        seen: false,
        markSeen: vi.fn(async () => {}),
        isInWorkspace: (_role, pathname) => pathname === "/home",
        suppressedStorageKey: "test:tour-disabled",
        children: (
            <>
                <Replay />
                <Where />
            </>
        ),
        ...props,
    };
    return { props: all, ...render(<MemoryRouter initialEntries={[path]}><TourProvider {...all} /></MemoryRouter>) };
}

const host = () => hostProps.current!;

describe("TourProvider", () => {
    beforeEach(() => {
        hostProps.current = null;
        localStorage.clear();
        vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
    });
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("starts by itself for an unseen account and records it as seen", async () => {
        const { props } = renderTour();
        expect(await screen.findByTestId("step")).toHaveTextContent("welcome");
        expect(props.markSeen).toHaveBeenCalledWith("student");
    });

    it.each<[string, Props, string]>([
        ["a seen account", { seen: true }, "/home"],
        ["a blocked screen", { blocked: true }, "/home"],
        ["a record still loading", { infoLoaded: false }, "/home"],
        ["a screen outside the workspace", {}, "/classes/7"],
        ["no role", { role: null }, "/home"],
    ])("does not start by itself for %s", async (_label, props, path) => {
        renderTour(props, path);
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
        expect(screen.queryByTestId("step")).toBeNull();
    });

    it("does not start by itself where the scripts' switch is on", async () => {
        localStorage.setItem("test:tour-disabled", "1");
        renderTour();
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 30));
        });
        expect(screen.queryByTestId("step")).toBeNull();
    });

    it("replays from the first step and walks each step's route", async () => {
        const { props } = renderTour({ seen: true });
        act(() => screen.getByRole("button", { name: /replay/ }).click());
        expect(await screen.findByTestId("step")).toHaveTextContent("welcome");
        expect(props.markSeen).not.toHaveBeenCalled();

        act(() => host().onNext());
        expect(screen.getByTestId("step")).toHaveTextContent("classes");
        await act(async () => {
            await host().onBefore(1);
        });
        expect(screen.getByTestId("path")).toHaveTextContent("/classes");

        act(() => host().onBack());
        expect(screen.getByTestId("step")).toHaveTextContent("welcome");
    });

    it("ends after the last step and tells the app", async () => {
        const onEnd = vi.fn();
        renderTour({ onEnd });
        await screen.findByTestId("step");
        act(() => host().onNext());
        act(() => host().onNext());
        expect(screen.queryByTestId("step")).toBeNull();
        expect(onEnd).toHaveBeenCalledWith(expect.objectContaining({ pathname: "/home" }));
    });

    it("skips a missing element, then ends early after too many misses", async () => {
        const onEndedEarly = vi.fn();
        renderTour({ onEndedEarly, missesBeforeEnd: 1 });
        await screen.findByTestId("step");
        act(() => host().onTargetMissing(0));
        expect(screen.queryByTestId("step")).toBeNull();
        expect(onEndedEarly).toHaveBeenCalled();
    });

    it("holds the screen while a tour is due, and lets go once it has started", async () => {
        renderTour();
        expect(screen.getByRole("button", { name: /replay/ })).toHaveAttribute("data-holds", "true");
        await screen.findByTestId("step");
        act(() => host().onEnd());
        await waitFor(() =>
            expect(screen.getByRole("button", { name: /replay/ })).toHaveAttribute("data-holds", "false"),
        );
    });

    it("passes the host options through", async () => {
        renderTour({ host: { fixedAnchors: ["header-guides"], labels: { skip: "Bỏ qua" } } });
        await screen.findByTestId("step");
        expect(host().fixedAnchors).toEqual(["header-guides"]);
        expect(host().labels).toEqual({ skip: "Bỏ qua" });
    });
});
