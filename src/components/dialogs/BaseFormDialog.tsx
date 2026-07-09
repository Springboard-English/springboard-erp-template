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
import { cn } from '@/lib/utils';

type BaseFormDialogProps = {
    open: boolean;
    saving?: boolean;
    title: string;
    description?: string;
    error?: string | null;
    submitLabel?: string;
    submitDisabled?: boolean;
    submitDisabledReason?: string;
    onClose: () => void;
    onSubmit: () => void | Promise<void>;
    children: ReactNode;
    subHeader?: ReactNode;
};

export default function BaseFormDialog({
    open,
    saving = false,
    title,
    description,
    error,
    submitLabel = 'Create',
    submitDisabled = false,
    submitDisabledReason,
    onClose,
    onSubmit,
    children,
    subHeader,
}: BaseFormDialogProps) {
    const { t } = useI18n();
    const resolvedSubmitLabel = submitLabel || t('common.create');
    return (
        <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && !saving && onClose()}>
            <DialogContent
                showCloseButton={!saving}
                className="!fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[calc(100%-1rem)] max-h-[calc(100svh-1rem)] !max-w-none sm:!w-[80vw] sm:max-h-[90vh] sm:!max-w-none flex flex-col overflow-hidden border-0 bg-card p-0 shadow-xl"
            >
                <DialogHeader
                    className={cn(
                        'shrink-0 border-b border-border/60 px-4 text-left sm:px-5',
                        subHeader ? 'pb-0 pt-3 sm:pt-3.5' : 'py-3 sm:py-3.5',
                    )}
                >
                    <DialogTitle className={subHeader ? 'mb-3' : undefined}>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                    {subHeader}
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
                    <div className="flex min-h-full flex-col justify-center gap-3">
                        {error && <StatusBanner variant="error">{error}</StatusBanner>}
                        {children}
                    </div>
                </div>

                <DialogFooter className="shrink-0 border-t border-border/60 px-4 py-3 sm:px-5 sm:py-3.5" showCloseButton={false}>
                    {submitDisabledReason && submitDisabled && (
                        <p className="mr-auto max-w-[50%] text-xs text-muted-foreground/80">
                            {submitDisabledReason}
                        </p>
                    )}
                    <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="button" onClick={() => void onSubmit()} disabled={saving || submitDisabled}>
                        {resolvedSubmitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
