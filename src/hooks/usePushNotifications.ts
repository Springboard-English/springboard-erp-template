import { useCallback, useEffect, useRef, useState } from "react";
import {
    fetchPushPublicKey,
    pushSupport,
    registerPushDevice,
    removePushDevice,
    sendTestPush,
    urlBase64ToUint8Array,
    type PushApp,
    type PushEnvironment,
    type PushSupport,
} from "../api_calls/pushNotifications";

export interface UsePushNotificationsOptions {
    /** Which app is asking — `lms` or `erp-hrm`. */
    app: PushApp;
    /**
     * Where the app serves the template's `push-sw.js`, e.g. `/sw.js` or
     * `/hrm/sw.js`. Its directory is the default scope.
     */
    serviceWorkerUrl: string;
    /** Defaults to the service worker's own directory. */
    scope?: string;
}

export interface PushNotificationsState {
    /** Push is possible on this device, on this server, right now. */
    support: PushSupport;
    /** False until the server has said whether push is configured at all. */
    ready: boolean;
    /** The server has VAPID keys; false hides the whole control. */
    available: boolean;
    permission: NotificationPermission | "unsupported";
    enabled: boolean;
    busy: boolean;
    error: string | null;
    enable: () => Promise<void>;
    disable: () => Promise<void>;
    sendTest: () => Promise<void>;
}

function readEnvironment(): PushEnvironment {
    const nav = typeof navigator !== "undefined" ? navigator : undefined;
    const win = typeof window !== "undefined" ? window : undefined;
    return {
        userAgent: nav?.userAgent ?? "",
        platform: nav?.platform ?? "",
        maxTouchPoints: nav?.maxTouchPoints ?? 0,
        standalone:
            (win?.matchMedia?.("(display-mode: standalone)").matches ?? false) ||
            (nav as Navigator & { standalone?: boolean } | undefined)?.standalone === true,
        hasServiceWorker: !!nav && "serviceWorker" in nav,
        hasPushManager: !!win && "PushManager" in win,
        hasNotification: !!win && "Notification" in win,
    };
}

function message(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

/**
 * This browser's push subscription, kept in step with the server.
 *
 * On mount it asks the server whether push is configured, and — if this
 * browser already granted permission and holds a subscription — registers it
 * again. That is deliberate: registration is idempotent on the endpoint, and it
 * repairs the two ways the server's copy goes missing (the row was removed
 * after a 410, or the browser rotated the subscription with nobody signed in to
 * tell the API). It is also what moves a shared device to whoever is signed in
 * now.
 *
 * `enable()` must run from a click: browsers, iOS above all, refuse a
 * permission prompt that no gesture asked for.
 */
export function usePushNotifications({
    app,
    serviceWorkerUrl,
    scope,
}: UsePushNotificationsOptions): PushNotificationsState {
    const [support] = useState<PushSupport>(() => pushSupport(readEnvironment()));
    const [ready, setReady] = useState(false);
    const [available, setAvailable] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission | "unsupported">(() =>
        typeof Notification !== "undefined" ? Notification.permission : "unsupported",
    );
    const [deviceKey, setDeviceKey] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const publicKey = useRef<string | null>(null);

    const registration = useCallback(
        () =>
            navigator.serviceWorker.register(serviceWorkerUrl, scope ? { scope } : undefined),
        [serviceWorkerUrl, scope],
    );

    useEffect(() => {
        if (support !== "supported") {
            setReady(true);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                publicKey.current = await fetchPushPublicKey();
                if (cancelled) return;
                setAvailable(publicKey.current !== null);
                if (publicKey.current === null || Notification.permission !== "granted") return;
                const existing = await (await registration()).pushManager.getSubscription();
                if (!existing || cancelled) return;
                const device = await registerPushDevice(existing, app);
                if (!cancelled) setDeviceKey(device.appsheet_key);
            } catch (caught) {
                // Not fatal: the switch reads "off" and turning it on retries.
                if (!cancelled) setError(message(caught));
            } finally {
                if (!cancelled) setReady(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [support, app, registration]);

    const enable = useCallback(async () => {
        if (support !== "supported" || !publicKey.current) return;
        setBusy(true);
        setError(null);
        try {
            const granted = await Notification.requestPermission();
            setPermission(granted);
            if (granted !== "granted") return;
            const reg = await registration();
            await navigator.serviceWorker.ready;
            const subscription =
                (await reg.pushManager.getSubscription()) ??
                (await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey.current),
                }));
            const device = await registerPushDevice(subscription, app);
            setDeviceKey(device.appsheet_key);
        } catch (caught) {
            setError(message(caught));
        } finally {
            setBusy(false);
        }
    }, [support, app, registration]);

    const disable = useCallback(async () => {
        if (support !== "supported") return;
        setBusy(true);
        setError(null);
        try {
            if (deviceKey) await removePushDevice(deviceKey);
            const reg = await navigator.serviceWorker.getRegistration(scope ?? serviceWorkerUrl);
            await (await reg?.pushManager.getSubscription())?.unsubscribe();
            setDeviceKey(null);
        } catch (caught) {
            setError(message(caught));
        } finally {
            setBusy(false);
        }
    }, [support, deviceKey, scope, serviceWorkerUrl]);

    const sendTest = useCallback(async () => {
        if (!deviceKey) return;
        setBusy(true);
        setError(null);
        try {
            await sendTestPush(deviceKey);
        } catch (caught) {
            setError(message(caught));
        } finally {
            setBusy(false);
        }
    }, [deviceKey]);

    return {
        support,
        ready,
        available,
        permission,
        enabled: deviceKey !== null,
        busy,
        error,
        enable,
        disable,
        sendTest,
    };
}
