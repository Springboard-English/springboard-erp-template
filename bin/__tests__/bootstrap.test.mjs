import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Runs the real artifact: stamp the template's bootstrap for an app, then
 * execute its loader against a stubbed bucket. Once for an app at the bucket
 * root and once for one served under a base path, which are the two shapes the
 * five apps take.
 */

const BIN = resolve(__dirname, "..");
const STAMP = join(BIN, "stamp-bootstrap.mjs");
const CONTROL = "a".repeat(40);
const B = "b".repeat(40);
const tempDir = (prefix) => mkdtempSync(join(tmpdir(), `sb-${prefix}-`));

const APPS = [
    // Config read from package.json, as the apps will.
    { app: "lms", name: "LMS", failureName: "The LMS", base: "", viaPackage: true },
    // Config passed as flags, with a base path.
    { app: "hrm", name: "HRM", failureName: "HRM", base: "/hrm", viaPackage: false },
];

describe.each(APPS)("bootstrap for $app (base '$base')", (config) => {
    const { app, base } = config;
    const flag = `${app}_variant`;
    const globalName = `__${app}Variant`;
    const variant = () => window[globalName];

    // An app root holding the committed map and, for one app, the config.
    const root = tempDir(`${app}-root`);
    mkdirSync(join(root, "bootstrap"));
    writeFileSync(join(root, "bootstrap/variants.json"), JSON.stringify({ b: B }));
    const configArgs = config.viaPackage
        ? []
        : ["--app", app, "--name", config.name, "--failure-name", config.failureName, "--base", base];
    if (config.viaPackage) {
        writeFileSync(
            join(root, "package.json"),
            JSON.stringify({
                springboardBootstrap: {
                    app,
                    name: config.name,
                    failureName: config.failureName,
                    base,
                    bucket: "example-bucket",
                },
            }),
        );
    }

    function stamp(args) {
        const out = join(tempDir(`${app}-bootstrap`), "index.html");
        execFileSync("node", [STAMP, "--root", root, ...configArgs, ...args, "--out", out], {
            stdio: "pipe",
        });
        return readFileSync(out, "utf8");
    }

    function stampWithVariants(variants) {
        const file = join(tempDir(`${app}-variants`), "variants.json");
        writeFileSync(file, JSON.stringify(variants));
        return stamp(["--control", CONTROL, "--variants", file]);
    }

    function stampFails(args) {
        try {
            stamp(args);
        } catch (error) {
            return String(error.stderr);
        }
        throw new Error("stamp succeeded");
    }

    // What vite emits under the app's base, plus the inline script Cloudflare injects.
    const release = (entry) => `<!doctype html><html><head>
<meta charset="utf-8" />
<title>Springboard English</title>
<link rel="icon" href="${base}/favicon.ico"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend&display=swap" />
<script type="module" crossorigin src="${base}/assets/${entry}.js"></script>
<link rel="modulepreload" crossorigin href="${base}/assets/vendor.js">
<link rel="stylesheet" crossorigin href="${base}/assets/${entry}.css">
<script>window.cloudflareRan = (window.cloudflareRan || 0) + 1</script>
</head><body><div id="root"></div></body></html>`;

    let bucket;
    const fetched = [];

    function runLoader(html, headPrefix = "") {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const slot = doc.getElementById(`${app}-releases`);
        const loader = [...doc.querySelectorAll("script")].find((s) => !s.type);
        document.head.innerHTML = headPrefix + slot.outerHTML;
        document.body.innerHTML = '<div id="root"></div>';
        new Function(loader.textContent)();
    }

    /** Loads the stamped page's data slot and runs its loader, as a browser would. */
    async function boot(html) {
        runLoader(html);
        await vi.waitFor(() => {
            const settled = variant()?.running || document.getElementById("root").textContent;
            if (!settled) throw new Error("still loading");
        });
    }

    const entryScripts = () =>
        [...document.head.querySelectorAll("script[type=module]")].map((s) => s.getAttribute("src"));

    describe("loader", () => {
        beforeEach(() => {
            bucket = {
                [`${base}/releases/${CONTROL}/index.html`]: release("control"),
                [`${base}/releases/${B}/index.html`]: release("b"),
            };
            fetched.length = 0;
            vi.stubGlobal(
                "fetch",
                vi.fn(async (url) => {
                    fetched.push(url);
                    const body = bucket[url];
                    return { ok: body !== undefined, status: body ? 200 : 404, text: async () => body };
                }),
            );
            vi.spyOn(console, "warn").mockImplementation(() => {});
            localStorage.clear();
            delete window.cloudflareRan;
        });
        afterEach(() => {
            vi.unstubAllGlobals();
            vi.restoreAllMocks();
            delete window[globalName];
        });

        it("names the app in the page", () => {
            const html = stampWithVariants({});
            expect(html).toContain(`<title>${config.name} · Springboard English</title>`);
            expect(html).toContain(`const BASE = "${base}";`);
            expect(html).not.toMatch(/%[A-Z_]+%/);
            expect(html).not.toContain('name="description"');
        });

        it("loads control for a signed-out browser, adopting its head", async () => {
            await boot(stampWithVariants({ b: B }));
            expect(fetched).toEqual([`${base}/releases/${CONTROL}/index.html`]);
            expect(variant().running).toBe("control");
            expect(entryScripts()).toEqual([`${base}/assets/control.js`]);
            const entry = document.head.querySelector("script[type=module]");
            expect(entry.getAttribute("crossorigin")).toBe("");
            expect(document.head.querySelector("link[rel=modulepreload]")).not.toBeNull();
            expect(document.head.querySelector(`link[href="${base}/assets/control.css"]`)).not.toBeNull();
            // The font stylesheet the release names comes across too.
            expect(document.head.querySelector('link[href^="https://fonts.googleapis.com"]')).not.toBeNull();
            // Preloads land before the entry script.
            expect(document.head.lastElementChild).toBe(entry);
        });

        it("does not add a stylesheet the root already has", async () => {
            const bootCss = `<link rel="stylesheet" href="${base}/assets/sb-boot-1a2b3c4d.css">`;
            bucket[`${base}/releases/${CONTROL}/index.html`] = release("control").replace(
                "</head>",
                `${bootCss}</head>`,
            );
            runLoader(stampWithVariants({}), bootCss);
            await vi.waitFor(() => expect(variant()?.running).toBe("control"));
            expect(
                document.head.querySelectorAll(`link[href="${base}/assets/sb-boot-1a2b3c4d.css"]`),
            ).toHaveLength(1);
            expect(document.head.querySelector(`link[href="${base}/assets/control.css"]`)).not.toBeNull();
        });

        it("never copies inline scripts", async () => {
            await boot(stampWithVariants({}));
            expect(window.cloudflareRan).toBeUndefined();
            expect(document.head.querySelectorAll("script:not([type])")).toHaveLength(0);
        });

        it("loads the build the stored user is flagged into", async () => {
            localStorage.setItem("auth.user", JSON.stringify({ info: { [flag]: "b" } }));
            await boot(stampWithVariants({ b: B }));
            expect(fetched).toEqual([`${base}/releases/${B}/index.html`]);
            expect(variant().running).toBe("b");
            expect(entryScripts()).toEqual([`${base}/assets/b.js`]);
        });

        it.each([
            ["a variant this page does not offer", JSON.stringify({ info: { [flag]: "gone" } })],
            ["a non-string flag", JSON.stringify({ info: { [flag]: ["b"] } })],
            ["an inherited key", JSON.stringify({ info: { [flag]: "toString" } })],
            ["another app's flag", JSON.stringify({ info: { other_variant: "b" } })],
            ["a malformed stored user", "{not json"],
        ])("loads control for %s", async (_, stored) => {
            localStorage.setItem("auth.user", stored);
            await boot(stampWithVariants({ b: B }));
            expect(variant().running).toBe("control");
        });

        it("exposes the same pick to the app", async () => {
            await boot(stampWithVariants({ b: B }));
            expect(variant().pick({ info: { [flag]: "b" } })).toBe("b");
            expect(variant().pick({ info: {} })).toBe("control");
            expect(variant().pick(null)).toBe("control");
        });

        it("falls back to control when the variant will not load", async () => {
            localStorage.setItem("auth.user", JSON.stringify({ info: { [flag]: "b" } }));
            delete bucket[`${base}/releases/${B}/index.html`];
            await boot(stampWithVariants({ b: B }));
            expect(variant().running).toBe("control");
            expect(entryScripts()).toEqual([`${base}/assets/control.js`]);
        });

        it("treats a release with no entry script as a failed load", async () => {
            localStorage.setItem("auth.user", JSON.stringify({ info: { [flag]: "b" } }));
            bucket[`${base}/releases/${B}/index.html`] = "<html><head></head></html>";
            await boot(stampWithVariants({ b: B }));
            expect(variant().running).toBe("control");
        });

        it(`ignores module scripts outside ${base}/assets/`, async () => {
            bucket[`${base}/releases/${CONTROL}/index.html`] = release("control").replace(
                "</head>",
                '<script type="module" src="/elsewhere/assets/stray.js"></script></head>',
            );
            await boot(stampWithVariants({}));
            expect(entryScripts()).toEqual([`${base}/assets/control.js`]);
        });

        it("retries control once, then says it could not load", async () => {
            bucket = {};
            await boot(stampWithVariants({}));
            expect(fetched).toHaveLength(2);
            expect(variant().running).toBeNull();
            const rootEl = document.getElementById("root");
            expect(rootEl.textContent).toContain(`${config.failureName} could not load`);
            expect(rootEl.querySelector("button")).not.toBeNull();
            expect(console.warn).toHaveBeenCalledWith(
                `${config.name} build "control" did not load`,
                expect.any(Error),
            );
        });
    });

    describe("stamp", () => {
        it("re-stamps a live root keeping its variants, changing only control", () => {
            const live = join(tempDir(`${app}-live`), "index.html");
            writeFileSync(live, stampWithVariants({ b: B }));
            const previous = "c".repeat(40);
            const html = stamp(["--control", previous, "--from", live]);
            const doc = new DOMParser().parseFromString(html, "text/html");
            expect(JSON.parse(doc.getElementById(`${app}-releases`).textContent)).toEqual({
                control: previous,
                variants: { b: B },
            });
        });

        it("refuses a short sha", () => {
            expect(stampFails(["--control", "abc1234"])).toContain("40-character");
        });

        it("refuses a variant name that is not plain", () => {
            const file = join(tempDir(`${app}-variants`), "v.json");
            writeFileSync(file, JSON.stringify({ "B</script>": B }));
            expect(stampFails(["--control", CONTROL, "--variants", file])).toContain("must match");
        });

        it("refuses a variant named control", () => {
            const file = join(tempDir(`${app}-variants`), "v.json");
            writeFileSync(file, JSON.stringify({ control: B }));
            expect(stampFails(["--control", CONTROL, "--variants", file])).toContain("reserved");
        });

        it("stamps the app's committed map by default", () => {
            const html = stamp(["--control", CONTROL]);
            expect(html).toContain(JSON.stringify({ control: CONTROL, variants: { b: B } }));
            expect(html).not.toContain("__RELEASES__");
        });

        // What springboardBoot adds to a build's index.html.
        const withBoot = release("control")
            .replace(
                "</head>",
                `<link rel="stylesheet" href="${base}/assets/sb-boot-1a2b3c4d.css">\n` +
                    `<script src="${base}/assets/sb-boot-5e6f7a8b.js"></script>\n</head>`,
            )
            .replace(
                '<body><div id="root">',
                () => '<body><div id="sb-boot" role="status"><p>Portal $&</p></div>\n    <div id="root">',
            );
        const buildFile = (html) => {
            const file = join(tempDir(`${app}-build`), "index.html");
            writeFileSync(file, html);
            return file;
        };

        it("copies the build's boot screen into the root", () => {
            const html = stamp(["--control", CONTROL, "--boot", buildFile(withBoot)]);
            const doc = new DOMParser().parseFromString(html, "text/html");
            expect(doc.head.querySelector(`link[href="${base}/assets/sb-boot-1a2b3c4d.css"]`)).not.toBeNull();
            expect(doc.head.querySelector(`script[src="${base}/assets/sb-boot-5e6f7a8b.js"]`)).not.toBeNull();
            // Before #root, and copied literally.
            expect(doc.body.firstElementChild.id).toBe("sb-boot");
            expect(doc.getElementById("sb-boot").textContent).toBe("Portal $&");
            expect(html).not.toContain("__BOOT_");
            // Nothing of the app itself.
            expect(doc.querySelector("script[type=module]")).toBeNull();
        });

        it("refuses a build with no boot screen", () => {
            expect(
                stampFails(["--control", CONTROL, "--boot", buildFile(release("control"))]),
            ).toContain("exactly one boot stylesheet");
        });

        it("keeps the live boot screen on a rollback", () => {
            const live = buildFile(stamp(["--control", CONTROL, "--boot", buildFile(withBoot)]));
            const html = stamp(["--control", "c".repeat(40), "--from", live]);
            expect(html).toContain('<div id="sb-boot"');
            expect(html).toContain(`${base}/assets/sb-boot-5e6f7a8b.js`);
        });
    });
});

describe("stamp config", () => {
    const root = tempDir("config-root");
    mkdirSync(join(root, "bootstrap"));
    writeFileSync(join(root, "bootstrap/variants.json"), "{}");
    const run = (args) => {
        const out = join(tempDir("config-out"), "index.html");
        execFileSync("node", [STAMP, "--root", root, "--control", CONTROL, ...args, "--out", out], {
            stdio: "pipe",
        });
        return readFileSync(out, "utf8");
    };
    const fails = (args) => {
        try {
            run(args);
        } catch (error) {
            return String(error.stderr);
        }
        throw new Error("stamp succeeded");
    };

    it("writes a description meta after the title when one is set", () => {
        const html = run(["--app", "leap", "--name", "Leap", "--description", "Practice and testing."]);
        expect(html).toContain(
            '<title>Leap · Springboard English</title>\n    <meta name="description" content="Practice and testing." />\n',
        );
        expect(html).toContain("Leap could not load");
    });

    it("refuses an app with no config", () => {
        expect(fails([])).toContain("app");
    });

    it.each([
        [["--app", "Lms", "--name", "LMS"], "must match"],
        [["--app", "lms", "--name", "<b>"], "markup"],
        [["--app", "lms", "--name", "LMS", "--base", "/hrm/"], "trailing slash"],
    ])("refuses unsafe values %j", (args, message) => {
        expect(fails(args)).toContain(message);
    });
});

describe("bootstrap-config --shell", () => {
    it("prints the app, bucket and bucket prefix for rollback.sh", () => {
        const root = tempDir("shell-root");
        writeFileSync(
            join(root, "package.json"),
            JSON.stringify({
                springboardBootstrap: { app: "crm", name: "CRM", base: "/crm", bucket: "springboard_erp-crm" },
            }),
        );
        const out = execFileSync("node", [join(BIN, "lib/bootstrap-config.mjs"), "--shell"], {
            cwd: root,
            encoding: "utf8",
        });
        expect(out).toBe("crm\nspringboard_erp-crm\ncrm\n");
    });
});
