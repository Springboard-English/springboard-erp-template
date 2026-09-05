// Relative, NOT `@/`. tsc emits the specifier verbatim into the .d.ts, and a
// consumer resolves `@/` against its OWN src — so an aliased type import
// silently becomes `any` on the other side. Here that turned every
// `csvValue: (row) => …` in five apps into an implicit-any error.
import type { SimpleDataTableColumn } from "../components/SimpleDataTable";

export type CsvCellValue = string | number | boolean | null | undefined;

/**
 * A `SimpleDataTable` column that can also be exported to CSV.
 *
 * `render` returns a ReactNode, so it can't be reused for the file. Columns
 * therefore carry a `csvValue` accessor returning the same information as plain
 * text; columns without one (actions, icons, checkboxes) are left out of the CSV.
 */
export type CsvColumn<T> = SimpleDataTableColumn<T> & {
    csvValue?: (row: T) => CsvCellValue;
    /** CSV header override, for columns whose `header` is not a plain string. */
    csvHeader?: string;
    /**
     * Expands one table column into several CSV columns. Use for composite cells
     * (e.g. a progress cell showing counts and a date range) so the export keeps
     * every value the cell displays. Takes precedence over `csvValue`.
     */
    csvFields?: Array<{ header: string; value: (row: T) => CsvCellValue }>;
};

type CsvField<T> = { header: string; value: (row: T) => CsvCellValue };

function escapeCsvValue(value: CsvCellValue): string {
    if (value == null) {
        return "";
    }

    return `"${String(value).replace(/"/g, "\"\"")}"`;
}

/**
 * Marks a value as text that must reach the spreadsheet unaltered.
 *
 * Quoting is not enough. Excel converts a quoted field that looks numeric into
 * a number, so `"01311003"` — a CITAD bank code — opens as `1311003`, and
 * `"0123456789"` — a bank account — opens as `123456789`. The leading zero is
 * the digit that makes each valid, and losing it is silent: the file looks
 * right, and the transfer fails or reaches the wrong account.
 *
 * `="..."` is a formula, which Excel, LibreOffice and Google Sheets all honour
 * as literal text. It is deliberately NOT applied to every column — a money
 * column wrapped this way could not be summed, which is the whole point of
 * exporting it. Use it for identifiers only.
 *
 * `downloadCsv` already writes a BOM so Excel reads UTF-8; this is the same
 * bargain, for the same reader.
 */
export function csvText(value: CsvCellValue): CsvCellValue {
    if (value == null || value === "") {
        return value;
    }

    return `="${String(value).replace(/"/g, "\"\"")}"`;
}

function csvHeaderOf<T>(column: CsvColumn<T>): string {
    if (column.csvHeader) {
        return column.csvHeader;
    }
    if (typeof column.header === "string") {
        return column.header;
    }
    return column.id;
}

function toCsvFields<T>(columns: Array<CsvColumn<T>>): Array<CsvField<T>> {
    return columns.flatMap((column) => {
        if (column.csvFields?.length) {
            return column.csvFields;
        }
        if (typeof column.csvValue === "function") {
            return [{ header: csvHeaderOf(column), value: column.csvValue }];
        }
        // Columns with neither (actions, icons) are left out of the CSV.
        return [];
    });
}

export function buildCsvContent<T>(columns: Array<CsvColumn<T>>, rows: T[]): string {
    const fields = toCsvFields(columns);

    return [
        fields.map((field) => escapeCsvValue(field.header)).join(","),
        ...rows.map((row) =>
            fields.map((field) => escapeCsvValue(field.value(row))).join(","),
        ),
    ].join("\n");
}

export function csvFilename(prefix: string): string {
    return `${prefix}-${new Date().toISOString().slice(0, 10)}.csv`;
}

export function downloadCsv(filename: string, content: string): void {
    // Leading BOM so Excel opens the file as UTF-8 rather than mangling
    // Vietnamese names and diacritics.
    const blob = new Blob(["\uFEFF", content], {
        type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(url);
}
