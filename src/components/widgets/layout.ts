import type { UserInfo } from "../../api_calls/UserData";
import { hasUserScope } from "../../utils/userScopes";
import {
    isWidgetStack,
    WIDGET_SIZES,
    type AnyWidgetDefinition,
    type WidgetItem,
    type WidgetLayout,
    type WidgetLayoutEntry,
    type WidgetRegistry,
    type WidgetSize,
    type WidgetStack,
    type WidgetStackChild,
} from "./types";

/**
 * Pure layout logic: validating what came back from `info`, and every edit the
 * board can make. Kept free of React so all of it is unit-testable.
 */

/** The fewest rows each size takes, whatever its content: L is two cells tall. */
export const WIDGET_MIN_ROWS: Record<WidgetSize, number> = { S: 1, M: 1, L: 2, XL: 1 };

/**
 * How many of the board's fixed rows a widget spans: enough for `contentPx`,
 * counting the gaps it bridges, and never fewer than `minRows`.
 */
export function widgetRowSpan(contentPx: number, rowPx: number, gapPx: number, minRows: number): number {
    if (!(rowPx > 0) || !(contentPx > 0)) return minRows;
    return Math.max(minRows, Math.ceil((contentPx + gapPx) / (rowPx + gapPx)));
}

export function isWidgetAvailable(def: AnyWidgetDefinition, user: UserInfo): boolean {
    if (def.accountTypes && !def.accountTypes.includes(user.account_type)) {
        return false;
    }
    if (def.scopes && !def.scopes.every((scope) => hasUserScope(user, scope))) {
        return false;
    }
    return def.isAvailable ? def.isAvailable(user) : true;
}

export function availableWidgets(registry: WidgetRegistry, user: UserInfo): AnyWidgetDefinition[] {
    return registry.filter((def) => isWidgetAvailable(def, user));
}

export function findWidget(registry: WidgetRegistry, id: string): AnyWidgetDefinition | undefined {
    return registry.find((def) => def.id === id);
}

export function createWidgetId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `w-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isSize(value: unknown): value is WidgetSize {
    return typeof value === "string" && (WIDGET_SIZES as readonly string[]).includes(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Sizes every widget in a stack can render at. */
export function stackSizes(stack: WidgetStack, registry: WidgetRegistry): WidgetSize[] {
    return WIDGET_SIZES.filter((size) =>
        stack.stack.every((child) => findWidget(registry, child.widget)?.sizes.includes(size)),
    );
}

/**
 * Turn a stored layout into one this user can render, or `null` when it is not
 * a layout at all (absent, cleared, or a future version) — the caller then
 * falls back to the defaults. Unknown widgets, widgets the user has lost access
 * to and sizes a widget no longer supports are repaired rather than rejected,
 * so one removed widget never costs a user the rest of their layout.
 */
export function normaliseLayout(
    raw: unknown,
    registry: WidgetRegistry,
    user: UserInfo,
): WidgetLayoutEntry[] | null {
    if (!isRecord(raw) || raw.v !== 1 || !Array.isArray(raw.items)) {
        return null;
    }

    const seen = new Set<string>();
    const uniqueId = (id: unknown): string => {
        const base = typeof id === "string" && id ? id : createWidgetId();
        if (!seen.has(base)) {
            seen.add(base);
            return base;
        }
        const fresh = createWidgetId();
        seen.add(fresh);
        return fresh;
    };
    const usable = (widgetId: unknown): AnyWidgetDefinition | undefined => {
        if (typeof widgetId !== "string") return undefined;
        const def = findWidget(registry, widgetId);
        return def && isWidgetAvailable(def, user) ? def : undefined;
    };
    const configFor = (def: AnyWidgetDefinition, config: unknown) =>
        config === undefined ? def.defaultConfig : config;

    const entries: WidgetLayoutEntry[] = [];
    for (const rawEntry of raw.items) {
        if (!isRecord(rawEntry)) continue;

        if (Array.isArray(rawEntry.stack)) {
            const children: WidgetStackChild[] = [];
            for (const rawChild of rawEntry.stack) {
                if (!isRecord(rawChild)) continue;
                const def = usable(rawChild.widget);
                if (!def) continue;
                children.push({ id: uniqueId(rawChild.id), widget: def.id, config: configFor(def, rawChild.config) });
            }
            if (children.length === 0) continue;

            const draft: WidgetStack = { id: uniqueId(rawEntry.id), size: "XL", stack: children };
            const fits = stackSizes(draft, registry);
            if (fits.length === 0) continue;
            draft.size = isSize(rawEntry.size) && fits.includes(rawEntry.size) ? rawEntry.size : fits[fits.length - 1];

            if (children.length === 1) {
                const [only] = children;
                entries.push({ id: draft.id, widget: only.widget, size: draft.size, config: only.config });
            } else {
                entries.push(draft);
            }
            continue;
        }

        const def = usable(rawEntry.widget);
        if (!def) continue;
        const size = isSize(rawEntry.size) && def.sizes.includes(rawEntry.size) ? rawEntry.size : def.defaultSize;
        entries.push({ id: uniqueId(rawEntry.id), widget: def.id, size, config: configFor(def, rawEntry.config) });
    }
    return entries;
}

export function toStoredLayout(items: WidgetLayoutEntry[]): WidgetLayout {
    return { v: 1, items };
}

export function sameLayout(a: WidgetLayoutEntry[], b: WidgetLayoutEntry[]): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

// ---- edits ---------------------------------------------------------------

export function addWidget(
    items: WidgetLayoutEntry[],
    def: AnyWidgetDefinition,
    size: WidgetSize = def.defaultSize,
): WidgetLayoutEntry[] {
    return [...items, { id: createWidgetId(), widget: def.id, size, config: def.defaultConfig }];
}

/** Removes a top-level entry, or a child of a stack (a stack left with one child unstacks). */
export function removeEntry(items: WidgetLayoutEntry[], id: string): WidgetLayoutEntry[] {
    const out: WidgetLayoutEntry[] = [];
    for (const entry of items) {
        if (entry.id === id) continue;
        if (isWidgetStack(entry) && entry.stack.some((child) => child.id === id)) {
            const stack = entry.stack.filter((child) => child.id !== id);
            if (stack.length === 1) {
                out.push({ id: entry.id, widget: stack[0].widget, size: entry.size, config: stack[0].config });
            } else if (stack.length > 1) {
                out.push({ ...entry, stack });
            }
            continue;
        }
        out.push(entry);
    }
    return out;
}

export function resizeEntry(items: WidgetLayoutEntry[], id: string, size: WidgetSize): WidgetLayoutEntry[] {
    return items.map((entry) => (entry.id === id ? { ...entry, size } : entry));
}

export function configureEntry(items: WidgetLayoutEntry[], id: string, config: unknown): WidgetLayoutEntry[] {
    return items.map((entry) => {
        if (entry.id === id && !isWidgetStack(entry)) return { ...entry, config };
        if (isWidgetStack(entry) && entry.stack.some((child) => child.id === id)) {
            return { ...entry, stack: entry.stack.map((child) => (child.id === id ? { ...child, config } : child)) };
        }
        return entry;
    });
}

function moveIndex<T>(list: T[], from: number, to: number): T[] {
    if (from < 0 || to < 0 || from >= list.length || to >= list.length || from === to) return list;
    const next = list.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
}

/** One step earlier (`-1`) or later (`+1`) — the keyboard and menu path for reordering. */
export function moveEntry(items: WidgetLayoutEntry[], id: string, delta: -1 | 1): WidgetLayoutEntry[] {
    const index = items.findIndex((entry) => entry.id === id);
    return moveIndex(items, index, index + delta);
}

/** Drag-and-drop: put `activeId` where `overId` is. */
export function moveEntryTo(items: WidgetLayoutEntry[], activeId: string, overId: string): WidgetLayoutEntry[] {
    return moveIndex(
        items,
        items.findIndex((entry) => entry.id === activeId),
        items.findIndex((entry) => entry.id === overId),
    );
}

export function moveStackChild(
    items: WidgetLayoutEntry[],
    stackId: string,
    childId: string,
    delta: -1 | 1,
): WidgetLayoutEntry[] {
    return items.map((entry) => {
        if (entry.id !== stackId || !isWidgetStack(entry)) return entry;
        const index = entry.stack.findIndex((child) => child.id === childId);
        return { ...entry, stack: moveIndex(entry.stack, index, index + delta) };
    });
}

/**
 * Add a widget to the slot `targetId`. A plain widget becomes a stack of two at
 * its current size; the caller offers only widgets that support that size.
 */
export function addToStack(
    items: WidgetLayoutEntry[],
    targetId: string,
    def: AnyWidgetDefinition,
): WidgetLayoutEntry[] {
    const child: WidgetStackChild = { id: createWidgetId(), widget: def.id, config: def.defaultConfig };
    return items.map((entry) => {
        if (entry.id !== targetId) return entry;
        if (isWidgetStack(entry)) return { ...entry, stack: [...entry.stack, child] };
        const first: WidgetStackChild = { id: createWidgetId(), widget: entry.widget, config: entry.config };
        return { id: entry.id, size: entry.size, stack: [first, child] };
    });
}

export function unstack(items: WidgetLayoutEntry[], stackId: string): WidgetLayoutEntry[] {
    return items.flatMap((entry): WidgetLayoutEntry[] => {
        if (entry.id !== stackId || !isWidgetStack(entry)) return [entry];
        return entry.stack.map(
            (child): WidgetItem => ({ id: child.id, widget: child.widget, size: entry.size, config: child.config }),
        );
    });
}
