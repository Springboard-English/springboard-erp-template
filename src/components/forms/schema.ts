// A form described as plain JSON: a template row can store it, a dialog can
// declare it in code, and `useSchemaForm` renders and validates either.

export type FormFieldType =
    | "text"
    | "longText"
    | "number"
    | "money"
    | "date"
    | "datetime"
    | "month"
    | "checkbox"
    | "choice"
    | "lookup"
    | "tags"
    | "list"
    | "formula";

export const FORM_FIELD_TYPES: readonly FormFieldType[] = [
    "text",
    "longText",
    "number",
    "money",
    "date",
    "datetime",
    "month",
    "checkbox",
    "choice",
    "lookup",
    "tags",
    "list",
    "formula",
];

export type FormColumns = 1 | 2 | 3 | 4;
export type FormFieldSpan = FormColumns | "full";

export interface FormFieldOption {
    value: string;
    /** Shown instead of the value; the value is what is sent. */
    label?: string;
}

/** A list's footer total: the sum of `column`, also written to the value `into`. */
export interface FormTotal {
    column: string;
    into: string;
}

/**
 * One field. A flat shape rather than a union per type, so a builder can switch
 * a field's type without rebuilding it; each option says which types read it.
 */
export interface FormField {
    /** The key in the values, and the Jinja name when the form fills a template. */
    name: string;
    label: string;
    type: FormFieldType;
    /** The section id; the first section when absent. */
    section?: string;
    span?: FormFieldSpan;
    required?: boolean;
    help?: string;
    placeholder?: string;
    /** An expression; the field is hidden (and not required) while it is false. */
    showIf?: string;
    /** number: bounds and step. */
    min?: number;
    max?: number;
    step?: number;
    /** longText: visible rows. */
    rows?: number;
    /** checkbox: the text beside the box; the label when absent. */
    text?: string;
    /** choice: the allowed values. */
    options?: FormFieldOption[];
    /** choice: segmented buttons (default up to 4 options) or a select. */
    display?: "buttons" | "select";
    /** lookup: the name of a source the app passes to `useSchemaForm`. */
    source?: string;
    /** lookup: value name → dotted path in the picked record, filled on pick. */
    fills?: Record<string, string>;
    /** lookup: false keeps the picked key itself out of the output. */
    send?: boolean;
    /** list: the fields of one row (no list inside a list). */
    columns?: FormField[];
    minRows?: number;
    totals?: FormTotal[];
    /** formula: the expression, e.g. `sessions * unit_price`. */
    expr?: string;
    /** formula: how `output("print")` writes it. */
    format?: "money" | "number" | "text";
}

export interface FormSection {
    id: string;
    title?: string;
    /** The dialog tab it sits in; sections with no tab share the first one. */
    tab?: string;
    /** Grid width on desktop; one column on a phone. Defaults to the schema's. */
    columns?: FormColumns;
}

export interface FormSchema {
    columns?: FormColumns;
    sections: FormSection[];
    fields: FormField[];
}

/** `month` values: as typed in a month input (`YYYY-MM`), printed as `{ month, year }`. */
export interface FormMonth {
    month: string;
    year: string;
}

export type FormScalar = string | number | boolean | null | string[] | FormMonth;
export type FormRow = Record<string, FormScalar>;
export type FormValue = FormScalar | FormRow[];
export type FormValues = Record<string, FormValue>;

export const EMPTY_FORM_SCHEMA: FormSchema = { sections: [{ id: "details" }], fields: [] };

const NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asColumns(value: unknown): FormColumns | undefined {
    return value === 1 || value === 2 || value === 3 || value === 4 ? value : undefined;
}

function asString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/** One field from untrusted JSON, or null when it has no usable name or type. */
function parseField(raw: unknown, inList: boolean): FormField | null {
    if (!isRecord(raw)) {
        return null;
    }
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    const type = FORM_FIELD_TYPES.find((value) => value === raw.type);
    if (!NAME.test(name) || !type || (inList && type === "list")) {
        return null;
    }
    const span = raw.span === "full" ? "full" : asColumns(raw.span);
    const field: FormField = { name, label: asString(raw.label) ?? name, type };
    if (span) field.span = span;
    if (asString(raw.section)) field.section = raw.section as string;
    if (raw.required === true) field.required = true;
    if (asString(raw.help)) field.help = raw.help as string;
    if (asString(raw.placeholder)) field.placeholder = raw.placeholder as string;
    if (asString(raw.showIf)) field.showIf = raw.showIf as string;
    if (asNumber(raw.min) !== undefined) field.min = raw.min as number;
    if (asNumber(raw.max) !== undefined) field.max = raw.max as number;
    if (asNumber(raw.step) !== undefined) field.step = raw.step as number;
    if (asNumber(raw.rows) !== undefined) field.rows = raw.rows as number;
    if (asString(raw.text)) field.text = raw.text as string;
    if (raw.display === "buttons" || raw.display === "select") field.display = raw.display;
    if (asString(raw.source)) field.source = raw.source as string;
    if (raw.send === false) field.send = false;
    if (asString(raw.expr)) field.expr = raw.expr as string;
    if (raw.format === "money" || raw.format === "number" || raw.format === "text") field.format = raw.format;
    if (asNumber(raw.minRows) !== undefined) field.minRows = raw.minRows as number;
    if (Array.isArray(raw.options)) {
        field.options = raw.options
            .map((option) =>
                typeof option === "string"
                    ? { value: option }
                    : isRecord(option) && typeof option.value === "string"
                      ? { value: option.value, ...(asString(option.label) ? { label: option.label as string } : {}) }
                      : null,
            )
            .filter((option): option is FormFieldOption => option !== null);
    }
    if (isRecord(raw.fills)) {
        field.fills = Object.fromEntries(
            Object.entries(raw.fills).filter(
                (entry): entry is [string, string] => NAME.test(entry[0]) && typeof entry[1] === "string",
            ),
        );
    }
    if (type === "list") {
        field.columns = (Array.isArray(raw.columns) ? raw.columns : [])
            .map((column) => parseField(column, true))
            .filter((column): column is FormField => column !== null);
        if (Array.isArray(raw.totals)) {
            field.totals = raw.totals.filter(
                (total): total is FormTotal =>
                    isRecord(total) &&
                    typeof total.column === "string" &&
                    typeof total.into === "string" &&
                    NAME.test(total.into),
            );
        }
    }
    return field;
}

/**
 * A schema from untrusted JSON (a template row's `info.form`), or null when it
 * is not one. Unknown keys are dropped and bad fields skipped, so a stored
 * schema an older builder wrote still opens.
 */
export function parseFormSchema(raw: unknown): FormSchema | null {
    if (!isRecord(raw) || !Array.isArray(raw.fields)) {
        return null;
    }
    const sections = (Array.isArray(raw.sections) ? raw.sections : [])
        .filter((section): section is Record<string, unknown> => isRecord(section) && typeof section.id === "string")
        .map((section) => {
            const parsed: FormSection = { id: section.id as string };
            if (asString(section.title)) parsed.title = section.title as string;
            if (asString(section.tab)) parsed.tab = section.tab as string;
            const columns = asColumns(section.columns);
            if (columns) parsed.columns = columns;
            return parsed;
        });
    const fields = raw.fields
        .map((field) => parseField(field, false))
        .filter((field): field is FormField => field !== null);
    const schema: FormSchema = { sections: sections.length > 0 ? sections : [{ id: "details" }], fields };
    const columns = asColumns(raw.columns);
    if (columns) schema.columns = columns;
    return schema;
}

/** The section a field renders in: its own when that exists, else the first. */
export function fieldSectionId(schema: FormSchema, field: FormField): string {
    const first = schema.sections[0]?.id ?? "details";
    return field.section && schema.sections.some((section) => section.id === field.section) ? field.section : first;
}
