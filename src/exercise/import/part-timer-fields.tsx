import { Input, Label } from "../../exports";

import { useStableI18n } from "./i18n";
import { partTimersBody, type PartTimerDraft } from "./part-timers";

/**
 * A part's own timers on a test, in minutes: the time to answer and an
 * optional preparation before it. Set when the part is added to the test.
 */
export function PartTimerFields({
  value,
  onChange,
  idPrefix,
  disabled = false,
}: {
  value: PartTimerDraft;
  onChange: (next: PartTimerDraft) => void;
  idPrefix: string;
  disabled?: boolean;
}) {
  const { t } = useStableI18n();
  const result = partTimersBody(value);
  const error =
    "error" in result
      ? result.error === "prepNeedsLimit"
        ? t("exercise.import.partTimer.prepNeedsLimit", "Set a time limit before a preparation time.")
        : result.error === "tooLong"
          ? t("exercise.import.partTimer.tooLong", "A part's time limit is at most 180 minutes.")
          : t("exercise.import.partTimer.invalid", "Enter a number of minutes above 0, or leave it blank.")
      : null;
  return (
    <div className="grid gap-2">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-limit`}>{t("exercise.import.partTimer.limit", "Part time limit (minutes)")}</Label>
          <Input
            id={`${idPrefix}-limit`}
            type="number"
            min={0}
            step="0.5"
            inputMode="decimal"
            value={value.limitMinutes}
            placeholder={t("exercise.import.partTimer.none", "None")}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, limitMinutes: event.target.value })}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${idPrefix}-prep`}>{t("exercise.import.partTimer.prep", "Preparation (minutes)")}</Label>
          <Input
            id={`${idPrefix}-prep`}
            type="number"
            min={0}
            step="0.5"
            inputMode="decimal"
            value={value.prepMinutes}
            placeholder={t("exercise.import.partTimer.none", "None")}
            disabled={disabled}
            onChange={(event) => onChange({ ...value, prepMinutes: event.target.value })}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {t(
          "exercise.import.timedPart.rule",
          "The challenge's own time limit covers every part. A part's timer starts when the student opens it, and if they open it late they get only what is left of the challenge.",
        )}
      </p>
      {error ? <p className="text-xs font-bold text-destructive">{error}</p> : null}
    </div>
  );
}
