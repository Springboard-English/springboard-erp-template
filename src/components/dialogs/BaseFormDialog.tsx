import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import StatusBanner from '@/components/StatusBanner';

type BaseFormDialogProps = {
    open: boolean;
    saving?: boolean;
    title: string;
    description?: string;
    error?: string | null;
    submitLabel?: string;
    submitDisabled?: boolean;
    onClose: () => void;
    onSubmit: () => void | Promise<void>;
    children: ReactNode;
};

export default function BaseFormDialog({
    open,
    saving = false,
    title,
    description,
    error,
    submitLabel = 'Create',
    submitDisabled = false,
    onClose,
    onSubmit,
    children,
}: BaseFormDialogProps) {
    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !saving && onClose()}>
            <DialogContent
                showCloseButton={!saving}
                className="!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[80vw] max-h-[92vh] !max-w-none flex flex-col overflow-hidden border-0 bg-card p-0 shadow-none"
            >
                <DialogHeader className="border-b border-border/60 px-6 py-4 text-left">
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                    <div className="flex min-h-full flex-col justify-center gap-4">
                        {error && <StatusBanner variant="error">{error}</StatusBanner>}
                        {children}
                    </div>
                </div>

                <DialogFooter className="border-t border-border/60 px-6 py-4" showCloseButton={false}>
                    <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={() => void onSubmit()} disabled={saving || submitDisabled}>
                        {submitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
