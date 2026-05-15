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
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import StatusBanner from '@/components/StatusBanner';
import { cn } from '@/lib/utils';

type FormTableDialogProps = {
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

type FormTableRowProps = {
    label: string;
    required?: boolean;
    helperText?: string;
    children: ReactNode;
    className?: string;
    align?: 'center' | 'start';
};

export function FormTableRow({ label, required = false, helperText, children, className, align = 'center' }: FormTableRowProps) {
    return (
        <TableRow className={cn('hover:bg-transparent', className)}>
            <TableCell
                className={cn(
                    'w-[220px] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground',
                    align === 'center' ? 'align-middle' : 'align-top',
                )}
            >
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1">
                        <span>{label}</span>
                        {required && (
                            <span className="text-destructive" aria-hidden="true">
                                *
                            </span>
                        )}
                    </div>
                    {helperText && <p className="text-xs normal-case leading-5 text-muted-foreground">{helperText}</p>}
                </div>
            </TableCell>
            <TableCell className={cn('min-w-0 px-4 py-3 text-sm', align === 'center' ? 'align-middle' : 'align-top')}>
                {children}
            </TableCell>
        </TableRow>
    );
}

export default function FormTableDialog({
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
}: FormTableDialogProps) {
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
                        <div className="overflow-hidden rounded-2xl bg-transparent">
                            <Table className="table-fixed" containerClassName="overflow-x-hidden">
                                <TableBody className="[&_tr]:border-b-0">{children}</TableBody>
                            </Table>
                        </div>
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
