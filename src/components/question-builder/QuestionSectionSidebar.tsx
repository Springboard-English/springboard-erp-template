import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { type QuestionBuilderSectionNavItem } from "./types";

interface QuestionSectionSidebarProps {
  sections: QuestionBuilderSectionNavItem[];
  activeSectionId: string | null;
  missingFields: string[];
  submitDisabled: boolean;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  onSelectSection: (id: string) => void;
  onSubmit: () => void;
}

export default function QuestionSectionSidebar({
  sections,
  activeSectionId,
  missingFields,
  submitDisabled,
  submitLabel,
  submittingLabel,
  isSubmitting,
  onSelectSection,
  onSubmit,
}: QuestionSectionSidebarProps) {
  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <div className="sticky top-8 space-y-4">
        <nav className="space-y-1">
          {sections.map((section, index) => {
            const isActive = activeSectionId === section.id;

            return (
              <div
                key={section.id}
                className={cn(
                  "overflow-hidden rounded-xl border transition-colors duration-150",
                  isActive
                    ? "border-border/60 bg-secondary/50"
                    : "border-transparent hover:border-border/40 hover:bg-muted/20",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelectSection(section.id)}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left"
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums transition-colors",
                      section.isComplete
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                        : isActive
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {section.isComplete ? (
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="size-2.5"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium leading-snug transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {section.label}
                  </span>
                </button>
              </div>
            );
          })}
        </nav>

        <div className="group relative pt-2">
          <Button
            type="button"
            className="w-full"
            onClick={onSubmit}
            disabled={submitDisabled || isSubmitting}
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </Button>
          {submitDisabled && missingFields.length > 0 ? (
            <div className="pointer-events-none absolute bottom-full left-0 right-0 mb-2 hidden rounded-xl border border-border/70 bg-popover px-3 py-2.5 shadow-lg group-hover:block">
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Còn thiếu
              </p>
              <ul className="space-y-1">
                {missingFields.map((field) => (
                  <li
                    key={field}
                    className="flex items-center gap-1.5 text-xs text-foreground"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-destructive" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
