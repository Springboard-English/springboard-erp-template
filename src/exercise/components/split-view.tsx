import { BookOpen } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import type { ExerciseNode } from "../lib/exercises";
import { typedParagraphs } from "../lib/passage";

import { EditableText, useNodeEdit } from "./exercise-edit";
import { type SubProps } from "./frame";
import { McqChoiceGroup } from "./mcq-choice-group";
import { PassageText } from "./passage-text";

// A reading-full-test question: one choice question that carries its own short
// source text. The text is a plain block above the prompt, the full width of
// the question, inside the question's card: the page's side column is the
// section's or part's passage, so a second two-column split here would squeeze
// both into a sliver.
type SplitNode = Extract<ExerciseNode, { type: "reading-full-test" }>;

/** The question with its source text above it; answered like any choice question. */
export function SplitView({ node, mode, value, onChange }: SubProps<SplitNode>) {
  return (
    <McqChoiceGroup
      node={node}
      mode={mode}
      value={value}
      onChange={onChange}
      lead={<SourceText node={node} />}
    />
  );
}

/** The question's titled source text, typed into in place in edit mode. */
function SourceText({ node }: { node: SplitNode }) {
  const { t } = useI18n();
  const edit = useNodeEdit(node);
  const { passage_title: title, passage } = node.content;
  return (
    <div className="mb-5 overflow-hidden rounded-2xl border bg-muted/30">
      {title || edit ? (
        <p className="flex items-center gap-2 border-b px-4 py-2.5 text-sm font-bold text-foreground">
          <BookOpen className="size-4 shrink-0" />
          <EditableText
            value={title}
            onChange={edit && ((next) => edit({ passage_title: next }))}
            label={t("exercise.edit.sourceTitle", "Source title")}
          />
        </p>
      ) : null}
      <div className="space-y-3 p-4 text-[14.5px] leading-7 text-muted-foreground">
        {edit ? (
          <p className="whitespace-pre-wrap">
            <EditableText
              value={passage.join("\n\n")}
              multiline
              label={t("exercise.edit.sourceText", "Source text")}
              onChange={(next) => edit({ passage: typedParagraphs(next) })}
            />
          </p>
        ) : (
          passage.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap">
              <PassageText text={paragraph} />
            </p>
          ))
        )}
      </div>
    </div>
  );
}
