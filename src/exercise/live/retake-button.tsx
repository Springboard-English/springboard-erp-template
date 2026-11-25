import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button, errorMessage } from "../../exports";
import { useStableI18n } from "./i18n";
import {
  joinLiveSession,
  type LiveSessionJoin,
} from "./api";

// "Take it again" — a new attempt at a share room, offered once the current one
// is handed in.
//
// Its own component so its pending state is its own: the runner returns early
// for every screen it draws, and a hook declared beside those returns would be
// called in a different order depending on which screen is up.
//
// **Whether to show it is the server's call.** `can_retake` on the join says
// whether another attempt may follow this one — a share room, attempts left,
// the room open — and the rule behind it (`Test.retries`, which a student
// cannot read) lives on the API. The server re-checks all of it when asked, so
// a due date passing between the score screen and the click is a toast with the
// server's own sentence, not a broken attempt.
//
// `onJoined` swaps the live join for the new attempt's. The runner route is
// keyed by attempt, so that swap mounts a fresh runner — no answers, page or
// step carried over from the attempt just finished.

export function RetakeButton({
  code,
  join,
  onJoined,
}: {
  code: string;
  join: LiveSessionJoin | null;
  onJoined: (next: LiveSessionJoin) => void;
}) {
  const { t } = useStableI18n();
  const [pending, setPending] = useState(false);
  if (!join?.can_retake) return null;

  const left = join.attempts_left;
  const label =
    left === null || left === undefined
      ? t("exercise.live.retake.label", "Take it again")
      : left === 1
        ? t("exercise.live.retake.leftOne", "Take it again · 1 attempt left")
        : t("exercise.live.retake.leftOther", "Take it again · {n} attempts left", { n: left });

  return (
    <Button
      size="lg"
      disabled={pending}
      onClick={() => {
        setPending(true);
        joinLiveSession(code, { retake: true })
          .then(onJoined)
          .catch((err: unknown) => {
            toast.error(errorMessage(err, t("exercise.live.retake.failed", "Couldn’t start another attempt.")));
            setPending(false);
          });
      }}
    >
      <RotateCcw className="size-4" />
      {label}
    </Button>
  );
}
