import { useEffect, useState, type ReactNode } from 'react';
import BaseFormDialog from '@/components/dialogs/BaseFormDialog';
import FormTableSection, { FormTableRow } from '@/components/dialogs/FormTableSection';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';

export type FormTableDialogTab = {
    label: string;
    content: ReactNode;
};

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
        <div className="flex gap-1 px-4 py-2 sm:px-5">
            {tabs.map((tab, i) => (
                <button
                    key={tab.label}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={cn(
                        'rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                        i === activeTab
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    ) : undefined;

    const content = tabs
        ? tabs[activeTab]?.content
        : children;

    return (
        <BaseFormDialog
            open={open}
            saving={saving}
            title={title}
            description={description}
            error={error}
            submitLabel={submitLabel ?? t('common.create')}
            submitDisabled={submitDisabled}
            onClose={onClose}
            onSubmit={onSubmit}
            subHeader={tabBar}
        >
            <FormTableSection>{content}</FormTableSection>
        </BaseFormDialog>
    );
}

export { FormTableRow };
