import { Eye, SunMoon, Timer } from "lucide-react";

import { useStableI18n } from "./i18n";

// The eye-care note, shown on the two screens that come BEFORE a paper: the
// join screen and the challenge lobby.
//
// Deliberately nowhere inside the runner. Every line here is something to do
// before starting — a student halfway through a timed exam cannot go and change
// a display setting or take five minutes off, and the exam screen carries the
// paper and nothing else.
export function EyeCareNote() {
  const { t } = useStableI18n();
  const tips = [
    {
      icon: SunMoon,
      text: t("exercise.live.eyeCare.warmScreen", "Warm the screen: turn on Night Light / Night Shift (yellow mode) and bring the brightness down to match the room you’re in."),
    },
    {
      icon: Timer,
      text: t("exercise.live.eyeCare.rest", "25–5: after 25 minutes of screen time, rest your eyes for 5. In a timed challenge take the shorter version — look at something across the room for 20 seconds as you finish each part."),
    },
    {
      icon: Eye,
      text: t("exercise.live.eyeCare.distance", "Sit about an arm’s length back, with the top of the screen at or just below eye level — and blink on purpose. Reading on a screen roughly halves how often you do."),
    },
  ];
  return (
    <div className="rounded-3xl border border-butter-300 bg-butter-bg/60 p-5 text-left sm:p-6">
      <p className="text-xs font-bold text-butter-700">
        {t("exercise.live.eyeCare.title", "Before you start — look after your eyes")}
      </p>
      <ul className="mt-3 space-y-2.5">
        {tips.map(({ icon: Icon, text }) => (
          <li
            key={text}
            className="flex items-start gap-2.5 text-xs font-semibold leading-relaxed text-muted-foreground"
          >
            <Icon className="mt-0.5 size-4 shrink-0 text-butter-700" />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
