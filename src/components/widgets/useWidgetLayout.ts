import { useCallback, useMemo, useState } from "react";
import { patchCurrentUserInfo } from "../../api_calls/UserData";
import { useAuth } from "../../context/AuthContext";
import { useGlobalStatusOptional } from "../../context/GlobalStatusContext";
import { useI18n } from "../../context/I18nContext";
import { normaliseLayout, sameLayout, toStoredLayout } from "./layout";
import type { WidgetDefaults, WidgetLayoutEntry, WidgetRegistry } from "./types";

export interface UseWidgetLayoutOptions {
    /** The key in the user's `info`, one per app — e.g. `dashboard_lms`. */
    storageKey: string;
    registry: WidgetRegistry;
    defaults: WidgetDefaults;
}

export interface WidgetLayoutState {
    items: WidgetLayoutEntry[];
    editing: boolean;
    saving: boolean;
    /** True once the user has stored a layout of their own. */
    customised: boolean;
    startEditing: () => void;
    cancelEditing: () => void;
    /** Apply an edit to the draft. Nothing is written until `save`. */
    update: (edit: (items: WidgetLayoutEntry[]) => WidgetLayoutEntry[]) => void;
    /** Put the draft back to the defaults; `save` then stops storing a copy. */
    resetToDefaults: () => void;
    save: () => Promise<void>;
}

/**
 * The board's state. The saved layout lives in `user.info[storageKey]`, not
 * localStorage — sign-out clears localStorage, and a home should follow the
 * user to another device. A user who has never customised stores nothing and
 * keeps receiving the app's current defaults.
 */
export default function useWidgetLayout({
    storageKey,
    registry,
    defaults,
}: UseWidgetLayoutOptions): WidgetLayoutState {
    const { user, setAuthenticatedUser } = useAuth();
    const status = useGlobalStatusOptional();
    const { t } = useI18n();
    const [draft, setDraft] = useState<WidgetLayoutEntry[] | null>(null);
    const [saving, setSaving] = useState(false);

    const info = user?.info && typeof user.info === "object" ? (user.info as Record<string, unknown>) : undefined;
    const stored = info?.[storageKey];

    const defaultItems = useMemo(
        () => (user ? normaliseLayout(toStoredLayout(defaults(user)), registry, user) ?? [] : []),
        [user, defaults, registry],
    );
    const savedItems = useMemo(
        () => (user ? normaliseLayout(stored, registry, user) : null),
        [user, stored, registry],
    );
    const resolved = savedItems ?? defaultItems;

    const update = useCallback(
        (edit: (items: WidgetLayoutEntry[]) => WidgetLayoutEntry[]) =>
            setDraft((current) => edit(current ?? resolved)),
        [resolved],
    );

    const save = useCallback(async () => {
        if (!draft) return;
        if (sameLayout(draft, resolved)) {
            setDraft(null);
            return;
        }
        // A draft equal to the defaults is stored as "no layout", so the user
        // keeps following the defaults as they change.
        const value = sameLayout(draft, defaultItems) ? null : toStoredLayout(draft);
        setSaving(true);
        try {
            setAuthenticatedUser(await patchCurrentUserInfo({ [storageKey]: value }));
            setDraft(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            status?.setStatus(t("widgets.saveFailed", undefined, { message }), "error");
        } finally {
            setSaving(false);
        }
    }, [draft, resolved, defaultItems, storageKey, setAuthenticatedUser, status, t]);

    return {
        items: draft ?? resolved,
        editing: draft !== null,
        saving,
        customised: savedItems !== null,
        startEditing: () => setDraft(resolved),
        cancelEditing: () => setDraft(null),
        update,
        resetToDefaults: () => setDraft(defaultItems),
        save,
    };
}
