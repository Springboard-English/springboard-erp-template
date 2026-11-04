import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";

// The first step of a banked word-formation blank: which bank word is this
// blank formed from? Graded (`answer_key.root`), so it is a real choice and not
// a hint. Drawn beside the typed word by both the cloze paragraph and the
// one-sentence blank, so it lives here once.
export function RootPick({
  bank,
  value,
  disabled,
  verdict,
  onChange,
}: {
  bank: string[];
  value: string;
  disabled: boolean;
  /** Result mode with the key present: whether the pick was the keyed root. */
  verdict?: boolean;
  onChange: (root: string) => void;
}) {
  const { t } = useI18n();
  return (
    <select
      aria-label={t("exercise.renderer.rootWord", "Root word")}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "mr-1 inline-flex h-8 max-w-[10rem] shrink-0 rounded-sm border-2 border-lav-300 bg-lav-bg px-1.5 py-0.5 align-middle text-xs font-extrabold text-lav-700",
        verdict === true && "border-success bg-success-bg text-mint-700",
        verdict === false && "border-error bg-error-bg text-error",
      )}
    >
      <option value="">{t("exercise.renderer.rootOption", "— root —")}</option>
      {bank.map((word) => (
        <option key={word} value={word}>
          {word}
        </option>
      ))}
    </select>
  );
}
