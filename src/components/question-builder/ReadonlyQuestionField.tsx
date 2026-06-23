import QuestionField from "./QuestionField";

export default function ReadonlyQuestionField({
  label,
  value,
  required,
}: {
  label: string;
  value: string;
  required?: boolean;
}) {
  return (
    <QuestionField label={label} required={required}>
      <div className="flex h-9 w-full items-center rounded-md border border-border/40 bg-muted/50 px-3 text-sm text-foreground/70">
        {value}
      </div>
    </QuestionField>
  );
}
