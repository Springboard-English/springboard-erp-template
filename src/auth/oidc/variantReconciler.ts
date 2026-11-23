/**
 * The per-user build bootstrap (`bootstrap/index.html`, stamped by
 * `sb-stamp-bootstrap`) picks which archived build runs from the stored `/me`
 * and publishes its choice as `window.__<app>Variant`. This module reads that
 * back after sign-in.
 */

/** What the bootstrap publishes on `window.__<app>Variant`. */
export interface BootstrapVariant {
    /** The build that loaded, or null while one is still loading. */
    running: string | null;
    /** The build a `/me` record asks for, when the page offers it. */
    pick: (user: unknown) => string;
}

/** An `OidcCallback` `onSignedIn` hook: true when it has taken over navigation. */
export type VariantReconciler = (user: unknown, returnTo: string) => boolean;

export interface VariantReconcilerOptions {
    /** The app's display name in console warnings ("LMS", "Leap"). Defaults to the id. */
    name?: string;
}

/** The sessionStorage key that guards an app's handoff against a reload loop. */
export function variantHandoffKey(appId: string): string {
    return `${appId}.variant.handoff`;
}

/** The bootstrap's `window.__<app>Variant` global, when the bootstrap ran. */
export function readBootstrapVariant(appId: string): BootstrapVariant | undefined {
    return (window as unknown as Record<string, BootstrapVariant | undefined>)[`__${appId}Variant`];
}

/**
 * Builds the `onSignedIn` hook for `OidcCallback`: if live `/me` wants a
 * different build than the one running, reload into it once. The callback has
 * just refreshed the stored `/me`, so a full load of `returnTo` makes the
 * bootstrap choose again, correctly. No-op without the bootstrap (`vite dev`,
 * tests). `appId` is the bootstrap config's `app` (`lms`, `hrm`).
 */
export function createVariantReconciler(
    appId: string,
    options: VariantReconcilerOptions = {},
): VariantReconciler {
    const handoffKey = variantHandoffKey(appId);
    const name = options.name ?? appId;
    return (user, returnTo) => {
        const variant = readBootstrapVariant(appId);
        if (!variant?.running) return false;

        const wanted = variant.pick(user);
        if (wanted === variant.running) {
            sessionStorage.removeItem(handoffKey);
            return false;
        }
        // Finding the guard already set for this pick means the last handoff did
        // not take (that build failed to load and the bootstrap fell back), so
        // stay rather than loop.
        if (sessionStorage.getItem(handoffKey) === wanted) {
            sessionStorage.removeItem(handoffKey);
            console.warn(`${name} build "${wanted}" was wanted but "${variant.running}" loaded`);
            return false;
        }

        sessionStorage.setItem(handoffKey, wanted);
        // `replace`, not `reload`: the callback URL's code is single-use.
        // `returnTo` already carries the router base path.
        window.location.replace(returnTo);
        return true;
    };
}
