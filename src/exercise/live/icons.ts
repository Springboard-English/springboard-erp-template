import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  GraduationCap,
  Headphones,
  Home,
  Library,
  MessageCircle,
  Mic,
  NotebookPen,
  PenLine,
  Search,
  Settings,
  SlidersHorizontal,
  SpellCheck,
  Trophy,
} from "lucide-react";

// `soft` and `ink` are the family's own tokens, not copies of their hex, because
// these are applied through inline `style` (CategoryPill, IconTile) where a
// Tailwind `dark:` variant cannot reach — a literal pastel would stay a pastel
// on a dark page, under text that had gone light. `gradient` and `glow`
// are saturated fills that read on either background, so they stay literal.
export const ACCENTS = {
  rose: { gradient: "linear-gradient(145deg,#E17190,#C0355C)", glow: "rgba(192,53,92,.38)", soft: "var(--rose-100)", ink: "var(--rose-600)" },
  mint: { gradient: "linear-gradient(145deg,#5FCF9E,#2E9268)", glow: "rgba(46,146,104,.36)", soft: "var(--mint-bg)", ink: "var(--mint-700)" },
  lav: { gradient: "linear-gradient(145deg,#A793E6,#7458C9)", glow: "rgba(116,88,201,.36)", soft: "var(--lav-bg)", ink: "var(--lav-700)" },
  sky: { gradient: "linear-gradient(145deg,#6BA9E6,#3877C4)", glow: "rgba(56,119,196,.36)", soft: "var(--sky-bg)", ink: "var(--sky-700)" },
  butter: { gradient: "linear-gradient(145deg,#F2C65C,#D9971C)", glow: "rgba(217,151,28,.36)", soft: "var(--butter-bg)", ink: "var(--butter-700)" },
  peach: { gradient: "linear-gradient(145deg,#F3A876,#E07A3C)", glow: "rgba(224,122,60,.36)", soft: "var(--peach-bg)", ink: "var(--peach-700)" },
} as const;

export type AccentName = keyof typeof ACCENTS;

export const ICONS = {
  reading: BookOpen,
  listening: Headphones,
  vocabGrammar: SpellCheck,
  writing: PenLine,
  speaking: MessageCircle,
  oral: Mic,
  exam: Trophy,
  library: Library,
  done: CheckCircle2,
  notes: NotebookPen,
  stats: BarChart3,
  streak: Flame,
  timer: Clock3,
  home: Home,
  search: Search,
  filters: SlidersHorizontal,
  alerts: Bell,
  settings: Settings,
  grade: GraduationCap,
} satisfies Record<string, LucideIcon>;

export const SKILL_ACCENTS = {
  reading: "rose",
  listening: "sky",
  "vocab-grammar": "lav",
  writing: "mint",
  // `peach` is the only accent family not already spoken for by a skill (butter
  // is the warning tone). Register a new SkillTag HERE FIRST: CategoryPill reads
  // `ACCENTS[SKILL_ACCENTS[skill]]` and would take `.soft` off undefined.
  speaking: "peach",
} satisfies Record<string, AccentName>;
