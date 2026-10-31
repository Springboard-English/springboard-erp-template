import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { SearchableSelect } from "../ui/searchable-select";
import { TagInput } from "../ui/tag-input";
import { Textarea } from "../ui/textarea";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { formatMoney, parseMoney, parseNumber } from "./formatting";
import { fieldSectionId, type FormColumns, type FormField, type FormFieldSpan, type FormRow, type FormScalar, type FormSchema } from "./schema";
import type { SchemaForm } from "./useSchemaForm";

// Literal class names, so the apps' Tailwind finds them in dist.
const GRID_COLUMNS: Record<FormColumns, string> = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
};
const SPAN: Record<Exclude<FormFieldSpan, "full">, string> = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
};

/** How a computed value reads in a read-only cell. */
function formulaText(field: FormField, value: FormScalar | undefined): string {
    if (value === null || value === undefined) return "";
    if (field.format === "money") return formatMoney(typeof value === "number" ? value : Number(value));
    if (typeof value === "number") return field.format === "number" ? String(value) : String(Math.round(value * 100) / 100);
    return String(value);
}

interface ControlProps {
    field: FormField;
    value: FormScalar | undefined;
    onChange: (value: FormScalar) => void;
    form: SchemaForm;
    invalid: boolean;
    /** Inside a list row: a compact control with the label as its aria-label. */
    compact?: boolean;
    ariaLabel?: string;
}

/** The input for one non-list field type. */
function FieldControl({ field, value, onChange, form, invalid, compact = false, ariaLabel }: ControlProps) {
    const { t } = useI18n();
    const label = ariaLabel ?? field.label;
    const common = {
        "aria-label": label,
        "aria-invalid": invalid || undefined,
        placeholder: field.placeholder ?? (field.required ? undefined : t("schemaForm.optional", "Optional")),
    };
    switch (field.type) {
        case "longText":
            return (
                <Textarea
                    {...common}
                    rows={field.rows ?? 3}
                    maxLength={field.maxLength}
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => onChange(event.target.value)}
                />
            );
        case "number":
            return (
                <Input
                    {...common}
                    type="number"
                    inputMode="decimal"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className={compact ? "h-9 md:h-9" : undefined}
                    value={typeof value === "number" ? String(value) : ""}
                    onChange={(event) => onChange(parseNumber(event.target.value))}
                />
            );
        case "money":
            return (
                <Input
                    {...common}
                    inputMode="numeric"
                    className={cn("text-right tabular-nums", compact && "h-9 md:h-9")}
                    value={formatMoney(typeof value === "number" ? value : null)}
                    onChange={(event) => onChange(parseMoney(event.target.value))}
                />
            );
        case "date":
        case "datetime":
        case "month":
            return (
                <Input
                    {...common}
                    type={field.type === "datetime" ? "datetime-local" : field.type}
                    className={compact ? "h-9 md:h-9" : undefined}
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => onChange(event.target.value)}
                />
            );
        case "checkbox":
            return (
                <label className="inline-flex min-h-11 items-center gap-2 text-sm md:pointer-fine:min-h-9">
                    <Checkbox
                        aria-label={label}
                        checked={value === true}
                        onCheckedChange={(checked) => onChange(checked === true)}
                    />
                    {compact ? null : <span>{field.text ?? field.label}</span>}
                </label>
            );
        case "choice": {
            const options = field.options ?? [];
            const selected = typeof value === "string" ? value : "";
            if ((field.display ?? (options.length <= 4 ? "buttons" : "select")) === "select" || compact) {
                return (
                    <select
                        {...common}
                        value={selected}
                        onChange={(event) => onChange(event.target.value)}
                        className="h-11 w-full rounded-md border border-input bg-transparent px-3 text-base md:text-sm md:pointer-fine:h-9"
                    >
                        <option value="">{t("schemaForm.choose", "Choose...")}</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label ?? option.value}
                            </option>
                        ))}
                    </select>
                );
            }
            return (
                <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
                    {options.map((option) => (
                        <Button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected === option.value}
                            variant={selected === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => onChange(selected === option.value ? "" : option.value)}
                        >
                            {option.label ?? option.value}
                        </Button>
                    ))}
                </div>
            );
        }
        case "lookup": {
            const source = field.source ? form.lookups[field.source] : undefined;
            return (
                <SearchableSelect
                    value={typeof value === "string" ? value : ""}
                    onValueChange={() => undefined}
                    onOptionSelect={(option) => form.pick(field, option)}
                    selectedOption={form.picked[field.name]}
                    loadOptions={source?.load}
                    placeholder={field.placeholder}
                    disabled={!source}
                />
            );
        }
        case "tags":
            return (
                <TagInput
                    aria-label={label}
                    value={Array.isArray(value) ? value : []}
                    onValueChange={(next) => onChange(next)}
                />
            );
        case "formula":
            return (
                <div
                    aria-label={label}
                    className={cn(
                        "flex items-center text-sm font-medium tabular-nums",
                        compact ? "h-9 justify-end" : "min-h-11 md:min-h-9",
                    )}
                >
                    {formulaText(field, value) || "—"}
                </div>
            );
        default:
            return (
                <Input
                    {...common}
                    maxLength={field.maxLength}
                    className={compact ? "h-9 md:h-9" : undefined}
                    value={typeof value === "string" ? value : ""}
                    onChange={(event) => onChange(event.target.value)}
                />
            );
    }
}

/** A list field: a grid of rows on desktop, a card per row on a phone, with totals under both. */
function ListControl({ field, form, invalid }: { field: FormField; form: SchemaForm; invalid: boolean }) {
    const { t } = useI18n();
    const rows = (Array.isArray(form.values[field.name]) ? form.values[field.name] : []) as FormRow[];
    const columns = field.columns ?? [];
    const totals = new Map((field.totals ?? []).map((total) => [total.column, total.into]));
    const cellLabel = (index: number, column: FormField) => `${field.label} ${index + 1} ${column.label}`;
    const totalText = (column: FormField) => {
        const into = totals.get(column.name);
        if (!into) return "";
        const money = column.type === "money" || column.format === "money";
        const value = form.values[into];
        return money ? formatMoney(typeof value === "number" ? value : null) : String(value ?? "");
    };

    return (
        <div className="grid gap-2">
            <div className={cn("hidden overflow-x-auto rounded-md border md:block", invalid ? "border-destructive" : "border-border")}>
                <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-xs text-muted-foreground">
                        <tr>
                            <th className="w-8 px-2 py-2 text-left font-medium">#</th>
                            {columns.map((column) => (
                                <th
                                    key={column.name}
                                    className={cn(
                                        "px-2 py-2 text-left font-medium",
                                        (column.type === "money" || column.type === "formula") && "text-right",
                                    )}
                                >
                                    {column.label}
                                    {column.required ? <span className="text-destructive"> *</span> : null}
                                </th>
                            ))}
                            <th className="w-10" />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="border-t border-border/60">
                                <td className="px-2 text-muted-foreground">{index + 1}</td>
                                {columns.map((column) => (
                                    <td key={column.name} className="min-w-[7rem] px-1 py-1">
                                        <FieldControl
                                            field={column}
                                            value={row[column.name]}
                                            onChange={(value) => form.setCell(field.name, index, column.name, value)}
                                            form={form}
                                            invalid={form.showErrors && Boolean(column.required) && !row[column.name] && row[column.name] !== 0}
                                            compact
                                            ariaLabel={cellLabel(index, column)}
                                        />
                                    </td>
                                ))}
                                <td className="px-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label={t("schemaForm.removeRow", "Remove row {row}", { row: String(index + 1) })}
                                        onClick={() => form.removeRow(field.name, index)}
                                    >
                                        <Trash2 />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    {totals.size > 0 && rows.length > 0 ? (
                        <tfoot>
                            <tr className="border-t border-border bg-muted/40 font-medium">
                                <td />
                                {columns.map((column, index) => (
                                    <td key={column.name} className={cn("px-2 py-2 tabular-nums", totals.has(column.name) && "text-right")}>
                                        {index === 0 && !totals.has(column.name) ? t("schemaForm.total", "Total") : totalText(column)}
                                    </td>
                                ))}
                                <td />
                            </tr>
                        </tfoot>
                    ) : null}
                </table>
            </div>

            <div className="grid gap-2 md:hidden">
                {rows.map((row, index) => (
                    <div key={index} className="grid gap-2 rounded-lg border border-border p-3">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            {t("schemaForm.row", "Row {row}", { row: String(index + 1) })}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={t("schemaForm.removeRow", "Remove row {row}", { row: String(index + 1) })}
                                onClick={() => form.removeRow(field.name, index)}
                            >
                                <Trash2 />
                            </Button>
                        </div>
                        {columns.map((column) => (
                            <label key={column.name} className="grid gap-1 text-sm">
                                <span className="text-muted-foreground">{column.label}</span>
                                <FieldControl
                                    field={column}
                                    value={row[column.name]}
                                    onChange={(value) => form.setCell(field.name, index, column.name, value)}
                                    form={form}
                                    invalid={false}
                                    ariaLabel={cellLabel(index, column)}
                                />
                            </label>
                        ))}
                    </div>
                ))}
                {totals.size > 0 && rows.length > 0 ? (
                    <div className="grid gap-1 rounded-lg bg-muted/40 p-3 text-sm font-medium">
                        {columns
                            .filter((column) => totals.has(column.name))
                            .map((column) => (
                                <div key={column.name} className="flex justify-between tabular-nums">
                                    <span>{column.label}</span>
                                    <span>{totalText(column)}</span>
                                </div>
                            ))}
                    </div>
                ) : null}
            </div>

            <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => form.addRow(field.name)}>
                <Plus />
                {t("schemaForm.addRow", "Add row")}
            </Button>
        </div>
    );
}

/** One field with its label, help and error, sized to its span in the section grid. */
function SchemaField({ field, form, missing }: { field: FormField; form: SchemaForm; missing: boolean }) {
    const { t } = useI18n();
    const invalid = form.showErrors && missing;
    const span = field.span ?? (field.type === "list" || field.type === "longText" ? "full" : 1);
    const id = `schema-field-${field.name}`;
    return (
        <div className={cn("grid content-start gap-1.5", span === "full" ? "md:col-span-full" : SPAN[span])}>
            {field.type === "checkbox" ? null : (
                <label htmlFor={id} className="text-sm text-muted-foreground">
                    {field.label}
                    {field.required ? <span className="text-destructive" aria-hidden="true"> *</span> : null}
                </label>
            )}
            {field.type === "list" ? (
                <ListControl field={field} form={form} invalid={invalid} />
            ) : (
                <div id={id}>
                    <FieldControl
                        field={field}
                        value={form.values[field.name] as FormScalar | undefined}
                        onChange={(value) => form.set(field.name, value)}
                        form={form}
                        invalid={invalid}
                    />
                </div>
            )}
            {field.help ? <p className="text-xs text-muted-foreground">{field.help}</p> : null}
            {invalid ? <p className="text-xs text-destructive">{t("schemaForm.required", "Required")}</p> : null}
        </div>
    );
}

export interface SchemaFieldsProps {
    form: SchemaForm;
    /** The section ids to render, in schema order; every section when absent. */
    sections?: string[];
    className?: string;
}

/** Renders a schema form's sections: a titled grid each, one column on a phone. */
export function SchemaFields({ form, sections, className }: SchemaFieldsProps) {
    const schema: FormSchema = form.schema;
    const missingNames = new Set(form.missing.map((item) => item.name));
    const shown = schema.sections.filter((section) => !sections || sections.includes(section.id));
    return (
        <div className={cn("grid gap-6", className)}>
            {shown.map((section) => {
                const fields = schema.fields.filter(
                    (field) => fieldSectionId(schema, field) === section.id && form.isVisible(field),
                );
                if (fields.length === 0) return null;
                return (
                    <section key={section.id} className="grid gap-3">
                        {section.title ? (
                            <h3 className="text-xs font-semibold text-muted-foreground">
                                {section.title}
                            </h3>
                        ) : null}
                        <div className={cn("grid grid-cols-1 gap-x-4 gap-y-4", GRID_COLUMNS[section.columns ?? schema.columns ?? 2])}>
                            {fields.map((field) => (
                                <SchemaField key={field.name} field={field} form={form} missing={missingNames.has(field.name)} />
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
