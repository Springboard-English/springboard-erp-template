/*
 * The Springboard push service worker — from @springboard-english/springboard-erp-template.
 *
 * Copy it into the app's build output as `sw.js` and register it with
 * `usePushNotifications` / `PushNotificationsToggle`. It does two things and
 * nothing else: show a push, and open its link when tapped.
 *
 * Deliberately NO `fetch` handler and no caching. Each app's release IS its
 * `index.html` (served no-store, rolled back by swapping it), and a service
 * worker that cached it would keep serving an old release after a deploy or a
 * rollback. Serve this file itself with `Cache-Control: no-cache`, or an update
 * to it can never reach a browser that already has it.
 *
 * The payload is the API's `{title, body, url, tag}` (app/base/services/
 * notifications/web_push.py). `url` is absolute and may belong to the other
 * app: a session push opens the LMS even from HRM's worker.
 */

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
    let message = {};
    try {
        message = event.data ? event.data.json() : {};
    } catch {
        message = { body: event.data ? event.data.text() : "" };
    }
    const scope = self.registration.scope;
    event.waitUntil(
        self.registration.showNotification(message.title || "Springboard", {
            body: message.body || "",
            tag: message.tag || undefined,
            // A same-tag notification replaces the earlier one; say so again.
            renotify: Boolean(message.tag),
            icon: new URL("icons/icon-192.png", scope).href,
            data: { url: message.url || scope },
        }),
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const target = new URL(
        (event.notification.data && event.notification.data.url) || self.registration.scope,
        self.registration.scope,
    );
    event.waitUntil(
        (async () => {
            const windows = await self.clients.matchAll({
                type: "window",
                includeUncontrolled: true,
            });
            for (const client of windows) {
                if (new URL(client.url).origin !== target.origin) continue;
                await client.focus();
                if ("navigate" in client) {
                    try {
                        await client.navigate(target.href);
                        return;
                    } catch {
                        // An uncontrolled window cannot be navigated from here.
                    }
                }
            }
            await self.clients.openWindow(target.href);
        })(),
    );
});
