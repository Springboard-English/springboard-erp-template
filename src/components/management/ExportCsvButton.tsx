import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import MoreActionsMenu from "./MoreActionsMenu";
import type { PageAction } from "../layout/PageActionBar";
import useIsMobile from "@/hooks/useIsMobile";
import { useI18n } from "@/context/I18nContext";
import { useGlobalStatus } from "@/context/GlobalStatusContext";
import {
    buildCsvContent,
    csvFilename,
    downloadCsv,
    type CsvColumn,
} from "../../utils/csvExport";
import type { EveryPageResult } from "../../utils/cursorPagination";

type ExportCsvButtonProps<T> = {
    /** The table's columns; those carrying `csvValue` become CSV columns. */
    columns: Array<CsvColumn<T>>;
    /** Filename stem; the current date and `.csv` are appended. */
    filenamePrefix: string;
    disabled?: boolean;
} & (
    | {
          /**
           * Every row matching the applied filters — a resource's
           * `fetchAllFoos(filters)` over `fetchEveryPage`.
           *
           * It takes an {@link EveryPageResult} rather than an array for two
           * reasons. `truncated` is surfaced below instead of being dropped. And
           * a `PageSlice` — what a PAGED read returns — has no `truncated`, so
           * handing one to an export is a type error rather than a CSV with one
           * row in it.
           */
          fetchAll: () => Promise<EveryPageResult<T>>;
          fetchRows?: never;
      }
    | {
          /** @deprecated Pass `fetchAll`. A paged read here exports one page. */
          fetchRows: () => Promise<T[]>;
          fetchAll?: never;
      }
);

/**
 * The "Export CSV" action for a `PageActionBar`: downloads the filtered rows,
 * reports progress and a capped export through the global status line, and
 * reads "Exporting..." while it runs.
 */
export function useExportCsvAction<T>({
    columns,
    fetchAll,
    fetchRows,
    filenamePrefix,
    disabled = false,
}: ExportCsvButtonProps<T>): PageAction {
    const { t } = useI18n();
    const { setStatus, clearStatus } = useGlobalStatus();
    const [isExporting, setIsExporting] = useState(false);

    const runExport = async () => {
        try {
            setIsExporting(true);
            setStatus(t("app.common.exporting", "Exporting..."));

            const result = fetchAll
                ? await fetchAll()
                : { items: await fetchRows!(), truncated: false };

            if (result.items.length === 0) {
                setStatus(t("app.common.exportEmpty", "Nothing to export."), "error");
                return;
            }

            downloadCsv(
                csvFilename(filenamePrefix),
                buildCsvContent(columns, result.items),
            );

            // Still downloaded — a short file beats no file — but the reader has
            // to be told, or a capped export looks like a complete one. This is
            // the whole reason `truncated` is carried rather than dropped.
            if (result.truncated) {
                setStatus(
                    t(
                        "app.common.exportTruncated",
                        `Exported the first ${result.items.length} rows; there are more. Narrow the filters to export the rest.`,
                    ),
                    "error",
                );
                return;
            }

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

    return {
        id: "export-csv",
        label: isExporting ? t("app.common.exporting", "Exporting...") : t("app.common.exportCsv", "Export CSV"),
        icon: <Download className="size-4" />,
        disabled: disabled || isExporting,
        onSelect: () => void runExport(),
        // A download is never the page's job, so it waits in "⋯"
        overflow: true,
    };
}

/**
 * Downloads the filtered rows as CSV. On a desktop it is an "Export CSV"
 * button; on a phone it folds into a "⋯" menu so the toolbar row keeps room
 * for search and Filters. In a `PageActionBar`, use `useExportCsvAction`.
 */
export default function ExportCsvButton<T>(props: ExportCsvButtonProps<T>) {
    const action = useExportCsvAction(props);
    const isMobile = useIsMobile();

    // A phone's toolbar row has room for search and Filters only; export is rare there.
    if (isMobile) {
        return (
            <MoreActionsMenu
                disabled={action.disabled}
                items={[{ label: String(action.label), icon: action.icon, onSelect: action.onSelect! }]}
            />
        );
    }

    return (
        <Button type="button" variant="outline" onClick={action.onSelect} disabled={action.disabled}>
            {action.icon}
            {action.label}
        </Button>
    );
}
