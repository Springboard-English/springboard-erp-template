import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button } from "../ui/button";
import QuestionList from "./QuestionList";
import QuestionSectionCard from "./QuestionSectionCard";
import QuestionSectionSidebar from "./QuestionSectionSidebar";
import { type QuestionBuilderSection } from "./types";

export interface QuestionBuilderProps {
  header?: ReactNode;
  sections: QuestionBuilderSection[];
  missingFields: string[];
  submitDisabled: boolean;
  submitLabel: string;
  submittingLabel: string;
  isSubmitting: boolean;
  submitError?: string | null;
  onSubmit: () => void;
  footerNote?: ReactNode;
}

export default function QuestionBuilder({
  header,
  sections,
  missingFields,
  submitDisabled,
  submitLabel,
  submittingLabel,
  isSubmitting,
  submitError,
  onSubmit,
  footerNote,
}: QuestionBuilderProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const visibleSections = useMemo(
    () => sections.filter((section) => section.visible !== false),
    [sections],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let topmost: { id: string; top: number } | null = null;

        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const top = entry.boundingClientRect.top;
          if (!topmost || top < topmost.top) {
            topmost = { id: entry.target.id, top };
          }
        }

        if (topmost) {
          setActiveSectionId(topmost.id);
        }
      },
      { threshold: 0.15, rootMargin: "-80px 0px -60% 0px" },
    );

    for (const section of visibleSections) {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [visibleSections]);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-5xl gap-8 px-4 py-8 sm:px-6">
        <QuestionSectionSidebar
          sections={visibleSections.map((section) => ({
            id: section.id,
            label: section.navLabel,
            isComplete: section.isComplete,
          }))}
          activeSectionId={activeSectionId}
          missingFields={missingFields}
          submitDisabled={submitDisabled}
          submitLabel={submitLabel}
          submittingLabel={submittingLabel}
          isSubmitting={isSubmitting}
          onSelectSection={(sectionId) =>
            document.getElementById(sectionId)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
          onSubmit={onSubmit}
        />

        <div className="min-w-0 flex-1 space-y-6">
          {header}

          {visibleSections.map((section, index) => (
            <QuestionSectionCard
              key={section.id}
              id={section.id}
              index={index + 1}
              title={section.title}
            >
              <QuestionList
                questions={section.questions}
                columns={section.columns ?? 2}
              />
            </QuestionSectionCard>
          ))}

          <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">{footerNote}</p>
            <div className="flex items-center gap-3">
              {submitError ? (
                <p className="text-sm text-destructive">{submitError}</p>
              ) : null}
              <div className="group relative">
                <Button
                  type="button"
                  onClick={onSubmit}
                  disabled={submitDisabled || isSubmitting}
                >
                  {isSubmitting ? submittingLabel : submitLabel}
                </Button>
                {submitDisabled && missingFields.length > 0 ? (
                  <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-64 rounded-xl border border-border/70 bg-popover px-3 py-2.5 shadow-lg group-hover:block">
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
          </div>
        </div>
      </div>
    </div>
  );
}
