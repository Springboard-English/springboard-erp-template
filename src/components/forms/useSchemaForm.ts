import { useCallback, useMemo, useRef, useState } from "react";
import type { SearchableSelectLoadParams, SearchableSelectOption, SearchableSelectPage } from "../ui/searchable-select";
import type { FormField, FormRow, FormScalar, FormSchema, FormValue, FormValues } from "./schema";
import {
    computeFormValues,
    emptyListRow,
    initialFormValues,
    isFieldVisible,
    missingFormFields,
    outputFormValues,
    type FormOutputMode,
    type MissingField,
} from "./schemaValues";

/** Where a `lookup` field's options come from; the app supplies it, by the name the schema uses. */
export interface FormLookupSource {
    load: (params: SearchableSelectLoadParams) => Promise<SearchableSelectPage>;
    /** The whole record for a picked key, read for the field's `fills`. */
    get?: (key: string) => Promise<unknown>;
}

export type FormLookups = Record<string, FormLookupSource>;

export interface UseSchemaFormOptions {
    initial?: FormValues;
    lookups?: FormLookups;
}

export interface SchemaForm {
    schema: FormSchema;
    /** The values with formulas and totals worked out. */
    values: FormValues;
    lookups: FormLookups;
    /** The option each lookup field shows as picked. */
    picked: Record<string, SearchableSelectOption>;
    missing: MissingField[];
    /** Set once a submit has been tried, so empty required fields show as errors. */
    showErrors: boolean;
    set: (name: string, value: FormValue) => void;
    setCell: (list: string, index: number, column: string, value: FormScalar) => void;
    addRow: (list: string) => void;
    removeRow: (list: string, index: number) => void;
    pick: (field: FormField, option: SearchableSelectOption) => void;
    isVisible: (field: FormField) => boolean;
    /** True when nothing required is missing; otherwise turns error display on. */
    validate: () => boolean;
    output: (mode?: FormOutputMode) => FormValues;
    reset: (initial?: FormValues) => void;
}

/** Reads `a.b.c` out of a record a lookup source returned. */
function readPath(record: unknown, path: string): unknown {
    return path.split(".").reduce<unknown>(
        (value, key) => (value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined),
        record,
    );
}

/**
 * Holds a schema form's values and everything derived from them: formulas,
 * totals, visibility, what is missing, and the output. A new `schema` object
 * starts the values over, so memoise the schema at the call site.
 */
export function useSchemaForm(schema: FormSchema, options: UseSchemaFormOptions = {}): SchemaForm {
    const lookups = useMemo(() => options.lookups ?? {}, [options.lookups]);
    const [raw, setRaw] = useState<FormValues>(() => initialFormValues(schema, options.initial));
    const [picked, setPicked] = useState<Record<string, SearchableSelectOption>>({});
    const [showErrors, setShowErrors] = useState(false);
    const [syncedSchema, setSyncedSchema] = useState(schema);
    // Synced during render, not in an effect, so the first frame of a new schema never shows the old values.
    if (syncedSchema !== schema) {
        setSyncedSchema(schema);
        setRaw(initialFormValues(schema, options.initial));
        setPicked({});
        setShowErrors(false);
    }
    // A lookup's record arrives late; only the latest pick per field may fill.
    const pickSerial = useRef<Record<string, number>>({});

    const values = useMemo(() => computeFormValues(schema, raw), [schema, raw]);
    const missing = useMemo(() => missingFormFields(schema, values), [schema, values]);

    const set = useCallback((name: string, value: FormValue) => {
        setRaw((current) => ({ ...current, [name]: value }));
    }, []);

    const listField = useCallback(
        (list: string) => schema.fields.find((field) => field.name === list && field.type === "list"),
        [schema],
    );

    const setCell = useCallback((list: string, index: number, column: string, value: FormScalar) => {
        setRaw((current) => {
            const rows = (Array.isArray(current[list]) ? current[list] : []) as FormRow[];
            return { ...current, [list]: rows.map((row, i) => (i === index ? { ...row, [column]: value } : row)) };
        });
    }, []);

    const addRow = useCallback(
        (list: string) => {
            const field = listField(list);
            if (!field) return;
            setRaw((current) => {
                const rows = (Array.isArray(current[list]) ? current[list] : []) as FormRow[];
                return { ...current, [list]: [...rows, emptyListRow(field)] };
            });
        },
        [listField],
    );

    const removeRow = useCallback((list: string, index: number) => {
        setRaw((current) => {
            const rows = (Array.isArray(current[list]) ? current[list] : []) as FormRow[];
            return { ...current, [list]: rows.filter((_, i) => i !== index) };
        });
    }, []);

    const pick = useCallback(
        (field: FormField, option: SearchableSelectOption) => {
            const key = String(option.value ?? "");
            setRaw((current) => ({ ...current, [field.name]: key }));
            setPicked((current) => {
                const next = { ...current };
                if (key) next[field.name] = option;
                else delete next[field.name];
                return next;
            });
            const source = field.source ? lookups[field.source] : undefined;
            if (!key || !source?.get || !field.fills) return;
            const serial = (pickSerial.current[field.name] ?? 0) + 1;
            pickSerial.current[field.name] = serial;
            const fills = field.fills;
            void source
                .get(key)
                .then((record) => {
                    if (pickSerial.current[field.name] !== serial) return;
                    setRaw((current) => {
                        const next = { ...current };
                        for (const [target, path] of Object.entries(fills)) {
                            const value = readPath(record, path);
                            if (value !== undefined && value !== null) {
                                next[target] = typeof value === "number" || typeof value === "boolean" ? value : String(value);
                            }
                        }
                        return next;
                    });
                })
                // A record the user may not read leaves the filled fields for them to type.
                .catch(() => undefined);
        },
        [lookups],
    );

    const isVisible = useCallback((field: FormField) => isFieldVisible(field, values), [values]);

    const validate = useCallback(() => {
        setShowErrors(true);
        return missing.length === 0;
    }, [missing]);

    const output = useCallback((mode?: FormOutputMode) => outputFormValues(schema, raw, mode), [schema, raw]);

    const reset = useCallback(
        (initial?: FormValues) => {
            setRaw(initialFormValues(schema, initial ?? options.initial));
            setPicked({});
            setShowErrors(false);
        },
        [schema, options.initial],
    );

    return {
        schema,
        values,
        lookups,
        picked,
        missing,
        showErrors,
        set,
        setCell,
        addRow,
        removeRow,
        pick,
        isVisible,
        validate,
        output,
        reset,
    };
}
