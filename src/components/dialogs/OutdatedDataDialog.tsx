import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/context/I18nContext";

export interface OutdatedDataDialogProps {
  open: boolean;
  onRefreshData: () => void | Promise<void>;
  onCancelAction: () => void;
  loading?: boolean;
}

/** Asks whether a save that lost an `edited_at` conflict reloads or stands down. */
export default function OutdatedDataDialog({
  open,
  onRefreshData,
  onCancelAction,
  loading = false,
}: OutdatedDataDialogProps) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancelAction()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-warning" />
            {t("outdatedData.title")}
          </DialogTitle>
          <DialogDescription>{t("outdatedData.description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancelAction} disabled={loading}>
            <X className="size-4" />
            {t("outdatedData.cancel")}
          </Button>
          <Button type="button" onClick={() => void onRefreshData()} disabled={loading}>
            <RefreshCw className="size-4" />
            {t("outdatedData.refresh")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
