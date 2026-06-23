import { type ReactNode } from "react";

export interface QuestionBuilderOption {
  value: string;
  label: string;
  selectedContent?: ReactNode;
}

interface QuestionBuilderQuestionBase {
  id: string;
  label?: string;
  required?: boolean;
  info?: string;
  error?: string | null;
  description?: ReactNode;
  columnSpan?: 1 | 2 | "full";
}

export interface QuestionBuilderInputQuestion
  extends QuestionBuilderQuestionBase {
  type: "input";
  inputType?: "text" | "email" | "tel" | "date" | "number";
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  min?: number;
}

export interface QuestionBuilderTextareaQuestion
  extends QuestionBuilderQuestionBase {
  type: "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export interface QuestionBuilderSelectQuestion
  extends QuestionBuilderQuestionBase {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: QuestionBuilderOption[];
  placeholder?: string;
  searchPlaceholder?: string;
}

export interface QuestionBuilderReadonlyQuestion
  extends QuestionBuilderQuestionBase {
  type: "readonly";
  value: string;
}

export interface QuestionBuilderRadioGroupQuestion
  extends QuestionBuilderQuestionBase {
  type: "radio-group";
  value: string;
  onChange: (value: string) => void;
  options: QuestionBuilderOption[];
  name?: string;
}

export interface QuestionBuilderCheckboxGroupQuestion
  extends QuestionBuilderQuestionBase {
  type: "checkbox-group";
  value: string[];
  onChange: (value: string[]) => void;
  options: QuestionBuilderOption[];
}

export interface QuestionBuilderCustomQuestion
  extends QuestionBuilderQuestionBase {
  type: "custom";
  render: () => ReactNode;
}

export type QuestionBuilderQuestion =
  | QuestionBuilderInputQuestion
  | QuestionBuilderTextareaQuestion
  | QuestionBuilderSelectQuestion
  | QuestionBuilderReadonlyQuestion
  | QuestionBuilderRadioGroupQuestion
  | QuestionBuilderCheckboxGroupQuestion
  | QuestionBuilderCustomQuestion;

export interface QuestionBuilderSectionNavItem {
  id: string;
  label: string;
  isComplete: boolean;
}

export interface QuestionBuilderSection {
  id: string;
  title: string;
  navLabel: string;
  isComplete: boolean;
  questions: QuestionBuilderQuestion[];
  columns?: 1 | 2;
  visible?: boolean;
}
