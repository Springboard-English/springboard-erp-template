import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/context/I18nContext";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import {
    buildCsvContent,
    csvFilename,
    downloadCsv,
    type CsvColumn,
} from "../../utils/csvExport";

type ExportCsvButtonProps<T> = {
    /** The table's columns; those carrying `csvValue` become CSV columns. */
    columns: Array<CsvColumn<T>>;
    /** Fetches every row matching the currently applied filters, unpaginated. */
    fetchRows: () => Promise<T[]>;
    /** Filename stem; the current date and `.csv` are appended. */
    filenamePrefix: string;
    disabled?: boolean;
};

export default function ExportCsvButton<T>({
    columns,
    fetchRows,
    filenamePrefix,
    disabled = false,
}: ExportCsvButtonProps<T>) {
    const { t } = useI18n();
    const { setStatus, clearStatus } = useGlobalStatus();
    const [isExporting, setIsExporting] = useState(false);

    const runExport = async () => {
        try {
            setIsExporting(true);
            setStatus(t("app.common.exporting", "Exporting..."));

            const rows = await fetchRows();
            if (rows.length === 0) {
                setStatus(t("app.common.exportEmpty", "Nothing to export."), "error");
                return;
            }

            downloadCsv(csvFilename(filenamePrefix), buildCsvContent(columns, rows));
            clearStatus();
        } catch (error) {
            setStatus(
                error instanceof Error
                    ? error.message
                    : t("app.common.exportFailed", "Failed to export CSV."),
                "error",
            );
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={() => void runExport()}
            disabled={disabled || isExporting}
        >
            <Download className="size-4" />
            {isExporting
                ? t("app.common.exporting", "Exporting...")
                : t("app.common.exportCsv", "Export CSV")}
        </Button>
    );
}
