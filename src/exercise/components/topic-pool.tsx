import { createContext, useContext, type ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "../../components/ui/button";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";
import { promptDensity, promptTextClass } from "../lib/prompt-scale";
import { AddRow, EditableText, useExerciseEditor } from "./exercise-edit";

// A speaking topic pool: a section laid out as `topic-pool` holds one
// placeholder speaking question and, on the section, the topics an attempt
// draws from. The API puts the drawn topic in that question's `prompt`, so a
// student's paper already carries the one topic they got; the list itself is
// authoring-only and reaches the editor through the host's `topicPrompts`.

/** The pool a speaking question sits in: its section's key. */
interface TopicPool {
  sectionKey: string;
}

const TopicPoolContext = createContext<TopicPool | null>(null);

/** Marks the questions below as a topic pool's (a `topic-pool` section page). */
export function TopicPoolProvider({ sectionKey, children }: { sectionKey: string | null; children: ReactNode }) {
  if (!sectionKey) return <>{children}</>;
  return <TopicPoolContext.Provider value={{ sectionKey }}>{children}</TopicPoolContext.Provider>;
}

/** The pool the question is drawn from, or null outside a topic-pool section. */
export function useTopicPool(): TopicPool | null {
  return useContext(TopicPoolContext);
}

/**
 * The topic a student was given, set apart above the recorder with a "Your
 * topic" label so it reads as the task rather than as an instruction.
 */
export function DrawnTopic({ prompt }: { prompt: string }) {
  const { t } = useI18n();
  return (
    // `clear-both`: on a question with no title the marks float at the card's
    // top right, and a box (unlike text) would run under them.
    <div className="clear-both rounded-2xl border-2 border-primary/30 bg-primary/5 px-5 py-4">
      <p className="text-xs font-extrabold text-primary">{t("exercise.topicPool.yourTopic", "Your topic")}</p>
      <p className={cn(promptTextClass(promptDensity(prompt)), "mt-1 text-foreground")}>{prompt}</p>
    </div>
  );
}

/**
 * The pool's topics in the editor, each typed in place, with remove and add.
 * Students never see this list: each is given one topic from it. Without the
 * host's `topicPrompts` (or before it has the list) it says where they are set.
 */
export function TopicPoolPrompts({ sectionKey }: { sectionKey: string }) {
  const { t } = useI18n();
  const editor = useExerciseEditor();
  const pool = editor?.topicPrompts?.(sectionKey) ?? null;
  return (
    // `clear-both`: as `DrawnTopic`, below the floated marks rather than under them.
    <div className="clear-both rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-5 py-4">
      <p className="text-xs font-extrabold text-primary">
        {t("exercise.topicPool.topics", "Topics")}
        <span className="ml-1.5 font-semibold text-muted-foreground">
          {t("exercise.topicPool.topicsHint", "each student is given one at random")}
        </span>
      </p>
      {pool ? (
        <>
          <ol className="mt-2 space-y-1.5">
            {pool.prompts.map((prompt, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 w-5 shrink-0 text-right text-sm font-extrabold tabular-nums text-muted-foreground">
                  {index + 1}.
                </span>
                <span className="min-w-0 flex-1 pt-1 text-base font-semibold leading-7 text-foreground">
                  <EditableText
                    value={prompt}
                    label={t("exercise.topicPool.topicN", "Topic {n}", { n: index + 1 })}
                    placeholder={t("exercise.topicPool.typeTopic", "Type a topic")}
                    onChange={(next) => pool.onChange(pool.prompts.map((other, at) => (at === index ? next : other)))}
                  />
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t("exercise.topicPool.removeTopic", "Remove topic {n}", { n: index + 1 })}
                  onClick={() => pool.onChange(pool.prompts.filter((_, at) => at !== index))}
                >
                  <X className="size-4" />
                </Button>
              </li>
            ))}
          </ol>
          {pool.prompts.length === 0 ? (
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              {t("exercise.topicPool.empty", "No topics yet. Students need at least one.")}
            </p>
          ) : null}
          <div className="mt-1.5">
            <AddRow
              className="rounded-lg px-1.5 py-1 text-base"
              chipClassName="size-5 rounded"
              label={t("exercise.topicPool.addTopic", "Add topic")}
              onClick={() => pool.onChange([...pool.prompts, ""])}
            />
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          {t("exercise.topicPool.unavailable", "The topics are set in the section’s settings.")}
        </p>
      )}
    </div>
  );
}
