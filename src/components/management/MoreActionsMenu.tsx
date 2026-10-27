import { type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/context/I18nContext";

export interface MoreActionItem {
    label: string;
    icon?: ReactNode;
    onSelect: () => void;
    disabled?: boolean;
}

export interface MoreActionsMenuProps {
    items: MoreActionItem[];
    disabled?: boolean;
    className?: string;
}

/**
 * A "⋯" (More actions) icon button opening a menu of a toolbar's rarer
 * actions. `ExportCsvButton` folds into one on a phone; a page with its own
 * export or other actions uses it directly.
 */
export default function MoreActionsMenu({ items, disabled = false, className }: MoreActionsMenuProps) {
    const { t } = useI18n();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={t("common.moreActions")}
                    title={t("common.moreActions")}
                    disabled={disabled}
                    className={className}
                >
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {items.map((item) => (
                    <DropdownMenuItem key={item.label} disabled={item.disabled} onSelect={item.onSelect}>
                        {item.icon}
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
