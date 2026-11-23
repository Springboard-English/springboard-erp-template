import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
    createVariantReconciler,
    variantHandoffKey,
    type BootstrapVariant,
} from "../variantReconciler";

const replace = vi.fn();
const HANDOFF_KEY = variantHandoffKey("lms");
const reconcileVariant = createVariantReconciler("lms", { name: "LMS" });
const userIn = (name?: string) => ({ info: name ? { lms_variant: name } : {} });
const globals = window as unknown as Record<string, BootstrapVariant | undefined>;

function bootstrapRunning(running: string | null, app = "lms") {
    globals[`__${app}Variant`] = {
        running,
        pick: (user) =>
            (user as { info?: Record<string, string | undefined> }).info?.[`${app}_variant`] ??
            "control",
    };
}

describe("createVariantReconciler", () => {
    beforeEach(() => {
        replace.mockReset();
        vi.stubGlobal("location", { ...window.location, replace });
        sessionStorage.clear();
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        delete globals.__lmsVariant;
        delete globals.__hrmVariant;
    });

    it("keys the handoff guard by app", () => {
        expect(HANDOFF_KEY).toBe("lms.variant.handoff");
        expect(variantHandoffKey("hrm")).toBe("hrm.variant.handoff");
    });

    it("does nothing without the bootstrap", () => {
        expect(reconcileVariant(userIn("b"), "/classes")).toBe(false);
        expect(replace).not.toHaveBeenCalled();
    });

    it("does nothing while the bootstrap is still loading a build", () => {
        bootstrapRunning(null);
        expect(reconcileVariant(userIn("b"), "/classes")).toBe(false);
    });

    it("stays when the running build is the one wanted, and clears the guard", () => {
        bootstrapRunning("b");
        sessionStorage.setItem(HANDOFF_KEY, "b");
        expect(reconcileVariant(userIn("b"), "/classes")).toBe(false);
        expect(replace).not.toHaveBeenCalled();
        expect(sessionStorage.getItem(HANDOFF_KEY)).toBeNull();
    });

    it("hands off to returnTo once when another build is wanted", () => {
        bootstrapRunning("control");
        expect(reconcileVariant(userIn("b"), "/classes/7?tab=a")).toBe(true);
        expect(replace).toHaveBeenCalledWith("/classes/7?tab=a");
        expect(sessionStorage.getItem(HANDOFF_KEY)).toBe("b");
    });

    it("hands back to control when the flag is gone", () => {
        bootstrapRunning("b");
        expect(reconcileVariant(userIn(), "/")).toBe(true);
        expect(replace).toHaveBeenCalledWith("/");
    });

    it("does not loop when the wanted build failed to load", () => {
        bootstrapRunning("control");
        sessionStorage.setItem(HANDOFF_KEY, "b");
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        expect(reconcileVariant(userIn("b"), "/classes")).toBe(false);
        expect(replace).not.toHaveBeenCalled();
        expect(sessionStorage.getItem(HANDOFF_KEY)).toBeNull();
        expect(warn).toHaveBeenCalledWith('LMS build "b" was wanted but "control" loaded');
    });

    it("reads only its own app's bootstrap and guard", () => {
        const reconcileHrm = createVariantReconciler("hrm");
        bootstrapRunning("control");
        expect(reconcileHrm({ info: { hrm_variant: "b" } }, "/hrm/users")).toBe(false);
        bootstrapRunning("control", "hrm");
        expect(reconcileHrm({ info: { hrm_variant: "b" } }, "/hrm/users/7")).toBe(true);
        expect(replace).toHaveBeenCalledWith("/hrm/users/7");
        expect(sessionStorage.getItem("hrm.variant.handoff")).toBe("b");
        expect(sessionStorage.getItem(HANDOFF_KEY)).toBeNull();
    });
});
