import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { UserInfo } from "../../api_calls/UserData";

/**
 * A widget's footprint on the board, phone-home-screen style. S is one cell,
 * M two cells wide, L two by two, XL the full row at whatever height its
 * content needs. Below `md` the board has two columns, so M, L and XL all span
 * the full width and S takes half.
 */
export type WidgetSize = "S" | "M" | "L" | "XL";

export const WIDGET_SIZES: readonly WidgetSize[] = ["S", "M", "L", "XL"];

export interface WidgetRenderProps<C = unknown> {
    size: WidgetSize;
    config: C;
    user: UserInfo;
    /** True inside the gallery: show the shape, skip anything with side effects. */
    preview: boolean;
}

/**
 * What an app registers for one widget. The template draws the frame, the
 * gallery and edit mode; the app supplies `render`, which owns its own data
 * fetching. `id` is what a saved layout stores, so never rename one.
 */
export interface WidgetDefinition<C = unknown> {
    id: string;
    title: string;
    titleKey?: string;
    description?: string;
    descriptionKey?: string;
    icon?: LucideIcon;
    sizes: readonly WidgetSize[];
    defaultSize: WidgetSize;
    /** Every scope listed is required. */
    scopes?: readonly string[];
    accountTypes?: readonly string[];
    isAvailable?: (user: UserInfo) => boolean;
    /** Where tapping "Open" goes — the full page this widget summarises. */
    href?: (config: C) => string | undefined;
    defaultConfig?: C;
    ConfigForm?: ComponentType<{ value: C; onChange: (value: C) => void }>;
    render: ComponentType<WidgetRenderProps<C>>;
}

// `any` here is deliberate: a registry mixes definitions with different config
// types, and `WidgetDefinition<unknown>` would reject every one that has a config.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyWidgetDefinition = WidgetDefinition<any>;
export type WidgetRegistry = readonly AnyWidgetDefinition[];

export interface WidgetItem {
    id: string;
    widget: string;
    size: WidgetSize;
    config?: unknown;
}

/** A widget inside a stack renders at the stack's size, so it carries none. */
export interface WidgetStackChild {
    id: string;
    widget: string;
    config?: unknown;
}

/** Several widgets in one slot, switched with tabs — iOS's Smart Stack. */
export interface WidgetStack {
    id: string;
    size: WidgetSize;
    stack: WidgetStackChild[];
}

export type WidgetLayoutEntry = WidgetItem | WidgetStack;

/** What is stored under the app's key in the user's `info`. */
export interface WidgetLayout {
    v: 1;
    items: WidgetLayoutEntry[];
}

/**
 * The layout a user sees until they customise. Give every entry a fixed id
 * (the widget id is fine): a user who resets and changes nothing is then
 * recognised as "on the defaults" and stops storing a copy.
 */
export type WidgetDefaults = (user: UserInfo) => WidgetLayoutEntry[];

export function isWidgetStack(entry: WidgetLayoutEntry): entry is WidgetStack {
    return Array.isArray((entry as WidgetStack).stack);
}
