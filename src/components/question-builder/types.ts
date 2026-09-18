import { type ReactNode } from "react";
// Relative, not `@/`: these types are re-emitted in this module's .d.ts and tsc
// writes the specifier verbatim. `scripts/check-dts-portable.mjs` enforces it.
import type {
  SearchableSelectLoadParams,
  SearchableSelectOption,
  SearchableSelectPage,
} from "../ui/searchable-select";

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
  /**
   * The whole option list, for a choice that is genuinely finite. For anything
   * backed by a listing endpoint use {@link loadOptions} — filling this from a
   * drained endpoint means the form cannot render until every row has arrived.
   */
  options?: QuestionBuilderOption[];
  /**
   * Cursor-paged options, fetched as the question is opened, searched and
   * paged. Takes precedence over {@link options}, which the underlying
   * `SearchableSelect` ignores entirely in async mode.
   */
  loadOptions?: (params: SearchableSelectLoadParams) => Promise<SearchableSelectPage>;
  /**
   * The selected option, for a {@link loadOptions} question — the chosen row
   * may not be on any page that has been loaded.
   */
  selectedOption?: SearchableSelectOption;
  onOptionSelect?: (option: SearchableSelectOption) => void;
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
