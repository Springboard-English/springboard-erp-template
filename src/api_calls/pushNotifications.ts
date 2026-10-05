import { API_CONFIG } from "../config/api";
import { fetchWithRefresh } from "./fetchWithRefresh";
import { ApiError, throwIfNotOk } from "./apiErrors";

/**
 * Web Push: the caller's own devices, under `/v2/users/me/push-*`.
 *
 * The API decides what is pushed (a session assigned or cancelled, a payroll
 * generated); this file only registers, removes and tests THIS browser. Every
 * route answers 503 on a server with no VAPID keys, which the hook reads as
 * "push is not offered here" rather than as an error.
 *
 * The pure helpers at the bottom decide whether a device can take part at all,
 * and are tested; the DOM-touching halves live in `usePushNotifications`.
 */

/** Which app registered a device. Informational on the server. */
export type PushApp = "lms" | "erp-hrm";

export interface PushDevice {
    appsheet_key: string;
    app: string;
    user_agent: string | null;
    created_at: string | null;
    last_success_at: string | null;
    last_failure_at: string | null;
}

const base = () => `${API_CONFIG.baseURL}/v2/users/me`;

function firstObject<T>(data: unknown): T {
    const objects = (data as { objects?: unknown[] } | null)?.objects;
    if (!Array.isArray(objects) || objects.length === 0) {
        throw new Error("The server answered without an object.");
    }
    return objects[0] as T;
}

/** The server's VAPID public key, or null when push is not configured (503). */
export async function fetchPushPublicKey(): Promise<string | null> {
    const response = await fetchWithRefresh(`${base()}/push-config`, {
        method: "GET",
        headers: { Accept: "application/json" },
    });
    if (response.status === 503) return null;
    await throwIfNotOk(response, "Failed to read the push configuration");
    return firstObject<{ vapid_public_key: string }>(await response.json())
        .vapid_public_key;
}

/** Store this browser's subscription; idempotent on its endpoint. */
export async function registerPushDevice(
    subscription: PushSubscription,
    app: PushApp,
): Promise<PushDevice> {
    const json = subscription.toJSON();
    const response = await fetchWithRefresh(`${base()}/push-subscriptions`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            endpoint: json.endpoint,
            keys: json.keys,
            expirationTime: json.expirationTime ?? null,
            app,
            user_agent:
                typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 512) : null,
        }),
    });
    await throwIfNotOk(response, "Failed to turn on push notifications");
    return firstObject<PushDevice>(await response.json());
}

/** Forget one device. A 404 means it is already gone, which is the goal. */
export async function removePushDevice(deviceKey: string): Promise<void> {
    const response = await fetchWithRefresh(
        `${base()}/push-subscriptions/${encodeURIComponent(deviceKey)}`,
        { method: "DELETE" },
    );
    if (response.status === 404) return;
    await throwIfNotOk(response, "Failed to turn off push notifications");
}

/** Queue "notifications are on" to one device. */
export async function sendTestPush(deviceKey: string): Promise<void> {
    const response = await fetchWithRefresh(
        `${base()}/push-subscriptions/${encodeURIComponent(deviceKey)}/test`,
        { method: "POST", headers: { Accept: "application/json" } },
    );
    await throwIfNotOk(response, "Failed to send a test notification");
}

export function isPushUnavailableError(error: unknown): boolean {
    return error instanceof ApiError && error.status === 503;
}

// --- pure ----------------------------------------------------------------

/** A VAPID key (base64url) as the bytes `applicationServerKey` takes. */
export function urlBase64ToUint8Array(base64Url: string): Uint8Array<ArrayBuffer> {
    const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    const bytes = new Uint8Array(new ArrayBuffer(raw.length));
    for (let i = 0; i < raw.length; i += 1) bytes[i] = raw.charCodeAt(i);
    return bytes;
}

export interface PushEnvironment {
    userAgent: string;
    platform: string;
    maxTouchPoints: number;
    /** `display-mode: standalone`, or Safari's own `navigator.standalone`. */
    standalone: boolean;
    hasServiceWorker: boolean;
    hasPushManager: boolean;
    hasNotification: boolean;
}

/**
 * iPhone, iPad or iPod — including an iPad in its default "desktop website"
 * mode, which reports `MacIntel` and is told apart by its touch points (the
 * same rule Leap's device check uses). Every browser on these is WebKit.
 */
export function isAppleMobile(env: Pick<PushEnvironment, "userAgent" | "platform" | "maxTouchPoints">): boolean {
    if (/iPhone|iPad|iPod/.test(env.userAgent)) return true;
    return env.platform === "MacIntel" && env.maxTouchPoints > 1;
}

export type PushSupport =
    /** Push works here. */
    | "supported"
    /** iOS/iPadOS in the browser: push works only from a Home Screen app. */
    | "needs-install"
    /** No Push API at all (an in-app webview, an old browser). */
    | "unsupported";

/**
 * Whether this device can take push. On iOS the Push API does not exist in a
 * Safari tab at all — only once the site is added to the Home Screen and opened
 * from there — so a missing API on an Apple mobile device means "install
 * first", and anywhere else it means "not here".
 */
export function pushSupport(env: PushEnvironment): PushSupport {
    const apis = env.hasServiceWorker && env.hasPushManager && env.hasNotification;
    if (apis) return "supported";
    if (isAppleMobile(env) && !env.standalone) return "needs-install";
    return "unsupported";
}
