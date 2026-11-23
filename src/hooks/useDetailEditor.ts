import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { isOutdatedEditedAtConflictError } from "../utils/conflictErrors";
// Relative: these types reach the published .d.ts, where `@/` does not resolve.
import type { OutdatedDataDialogProps } from "../components/dialogs/OutdatedDataDialog";
import type { PendingChangeItem } from "../components/PendingChangesBar";
import type { PendingChangesSource } from "../context/PendingChangesContext";

/** The slice of a react-query `useQuery` result the editor reads. */
export interface DetailEditorQuery<TRecord> {
    data: TRecord | undefined;
    isFetching?: boolean;
    refetch: () => Promise<{ data?: TRecord }>;
}

/** A PATCH body as sent: the changed fields plus the optimistic-lock stamp. */
export type DetailEditorPatchBody<TPatch> = TPatch & { edited_at: string };

export interface UseDetailEditorOptions<TRecord, TForm, TPatch extends object> {
    /** The record's query. Its data seeds the form; the outdated dialog refetches it. */
    query: DetailEditorQuery<TRecord>;
    /** The editable fields of a record, as the form holds them. */
    toForm: (record: TRecord) => TForm;
    /** Only the fields that differ from `original`, in the API's shape, without `edited_at`. */
    buildPatch: (form: TForm, original: TForm) => TPatch;
    /**
     * Sends the PATCH. Resolve with the updated record to re-seed the form from
     * it; resolve with nothing and the editor refetches `query` instead.
     */
    patch: (body: DetailEditorPatchBody<TPatch>, record: TRecord) => Promise<TRecord | void>;
    /** Runs after a save that went through, e.g. to put the record in the cache or invalidate a list. */
    onSaved?: (record: TRecord | undefined) => void | Promise<void>;
    /** The record's `edited_at`. Defaults to `record.edited_at`. */
    editedAt?: (record: TRecord) => string | null | undefined;
    /** Rows for the pending bar's Review list. Defaults to one row per changed field. */
    describeChanges?: (patch: TPatch) => PendingChangeItem[];
    /** The `section` of the default Review rows. */
    section?: string;
    /** Field labels for the default Review rows; a field with none shows its key. */
    fieldLabels?: Partial<Record<keyof TPatch & string, string>>;
}

/** The pending bar's edit-mode props, to spread onto `PendingChangesBar`. */
export interface DetailEditorPendingBarProps {
    pendingCount: number;
    pendingItems: PendingChangeItem[];
    saving: boolean;
    onSave: () => Promise<void>;
    onCancel: () => void;
}

export interface DetailEditor<TRecord, TForm, TPatch extends object> {
    /** The record the form was seeded from; its `edited_at` goes out with a save. Null until loaded. */
    record: TRecord | null;
    form: TForm | null;
    original: TForm | null;
    setForm: (next: TForm | ((current: TForm) => TForm)) => void;
    /** Sets one form field. */
    setField: <K extends keyof TForm>(field: K, value: TForm[K]) => void;
    /** The PATCH a save would send now, without `edited_at`. */
    changes: TPatch;
    pendingCount: number;
    pendingItems: PendingChangeItem[];
    isDirty: boolean;
    /** Whether a PATCH field is among the changes, e.g. to tint its input. */
    isFieldPending: (field: keyof TPatch) => boolean;
    /** Sends `changes` (nothing when there are none). Resolves false on a conflict or a failure. */
    save: () => Promise<boolean>;
    /** Sends another body with the same `edited_at` and conflict handling, e.g. a status move. */
    submit: (body: TPatch) => Promise<boolean>;
    /** Drops the edits, back to `original`. */
    reset: () => void;
    saving: boolean;
    /** The last save's failure other than a conflict; the status bar shows it too. */
    error: unknown;
    pendingBarProps: DetailEditorPendingBarProps;
    /** The same edits as a source for `usePendingChangesSource`, for a view on the shared bar. */
    pendingSource: PendingChangesSource;
    /** Props for `OutdatedDataDialog`, open after an `edited_at` conflict. */
    outdatedDialogProps: OutdatedDataDialogProps;
}

interface EditorState<TRecord, TForm> {
    record: TRecord;
    original: TForm;
    form: TForm;
}

const defaultEditedAt = (record: unknown): string | null | undefined =>
    (record as { edited_at?: string | null } | null)?.edited_at;

/** A Review row's value: arrays by count, empty values as "(empty)". */
function formatChangeValue(value: unknown): string {
    if (Array.isArray(value)) return String(value.length);
    if (value === null || value === undefined || value === "") return "(empty)";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

/**
 * The edit state of a detail view's record: a form seeded from the query, the
 * original it is compared with, the PATCH `buildPatch` derives from both, a
 * save that sends it with the seeding record's `edited_at`, and the
 * `OutdatedDataDialog` for a lost conflict. Spread `pendingBarProps` onto
 * `PendingChangesBar` and `outdatedDialogProps` onto `OutdatedDataDialog`. A
 * refetch re-seeds the form only while it holds no edits, so a background
 * refresh never wipes typing; "Refresh" in the dialog re-seeds regardless.
 */
export function useDetailEditor<TRecord, TForm, TPatch extends object>(
    options: UseDetailEditorOptions<TRecord, TForm, TPatch>,
): DetailEditor<TRecord, TForm, TPatch> {
    // Callers pass inline functions; read them through a ref so they never re-run effects.
    const optionsRef = useRef(options);
    optionsRef.current = options;
    const { query, buildPatch, describeChanges, section, fieldLabels } = options;

    const [state, setState] = useState<EditorState<TRecord, TForm> | null>(null);
    const [outdatedOpen, setOutdatedOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const seed = useCallback((record: TRecord) => {
        const form = optionsRef.current.toForm(record);
        setState({ record, original: form, form });
    }, []);

    useEffect(() => {
        const data = query.data;
        if (data === undefined || data === null) return;
        setState((current) => {
            if (current && current.record === data) return current;
            if (current) {
                const held = optionsRef.current.buildPatch(current.form, current.original);
                // Keep the edits and the record they were made against: a save
                // then meets the conflict instead of overwriting the newer record.
                if (Object.keys(held).length > 0) return current;
            }
            const form = optionsRef.current.toForm(data);
            return { record: data, original: form, form };
        });
    }, [query.data]);

    const mutation = useMutation({
        mutationFn: ({ body, record }: { body: TPatch; record: TRecord }) => {
            const { editedAt = defaultEditedAt, patch } = optionsRef.current;
            return patch({ ...body, edited_at: editedAt(record) ?? "" }, record);
        },
    });
    const { mutateAsync, reset: resetMutation } = mutation;

    const submit = useCallback(
        async (body: TPatch): Promise<boolean> => {
            if (!state) return false;
            try {
                const answered = await mutateAsync({ body, record: state.record });
                const next = answered ?? (await optionsRef.current.query.refetch()).data;
                if (next !== undefined && next !== null) seed(next);
                await optionsRef.current.onSaved?.(next ?? undefined);
                return true;
            } catch (error) {
                if (isOutdatedEditedAtConflictError(error)) {
                    // The dialog says it; the status bar need not say it again.
                    resetMutation();
                    setOutdatedOpen(true);
                }
                return false;
            }
        },
        [mutateAsync, resetMutation, seed, state],
    );

    const changes = useMemo(
        () => (state ? buildPatch(state.form, state.original) : ({} as TPatch)),
        [buildPatch, state],
    );
    const changedFields = Object.keys(changes) as Array<keyof TPatch & string>;
    const isDirty = changedFields.length > 0;

    const pendingItems = useMemo<PendingChangeItem[]>(() => {
        if (describeChanges) return describeChanges(changes);
        return (Object.keys(changes) as Array<keyof TPatch & string>).map((field) => ({
            section,
            key: fieldLabels?.[field] ?? field,
            value: formatChangeValue(changes[field]),
        }));
    }, [changes, describeChanges, fieldLabels, section]);

    // Nothing changed is nothing to send, and not a failure.
    const save = useCallback(
        async () => (isDirty ? submit(changes) : true),
        [changes, isDirty, submit],
    );
    const reset = useCallback(() => {
        setState((current) => (current ? { ...current, form: current.original } : current));
    }, []);
    const setForm = useCallback((next: TForm | ((current: TForm) => TForm)) => {
        setState((current) =>
            current
                ? {
                      ...current,
                      form:
                          typeof next === "function"
                              ? (next as (value: TForm) => TForm)(current.form)
                              : next,
                  }
                : current,
        );
    }, []);
    const setField = useCallback(
        <K extends keyof TForm>(field: K, value: TForm[K]) =>
            setForm((current) => ({ ...current, [field]: value })),
        [setForm],
    );
    const isFieldPending = useCallback(
        (field: keyof TPatch) => (changes as Record<PropertyKey, unknown>)[field] !== undefined,
        [changes],
    );

    const refreshAfterConflict = useCallback(async () => {
        setRefreshing(true);
        try {
            const { data } = await optionsRef.current.query.refetch();
            if (data !== undefined && data !== null) seed(data);
            setOutdatedOpen(false);
        } finally {
            setRefreshing(false);
        }
    }, [seed]);

    const saving = mutation.isPending;
    return {
        record: state?.record ?? null,
        form: state?.form ?? null,
        original: state?.original ?? null,
        setForm,
        setField,
        changes,
        pendingCount: pendingItems.length,
        pendingItems,
        isDirty,
        isFieldPending,
        save,
        submit,
        reset,
        saving,
        error: mutation.error,
        pendingBarProps: {
            pendingCount: pendingItems.length,
            pendingItems,
            saving,
            onSave: async () => {
                await save();
            },
            onCancel: reset,
        },
        pendingSource: {
            section,
            items: pendingItems,
            saving,
            save: async () => {
                await save();
            },
            discard: reset,
        },
        outdatedDialogProps: {
            open: outdatedOpen,
            loading: refreshing || Boolean(query.isFetching),
            onRefreshData: refreshAfterConflict,
            onCancelAction: () => setOutdatedOpen(false),
        },
    };
}
