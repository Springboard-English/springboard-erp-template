/// <reference types="vite/client" />

/**
 * Where each Springboard app lives, for links from one app into another.
 *
 * Shaped like `API_CONFIG`: the package's own env is frozen at its build, so
 * each app resolves its URLs from its own `import.meta.env` and hands them to
 * `configureAppUrls` at boot. A link into another app is then
 * `appUrl("leap", "/play/ABC123")`.
 */

/** The apps one app links into. */
export type SpringboardApp = "lms" | "leap" | "crm" | "hrm" | "ops" | "accounts" | "practice";

/** Each app's base URL: an origin, plus its path on a shared host. No trailing slash. */
export type AppUrls = Record<SpringboardApp, string>;

/** The production hosts. HRM and CRM are paths on one ERP host. */
export const PRODUCTION_APP_URLS: AppUrls = {
    lms: "https://lms.springboard.vn",
    leap: "https://leap.springboard.vn",
    crm: "https://erp.springboard.vn/crm",
    hrm: "https://erp.springboard.vn/hrm",
    ops: "https://ops.springboard.vn",
    accounts: "https://accounts.springboard.vn",
    practice: "https://app.springboard.vn",
};

/**
 * Under a dev server, the app being linked to runs on `localhost:3000`, the
 * one port besides 5173 that the dev API and dev Hydra accept. Accounts stays
 * on production: dev Hydra signs in through the dev API's own pages, so there
 * is no dev accounts site to link to.
 */
export const DEV_APP_URLS: AppUrls = {
    lms: "http://localhost:3000",
    leap: "http://localhost:3000",
    crm: "http://localhost:3000",
    hrm: "http://localhost:3000/hrm",
    ops: "http://localhost:3000",
    accounts: PRODUCTION_APP_URLS.accounts,
    practice: "http://localhost:3000",
};

/** The env variable that sets each app's URL. */
export const APP_URL_ENV_KEYS = {
    lms: "VITE_LMS_APP_URL",
    leap: "VITE_LEAP_APP_URL",
    crm: "VITE_CRM_APP_URL",
    hrm: "VITE_HRM_APP_URL",
    ops: "VITE_OPS_APP_URL",
    accounts: "VITE_ACCOUNTS_APP_URL",
    practice: "VITE_PRACTICE_APP_URL",
} as const satisfies Record<SpringboardApp, string>;

/** The `import.meta.env` fields `resolveAppUrls` reads. */
export type AppUrlEnv = Partial<Record<(typeof APP_URL_ENV_KEYS)[SpringboardApp], string>> & {
    DEV?: boolean;
};

const APPS = Object.keys(APP_URL_ENV_KEYS) as SpringboardApp[];

const trimUrl = (url: string | undefined): string => url?.trim().replace(/\/+$/, "") ?? "";

/**
 * Every app's base URL from an app's own `import.meta.env`: each
 * `VITE_<APP>_APP_URL` when set (trimmed, no trailing slash); else the dev
 * defaults under a dev server and production in a build.
 */
export function resolveAppUrls(env: AppUrlEnv): AppUrls {
    const defaults = env.DEV ? DEV_APP_URLS : PRODUCTION_APP_URLS;
    const urls = { ...defaults };
    for (const app of APPS) {
        urls[app] = trimUrl(env[APP_URL_ENV_KEYS[app]]) || defaults[app];
    }
    return urls;
}

let _appUrls: AppUrls = resolveAppUrls(
    typeof import.meta !== "undefined" && import.meta.env ? (import.meta.env as AppUrlEnv) : {},
);

/** Replaces the URLs `appUrl` builds from. Call once at boot with `resolveAppUrls(import.meta.env)`. */
export function configureAppUrls(urls: Partial<AppUrls>): void {
    const next = { ..._appUrls };
    for (const app of APPS) {
        const url = trimUrl(urls[app]);
        if (url) next[app] = url;
    }
    _appUrls = next;
}

/** An absolute URL into another app: its base URL followed by `path`, which starts with `/`. */
export function appUrl(app: SpringboardApp, path = ""): string {
    return `${_appUrls[app]}${path}`;
}
