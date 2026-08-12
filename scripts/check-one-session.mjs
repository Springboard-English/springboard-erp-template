// Post-build check: the two entry points must share ONE access token.
//
// The token lives in module scope in src/auth/accessToken.ts, which is only safe
// because Rollup emits `transport.js` as a shared chunk that `index.js` imports
// from. If a future build config ever inlines the module into both bundles
// instead, sign-in (component library) would arm one token while an app's API
// layer (transport) read another, empty one — and every request after a
// successful login would 401. That failure looks exactly like the iOS cookie bug
// this whole change exists to fix, so it is worth a guard that runs every build
// rather than a comment nobody re-reads.
//
// Run: node scripts/check-one-session.mjs   (wired into `npm run build`)
import { readFileSync } from "node:fs";

const index = readFileSync(new URL("../dist/index.js", import.meta.url), "utf8");

// The component library must not carry its own copy: it has to import the
// transport chunk rather than bundle it.
const importsTransport = /from\s*["']\.\/transport\.js["']/.test(index);
if (!importsTransport) {
  console.error(
    "dist/index.js does not import ./transport.js — the auth module is likely\n" +
      "duplicated across the two entries, which splits the session in two.\n" +
      "Fix the chunking (or move the token to a shared holder) before shipping.",
  );
  process.exit(1);
}

// And the token functions must be defined in exactly one place. Importing the
// component library in Node needs a stub for the one DOM call its markdown
// dependency makes while initialising — the very thing the transport entry point
// exists to spare consumers.
globalThis.document ??= {
  createElement: () => ({ innerHTML: "", textContent: "" }),
  querySelector: () => null,
  addEventListener: () => {},
};
globalThis.window ??= globalThis;

const { getAccessToken, setAccessToken } = await import("../dist/transport.js");
const viaIndex = await import("../dist/index.js");

setAccessToken("probe-token", 123);
if (viaIndex.getAccessToken() !== "probe-token" || getAccessToken() !== "probe-token") {
  console.error("the two entry points hold separate access tokens");
  process.exit(1);
}

viaIndex.clearAccessToken();
if (getAccessToken() !== null) {
  console.error("clearing through one entry point did not clear the other");
  process.exit(1);
}

console.log("one session across both entry points ✓");
