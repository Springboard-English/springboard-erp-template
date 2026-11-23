/**
 * The per-app settings the build kit (`sb-stamp-bootstrap`, `sb-rollback`)
 * needs, read from the `springboardBootstrap` key of the app's package.json and
 * overridable by flags. Run directly with `--shell` to print `app`, `bucket` and
 * the bucket prefix one per line, which is how `rollback.sh` reads them.
 *
 *     "springboardBootstrap": {
 *       "app": "hrm",                 // slot id hrm-releases, info.hrm_variant, window.__hrmVariant
 *       "name": "HRM",                // <title>, console warnings
 *       "failureName": "HRM",         // "<failureName> could not load…"; defaults to name
 *       "base": "/hrm",               // the path the app is served under; "" at the root
 *       "description": "…",           // optional <meta name="description">
 *       "bucket": "springboard_erp-hrm"
 *     }
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const CONFIG_KEY = "springboardBootstrap";

// Inlined into an HTML <script> and JS identifiers, so each value is held to a
// shape that cannot break out of either.
const APP = /^[a-z][a-z0-9]*$/;
const BASE = /^(\/[a-z0-9-]+)*$/;
const TEXT = /^[^<>"'`$\\&]*$/;
const BUCKET = /^[a-z0-9._-]+$/;

/** Throws when a config value would be unsafe to inline; returns the normalised config. */
export function validateBootstrapConfig(config) {
    const out = { ...config, base: config.base ?? "" };
    if (!out.app || !APP.test(out.app)) throw new Error(`app "${out.app ?? ""}" must match ${APP}`);
    if (!BASE.test(out.base)) throw new Error(`base "${out.base}" must match ${BASE} (no trailing slash)`);
    if (!out.name || !TEXT.test(out.name)) throw new Error(`name "${out.name ?? ""}" is missing or holds markup characters`);
    out.failureName = out.failureName ?? out.name;
    if (!TEXT.test(out.failureName)) throw new Error(`failureName "${out.failureName}" holds markup characters`);
    if (out.description !== undefined && !TEXT.test(out.description)) {
        throw new Error("description holds markup characters");
    }
    if (out.bucket !== undefined && !BUCKET.test(out.bucket)) throw new Error(`bucket "${out.bucket}" must match ${BUCKET}`);
    return out;
}

/** Reads `springboardBootstrap` from `<root>/package.json` (absent file or key → {}) and lays `overrides` over it. */
export function readBootstrapConfig(root, overrides = {}) {
    const pkgPath = resolve(root, "package.json");
    const fromPkg = existsSync(pkgPath)
        ? (JSON.parse(readFileSync(pkgPath, "utf8"))[CONFIG_KEY] ?? {})
        : {};
    const defined = Object.fromEntries(
        Object.entries(overrides).filter(([, value]) => value !== undefined),
    );
    return validateBootstrapConfig({ ...fromPkg, ...defined });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    if (process.argv[2] !== "--shell") {
        console.error("usage: bootstrap-config.mjs --shell");
        process.exit(2);
    }
    try {
        const config = readBootstrapConfig(process.cwd());
        if (!config.bucket) throw new Error(`no "bucket" under ${CONFIG_KEY} in package.json`);
        console.log([config.app, config.bucket, config.base.replace(/^\//, "")].join("\n"));
    } catch (error) {
        console.error(`bootstrap config: ${error.message}`);
        process.exit(1);
    }
}
