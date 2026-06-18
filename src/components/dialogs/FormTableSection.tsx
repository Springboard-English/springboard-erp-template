import type { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

type FormTableSectionProps = {
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
        <TableRow className={cn('block border-b border-border/60 hover:bg-transparent md:table-row', className)}>
            <TableCell
                className={cn(
                    'block w-full px-3 pt-3 pb-1.5 align-top text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground md:table-cell md:w-[160px] md:px-3 md:py-2.5 md:text-center',
                    align === 'center' ? 'md:align-middle' : 'md:align-top',
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
            <TableCell
                className={cn(
                    'block w-full min-w-0 px-3 pt-1.5 pb-3 text-sm md:table-cell md:px-3 md:py-2.5',
                    align === 'center' ? 'md:align-middle' : 'md:align-top',
                )}
            >
                {children}
            </TableCell>
        </TableRow>
    );
}

export default function FormTableSection({ children }: FormTableSectionProps) {
    return (
        <div className="overflow-hidden rounded-2xl bg-transparent">
            <Table className="w-full table-fixed" containerClassName="overflow-x-hidden">
                <TableBody>{children}</TableBody>
            </Table>
        </div>
    );
}
