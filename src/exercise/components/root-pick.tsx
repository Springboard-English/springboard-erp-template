import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useI18n } from "../../context/I18nContext";
import { cn } from "../../lib/utils";

// The "no pick" item: a select item can't carry an empty value.
const NONE = "__none__";

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
    <Select value={value} disabled={disabled} onValueChange={(next) => onChange(next === NONE ? "" : next)}>
      <SelectTrigger
        size="sm"
        aria-label={t("exercise.renderer.rootWord", "Root word")}
        className={cn(
          "mr-1 inline-flex h-8 max-w-[10rem] shrink-0 gap-1 rounded-sm border-2 border-lav-300 bg-lav-bg px-1.5 py-0.5 align-middle text-xs font-extrabold text-lav-700 shadow-none",
          verdict === true && "border-success bg-success-bg text-mint-700",
          verdict === false && "border-error bg-error-bg text-error",
        )}
      >
        <SelectValue placeholder={t("exercise.renderer.rootOption", "— root —")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={NONE}>{t("exercise.renderer.rootOption", "— root —")}</SelectItem>
        {bank.map((word) => (
          <SelectItem key={word} value={word}>
            {word}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
