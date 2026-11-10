// The Material 3 Expressive preset: shapes, springs and state layers on top
// of the M3 colour roles. It only works together with `m3e.css`, which
// defines the colour utilities (`bg-secondary-container`), the `ease-spring-*`
// curves and the `state-layer` utility these classes use; without it the
// classes compile to nothing and the primitives look as they always did.
//
// Heights are left alone: the suite's 44px touch / 36px mouse floor beats
// M3's 40px buttons and 56px fields.

import type { UIPreset, UIPresetSlotArgs } from "./uiPreset";

// Corners, colours and shadows change on the springs, so a pressed button
// morphs its shape instead of snapping. Plain utilities rather than a custom
// one, so tailwind-merge sees they replace the primitive's `transition-*`.
const shapeMotion =
    "transition-[border-radius,background-color,color,border-color,box-shadow,width,height,translate] duration-(--md-sys-motion-spring-default-effects-duration) ease-spring-fast-spatial";

// Popups pop in on the fast spatial spring (it overshoots a little, which is
// the "expressive" part) and leave on a quick accelerate.
const popupMotion =
    "data-open:ease-spring-fast-spatial data-open:duration-(--md-sys-motion-spring-fast-spatial-duration) data-closed:ease-emphasized-accelerate data-closed:duration-150";

/** Button colours by variant, as M3 roles: filled, tonal, outlined, text. */
function buttonVariant(variant: string | null | undefined): string {
    switch (variant) {
        case "secondary":
            return "bg-secondary-container text-on-secondary-container hover:bg-secondary-container";
        case "outline":
            return "border-outline-variant bg-transparent text-on-surface-variant shadow-none hover:bg-transparent hover:text-on-surface-variant dark:border-outline-variant dark:bg-transparent dark:hover:bg-transparent";
        case "ghost":
            return "text-on-surface-variant hover:bg-transparent hover:text-on-surface-variant dark:hover:bg-transparent";
        case "destructive":
            return "bg-destructive text-on-error hover:bg-destructive dark:bg-destructive";
        case "link":
            return "rounded-none active:rounded-none before:hidden";
        default:
            // `default` and `ai`: the filled button.
            return "bg-primary text-on-primary hover:bg-primary hover:shadow-elevation-1 active:shadow-none";
    }
}

/** The M3E button: a pill whose corners tighten while pressed, with a state layer for hover and press. */
function button({ variant }: UIPresetSlotArgs): string {
    return [
        `state-layer ${shapeMotion} rounded-full active:rounded-md font-semibold`,
        buttonVariant(variant),
    ].join(" ");
}

/** Outlined text field: 4px corners, outline border, a 2px primary edge on focus instead of a ring. */
const field =
    "rounded-xs border-outline shadow-none focus-visible:border-primary focus-visible:ring-0 focus-visible:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)] dark:bg-transparent";

/** Surface, corners and elevation of each floating panel. */
function popup({ variant }: UIPresetSlotArgs): string {
    const surface =
        variant === "popover"
            ? "rounded-xl border-0 bg-surface-container-high shadow-elevation-2"
            : "rounded-lg border-0 bg-surface-container shadow-elevation-2";
    return `${surface} ${popupMotion}`;
}

/** Bottom sheets round their top corners; side sheets the edge facing the page. */
function sheetContent({ variant }: UIPresetSlotArgs): string {
    const corners: Record<string, string> = {
        bottom: "rounded-t-2xl",
        top: "rounded-b-2xl",
        left: "rounded-r-2xl",
        right: "rounded-l-2xl",
    };
    return `border-0 bg-surface-container-low ${corners[variant ?? "right"] ?? ""} data-open:ease-spring-slow-spatial data-open:duration-(--md-sys-motion-spring-slow-spatial-duration) data-closed:ease-emphasized-accelerate data-closed:duration-200`;
}

/** Register with `configureUIPreset(m3eUIPreset)` and import `m3e.css` after `tokens.css`. */
export const m3eUIPreset: UIPreset = {
    button,
    input: field,
    textarea: field,
    selectTrigger: `${field} border font-medium data-popup-open:border-primary data-popup-open:shadow-[inset_0_0_0_1px_var(--md-sys-color-primary)] focus-visible:translate-y-0 dark:hover:bg-transparent`,
    card: "rounded-xl border-transparent bg-card shadow-none",
    dialogContent: `rounded-2xl border-0 bg-surface-container-high shadow-elevation-3 data-open:ease-spring-default-spatial data-open:duration-(--md-sys-motion-spring-default-spatial-duration) data-closed:ease-emphasized-accelerate data-closed:duration-150`,
    sheetContent,
    overlay: "bg-scrim/32",
    popup,
    listItem: `rounded-sm ${shapeMotion} focus:bg-on-surface/10 data-highlighted:bg-on-surface/10 data-highlighted:text-on-surface`,
    badge: ({ variant }) =>
        variant === "mono" || variant === "link"
            ? ""
            : "rounded-sm font-semibold shadow-none [a&]:hover:translate-y-0 [a&]:hover:scale-100 [a&]:state-layer",
    tabsList: ({ variant }) => (variant === "line" ? "" : "bg-surface-container"),
    tabsTrigger: `${shapeMotion} group-data-[variant=default]/tabs-list:data-active:shadow-none data-active:bg-secondary-container data-active:text-on-secondary-container dark:data-active:border-transparent dark:data-active:bg-secondary-container dark:data-active:text-on-secondary-container group-data-[orientation=horizontal]/tabs:after:h-[3px] after:rounded-t-full`,
    // M3 switch: 52×32 track; the thumb is a 16px dot that grows to 24px when on.
    switch: ({ size }) =>
        size === "sm"
            ? `${shapeMotion} data-unchecked:border-outline data-unchecked:bg-surface-container-highest`
            : `${shapeMotion} data-[size=default]:h-8 data-[size=default]:w-13 p-0 data-unchecked:border-outline data-unchecked:bg-surface-container-highest`,
    switchThumb: ({ size }) =>
        size === "sm"
            ? `${shapeMotion} data-unchecked:bg-outline data-checked:bg-on-primary`
            : `${shapeMotion} shadow-none group-data-[size=default]/switch:size-4 group-data-[size=default]/switch:data-checked:size-6 data-unchecked:translate-x-1.5 data-checked:translate-x-[22px] data-unchecked:bg-outline data-checked:bg-on-primary`,
    // M3 checkbox: 18px, 2px corners, a round 40px state layer.
    checkbox: `state-layer-circle ${shapeMotion} size-[18px] rounded-[2px] border-on-surface-variant bg-transparent shadow-none dark:bg-transparent [&_svg]:size-3.5`,
};
