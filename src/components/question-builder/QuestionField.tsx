import { type ReactNode } from "react";

export default function QuestionField({
  label,
  required,
  info,
  children,
}: {
  label: string;
  required?: boolean;
  info?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium text-foreground">
          {label}
          {required ? (
            <span className="ml-0.5 text-destructive">*</span>
          ) : null}
        </label>
        {info ? (
          <div className="group relative flex">
            <button
              type="button"
              tabIndex={-1}
              className="flex h-4 w-4 items-center justify-center rounded-full border border-border/60 bg-muted/60 text-[10px] font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              i
            </button>
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-xl border border-border/70 bg-popover px-3 py-2 text-xs text-muted-foreground shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
              {info}
              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-border/70" />
            </div>
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}
