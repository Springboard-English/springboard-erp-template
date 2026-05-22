import { AlertCircle } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ImmediateNotificationDialog() {
    const { immediate, dismiss } = useNotifications();
    const current = immediate[0] ?? null;

    if (!current) return null;

    return (
        <Dialog open>
            <DialogContent
                showCloseButton={false}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="sm:max-w-md"
            >
                <DialogHeader>
                    <div className="mb-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                            <AlertCircle className="size-3" />
                            Important
                        </span>
                        {immediate.length > 1 && (
                            <span className="text-xs text-muted-foreground">
                                1 of {immediate.length}
                            </span>
                        )}
                    </div>
                    <DialogTitle>{current.title}</DialogTitle>
                    {current.description && (
                        <DialogDescription>{current.description}</DialogDescription>
                    )}
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => dismiss(current.appsheet_key)}>Got it</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
