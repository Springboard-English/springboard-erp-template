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
import { useI18n } from '@/context/I18nContext';

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
    const { t } = useI18n();
    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !saving && onClose()}>
            <DialogContent
                showCloseButton={!saving}
                className="!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[calc(100%-1rem)] max-h-[calc(100svh-1rem)] !max-w-none sm:!w-[80vw] sm:max-h-[90vh] sm:!max-w-none flex flex-col overflow-hidden border-0 bg-card p-0 shadow-xl"
            >
                <DialogHeader className="shrink-0 border-b border-border/60 px-4 py-3 text-left sm:px-5 sm:py-3.5">
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
                    <div className="flex min-h-full flex-col justify-center gap-3">
                        {error && <StatusBanner variant="error">{error}</StatusBanner>}
                        {children}
                    </div>
                </div>

                <DialogFooter className="shrink-0 border-t border-border/60 px-4 py-3 sm:px-5 sm:py-3.5" showCloseButton={false}>
                    <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="button" onClick={() => void onSubmit()} disabled={saving || submitDisabled}>
                        {submitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
