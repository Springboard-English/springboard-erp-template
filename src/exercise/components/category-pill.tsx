import { BookOpen, Headphones, MessageCircle, PenLine, SpellCheck, type LucideIcon } from "lucide-react";

import { useI18n } from "../../context/I18nContext";
import { valueLabel } from "../i18n";
import { SKILL_LABELS, type SkillTag } from "../lib/exercises";

interface SkillAccent {
  icon: LucideIcon;
  /** The pill's fill and ink, as the app theme's accent tokens. */
  soft: string;
  ink: string;
}

// Tokens, not hexes: they are applied through inline `style`, where a `dark:` variant cannot reach.
const SKILL_ACCENTS: Record<SkillTag, SkillAccent> = {
  reading: { icon: BookOpen, soft: "var(--rose-100)", ink: "var(--rose-600)" },
  listening: { icon: Headphones, soft: "var(--sky-bg)", ink: "var(--sky-700)" },
  "vocab-grammar": { icon: SpellCheck, soft: "var(--lav-bg)", ink: "var(--lav-700)" },
  writing: { icon: PenLine, soft: "var(--mint-bg)", ink: "var(--mint-700)" },
  speaking: { icon: MessageCircle, soft: "var(--peach-bg)", ink: "var(--peach-700)" },
};

/** A question's skill as a coloured pill with its icon, and its type beside it when given. */
export function CategoryPill({ skill, type }: { skill: SkillTag; type?: string }) {
  const { t } = useI18n();
  const accent = SKILL_ACCENTS[skill];
  const Icon = accent.icon;

  return (
    <span className="inline-flex max-w-full flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-2 rounded-full py-2 pl-2.5 pr-[15px] text-[13.5px] font-extrabold shadow-[0_2px_5px_rgba(33,27,30,.05)] transition-transform duration-200 ease-bounce hover:-translate-y-0.5" style={{ background: accent.soft, color: accent.ink }}>
        <Icon className="size-[17px]" strokeWidth={2.5} />
        {valueLabel(t, SKILL_LABELS[skill])}
      </span>
      {type ? <span className="max-w-full rounded-full border bg-muted px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground">{type}</span> : null}
    </span>
  );
}
