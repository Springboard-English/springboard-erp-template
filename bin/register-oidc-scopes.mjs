#!/usr/bin/env node
/**
 * Add every scope an app requests to its Hydra client, before the app ships.
 *
 * Hydra refuses a whole sign-in with `invalid_scope` when the bundle asks for a
 * scope its client is not registered with, so the client is widened first.
 * Add-only: a scope the app stopped asking for stays, which keeps the bundle
 * still being served working. Run from the app's root, after `npm ci`:
 *
 *     sb-register-oidc-scopes --issuer=https://auth.springboard.vn/dev --client=lms-dev [--dry-run]
 *
 * In Cloud Build the token comes from the metadata server; elsewhere set
 * HYDRA_TOKEN to an identity token for the admin URL.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

const ADMIN_URLS = {
    "https://auth.springboard.vn":
        "https://hydra-admin-254797106218.asia-southeast1.run.app",
    "https://auth.springboard.vn/dev":
        "https://hydra-dev-admin-254797106218.asia-southeast1.run.app",
};
// OIDC_CONFIG.scope always prepends these (src/auth/oidc/config.ts).
const PROTOCOL_SCOPES = ["openid", "offline_access"];

const { values: args } = parseArgs({
    options: {
        issuer: { type: "string" },
        client: { type: "string" },
        module: { type: "string", default: "src/config/oidc.ts" },
        export: { type: "string" },
        "dry-run": { type: "boolean", default: false },
    },
});

function fail(message) {
    console.error(message);
    process.exit(1);
}

async function requestedScopes() {
    // Evaluated, not scanned: some apps compute their list (erp-hrm filters a
    // larger one). runnerImport reads no vite.config, so `@/` is given here.
    const root = process.cwd();
    const appRequire = createRequire(path.join(root, "package.json"));
    const vite = await import(pathToFileURL(appRequire.resolve("vite")).href);
    const { module } = await vite.runnerImport(path.resolve(root, args.module), {
        root,
        logLevel: "error",
        resolve: { alias: { "@": path.join(root, "src") } },
    });
    const names = args.export
        ? [args.export]
        : Object.keys(module).filter((name) => name.endsWith("_OIDC_SCOPE"));
    if (names.length !== 1) {
        fail(`${args.module} must export exactly one *_OIDC_SCOPE, or pass --export (found ${names}).`);
    }
    const value = module[names[0]];
    const scopes = Array.isArray(value) ? value : String(value ?? "").split(/\s+/);
    return [...PROTOCOL_SCOPES, ...scopes.filter(Boolean)];
}

async function identityToken(audience) {
    if (process.env.HYDRA_TOKEN) return process.env.HYDRA_TOKEN;
    const response = await fetch(
        "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity" +
            `?audience=${encodeURIComponent(audience)}`,
        { headers: { "Metadata-Flavor": "Google" } },
    );
    if (!response.ok) fail(`No identity token from the metadata server: ${response.status}`);
    return response.text();
}

async function call(url, token, method = "GET", body) {
    const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: body && JSON.stringify(body),
    });
    if (!response.ok) fail(`${method} ${url}: ${response.status} ${await response.text()}`);
    return response.json();
}

const admin = ADMIN_URLS[args.issuer];
if (!admin || !args.client) {
    fail(`--client and --issuer (one of ${Object.keys(ADMIN_URLS).join(", ")}) are required.`);
}
const wanted = await requestedScopes();
const token = await identityToken(admin);
const url = `${admin}/admin/clients/${encodeURIComponent(args.client)}`;
const held = ((await call(url, token)).scope ?? "").split(/\s+/).filter(Boolean);
const missing = [...new Set(wanted)].filter((scope) => !held.includes(scope));
console.log(JSON.stringify({ client: args.client, requested: wanted.length, missing }));

if (missing.length && !args["dry-run"]) {
    // JSON Patch on /scope only; a PUT would replace the whole client.
    const patch = [{ op: "replace", path: "/scope", value: [...held, ...missing].join(" ") }];
    const after = ((await call(url, token, "PATCH", patch)).scope ?? "").split(/\s+/);
    const absent = missing.filter((scope) => !after.includes(scope));
    if (absent.length) fail(`Hydra did not keep ${absent}`);
    console.log(JSON.stringify({ client: args.client, added: missing }));
}
// The vite runner keeps handles open.
process.exit(0);
