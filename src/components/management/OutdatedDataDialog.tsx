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

interface OutdatedDataDialogProps {
    open: boolean;
    onRefreshData: () => void | Promise<void>;
    onCancelAction: () => void;
    loading?: boolean;
}

export default function OutdatedDataDialog({
    open,
    onRefreshData,
    onCancelAction,
    loading = false,
}: OutdatedDataDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancelAction()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="size-5 text-amber-500" />
                        Outdated data
                    </DialogTitle>
                    <DialogDescription>
                        The record changed on the server. Refresh to load the latest data and
                        discard local pending changes, or cancel this save and keep your pending
                        edits.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancelAction}
                        disabled={loading}
                    >
                        <X className="size-4" />
                        Cancel action
                    </Button>
                    <Button type="button" onClick={onRefreshData} disabled={loading}>
                        <RefreshCw className="size-4" />
                        Refresh data
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
