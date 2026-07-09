import { useEffect, useState, type ReactNode } from 'react';
import BaseFormDialog from '@/components/dialogs/BaseFormDialog';
import FormTableSection, { FormTableRow } from '@/components/dialogs/FormTableSection';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';

export type FormTableDialogTab = {
    label: string;
    content: ReactNode;
    /** Skip the FormTableSection wrapper — use for tabs with custom table layouts */
    raw?: boolean;
    /** Show a completion checkmark on the tab pill */
    complete?: boolean;
};

type FormTableDialogProps = {
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
    children?: ReactNode;
    tabs?: FormTableDialogTab[];
};

export default function FormTableDialog({
    open,
    saving = false,
    title,
    description,
    error,
    submitLabel,
    submitDisabled = false,
    submitDisabledReason,
    onClose,
    onSubmit,
    children,
    tabs,
}: FormTableDialogProps) {
    const { t } = useI18n();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!open) {
            setActiveTab(0);
        }
    }, [open]);

    const tabBar = tabs && tabs.length > 1 ? (
        <div className="-mx-4 flex gap-1 border-t border-border/40 px-3 py-2 sm:-mx-5 sm:px-4">
            {tabs.map((tab, i) => (
                <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={cn(
                        'inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition-all',
                        i === activeTab
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )}
                >
                    {tab.label}
                    {tab.complete && (
                        <span className={cn(
                            'text-[10px] font-bold leading-none',
                            i === activeTab ? 'text-primary-foreground/70' : 'text-emerald-500',
                        )}>✓</span>
                    )}
                </button>
            ))}
        </div>
    ) : undefined;

    const currentTab = tabs?.[activeTab];
    const content = currentTab?.content ?? children;
    const isRaw = currentTab?.raw ?? false;

    return (
        <BaseFormDialog
            open={open}
            saving={saving}
            title={title}
            description={description}
            error={error}
            submitLabel={submitLabel ?? t('common.create')}
            submitDisabled={submitDisabled}
            submitDisabledReason={submitDisabledReason}
            onClose={onClose}
            onSubmit={onSubmit}
            subHeader={tabBar}
        >
            {isRaw ? content : <FormTableSection>{content}</FormTableSection>}
        </BaseFormDialog>
    );
}

export { FormTableRow };
