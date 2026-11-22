import { describe, expect, it } from "vitest";

import { ENGLISH_MESSAGES, VIETNAMESE_MESSAGES } from "./messages";

// Every source file of the package as text, tests and this catalog left out.
const source = Object.values(
  import.meta.glob<string>(["/src/**/*.{ts,tsx}", "!**/*.test.*", "!**/__tests__/**", "!/src/i18n/messages.ts"], {
    query: "?raw",
    import: "default",
    eager: true,
  }),
).join("\n");

// Keys built at run time, as `${prefix}${value}`.
const DYNAMIC_PREFIXES = ["account.type.", "app.notification.", "changelog.kind.", "guides.section.", "widgets.size."];

// Keys the package catalogs for the apps to call, though it never does itself.
const APP_FACING_KEYS = new Set(["common.loading"]);

const quoted = new Set([...source.matchAll(/["'`]([a-zA-Z][\w-]*(?:\.[\w-]+)+)["'`]/g)].map((match) => match[1]));

describe("template message catalog", () => {
  it("finds the keys it checks", () => {
    expect(quoted.size).toBeGreaterThan(200);
  });

  it("keeps no key the package and the apps have stopped using", () => {
    const unused = Object.keys(ENGLISH_MESSAGES).filter(
      (key) =>
        !quoted.has(key) && !APP_FACING_KEYS.has(key) && !DYNAMIC_PREFIXES.some((prefix) => key.startsWith(prefix)),
    );
    expect(unused).toEqual([]);
  });

  it("has the same keys in English and Vietnamese", () => {
    const english = Object.keys(ENGLISH_MESSAGES);
    const vietnamese = Object.keys(VIETNAMESE_MESSAGES);
    expect(english.filter((key) => !vietnamese.includes(key))).toEqual([]);
    // English may leave a run-time key to its inline fallback (an account type, capitalised).
    expect(
      vietnamese.filter((key) => !english.includes(key) && !DYNAMIC_PREFIXES.some((prefix) => key.startsWith(prefix))),
    ).toEqual([]);
  });
});
