import { useMemo } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserScopes } from "@/utils/userScopes";

const DEFAULT_SCOPE_OPTIONS = ["payrolls_get", "tasks_get", "projects_get"];

export interface MultiSelectDropdownProps {
  value: string | null | undefined;
  onValueChange: (nextValue: string) => void;
  additionalOptions?: string[];
  placeholder?: string;
}

export default function MultiSelectDropdown({
  value,
  onValueChange,
  additionalOptions,
  placeholder = "Select scopes",
}: MultiSelectDropdownProps) {
  const selectedScopes = useMemo(() => getUserScopes(value), [value]);
  const selectedScopeSet = useMemo(() => new Set(selectedScopes), [selectedScopes]);
  const options = useMemo(() => {
    const merged = [...DEFAULT_SCOPE_OPTIONS, ...(additionalOptions ?? []), ...selectedScopes];
    return Array.from(new Set(merged.filter(Boolean)));
  }, [additionalOptions, selectedScopes]);

  const displayValue = selectedScopes.length > 0 ? selectedScopes.join(" ") : placeholder;

  return (
    <div className="w-full min-w-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="grid h-10 w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 overflow-hidden rounded-md border border-input bg-background px-3 text-sm font-normal"
          >
            <span className="block min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-left">
              {displayValue}
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[--radix-dropdown-menu-trigger-width] min-w-[260px] p-1"
        >
          <div className="max-h-64 overflow-auto">
            {options.map((scope) => {
              const checked = selectedScopeSet.has(scope);
              return (
                <button
                  key={scope}
                  type="button"
                  className="flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    const nextScopes = checked
                      ? selectedScopes.filter((item) => item !== scope)
                      : [...selectedScopes, scope];
                    onValueChange(nextScopes.join(" "));
                  }}
                >
                  <span>{scope}</span>
                  <span className="ml-2 inline-flex size-4 items-center justify-center">
                    {checked ? <Check className="size-4" /> : null}
                  </span>
                </button>
              );
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
