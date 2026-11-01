import { CornerDownLeft, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/context/I18nContext";
import { touchHitArea } from "@/lib/touchTarget";
import { cn } from "@/lib/utils";

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  /** Shows an apply button, for a search that only runs on submit. */
  hasPendingSubmit?: boolean;
  placeholder: string;
  className?: string;
}

/** A search input with a clear button; Enter submits. */
export default function SearchField({
  value,
  onChange,
  onSubmit,
  hasPendingSubmit = false,
  placeholder,
  className = "relative min-w-0 flex-1",
}: SearchFieldProps) {
  const { t } = useI18n();
  const showApply = hasPendingSubmit && Boolean(onSubmit);
  return (
    <div className={className}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmit?.();
          }
        }}
        placeholder={placeholder}
        className={cn("pl-9", showApply ? "pr-16" : "pr-9")}
      />
      {showApply ? (
        <button
          type="button"
          onClick={onSubmit}
          // Above the clear button, whose tap area reaches over this one on touch.
          className={`${touchHitArea} absolute right-8 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-muted-foreground transition hover:text-foreground`}
          aria-label={t("search.apply")}
          title={t("search.apply")}
        >
          <CornerDownLeft className="size-4" />
        </button>
      ) : null}
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className={`${touchHitArea} absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition hover:text-foreground`}
          aria-label={t("search.clear")}
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
