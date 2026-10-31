import type { ReactNode } from "react";
import FormTableDialog, { type FormTableDialogTab } from "../dialogs/FormTableDialog";
import { useI18n } from "../../context/I18nContext";
import { fieldSectionId, type FormSchema } from "./schema";
import type { FormOutputMode } from "./schemaValues";
import { SchemaFields } from "./SchemaFields";
import type { SchemaForm } from "./useSchemaForm";

export interface SchemaFormTab {
    label: string;
    content: ReactNode;
    /** Shows the ✓ on the tab; extra tabs own their own completeness. */
    complete?: boolean;
}

export interface SchemaFormDialogProps {
    open: boolean;
    title: string;
    description?: string;
    form: SchemaForm;
    /** Rendered above the fields on the first tab, e.g. a template picker. */
    head?: ReactNode;
    /** Tabs after the schema's own, e.g. Signers and Preview. */
    extraTabs?: SchemaFormTab[];
    /** The tab shown each time the dialog opens. */
    initialTab?: number;
    submitLabel?: string;
    saving?: boolean;
    /** An error from the submit itself; a missing field is reported by the dialog. */
    error?: string | null;
    /** How `onSubmit` receives the values; see `SchemaForm.output`. */
    outputMode?: FormOutputMode;
    onClose: () => void;
    /** Called only when nothing required is missing. */
    onSubmit: (values: ReturnType<SchemaForm["output"]>) => void | Promise<void>;
}

interface SchemaTab {
    label: string;
    sectionIds: string[];
}

/** The schema's tabs in first-seen order; sections without one share a first "Details" tab. */
function schemaTabs(schema: FormSchema, fallback: string): SchemaTab[] {
    const tabs: SchemaTab[] = [];
    for (const section of schema.sections) {
        const label = section.tab ?? fallback;
        const tab = tabs.find((item) => item.label === label);
        if (tab) tab.sectionIds.push(section.id);
        else tabs.push({ label, sectionIds: [section.id] });
    }
    return tabs;
}

/**
 * A form dialog built from a schema form: its sections laid out as grids, one
 * tab per section `tab`, the caller's extra tabs after them, a ✓ on each tab
 * with nothing missing, and the "Still needed" message on a submit that is
 * not ready. The submit receives `form.output(outputMode)`.
 */
export function SchemaFormDialog({
    open,
    title,
    description,
    form,
    head,
    extraTabs = [],
    initialTab,
    submitLabel,
    saving = false,
    error,
    outputMode = "typed",
    onClose,
    onSubmit,
}: SchemaFormDialogProps) {
    const { t } = useI18n();
    const tabs = schemaTabs(form.schema, t("schemaForm.details", "Details"));
    const missingNames = new Set(form.missing.map((item) => item.name));
    const visibleMissing = (sectionIds: string[]) =>
        form.schema.fields.some(
            (field) => missingNames.has(field.name) && sectionIds.includes(fieldSectionId(form.schema, field)),
        );

    const dialogTabs: FormTableDialogTab[] = [
        ...tabs.map((tab, index) => ({
            label: tab.label,
            raw: true,
            complete: form.schema.fields.length > 0 && !visibleMissing(tab.sectionIds),
            content: (
                <div className="grid gap-6 py-1">
                    {index === 0 ? head : null}
                    <SchemaFields form={form} sections={tab.sectionIds} />
                </div>
            ),
        })),
        ...extraTabs.map((tab) => ({ label: tab.label, raw: true, complete: tab.complete, content: tab.content })),
    ];

    const submit = () => {
        if (!form.validate()) {
            return;
        }
        return onSubmit(form.output(outputMode));
    };
    // Listed live after the first try, so it shrinks as the fields are filled.
    const missingError =
        form.showErrors && form.missing.length > 0
            ? t("schemaForm.missing", "Still needed: {fields}.", {
                  fields: form.missing.map((item) => item.label).join(", "),
              })
            : null;

    return (
        <FormTableDialog
            open={open}
            title={title}
            description={description}
            error={error ?? missingError}
            saving={saving}
            submitLabel={submitLabel}
            onClose={onClose}
            onSubmit={submit}
            tabs={dialogTabs}
            initialTab={initialTab}
        />
    );
}
