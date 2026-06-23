import { Input } from "../ui/input";
import { SearchableSelect } from "../ui/searchable-select";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import QuestionField from "./QuestionField";
import ReadonlyQuestionField from "./ReadonlyQuestionField";
import { type QuestionBuilderQuestion } from "./types";

interface QuestionListProps {
  questions: QuestionBuilderQuestion[];
  columns?: 1 | 2;
  className?: string;
}

export default function QuestionList({
  questions,
  columns = 2,
  className,
}: QuestionListProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 ? "sm:grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {questions.map((question) => {
        const spanClass =
          columns === 2 && question.columnSpan !== 1
            ? "sm:col-span-2"
            : undefined;

        if (question.type === "custom") {
          return (
            <div key={question.id} className={spanClass}>
              {question.render()}
            </div>
          );
        }

        if (question.type === "readonly") {
          return (
            <div key={question.id} className={spanClass}>
              <ReadonlyQuestionField
                label={question.label ?? ""}
                value={question.value}
                required={question.required}
              />
              {question.description ? (
                <div className="mt-1 text-xs text-muted-foreground">
                  {question.description}
                </div>
              ) : null}
            </div>
          );
        }

        return (
          <div key={question.id} className={spanClass}>
            <QuestionField
              label={question.label ?? ""}
              required={question.required}
              info={question.info}
            >
              {question.type === "input" ? (
                <Input
                  type={question.inputType ?? "text"}
                  value={question.value}
                  onChange={(event) =>
                    question.onChange(event.target.value)
                  }
                  onBlur={question.onBlur}
                  placeholder={question.placeholder}
                  min={question.min}
                />
              ) : null}

              {question.type === "textarea" ? (
                <Textarea
                  value={question.value}
                  onChange={(event) =>
                    question.onChange(event.target.value)
                  }
                  placeholder={question.placeholder}
                  rows={question.rows}
                />
              ) : null}

              {question.type === "select" ? (
                <SearchableSelect
                  value={question.value}
                  onValueChange={question.onChange}
                  options={question.options.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  placeholder={question.placeholder}
                  searchPlaceholder={question.searchPlaceholder}
                />
              ) : null}

              {question.type === "radio-group" ? (
                <div className="space-y-2 rounded-lg border border-border/50 p-3">
                  {question.options.map((option) => (
                    <label
                      key={option.value}
                      className="cursor-pointer flex items-center gap-2.5"
                    >
                      <input
                        type="radio"
                        name={question.name ?? question.id}
                        value={option.value}
                        checked={question.value === option.value}
                        onChange={() => question.onChange(option.value)}
                        className="h-4 w-4 border-border accent-primary"
                      />
                      <span className="text-sm text-foreground">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              ) : null}

              {question.type === "checkbox-group" ? (
                <div className="space-y-2 rounded-lg border border-border/50 p-3">
                  {question.options.map((option) => {
                    const isSelected = question.value.includes(option.value);

                    return (
                      <div key={option.value} className="space-y-2">
                        <label className="cursor-pointer flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(event) =>
                              question.onChange(
                                event.target.checked
                                  ? [...question.value, option.value]
                                  : question.value.filter(
                                      (value) => value !== option.value,
                                    ),
                              )
                            }
                            className="h-4 w-4 rounded border-border accent-primary"
                          />
                          <span className="text-sm text-foreground">
                            {option.label}
                          </span>
                        </label>
                        {isSelected && option.selectedContent ? (
                          <div className="pl-6">{option.selectedContent}</div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </QuestionField>
            {question.description ? (
              <div className="mt-1 text-xs text-muted-foreground">
                {question.description}
              </div>
            ) : null}
            {question.error ? (
              <p className="mt-1 text-xs text-destructive">
                {question.error}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
