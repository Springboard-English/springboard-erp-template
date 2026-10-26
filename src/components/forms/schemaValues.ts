import { evaluateExpression, type ExprValue } from "./expression";
import { formatMoney } from "./formatting";
import type { FormField, FormMonth, FormRow, FormScalar, FormSchema, FormValue, FormValues } from "./schema";

// The pure half of a schema form: starting values, formulas and totals,
// visibility, what is missing, and the values as they are sent.

export type FormOutputMode = "typed" | "print";

/** What a field holds before anyone types: blank, unticked, no rows but the minimum. */
export function emptyFieldValue(field: FormField): FormValue {
    switch (field.type) {
        case "number":
        case "money":
        case "formula":
            return null;
        case "checkbox":
            return false;
        case "tags":
            return [];
        case "list":
            return Array.from({ length: Math.max(field.minRows ?? 0, field.required ? 1 : 0) }, () =>
                emptyListRow(field),
            );
        default:
            return "";
    }
}

/** A list row with every column at its empty value. */
export function emptyListRow(field: FormField): FormRow {
    return Object.fromEntries(
        (field.columns ?? []).map((column) => [column.name, emptyFieldValue(column) as FormScalar]),
    );
}

/** The starting values: each field empty, then whatever `initial` supplies. */
export function initialFormValues(schema: FormSchema, initial: FormValues = {}): FormValues {
    const values: FormValues = {};
    for (const field of schema.fields) {
        values[field.name] = field.name in initial ? initial[field.name] : emptyFieldValue(field);
    }
    return { ...initial, ...values };
}

function isMonth(value: unknown): value is FormMonth {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value) && "month" in (value as object);
}

/** A stored value as the expression language sees it. */
function toExpr(value: FormValue | undefined): ExprValue {
    if (value === undefined) return null;
    if (Array.isArray(value)) {
        return value.every((item) => typeof item === "string") ? (value as string[]) : null;
    }
    if (isMonth(value)) return `${value.month}/${value.year}`;
    return value;
}

/** A scope over the form's values, with a row's own columns first when inside a list. */
function scopeFor(values: FormValues, row?: FormRow) {
    return (path: string[]): ExprValue => {
        const [head, ...rest] = path;
        if (row && rest.length === 0 && head in row) {
            return toExpr(row[head]);
        }
        const value = values[head];
        if (rest.length === 1 && Array.isArray(value) && value.some((item) => typeof item === "object")) {
            return (value as FormRow[]).map((item) => toExpr(item[rest[0]]));
        }
        return rest.length === 0 ? toExpr(value) : null;
    };
}

/** Runs a formula, answering null instead of throwing on a bad expression. */
function runFormula(expr: string | undefined, values: FormValues, row?: FormRow): FormScalar {
    if (!expr) return null;
    try {
        const result = evaluateExpression(expr, scopeFor(values, row));
        return Array.isArray(result) ? null : (result as FormScalar);
    } catch {
        return null;
    }
}

function toNumber(value: FormScalar | undefined): number {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim()) {
        const parsed = Number(value.replace(/\./g, "").replace(",", "."));
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
}

/**
 * The values with every formula, row formula and list total worked out.
 * Each result is visible to the next formula at once, and passes repeat until
 * nothing changes, so a formula may read another formula or a total whatever
 * order the schema lists them in. A cycle stops after one pass per field.
 */
export function computeFormValues(schema: FormSchema, values: FormValues): FormValues {
    const current: FormValues = { ...values };
    for (let pass = 0; pass <= schema.fields.length; pass += 1) {
        let changed = false;
        const write = (name: string, value: FormValue) => {
            if (JSON.stringify(current[name]) !== JSON.stringify(value)) changed = true;
            current[name] = value;
        };
        for (const field of schema.fields) {
            if (field.type === "list") {
                const rows = (Array.isArray(current[field.name]) ? current[field.name] : []) as FormRow[];
                const computed = rows.map((row) => {
                    const out: FormRow = { ...row };
                    for (const column of field.columns ?? []) {
                        if (column.type === "formula") out[column.name] = runFormula(column.expr, current, out);
                    }
                    return out;
                });
                write(field.name, computed);
                for (const total of field.totals ?? []) {
                    write(total.into, computed.reduce((sum, row) => sum + toNumber(row[total.column]), 0));
                }
            } else if (field.type === "formula") {
                write(field.name, runFormula(field.expr, current));
            }
        }
        if (!changed) break;
    }
    return current;
}

/** Whether a field shows: true without `showIf`, and true when its expression cannot run. */
export function isFieldVisible(field: FormField, values: FormValues): boolean {
    if (!field.showIf) return true;
    try {
        const result = evaluateExpression(field.showIf, scopeFor(values));
        return result !== null && result !== false && result !== 0 && result !== "";
    } catch {
        return true;
    }
}

/** Whether a value counts as filled in for a `required` check. */
function isFilled(field: FormField, value: FormValue | undefined): boolean {
    switch (field.type) {
        case "checkbox":
        case "formula":
            return true;
        case "number":
        case "money":
            return typeof value === "number" && Number.isFinite(value);
        case "tags":
            return Array.isArray(value) && value.length > 0;
        default:
            return typeof value === "string" ? value.trim() !== "" : value !== null && value !== undefined;
    }
}

export interface MissingField {
    name: string;
    /** As shown to the sender: the label, or the label with the row and column. */
    label: string;
}

/** The required fields still empty (visible ones only), in schema order. */
export function missingFormFields(schema: FormSchema, values: FormValues): MissingField[] {
    const missing: MissingField[] = [];
    for (const field of schema.fields) {
        if (!isFieldVisible(field, values)) continue;
        if (field.type !== "list") {
            if (field.required && !isFilled(field, values[field.name])) {
                missing.push({ name: field.name, label: field.label });
            }
            continue;
        }
        const rows = (Array.isArray(values[field.name]) ? values[field.name] : []) as FormRow[];
        const minimum = Math.max(field.minRows ?? 0, field.required ? 1 : 0);
        if (rows.length < minimum) {
            missing.push({ name: field.name, label: field.label });
            continue;
        }
        rows.forEach((row, index) => {
            for (const column of field.columns ?? []) {
                if (column.required && !isFilled(column, row[column.name])) {
                    missing.push({ name: field.name, label: `${field.label} (${index + 1}: ${column.label})` });
                }
            }
        });
    }
    return missing;
}

/** `2026-10` → `{ month: "10", year: "2026" }`; an empty month for anything else. */
function monthValue(value: FormValue | undefined): FormMonth {
    const match = typeof value === "string" ? /^(\d{4})-(\d{2})$/.exec(value) : null;
    return match ? { month: String(Number(match[2])), year: match[1] } : { month: "", year: "" };
}

/** One value as sent: typed for an API body, or as a printed document shows it. */
function outputValue(field: FormField, value: FormValue | undefined, mode: FormOutputMode): FormValue {
    const print = mode === "print";
    switch (field.type) {
        case "text":
        case "longText":
        case "choice":
        case "lookup":
        case "date":
        case "datetime":
            return typeof value === "string" ? value.trim() : "";
        case "number":
            return print ? (typeof value === "number" ? String(value) : "") : typeof value === "number" ? value : null;
        case "money":
            return print ? formatMoney(typeof value === "number" ? value : null) : typeof value === "number" ? value : null;
        case "checkbox":
            return value === true;
        case "tags":
            return Array.isArray(value) ? (value as string[]) : [];
        case "month":
            return monthValue(value);
        case "formula": {
            const scalar = (value ?? null) as FormScalar;
            if (!print) return scalar;
            if (field.format === "money") return formatMoney(typeof scalar === "number" ? scalar : toNumber(scalar));
            if (scalar === null) return "";
            return typeof scalar === "boolean" ? scalar : String(scalar);
        }
        case "list": {
            const rows = (Array.isArray(value) ? value : []) as FormRow[];
            return rows.map((row) =>
                Object.fromEntries(
                    (field.columns ?? []).map((column) => [
                        column.name,
                        outputValue(column, row[column.name], mode) as FormScalar,
                    ]),
                ),
            );
        }
    }
}

/** The total's printed form follows its column: money columns print as money. */
function totalField(field: FormField, column: string, into: string): FormField {
    const source = field.columns?.find((item) => item.name === column);
    const money = source?.type === "money" || (source?.type === "formula" && source.format === "money");
    return { name: into, label: into, type: money ? "money" : "number" };
}

/**
 * The values to send. `typed` keeps numbers and nulls for an API body; `print`
 * formats them as a document shows them (1.200.000), for a Jinja template that
 * only prints. Hidden fields are included, empty, so a template never meets a
 * missing name.
 */
export function outputFormValues(schema: FormSchema, values: FormValues, mode: FormOutputMode = "typed"): FormValues {
    const computed = computeFormValues(schema, values);
    const out: FormValues = {};
    for (const field of schema.fields) {
        if (field.type === "lookup" && field.send === false) continue;
        out[field.name] = outputValue(field, computed[field.name], mode);
        for (const total of field.totals ?? []) {
            out[total.into] = outputValue(totalField(field, total.column, total.into), computed[total.into], mode);
        }
    }
    return out;
}
