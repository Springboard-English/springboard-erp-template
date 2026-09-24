import {
    lazy,
    useEffect,
    useState,
    type ComponentProps,
    type ComponentType,
} from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type PreloadableComponent<T extends ComponentType<any>> = ComponentType<
    ComponentProps<T>
> & {
    preload: () => Promise<unknown>;
};

/**
 * `React.lazy` with a `preload()`. Once the chunk has loaded, the component
 * renders without suspending — plain `lazy` suspends once even on a resolved
 * import, which flashes the Suspense fallback when navigation isn't a transition.
 */
export function lazyWithPreload<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>,
): PreloadableComponent<T> {
    let loaded: T | undefined;
    let pending: Promise<{ default: T }> | undefined;

    const load = () => {
        pending ??= factory().then(
            (module) => {
                loaded = module.default;
                return module;
            },
            (error: unknown) => {
                // Forget the failure so the next attempt re-requests the chunk.
                pending = undefined;
                throw error;
            },
        );
        return pending;
    };

    const Lazy = lazy(load);

    function Preloadable(props: ComponentProps<T>) {
        // Chosen once per mount: switching from `Lazy` to `loaded` later would
        // be a different element type and remount the view, losing its state.
        const [Component] = useState<ComponentType<any>>(() => loaded ?? Lazy);
        return <Component {...props} />;
    }

    return Object.assign(Preloadable, { preload: load });
}
/* eslint-enable @typescript-eslint/no-explicit-any */

type IdleWindow = Window & {
    requestIdleCallback?: (callback: () => void) => number;
    cancelIdleCallback?: (handle: number) => void;
};

/** Preloads each component's chunk, one per idle period, after first paint. */
export function usePreloadOnIdle(
    components: ReadonlyArray<{ preload: () => Promise<unknown> }>,
): void {
    useEffect(() => {
        const idle = window as IdleWindow;
        const queue = [...components];
        let handle: number | undefined;
        let cancelled = false;

        const schedule = () => {
            if (cancelled || queue.length === 0) return;
            handle = idle.requestIdleCallback
                ? idle.requestIdleCallback(step)
                : window.setTimeout(step, 200);
        };
        const step = () => {
            const next = queue.shift();
            // A failed preload is not an error: the route retries when visited.
            void next?.preload().catch(() => undefined).finally(schedule);
        };

        schedule();
        return () => {
            cancelled = true;
            if (handle === undefined) return;
            if (idle.cancelIdleCallback) idle.cancelIdleCallback(handle);
            else window.clearTimeout(handle);
        };
        // The route table is module-level and never changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
