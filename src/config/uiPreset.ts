// How an app re-skins the shared primitives without forking them.
//
// The primitives keep their plain API — `<Button variant="default" size="lg" />`
// everywhere, same props, same refs, same `asChild`. What an app registers here
// is a layer of Tailwind classes merged *between* the built-in variant classes
// and the per-call `className`. Because `cn` is tailwind-merge, a preset class
// replaces the built-in it conflicts with (`rounded-full` beats `rounded-md`)
// and composes with the rest (`ease-bounce` just lands), while a per-call
// `className` still wins over both.
//
// This exists because Leap's look is not only colour. Its tokens sit on the
// same shadcn base as the ERP apps, but its *shape and motion* — pill radius, a
// hard bottom-edge shadow, a bounce easing — lived in the class strings of a
// forked copy. Tokens alone cannot express those; a preset can.
//
// Module state rather than a context, matching `configureApi` in ./api.ts: a
// preset is decided once at boot and never changes, so nothing needs to
// re-render when it is set, and the primitives stay plain functions of their
// props. Colour mode is the opposite case and is a real provider — see
// `theme/AppTheme`.

export interface UIPresetSlotArgs {
    variant?: string | null;
    size?: string | null;
}

/** A slot is either fixed classes, or classes chosen per variant/size. */
export type UIPresetSlot =
    | string
    | ((args: UIPresetSlotArgs) => string | undefined);

export interface UIPreset {
    button?: UIPresetSlot;
    input?: UIPresetSlot;
    textarea?: UIPresetSlot;
    card?: UIPresetSlot;
    dialogContent?: UIPresetSlot;
    /** `SheetContent` receives the open edge as `variant` ("right", "bottom", …). */
    sheetContent?: UIPresetSlot;
    tableHead?: UIPresetSlot;
    tableRow?: UIPresetSlot;
}

let _preset: UIPreset = {};

/**
 * Register the app's preset. Call once at boot, before `render()` — alongside
 * `configureApi`.
 */
export function configureUIPreset(preset: UIPreset): void {
    _preset = preset;
}

export function getUIPreset(): UIPreset {
    return _preset;
}

/**
 * Resolve one slot to a class string. Returns `undefined` when the app
 * registered no preset, which is the common case — `cn` drops it and the
 * primitive renders exactly as it does without one.
 */
export function uiPresetClass(
    slot: keyof UIPreset,
    args: UIPresetSlotArgs = {},
): string | undefined {
    const value = _preset[slot];

    if (typeof value === "function") {
        return value(args);
    }

    return value;
}
