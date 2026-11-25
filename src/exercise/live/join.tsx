import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Label,
  LocaleSelect,
  SearchableSelect,
  beginSignIn,
  toLoadOptions,
  useAuth,
  type SearchableSelectOption,
  errorMessage,
} from "../../exports";

import { StudentPageShell } from "./student-page-shell";
import { EyeCareNote } from "./eye-care-note";
import { Button } from "../../exports";
import {
  hasPublicCohorts,
  joinLiveSession,
  searchPublicCohorts,
} from "./api";
import { useStableI18n } from "./i18n";
import { useLiveStudent } from "./live-student";
import { playJoinRoute, playRunRoute } from "./config";

// Join by code. This screen is PUBLIC — it is the one place someone can be
// before they have an account at all — and it serves two different arrivals:
//
//   * a signed-in student or teacher handed a class code, who has nothing to
//     type: the backend takes `Participant.user_key` and the display name from
//     their access token, so this only confirms who is joining; and
//   * anyone else, who is sent straight on to the ordinary sign-in carrying
//     the code as `guest_join`, with no screen of ours in between. On a public
//     link the accounts page offers to join as a guest (a name and an email,
//     and the API mints a disposable account as the login's subject) or to
//     sign in; on any other code it is just the sign-in. Either way they come
//     back here signed in, with an ordinary OIDC session.
//
// It cannot know which kind of code it is, and deliberately does not probe: a
// lookup would answer "is this code public?" to anyone who asked. The accounts
// page decides, from the API, after Hydra has the request.
// The group picker's "I'm not sure" choice; never a cohort key, which is a uuid.
const NOT_SURE = "not-sure";

export function StudentJoin({ code }: { code: string }) {
  const { t } = useStableI18n();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setJoin } = useLiveStudent();
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  // The run joined, once a join has shown it has groups to pick from.
  const [pickingIn, setPickingIn] = useState<string | null>(null);
  const picking = pickingIn !== null;
  const [picked, setPicked] = useState<SearchableSelectOption | null>(null);
  const loadCohorts = useMemo(
    () =>
      toLoadOptions(
        (query) => searchPublicCohorts(pickingIn ?? "", query),
        (cohort) => ({ value: cohort.value, label: cohort.name }),
        // Not knowing must not stop anyone sitting the paper; a teacher can
        // place them afterwards. First in the unsearched list.
        [{ value: NOT_SURE, label: t("exercise.live.join.notSureOption", "I'm not sure") }],
      ),
    [pickingIn, t],
  );
  const leavingRef = useRef(false);

  // Wait for `isLoading`: coming back from the callback, the token is already
  // in memory but /users/me has not answered, and leaving then is a loop.
  useEffect(() => {
    if (isLoading || isAuthenticated || leavingRef.current) return;
    leavingRef.current = true;
    void beginSignIn(playJoinRoute(code), { guest_join: code });
  }, [code, isAuthenticated, isLoading]);

  const accountName =
    (typeof user?.name === "string" && user.name) ||
    user?.username ||
    t("exercise.live.join.yourAccount", "your account");

  if (!isAuthenticated) {
    return (
      <StudentPageShell>
        <p className="text-center text-sm font-semibold text-muted-foreground">
          {t("exercise.live.join.takingToSignIn", "Taking you to sign in…")}
        </p>
      </StudentPageShell>
    );
  }

  /** Join, asking for a cohort first when the room offers some (`skipPick` not set). */
  async function start(cohortKey?: string, skipPick = false) {
    setJoining(true);
    setError(null);
    try {
      const result = await joinLiveSession(code, { cohortKey });
      // A room with cohorts a guest may pick asks once, before the paper; the
      // second join (with the pick) returns the same attempt, now in it.
      if (
        !cohortKey &&
        !skipPick &&
        !result.cohort_key &&
        (await hasPublicCohorts(result.live_session_key))
      ) {
        setPickingIn(result.live_session_key);
        setJoining(false);
        return;
      }
      setJoin(result);
      navigate(playRunRoute(code));
    } catch (err) {
      // The server's own words where it gave any. One flat sentence for every
      // failure is fine for a mistyped code and wrong for every refusal that
      // names a reason — "this closed on 12 September", "you have used all 3
      // attempts". Those would read as "check the code", so a student would
      // retype a code that was never the problem.
      setError(errorMessage(err, t("exercise.live.join.failed", "Couldn’t join. Check the code and try again.")));
      setJoining(false);
    }
  }

  return (
    <StudentPageShell headerActions={<LocaleSelect className="text-xs" />}>
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-foreground">{t("exercise.live.join.title", "Join the session")}</h1>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {t("exercise.live.join.code", "Code")} <span className="font-mono tracking-widest text-foreground">{code}</span>
          </p>
        </div>
        <div className="space-y-4 rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-center text-sm font-semibold text-muted-foreground">
            {t("exercise.live.join.joiningAs", "Joining as")}
            <span className="ml-1 font-bold text-foreground">{accountName}</span>
          </p>
          {picking ? (
            <div className="space-y-3">
              <Label htmlFor="join-cohort" className="block text-center text-sm font-bold text-foreground">
                {t("exercise.live.join.pickCohort", "Which group are you in?")}
              </Label>
              {/* Searched on the server: a room can hold hundreds of groups. */}
              <SearchableSelect
                id="join-cohort"
                className="w-full"
                value={picked?.value ?? ""}
                selectedOption={picked ?? undefined}
                onValueChange={() => undefined}
                onOptionSelect={setPicked}
                loadOptions={loadCohorts}
                placeholder={t("exercise.live.join.pickCohortPlaceholder", "Find your group")}
                searchPlaceholder={t("exercise.live.join.searchCohort", "Type to search")}
                emptyMessage={t("exercise.live.join.noCohortMatch", "No group by that name")}
              />
              <Button
                size="lg"
                className="w-full"
                disabled={joining || !picked}
                onClick={() =>
                  picked &&
                  (picked.value === NOT_SURE
                    ? start(undefined, true)
                    : start(picked.value))
                }
              >
                {joining ? t("exercise.live.join.joining", "Joining…") : t("exercise.live.join.join", "Join")}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          ) : (
            <Button size="lg" className="w-full" disabled={joining} onClick={() => start()}>
              {joining ? t("exercise.live.join.joining", "Joining…") : t("exercise.live.join.join", "Join")}
              <ArrowRight className="size-4" />
            </Button>
          )}
          <p className="text-center text-xs font-semibold text-muted-foreground">
            {t("exercise.live.join.recorded", "Your answers are recorded against your account.")}
          </p>
          {error ? (
            <p className="text-center text-sm font-semibold text-error">{error}</p>
          ) : null}
        </div>
        <EyeCareNote />
      </div>
    </StudentPageShell>
  );
}
