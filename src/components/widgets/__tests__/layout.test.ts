import { describe, expect, it } from "vitest";
import type { UserInfo } from "../../../api_calls/UserData";
import {
    addToStack,
    moveEntry,
    moveEntryTo,
    normaliseLayout,
    removeEntry,
    unstack,
    widgetMinRows,
    widgetRowSpan,
} from "../layout";
import type { WidgetDefinition, WidgetLayoutEntry, WidgetRegistry } from "../types";

const Nothing = () => null;

function def(id: string, extra: Partial<WidgetDefinition> = {}): WidgetDefinition {
    return { id, title: id, sizes: ["S", "M", "L"], defaultSize: "M", render: Nothing, ...extra };
}

const REGISTRY: WidgetRegistry = [
    def("a"),
    def("b", { sizes: ["M", "L"] }),
    def("payroll", { scopes: ["payrolls_get"] }),
    def("students", { accountTypes: ["student"] }),
    def("wide", { sizes: ["XL"], defaultSize: "XL" }),
];

const employee: UserInfo = { name: "E", username: "e", sub: "e1", account_type: "employee", scope: "tasks_get" };

const stored = (items: unknown[]) => ({ v: 1, items });

describe("normaliseLayout", () => {
    it("rejects anything that is not a v1 layout, so the defaults apply", () => {
        expect(normaliseLayout(undefined, REGISTRY, employee)).toBeNull();
        expect(normaliseLayout(null, REGISTRY, employee)).toBeNull();
        expect(normaliseLayout({ v: 2, items: [] }, REGISTRY, employee)).toBeNull();
        expect(normaliseLayout({ v: 1 }, REGISTRY, employee)).toBeNull();
    });

    it("keeps an empty layout — a user who removed everything meant it", () => {
        expect(normaliseLayout(stored([]), REGISTRY, employee)).toEqual([]);
    });

    it("drops unknown widgets and ones the user can no longer use, keeping the rest", () => {
        const items = normaliseLayout(
            stored([
                { id: "1", widget: "gone", size: "M" },
                { id: "2", widget: "payroll", size: "M" },
                { id: "3", widget: "students", size: "M" },
                { id: "4", widget: "a", size: "S" },
            ]),
            REGISTRY,
            employee,
        );
        expect(items).toEqual([{ id: "4", widget: "a", size: "S", config: undefined }]);
    });

    it("repairs an unsupported size to the widget's default", () => {
        const items = normaliseLayout(stored([{ id: "1", widget: "b", size: "S" }]), REGISTRY, employee);
        expect(items?.[0]).toMatchObject({ size: "M" });
    });

    it("gives a duplicated id a fresh one", () => {
        const items = normaliseLayout(
            stored([
                { id: "x", widget: "a", size: "S" },
                { id: "x", widget: "b", size: "M" },
            ]),
            REGISTRY,
            employee,
        )!;
        expect(items[0].id).toBe("x");
        expect(items[1].id).not.toBe("x");
    });

    it("collapses a stack left with one usable child into a plain widget", () => {
        const items = normaliseLayout(
            stored([{ id: "s", size: "M", stack: [{ id: "c1", widget: "a" }, { id: "c2", widget: "payroll" }] }]),
            REGISTRY,
            employee,
        );
        expect(items).toEqual([{ id: "s", widget: "a", size: "M", config: undefined }]);
    });

    it("drops a stack none of whose children share a size", () => {
        const items = normaliseLayout(
            stored([{ id: "s", size: "M", stack: [{ id: "c1", widget: "a" }, { id: "c2", widget: "wide" }] }]),
            REGISTRY,
            employee,
        );
        expect(items).toEqual([]);
    });
});

describe("edits", () => {
    const base: WidgetLayoutEntry[] = [
        { id: "1", widget: "a", size: "M" },
        { id: "2", widget: "b", size: "M" },
        { id: "3", widget: "a", size: "S" },
    ];

    it("moves one step and by drag", () => {
        expect(moveEntry(base, "2", -1).map((e) => e.id)).toEqual(["2", "1", "3"]);
        expect(moveEntry(base, "1", -1)).toBe(base);
        expect(moveEntryTo(base, "3", "1").map((e) => e.id)).toEqual(["3", "1", "2"]);
    });

    it("stacks a widget onto another, and unstacks back to separate widgets", () => {
        const stacked = addToStack(base, "1", def("b"));
        expect(stacked[0]).toMatchObject({ id: "1", size: "M", stack: [{ widget: "a" }, { widget: "b" }] });

        const flat = unstack(stacked, "1");
        expect(flat.map((e) => ("widget" in e ? e.widget : "stack"))).toEqual(["a", "b", "b", "a"]);
        expect(flat.slice(0, 2).every((e) => e.size === "M")).toBe(true);
    });

    it("removing a stack's second-last child leaves a plain widget in the slot", () => {
        const stacked = addToStack(base, "1", def("b"));
        const childId = (stacked[0] as { stack: { id: string }[] }).stack[1].id;
        expect(removeEntry(stacked, childId)[0]).toMatchObject({ id: "1", widget: "a", size: "M" });
    });
});

describe("widgetRowSpan", () => {
    // 136px rows with 16px gaps: one row 136, two 288, three 440.
    it("takes the fewest rows that hold the content", () => {
        expect(widgetRowSpan(100, 136, 16, 1)).toBe(1);
        expect(widgetRowSpan(136, 136, 16, 1)).toBe(1);
        // Within two pixels of a fit is a fit: zoom rounding, not real content.
        expect(widgetRowSpan(137.5, 136, 16, 1)).toBe(1);
        expect(widgetRowSpan(139, 136, 16, 1)).toBe(2);
        expect(widgetRowSpan(288, 136, 16, 1)).toBe(2);
        expect(widgetRowSpan(410, 136, 16, 1)).toBe(3);
    });

    it("never goes below the size's minimum, and falls back to it before measuring", () => {
        expect(widgetRowSpan(100, 136, 16, 2)).toBe(2);
        expect(widgetRowSpan(0, 136, 16, 2)).toBe(2);
        expect(widgetRowSpan(500, 0, 16, 1)).toBe(1);
    });
});

describe("widgetMinRows", () => {
    const registry: WidgetRegistry = [
        def("plain", { sizes: ["L", "XL"] }),
        def("short", { sizes: ["L", "XL"], rows: { XL: 3 } }),
        def("tall", { sizes: ["L", "XL"], rows: { XL: 4, L: 2 } }),
    ];

    it("uses the size's minimum unless the widget sets its own rows", () => {
        expect(widgetMinRows({ id: "1", widget: "plain", size: "XL" }, registry)).toBe(1);
        expect(widgetMinRows({ id: "1", widget: "short", size: "XL" }, registry)).toBe(3);
        // Never below the size's minimum: L stays five tall.
        expect(widgetMinRows({ id: "1", widget: "tall", size: "L" }, registry)).toBe(5);
    });

    it("gives a stack the most rows any of its tabs asks for", () => {
        const stack: WidgetLayoutEntry = {
            id: "s",
            size: "XL",
            stack: [
                { id: "x", widget: "plain" },
                { id: "y", widget: "short" },
                { id: "z", widget: "tall" },
            ],
        };
        expect(widgetMinRows(stack, registry)).toBe(4);
    });
});
