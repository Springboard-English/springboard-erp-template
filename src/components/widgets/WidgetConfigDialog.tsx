import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useI18n } from "../../context/I18nContext";
import type { AnyWidgetDefinition } from "./types";

export interface WidgetConfigTarget {
    id: string;
    def: AnyWidgetDefinition;
    config: unknown;
}

/** Hosts a widget's own `ConfigForm` — iOS's "Edit Widget". */
export default function WidgetConfigDialog({
    target,
    onClose,
    onSave,
}: {
    target: WidgetConfigTarget | null;
    onClose: () => void;
    onSave: (id: string, config: unknown) => void;
}) {
    const { t } = useI18n();
    const [value, setValue] = useState<unknown>(target?.config);

    useEffect(() => setValue(target?.config), [target]);

    const Form = target?.def.ConfigForm;
    const title = target ? t(target.def.titleKey ?? target.def.title, target.def.title) : "";

    return (
        <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("widgets.configureTitle", undefined, { title })}</DialogTitle>
                </DialogHeader>
                {Form ? <Form value={value} onChange={setValue} /> : null}
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            if (target) onSave(target.id, value);
                            onClose();
                        }}
                    >
                        {t("common.save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
